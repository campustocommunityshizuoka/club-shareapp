'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function registerCircle(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File

  if (!name || !description || !imageFile) {
    throw new Error('入力内容が不足しています')
  }

  // 日本語ファイル名対策（ランダムな英数字に変換）
  const fileExt = imageFile.name.split('.').pop()
  // 圧縮済みでも拡張子が元のままの場合があるので、WebP等の場合はここで調整も可能ですが
  // 今回はブラウザ側で変換された拡張子をそのまま使う想定にします
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

  // 画像のアップロード（送られてきたものをそのまま保存）
  const { error: uploadError } = await supabase.storage
    .from('circle-icons')
    .upload(fileName, imageFile)

  if (uploadError) {
    console.error(uploadError)
    throw new Error(`画像のアップロードに失敗しました: ${uploadError.message}`)
  }

  // データベースへの登録
  const { error: dbError } = await supabase
    .from('circles')
    .insert({
      name,
      description,
      image_path: fileName, 
    })

  if (dbError) {
    console.error(dbError)
    throw new Error(`データベース登録に失敗しました: ${dbError.message}`)
  }

  redirect('/')
}