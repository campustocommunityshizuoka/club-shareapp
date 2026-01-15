// app/admin/login/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // ログイン失敗時はエラーとともにリダイレクト（簡易実装）
    // 本来はフォームにエラーメッセージを戻すのが親切ですが、今回はシンプルにします
    console.error('Login error:', error.message)
    redirect('/admin/login?error=login_failed')
  }

  // ログイン成功後は、管理者ダッシュボード（まだ作っていませんが）へリダイレクト
  redirect('/admin')
}