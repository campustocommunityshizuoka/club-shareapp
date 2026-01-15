'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// サークル削除機能
export async function deleteCircle(id: string, imagePath: string | null) {
  const supabase = await createClient()

  // 1. 画像があればStorageから削除
  if (imagePath) {
    const { error: storageError } = await supabase.storage
      .from('circle-icons')
      .remove([imagePath])
    
    if (storageError) {
      console.error('画像削除エラー:', storageError)
      // 画像削除に失敗してもDB削除は試みるため、ここではthrowしない
    }
  }

  // 2. データベースから削除
  const { error: dbError } = await supabase
    .from('circles')
    .delete()
    .eq('id', id)

  if (dbError) {
    throw new Error('削除に失敗しました')
  }

  // 画面を更新
  revalidatePath('/admin')
  revalidatePath('/') // トップページも更新
}

// ログアウト機能
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}