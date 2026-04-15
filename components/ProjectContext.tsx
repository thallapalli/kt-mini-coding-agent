'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { Folder, ChevronRight, X } from 'lucide-react'

interface Project {
  id: string
  repo_id: number
  repo_name: string
  repo_full_name: string
  repo_url: string
}

interface ProjectContextProps {
  userId: string
  activeProject: Project | null
  setActiveProject: (project: Project | null) => void
}

export default function ProjectContext({ userId, activeProject, setActiveProject }: ProjectContextProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
      
      if (!error && data) {
        setProjects(data)
        if (data.length > 0 && !activeProject) {
          setActiveProject(data[0])
        }
      }
      setLoading(false)
    }

    fetchProjects()
  }, [userId, supabase, activeProject, setActiveProject])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (!error) {
      setProjects(projects.filter(p => p.id !== id))
      if (activeProject?.id === id) {
        setActiveProject(null)
      }
    }
  }

  if (loading) return <div>Loading projects...</div>

  return (
    <div style={{ marginTop: '20px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Folder size={18} /> Saved Projects
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {projects.length === 0 ? (
          <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic' }}>No saved projects yet.</p>
        ) : (
          projects.map(project => (
            <div 
              key={project.id}
              onClick={() => setActiveProject(project)}
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: activeProject?.id === project.id ? '2px solid #0070f3' : '1px solid #ddd',
                background: activeProject?.id === project.id ? '#f0f7ff' : 'white',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ChevronRight size={16} color={activeProject?.id === project.id ? '#0070f3' : '#666'} />
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{project.repo_full_name}</span>
              </div>
              <button 
                onClick={(e) => handleDelete(project.id, e)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#666' }}
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
