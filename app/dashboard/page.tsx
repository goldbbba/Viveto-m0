'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Shop {
  id: string
  shop_name: string
  phone: string
  business_type: string
  address: string
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [shopName, setShopName] = useState('')
  const [phone, setPhone] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth/login')
        return
      }

      setUser(session.user)
      await fetchShops(session.user.id)
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  async function fetchShops(userId: string) {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', userId)

      if (error) throw error
      setShops(data || [])
    } catch (error) {
      console.error('Failed to fetch shops:', error)
    }
  }

  async function handleAddShop(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('shops')
        .insert([
          {
            shop_name: shopName,
            phone,
            business_type: businessType,
            address,
            owner_id: user.id
          }
        ])
        .select()

      if (error) throw error

      setShops([...shops, data[0]])
      setShopName('')
      setPhone('')
      setBusinessType('')
      setAddress('')
      alert('매장이 추가되었습니다!')
    } catch (error) {
      console.error('Failed to add shop:', error)
      alert('매장 추가 실패')
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">로딩 중...</div>
  }

  return (
    <main className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Viveto M0</h1>
          <div className="text-right">
            <p className="text-gray-400">로그인: {user?.email}</p>
            <a href="/auth/login" className="text-blue-400 hover:text-blue-300 underline" onClick={handleLogout}>
              로그아웃
            </a>
          </div>
        </div>

        {/* 매장 추가 폼 */}
        <div className="bg-slate-900 p-8 rounded mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">새 매장 추가</h2>
          <form onSubmit={handleAddShop} className="space-y-4">
            <div>
              <label className="text-white text-sm">매장명</label>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="예: 스타벅스 종로점"
                required
                className="w-full mt-1 p-3 bg-slate-800 text-white rounded border border-slate-700"
              />
            </div>

            <div>
              <label className="text-white text-sm">전화번호</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678"
                required
                className="w-full mt-1 p-3 bg-slate-800 text-white rounded border border-slate-700"
              />
            </div>

            <div>
              <label className="text-white text-sm">업종</label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="예: 카페"
                required
                className="w-full mt-1 p-3 bg-slate-800 text-white rounded border border-slate-700"
              />
            </div>

            <div>
              <label className="text-white text-sm">주소</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="예: 서울 종로구 종로 1"
                required
                className="w-full mt-1 p-3 bg-slate-800 text-white rounded border border-slate-700"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-6 p-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
            >
              매장 추가
            </button>
          </form>
        </div>

        {/* 매장 목록 */}
        <div className="bg-slate-900 p-8 rounded">
          <h2 className="text-2xl font-bold text-white mb-6">내 매장 ({shops.length}개)</h2>
          
          {shops.length === 0 ? (
            <p className="text-gray-400">등록된 매장이 없습니다.</p>
          ) : (
            <div className="grid gap-4">
              {shops.map((shop) => (
                <div key={shop.id} className="bg-slate-800 p-4 rounded border border-slate-700">
                  <h3 className="text-white font-bold mb-2">{shop.shop_name}</h3>
                  <p className="text-gray-400 text-sm">
                    📞 {shop.phone} | 🏢 {shop.business_type} | 📍 {shop.address}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}