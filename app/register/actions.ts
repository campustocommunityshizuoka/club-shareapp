// app/register/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function registerCircle(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  // ↓ ここを追加
  const contactInfo = formData.get('contactInfo') as string
  const imageFile = formData.get('image') as File

  // 入力チェックに追加
  if (!name || !description || !contactInfo || !imageFile) {
    throw new Error('入力内容が不足しています')
  }

  // (中略... ファイル名の生成などはそのまま)
  const fileExt = imageFile.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

  // 画像アップロード (そのまま)
  const { error: uploadError } = await supabase.storage
    .from('circle-icons')
    .upload(fileName, imageFile)

  if (uploadError) {
    console.error(uploadError)
    throw new Error(`画像のアップロードに失敗しました: ${uploadError.message}`)
  }

  // データベースへの登録 (contact_info を追加)
  const { error: dbError } = await supabase
    .from('circles')
    .insert({
      name,
      description,
      contact_info: contactInfo, // 追加
      image_path: fileName, 
    })

  if (dbError) {
    console.error(dbError)
    throw new Error(`データベース登録に失敗しました: ${dbError.message}`)
  }

  redirect('/')
}