import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
import { SUPPORTED_LANGUAGES, useTranslation, detectBrowserLanguage } from '../i18n'
import { authApi, configApi } from '../api/client'
import { hasStoredLanguage } from '../store/settingsStore'
import { getApiErrorMessage } from '../types'
import { Plus, User as UserIcon, Globe, ChevronDown, Lock } from 'lucide-react'

interface PublicUser {
  id: number
  username: string
  avatar_url: string | null
}

export default function LoginPage(): React.ReactElement {
  const { t, language } = useTranslation()
  const [users, setUsers] = useState<PublicUser[]>([])
  const [mode, setMode] = useState<'select' | 'add'>('select')
  const [newUsername, setNewUsername] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [showTakeoff, setShowTakeoff] = useState(false)

  const { directLogin, register, loadUser } = useAuthStore()
  const { setLanguageLocal, setLanguageTransient } = useSettingsStore()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTarget = useMemo(() => {
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('redirect')
    if (redirect && redirect.startsWith('/') && !redirect.startsWith('//') && !redirect.startsWith('/\\')) {
      return redirect
    }
    return '/dashboard'
  }, [])

  useEffect(() => {
    // Fetch public users on mount
    setIsLoading(true)
    authApi.getPublicUsers()
      .then((data) => {
        setUsers(data.users || [])
        if (!data.users || data.users.length === 0) {
          setMode('add')
        }
      })
      .catch((err) => {
        setError(getApiErrorMessage(err, 'Failed to load users'))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  // Language detection
  useEffect(() => {
    if (hasStoredLanguage()) return
    const detected = detectBrowserLanguage()
    if (detected) {
      setLanguageTransient(detected)
      return
    }
    configApi.getPublicConfig()
      .then(({ defaultLanguage }) => { if (defaultLanguage) setLanguageTransient(defaultLanguage) })
      .catch(() => {})
  }, [setLanguageTransient])

  useEffect(() => {
    if (!langDropdownOpen) return
    const close = () => setLangDropdownOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [langDropdownOpen])

  const handleSelectUser = async (userId: number) => {
    setError('')
    try {
      await directLogin(userId)
      triggerTakeoff()
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Login failed'))
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUsername.trim()) return
    setError('')
    setIsLoading(true)
    try {
      // Auto-generate email and password for seamless registration
      const email = `${newUsername.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}@trek.local`
      const password = Math.random().toString(36).slice(-10) + 'Aa1!'
      await register(newUsername.trim(), email, password)
      triggerTakeoff()
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to create user'))
      setIsLoading(false)
    }
  }

  const triggerTakeoff = () => {
    setShowTakeoff(true)
    setTimeout(() => navigate(redirectTarget), 2600)
  }

  if (showTakeoff) {
    return (
      <div className="takeoff-overlay" style={{ position: 'fixed', inset: 0, zIndex: 99999, overflow: 'hidden' }}>
        <div className="takeoff-sky" style={{ position: 'absolute', inset: 0 }} />
        {/* Simplified takeoff animation */}
        <div className="takeoff-logo" style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <img src="/logo-light.svg" alt="TREK" style={{ height: 72 }} />
          <p style={{ margin: 0, fontSize: 20, color: 'rgba(255,255,255,0.6)', fontFamily: "'MuseoModerno', sans-serif", textTransform: 'lowercase', whiteSpace: 'nowrap' }}>{t('login.tagline')}</p>
        </div>
        <style>{`
          .takeoff-sky {
            background: linear-gradient(to top, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #0a0a23 100%);
            animation: skyShift 2.6s ease-in-out forwards;
          }
          @keyframes skyShift {
            0%   { background: linear-gradient(to top, #0a0a23 0%, #0f172a 40%, #111827 100%); }
            100% { background: linear-gradient(to top, #000011 0%, #000016 50%, #000011 100%); }
          }
          .takeoff-logo {
            opacity: 0;
            animation: logoReveal 0.5s ease-out 0.2s forwards;
          }
          @keyframes logoReveal {
            0%   { opacity: 0; transform: translate(-50%, -40%) scale(0.9); }
            100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif", 
      background: '#141414', // Netflix dark background
      color: '#fff',
      position: 'relative' 
    }}>

      {/* Language dropdown */}
      <div style={{ position: 'absolute', top: 24, right: 32, zIndex: 10 }}>
        <button
          onClick={(e) => { e.stopPropagation(); setLangDropdownOpen(o => !o) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 6,
            background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)',
            fontSize: 14, fontWeight: 500, color: '#fff',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'background 0.2s',
          }}
        >
          <Globe size={16} />
          {SUPPORTED_LANGUAGES.find(l => l.value === language)?.label ?? language.toUpperCase()}
          <ChevronDown size={14} style={{ transform: langDropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
        </button>
        {langDropdownOpen && (
          <div style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              background: 'rgba(0,0,0,0.9)', borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.2)',
              minWidth: 160, overflow: 'hidden'
          }}>
            {SUPPORTED_LANGUAGES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => { setLanguageLocal(value); setLangDropdownOpen(false) }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '12px 16px', border: 'none',
                  background: value === language ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: '#fff', fontSize: 14, cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Header Logo */}
      <div style={{ padding: '24px 48px' }}>
        <img src="/logo-light.svg" alt="TREK" style={{ height: 40 }} />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 64px' }}>
        
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTopColor: '#e50914', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>Loading profiles...</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        ) : mode === 'select' ? (
          <div style={{ textAlign: 'center', width: '100%', maxWidth: 1000 }}>
            <h1 style={{ fontSize: '3.5vw', minFontSize: 32, fontWeight: 500, margin: '0 0 32px' }}>
              Who's planning?
            </h1>

            {error && (
              <div style={{ background: '#e50914', color: 'white', padding: '12px 24px', borderRadius: 4, display: 'inline-block', marginBottom: 24 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2vw', minGap: 16 }}>
              {users.map((u) => (
                <div 
                  key={u.id} 
                  className="profile-card"
                  onClick={() => handleSelectUser(u.id)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', width: 'clamp(84px, 10vw, 150px)' }}
                >
                  <div className="avatar-wrapper" style={{ 
                    width: '100%', aspectRatio: '1/1', 
                    borderRadius: 8, overflow: 'hidden', 
                    border: '3px solid transparent',
                    transition: 'border-color 0.2s',
                    background: '#333',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt={u.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <UserIcon size={64} color="#666" style={{ width: '50%', height: '50%' }} />
                    )}
                  </div>
                  <span className="profile-name" style={{ 
                    marginTop: 12, fontSize: 'clamp(14px, 1.5vw, 24px)', 
                    color: 'grey', transition: 'color 0.2s',
                    textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>
                    {u.username}
                  </span>
                </div>
              ))}

              <div 
                className="profile-card"
                onClick={() => setMode('add')}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', width: 'clamp(84px, 10vw, 150px)' }}
              >
                <div className="avatar-wrapper" style={{ 
                  width: '100%', aspectRatio: '1/1', 
                  borderRadius: 8, overflow: 'hidden', 
                  border: '3px solid transparent',
                  transition: 'border-color 0.2s, background-color 0.2s',
                  background: 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Plus size={64} className="plus-icon" style={{ width: '50%', height: '50%', color: 'grey', transition: 'color 0.2s' }} />
                </div>
                <span className="profile-name" style={{ marginTop: 12, fontSize: 'clamp(14px, 1.5vw, 24px)', color: 'grey', transition: 'color 0.2s' }}>
                  Add Profile
                </span>
              </div>
            </div>

            <style>{`
              .profile-card:hover .avatar-wrapper { border-color: white; }
              .profile-card:hover .profile-name { color: white !important; }
              .profile-card:hover .avatar-wrapper { background: white !important; }
              .profile-card:hover .plus-icon { color: #141414 !important; }
            `}</style>
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: 400 }}>
            <h1 style={{ fontSize: 36, fontWeight: 500, margin: '0 0 32px', textAlign: 'center' }}>
              Add Profile
            </h1>
            
            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {error && (
                <div style={{ padding: '16px', background: '#e50914', color: 'white', borderRadius: 4, fontSize: 14 }}>
                  {error}
                </div>
              )}
              
              <div>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Name"
                  required
                  autoFocus
                  style={{
                    width: '100%', padding: '16px', background: '#333', color: 'white',
                    border: 'none', borderRadius: 4, fontSize: 16, outline: 'none', boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <button
                  type="submit"
                  disabled={isLoading || !newUsername.trim()}
                  style={{
                    flex: 1, padding: '16px', background: '#fff', color: '#141414',
                    border: 'none', borderRadius: 4, fontSize: 18, fontWeight: 600, cursor: 'pointer',
                    opacity: isLoading || !newUsername.trim() ? 0.7 : 1
                  }}
                >
                  {isLoading ? 'Creating...' : 'Continue'}
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('select'); setNewUsername(''); setError('') }}
                  style={{
                    flex: 1, padding: '16px', background: 'transparent', color: '#fff',
                    border: '1px solid grey', borderRadius: 4, fontSize: 18, fontWeight: 600, cursor: 'pointer'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'grey'}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
