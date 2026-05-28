'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface User {
  id: string
  email: string
}

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  // ============================================
  // 현재 로그인 상태 확인
  // ============================================
  async function checkAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        // 로그인됨
        setUser({
          id: session.user.id,
          email: session.user.email || ''
        })
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // 로그아웃
  // ============================================
  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      console.log('✅ Logged out')
    } catch (error) {
      console.error('❌ Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-white">⏳ 로딩 중...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-2xl mx-auto">
        {/* ============ 헤더 ============ */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Viveto M0
          </h1>
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              로그아웃
            </button>
          ) : null}
        </div>

        {/* ============ 로그인 상태에 따른 UI ============ */}
        {user ? (
          // 로그인된 상태
          <div className="space-y-6">
            {/* 사용자 정보 */}
            <div className="bg-slate-900 p-6 rounded">
              <p className="text-white text-lg">
                <span className="font-bold">환영합니다!</span> {user.email}
              </p>
              <p className="text-slate-400 text-sm mt-2">
                ID: {user.id}
              </p>
            </div>

            {/* 대시보드 버튼 */}
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-bold text-lg"
            >
              내 대시보드 보기
            </button>

            {/* 설명 */}
            <div className="bg-slate-900 p-6 rounded">
              <h2 className="text-white font-bold mb-3">✅ 인증 완료!</h2>
              <p className="text-slate-300 text-sm">
                이제 로그인된 사용자로 시스템이 작동합니다.
                대시보드에서 자신의 매장 데이터만 볼 수 있습니다.
              </p>
            </div>
          </div>
        ) : (
          // 로그인 안 된 상태
          <div className="space-y-6">
            {/* 설명 */}
            <div className="bg-slate-900 p-6 rounded">
              <h2 className="text-white font-bold mb-3">🔐 사용자 인증 시스템</h2>
              <p className="text-slate-300 text-sm">
                로그인하거나 회원가입해서 Viveto를 시작하세요.
                로그인 후 자신의 매장 데이터만 접근할 수 있습니다.
              </p>
            </div>

            {/* 버튼 */}
            <div className="space-y-3">
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-bold text-lg"
              >
                로그인
              </button>
              <button
                onClick={() => router.push('/auth/signup')}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded font-bold text-lg"
              >
                회원가입
              </button>
            </div>

            {/* 테스트 계정 정보 */}
            <div className="bg-slate-800 p-4 rounded border border-slate-700">
              <p className="text-slate-300 text-xs font-mono">
                <span className="text-yellow-400">💡 테스트:</span><br/>
                이메일: test@viveto.com<br/>
                비밀번호: 12345678
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}