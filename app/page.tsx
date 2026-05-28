'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [shops, setShops] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchShops()
  }, [])

  // ============================================
  // 1️⃣ Supabase에서 매장 목록 조회
  // ============================================
  async function fetchShops() {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')

      if (error) throw error

      setShops(data || [])
      console.log('✅ Shops fetched:', data)
    } catch (error) {
      console.error('❌ Error fetching shops:', error)
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // 2️⃣ 테스트 매장 추가 (owner_id 포함)
  // ============================================
  async function addTestShop() {
    try {
      // ✅ 임시 owner_id 생성 (테스트용 UUID)
      // (실제 서비스에서는 로그인한 사용자 ID 사용)
      const tempOwnerId = '00000000-0000-0000-0000-000000000001'

      const { data, error } = await supabase
        .from('shops')
        .insert([
          {
            shop_name: 'Test Nail Shop',
            phone: '010-1234-5678',
            business_type: 'nailshop',
            address: 'Seoul',
            owner_email: 'test@viveto.com',
            owner_id: tempOwnerId  // ✅ 중요: owner_id 필수!
          }
        ])
        .select()

      if (error) throw error

      console.log('✅ Shop added:', data)
      fetchShops()
    } catch (error) {
      console.error('❌ Error adding shop:', error)
    }
  }

  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-2xl mx-auto">
        {/* ============ 제목 ============ */}
        <h1 className="text-4xl font-bold text-white mb-8">
          Viveto M0 - Supabase Test
        </h1>

        {/* ============ 상태 표시 ============ */}
        <div className="bg-slate-900 p-4 rounded mb-8">
          <p className="text-white">
            {loading ? '⏳ 로딩 중...' : '✅ 로드 완료'}
          </p>
          <p className="text-green-400 text-sm mt-2">
            총 {shops.length}개 매장
          </p>
        </div>

        {/* ============ 추가 버튼 ============ */}
        <button
          onClick={addTestShop}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded mb-8 font-bold"
        >
          테스트 매장 추가
        </button>

        {/* ============ 매장 목록 ============ */}
        <div className="space-y-4">
          {shops.length === 0 ? (
            <p className="text-slate-400">아직 매장이 없습니다.</p>
          ) : (
            shops.map((shop) => (
              <div key={shop.id} className="bg-slate-800 p-4 rounded">
                <h2 className="text-white font-bold">{shop.shop_name}</h2>
                <p className="text-slate-400 text-sm">
                  {shop.business_type} | {shop.phone}
                </p>
                <p className="text-slate-400 text-sm">{shop.address}</p>
                <p className="text-slate-500 text-xs mt-2">
                  ID: {shop.id}
                </p>
              </div>
            ))
          )}
        </div>

        {/* ============ 콘솔 안내 ============ */}
        <div className="mt-8 bg-slate-900 p-4 rounded">
          <p className="text-white text-sm font-mono">
            브라우저 콘솔 열기 (F12) → Console 탭 → 메시지 확인
          </p>
        </div>
      </div>
    </main>
  )
}