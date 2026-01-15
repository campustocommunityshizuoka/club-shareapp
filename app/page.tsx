import { createClient } from '@/utils/supabase/server'
import { Circle } from '@/types'
import Link from 'next/link'
import Image from 'next/image'

// キャッシュを無効化して常に最新データを取得
export const revalidate = 0 

export default async function Home() {
  const supabase = await createClient()
  const { data: circles } = await supabase
    .from('circles')
    .select('*')
    .order('created_at', { ascending: false })

  const storageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/circle-icons/`

  return (
    <main className="min-h-screen bg-orange-50/30">
      {/* ヘッダーエリア */}
      <header className="bg-sky-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* 左側：ロゴとサイト名 */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative w-8 h-8 flex-shrink-0">
              <Image src="/logo.png" alt="ロゴ" fill className="object-contain" />
            </div>
            <h1 className="text-sm sm:text-lg font-bold text-gray-800 tracking-wide">
              しずおかコネクト<span className="hidden sm:inline">　サークル一覧サイト</span>
            </h1>
          </div>

          {/* 右側：登録ボタン */}
          <Link 
            href="/register" 
            className="text-xs sm:text-sm text-gray-500 hover:text-orange-500 transition-colors flex items-center gap-1 font-medium whitespace-nowrap"
          >
            <span>＋</span>
            <span>登録</span>
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-16">
        
        {/* サークルリスト（CSS Gridを使用） */}
        {/* grid-cols-2 でスマホでも強制2列。md以上で4列 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8">
          {(circles as Circle[])?.map((circle) => (
            <Link 
              key={circle.id} 
              href={`/circles/${circle.id}`}
              // even:mt-12 で偶数番目を下げてジグザグにする
              className="group flex flex-col items-center text-center even:mt-12"
            >
              {/* 丸いアイコン画像 */}
              {/* スマホでは w-32 (128px) 程度にして2列に収まるサイズに調整 */}
              <div className="relative w-32 h-32 sm:w-44 sm:h-44 mb-3 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl rounded-full overflow-hidden border-4 sm:border-[6px] border-white shadow-lg bg-white">
                {circle.image_path ? (
                  <Image
                    src={storageUrl + circle.image_path}
                    alt={circle.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              
              {/* サークル名 */}
              <h2 className="text-sm sm:text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors px-1 break-words w-full leading-tight">
                {circle.name}
              </h2>
            </Link>
          ))}
        </div>

        {/* データが0件の場合 */}
        {circles?.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">まだサークルが登録されていません</p>
            <Link href="/register" className="text-orange-500 underline">
              最初のサークルを登録する
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}