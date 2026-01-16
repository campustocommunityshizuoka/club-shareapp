import { createClient } from '@/utils/supabase/server'
import { deleteCircle, signOut } from './actions'
import { Circle } from '@/types'
import Image from 'next/image'

export const revalidate = 0

export default async function AdminDashboard() {
  const supabase = await createClient()

  // データベースから全サークルを取得
  const { data: circles } = await supabase
    .from('circles')
    .select('*')
    .order('created_at', { ascending: false })

  const storageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/circle-icons/`

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* ヘッダーエリア */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded shadow">
          <h1 className="text-2xl font-bold text-gray-800">管理者ダッシュボード</h1>
          <form action={signOut}>
            <button className="text-sm text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50 transition">
              ログアウト
            </button>
          </form>
        </div>

        {/* サークル一覧テーブル */}
        <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 border-b font-medium text-gray-600 w-24">画像</th>
                <th className="p-4 border-b font-medium text-gray-600 w-1/4">サークル名</th>
                <th className="p-4 border-b font-medium text-gray-600">説明</th>
                {/* ↓ 追加: 連絡先の列ヘッダー */}
                <th className="p-4 border-b font-medium text-gray-600 w-1/5">連絡先</th>
                <th className="p-4 border-b font-medium text-gray-600 text-right w-20">操作</th>
              </tr>
            </thead>
            <tbody>
              {(circles as Circle[])?.map((circle) => (
                <tr key={circle.id} className="hover:bg-gray-50 border-b last:border-0">
                  <td className="p-4 align-top">
                    <div className="relative w-16 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      {circle.image_path && (
                        <Image
                          src={storageUrl + circle.image_path}
                          alt={circle.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-gray-800 align-top">
                    {circle.name}
                  </td>
                  <td className="p-4 text-gray-600 text-sm max-w-xs align-top">
                    <div className="line-clamp-3 whitespace-pre-wrap">
                      {circle.description}
                    </div>
                  </td>
                  
                  {/* ↓ 追加: 連絡先のデータ表示 */}
                  <td className="p-4 text-gray-600 text-sm align-top break-all">
                    {circle.contact_info || <span className="text-gray-400">-</span>}
                  </td>

                  <td className="p-4 text-right align-top">
                    <DeleteButton id={circle.id} imagePath={circle.image_path} />
                  </td>
                </tr>
              ))}
              {circles?.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    サークルが登録されていません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function DeleteButton({ id, imagePath }: { id: string; imagePath: string | null }) {
  const deleteCircleWithId = deleteCircle.bind(null, id, imagePath)
  return (
    <form action={deleteCircleWithId}>
      <button 
        type="submit"
        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition whitespace-nowrap"
      >
        削除
      </button>
    </form>
  )
}