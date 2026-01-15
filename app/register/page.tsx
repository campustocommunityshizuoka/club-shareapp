// ファイルの先頭に必ず必要（クライアント機能を使うため）
'use client'

import { registerCircle } from './actions'
import Link from 'next/link'
import Image from 'next/image'
import { useState, ChangeEvent } from 'react'

export default function RegisterPage() {
  // プレビュー画像のURLを保持する状態
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ファイルが選択されたときに実行される関数
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 選択されたファイルからプレビュー用のURLを生成
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50/30 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative">
        {/* 一覧に戻るボタンを左上に配置 */}
        <Link href="/" className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition">
          ←戻る
        </Link>

        <h1 className="text-2xl font-bold mb-8 text-center text-gray-800 pt-4">
          サークル新規登録
        </h1>

        <form action={registerCircle} className="space-y-6">
          
          {/* アイコン画像（プレビュー機能付き） */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              アイコン画像 <span className="text-red-500">*</span>
            </label>
            
            <div className="flex items-center space-x-6">
              {/* プレビュー表示エリア */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-100 shadow-sm flex-shrink-0">
                {previewUrl ? (
                  <Image src={previewUrl} alt="プレビュー" fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs text-center px-1">
                    写真を選択
                  </div>
                )}
              </div>

              {/* ファイル選択ボタン */}
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                required
                onChange={handleImageChange} // 変更時にプレビュー関数を呼ぶ
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
              />
            </div>
          </div>

          {/* サークル名 */}
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-1">
              サークル名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="例: フットサルサークル"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </div>

          {/* 活動内容 */}
          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-1">
              活動内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={5}
              placeholder="活動内容や場所などを記入してください"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
            />
          </div>

          {/* 登録ボタン */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            登録する
          </button>
        </form>
      </div>
    </div>
  )
}