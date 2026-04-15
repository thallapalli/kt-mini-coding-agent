'use client'

import { useState, useEffect } from 'react'
import { getRepos } from '@/lib/github'
import { Search, Github, Plus } from 'lucide-react'

interface RepoBrowserProps {
  token: string
  onSelectRepo: (repo: any) => void
}

export default function RepoBrowser({ token, onSelectRepo }: RepoBrowserProps) {
  const [repos, setRepos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchRepos() {
      try {
        const data = await getRepos(token)
        setRepos(data)
      } catch (error) {
        console.error('Failed to fetch repos', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRepos()
  }, [token])

  const filteredRepos = repos.filter(repo => 
    repo.full_name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div>Loading repositories...</div>

  return (
    <div style={{ marginTop: '20px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ padding: '12px', background: '#f6f8fa', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Search size={16} color="#666" />
        <input 
          type="text" 
          placeholder="Search your repositories..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ 
            border: 'none', 
            background: 'transparent', 
            outline: 'none', 
            width: '100%',
            fontSize: '14px'
          }}
        />
      </div>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {filteredRepos.map(repo => (
          <div 
            key={repo.id} 
            style={{ 
              padding: '12px', 
              borderBottom: '1px solid #eee', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => onSelectRepo(repo)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Github size={16} color="#444" />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{repo.full_name}</span>
            </div>
            <button
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                background: 'white',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Plus size={12} /> Select
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
