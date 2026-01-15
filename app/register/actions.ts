// app/register/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import sharp from 'sharp' // 追加

export async function registerCircle(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const imageFile = formData.get('image') as File

  if (!name || !description || !imageFile) {
    throw new Error('入力内容が不足しています')
  }

  // --- 画像圧縮処理 Start ---

  // 1. FileオブジェクトをBufferに変換（sharpで扱うため）
  const imageBuffer = Buffer.from(await imageFile.arrayBuffer())

  // 2. sharpを使ってリサイズと圧縮を行う
  // 長辺を最大1200pxにリサイズし、WebP形式で画質80%に圧縮
  const compressedImageBuffer = await sharp(imageBuffer)
    .resize(1200, 1200, {
      fit: 'inside', // アスペクト比を維持して枠内に収める
      withoutEnlargement: true, // 元画像より大きくしない
    })
    .webp({ quality: 80 }) // WebP形式に変換
    .toBuffer()

  // 3. 保存するファイル名を決定（拡張子は .webp にする）
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`

  // 4. 圧縮済みのデータをSupabase Storageにアップロード
  const { error: uploadError } = await supabase.storage
    .from('circle-icons')
    .upload(fileName, compressedImageBuffer, {
      contentType: 'image/webp', // Content-Typeを明示
      cacheControl: '3600', // キャッシュ設定（任意）
      upsert: false,
    })
  
  // --- 画像圧縮処理 End ---

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