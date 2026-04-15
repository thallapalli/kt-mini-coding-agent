'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { Github, LogOut } from 'lucide-react'

export default function Auth() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'repo',
      },
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '14px', color: '#666' }}>{user.email}</span>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #ddd',
            background: 'white',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleLogin}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        borderRadius: '6px',
        border: 'none',
        background: '#24292e',
        color: 'white',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      <Github size={16} /> Sign in with GitHub
    </button>
  )
}
