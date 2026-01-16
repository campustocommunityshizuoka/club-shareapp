import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Circle } from '@/types'

type Props = {
  params: Promise<{ id: string }>
}

export const revalidate = 0

export default async function CircleDetailPage(props: Props) {
  const params = await props.params
  const { id } = params

  const supabase = await createClient()

  const { data: circle, error } = await supabase
    .from('circles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !circle) {
    notFound()
  }

  const circleData = circle as Circle
  const storageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/circle-icons/`

  return (
    <div className="min-h-screen bg-orange-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* 画像エリア */}
        <div className="relative w-full h-64 sm:h-96 bg-gray-200">
          {circleData.image_path ? (
            <Image
              src={storageUrl + circleData.image_path}
              alt={circleData.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* 詳細情報エリア */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {circleData.name}
          </h1>

          <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
            {circleData.description}
          </div>

          {/* ↓ 追加: 連絡先表示エリア */}
          {circleData.contact_info && (
            <div className="mb-8 p-6 bg-orange-50 rounded-lg border border-orange-100">
              <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">
                お問い合わせ / 連絡先
              </h3>
              <p className="text-lg font-bold text-gray-800 select-all">
                {circleData.contact_info}
              </p>
            </div>
          )}

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
             <span className="text-sm text-gray-400">
               登録日: {new Date(circleData.created_at).toLocaleDateString('ja-JP')}
             </span>
             
             <Link 
               href="/" 
               className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-full text-white bg-orange-500 hover:bg-orange-600 transition shadow-sm"
             >
               一覧に戻る
             </Link>
          </div>
        </div>

      </div>
    </div>
  )
}