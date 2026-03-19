import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RefreshCw, Maximize2, Monitor, Smartphone, Tablet } from 'lucide-react'
import type { ProjectModel } from '../lib/type/example'

interface ProjectPreviewModalProps {
  project: ProjectModel | null
  onClose: () => void
}

type DeviceType = 'desktop' | 'tablet' | 'mobile'

export const ProjectPreviewModal: React.FC<ProjectPreviewModalProps> = ({ project, onClose }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [device, setDevice] = useState<DeviceType>('desktop')

  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [project])

  const getWidth = () => {
    switch (device) {
      case 'mobile': return '375px'
      case 'tablet': return '768px'
      default: return '100%'
    }
  }

  if (!project) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={onClose}
      >
        <motion.div
          key={project.id}
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            width: '100%',
            maxWidth: '1200px',
            height: '90vh',
            background: '#1a1a1a',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Browser Header */}
          <div style={{
            padding: '12px 20px',
            background: 'rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
            </div>

            <div style={{
              flex: 1,
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              maxWidth: '600px'
            }}>
              <RefreshCw size={12} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {project.link}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '2px' }}>
                <button 
                  onClick={() => setDevice('desktop')}
                  style={{ padding: '6px', background: device === 'desktop' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '4px' }}
                >
                  <Monitor size={16} />
                </button>
                <button 
                  onClick={() => setDevice('tablet')}
                  style={{ padding: '6px', background: device === 'tablet' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '4px' }}
                >
                  <Tablet size={16} />
                </button>
                <button 
                  onClick={() => setDevice('mobile')}
                  style={{ padding: '6px', background: device === 'mobile' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '4px' }}
                >
                  <Smartphone size={16} />
                </button>
              </div>

              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'rgba(255,255,255,0.5)', display: 'flex' }}
              >
                <Maximize2 size={18} />
              </a>
              <button 
                onClick={onClose}
                style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', padding: 0 }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Iframe Container */}
          <div style={{ flex: 1, position: 'relative', background: '#fff', display: 'flex', justifyContent: 'center' }}>
            {isLoading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
                background: '#1a1a1a',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px'
              }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  style={{ width: '40px', height: '40px', border: '3px solid rgba(99, 102, 241, 0.1)', borderTop: '3px solid #6366f1', borderRadius: '50%' }}
                />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Establishing secure connection...</span>
              </div>
            )}
            <iframe
              src={project.link}
              style={{
                width: getWidth(),
                height: '100%',
                border: 'none',
                transition: 'width 0.3s ease-in-out'
              }}
              onLoad={() => setIsLoading(false)}
              title={project.title}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
