'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1️⃣ Supabase에 로그인
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (loginError) throw loginError

      console.log('✅ Login successful:', data)
      alert('로그인 성공!')
      
      // 2️⃣ 대시보드로 이동
      router.push('/dashboard')
    } catch (error) {
      console.error('❌ Login failed:', error)
      setError(error instanceof Error ? error.message : '로그인 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded">
        <h1 className="text-3xl font-bold text-white mb-8">로그인</h1>

        {error && (
          <div className="bg-red-900 text-red-200 p-4 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* 이메일 입력 */}
          <div>
            <label className="text-white text-sm">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@viveto.com"
              required
              className="w-full mt-1 p-3 bg-slate-800 text-white rounded border border-slate-700"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label className="text-white text-sm">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              required
              className="w-full mt-1 p-3 bg-slate-800 text-white rounded border border-slate-700"
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3 rounded mt-6"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 회원가입 링크 */}
        <div className="text-center mt-4">
          <p className="text-slate-400">
            계정이 없으신가요?{' '}
            <a href="/auth/signup" className="text-blue-400 hover:text-blue-300">
              회원가입
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}