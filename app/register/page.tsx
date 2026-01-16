'use client'

import { registerCircle } from './actions'
import Link from 'next/link'
import Image from 'next/image'
import { useState, ChangeEvent, FormEvent } from 'react'
import imageCompression from 'browser-image-compression' // 追加

export default function RegisterPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // 送信中ローディング用

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // 送信ボタンが押されたときの処理
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 通常の送信を一旦止める
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const imageFile = formData.get('image') as File;

    try {
      // --- ここで画像圧縮 ---
      const options = {
        maxSizeMB: 0.5, // 最大0.5MB (500KB) まで圧縮
        maxWidthOrHeight: 1200, // 長辺を1200pxにリサイズ
        useWebWorker: true,
      }
      
      console.log(`圧縮前: ${imageFile.size / 1024 / 1024} MB`);
      const compressedFile = await imageCompression(imageFile, options);
      console.log(`圧縮後: ${compressedFile.size / 1024 / 1024} MB`);

      // 圧縮したファイルをFormDataに上書き
      formData.set('image', compressedFile);

      // サーバーアクションを実行
      await registerCircle(formData);

    } catch (error) {
      console.error(error);
      alert('エラーが発生しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50/30 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative">
        <Link href="/" className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition">
          ←戻る
        </Link>

        <h1 className="text-2xl font-bold mb-8 text-center text-gray-800 pt-4">
          サークル新規登録
        </h1>

        {/* actionではなくonSubmitを使用 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              アイコン画像 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center space-x-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-100 shadow-sm flex-shrink-0">
                {previewUrl ? (
                  <Image src={previewUrl} alt="プレビュー" fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs text-center px-1">
                    写真を選択
                  </div>
                )}
              </div>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                required
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">
              サークル名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-1">
              活動内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
            />
          </div>

          <div>
            <label htmlFor="contactInfo" className="block text-sm font-bold text-gray-700 mb-1">
              連絡先（メールまたは電話） <span className="text-red-500">*</span>
           </label>
           <input
            type="text"
            id="contactInfo"
            name="contactInfo"
            required
            placeholder="例: circle@example.com または 090-1234-5678"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
           />
          </div>

          <button
            type="submit"
            disabled={isSubmitting} // 送信中はボタンを押せなくする
            className={`w-full text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md 
              ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-0.5'}`}
          >
            {isSubmitting ? '圧縮して送信中...' : '登録する'}
          </button>
        </form>
      </div>
    </div>
  )
}