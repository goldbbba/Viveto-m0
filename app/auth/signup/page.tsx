'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // ✅ 올바른 메서드: signUp (대문자 U)
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      // ✅ 올바른 변수명: error (signupError 아님)
      if (error) throw error

      console.log('✅ Sign up successful:', data)
      alert('회원가입 완료! 로그인 페이지로 이동합니다.')

      // 로그인 페이지로 이동
      router.push('/auth/login')
    } catch (error) {
      console.error('❌ Sign up failed:', error)
      setError(error instanceof Error ? error.message : '회원가입 실패')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-black p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded">
        <h1 className="text-3xl font-bold text-white mb-8">회원가입</h1>

        {error && (
          <div className="bg-red-900 text-red-200 p-4 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-white text-sm mb-2">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@viveto.com"
              required
              className="w-full mt-1 p-3 bg-slate-800 text-white rounded border border-slate-700"
            />
          </div>

          <div>
            <label className="text-white text-sm mb-2">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="12345678"
              required
              className="w-full mt-1 p-3 bg-slate-800 text-white rounded border border-slate-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 p-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="mt-4 text-white text-sm">
          이미 가입했나요? <a href="/auth/login" className="text-blue-400 hover:underline">로그인</a>
        </div>
      </div>
    </main>
  )
}