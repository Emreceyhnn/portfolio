import React, { useState } from 'react'
import type { ProjectCardProps } from '../lib/type/example'
import { ExternalLink, Globe, RefreshCw, Maximize2 } from 'lucide-react'
import { motion } from 'framer-motion'

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, onPreview }) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      style={{
        width: '100%',
        height: '100%',
        aspectRatio: '16 / 10',
        minHeight: '400px',
        background: '#1a1a1a',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        position: 'relative'
      }}
    >
      {/* Mini Browser Header */}
      <div style={{
        padding: '12px 16px',
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
        </div>
        
        <div style={{
          flex: 1,
          margin: '0 16px',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '6px',
          padding: '4px 12px',
          fontSize: '0.75rem',
          color: 'rgba(255,255,255,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          maxWidth: '300px',
          overflow: 'hidden'
        }}>
          <Globe size={12} />
          <span style={{ 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            fontFamily: 'monospace'
          }}>
            {project.link.replace('https://', '')}
          </span>
        </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            <button 
              onClick={() => onPreview(project.id)}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'rgba(255,255,255,0.4)', 
                cursor: 'pointer', 
                display: 'flex',
                padding: '4px'
              }}
              title="Preview Project"
            >
              <Maximize2 size={16} />
            </button>
            <button 
              onClick={() => onSelect(project.id)}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                color: 'rgba(255,255,255,0.4)', 
                cursor: 'pointer', 
                display: 'flex',
                padding: '4px'
              }}
              title="Open in New Tab"
            >
              <ExternalLink size={16} />
            </button>
          </div>
      </div>

      {/* Project Content Info (Floating Overlay for context) */}
      <div style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        right: '24px',
        zIndex: 20,
        pointerEvents: 'none'
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', fontWeight: 700 }}>{project.title}</h3>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
            {project.tech.slice(0, 3).map(t => (
              <span key={t} style={{ fontSize: '0.6rem', color: '#818cf8', opacity: 0.8 }}>#{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Iframe View */}
      <div style={{ flex: 1, position: 'relative', background: '#000' }}>
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5,
            background: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <RefreshCw className="animate-spin" size={24} color="#6366f1" />
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Initializing Preview...
            </span>
          </div>
        )}
        <iframe 
          src={project.link}
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none',
            background: '#fff' 
          }}
          onLoad={() => setIsLoading(false)}
          title={project.title}
          loading="lazy"
        />
      </div>
    </motion.div>
  )
}


