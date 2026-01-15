// app/circles/[id]/page.tsx
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Circle } from '@/types'

type Props = {
  params: Promise<{ id: string }>
}

// データのキャッシュを無効化（常に最新を取得）
export const revalidate = 0

export default async function CircleDetailPage(props: Props) {
  // Next.js 15以降、paramsはPromiseとして扱われるためawaitが必要です
  const params = await props.params
  const { id } = params

  const supabase = await createClient()

  // IDを使ってデータベースから1件だけ取得 (.single()を使用)
  const { data: circle, error } = await supabase
    .from('circles')
    .select('*')
    .eq('id', id)
    .single()

  // データが見つからない、またはエラーの場合は404ページを表示
  if (error || !circle) {
    notFound()
  }

  const circleData = circle as Circle
  const storageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/circle-icons/`

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* 画像エリア */}
        <div className="relative w-full h-64 sm:h-96 bg-gray-200">
          {circleData.image_path ? (
            <Image
              src={storageUrl + circleData.image_path}
              alt={circleData.name}
              fill
              className="object-cover"
              priority // ファーストビューに入る画像なので優先読み込み
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* 詳細情報エリア */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {circleData.name}
          </h1>

          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {/* whitespace-pre-wrap で改行をそのまま表示 */}
            {circleData.description}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
             <span className="text-sm text-gray-400">
               登録日: {new Date(circleData.created_at).toLocaleDateString('ja-JP')}
             </span>
             
             <Link 
               href="/" 
               className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
             >
               一覧に戻る
             </Link>
          </div>
        </div>

      </div>
    </div>
  )
}