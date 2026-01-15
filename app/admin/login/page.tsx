// app/admin/login/page.tsx
import { login } from './actions'

// URLパラメータからエラー情報を受け取るための型定義
interface SearchParams {
  error?: string
}

export default function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const errorMessage = searchParams?.error === 'login_failed' 
    ? 'メールアドレスまたはパスワードが間違っています。' 
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          管理者ログイン
        </h1>
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white font-bold py-2 px-4 rounded hover:bg-gray-900 transition duration-200"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  )
}