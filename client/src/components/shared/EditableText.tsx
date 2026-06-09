import React, { useState, useRef, useEffect } from 'react'

interface EditableTextProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  className?: string
  style?: React.CSSProperties
  multiline?: boolean
  disabled?: boolean
  textStyle?: React.CSSProperties
  inputStyle?: React.CSSProperties
}

export default function EditableText({ 
  value, onChange, placeholder, className, style, 
  multiline, disabled, textStyle, inputStyle 
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempVal, setTempVal] = useState(value)
  const inputRef = useRef<any>(null)

  useEffect(() => { setTempVal(value) }, [value])

  if (!isEditing) {
    return (
      <div 
        onClick={(e) => {
          if (disabled) return
          setIsEditing(true)
        }}
        className={className}
        style={{ 
          cursor: disabled ? 'default' : 'text', 
          minHeight: 20, 
          display: 'flex',
          alignItems: 'center',
          ...style,
          ...textStyle
        }}
        title={disabled ? undefined : "Click to edit"}
      >
        {value || <span style={{ opacity: 0.5 }}>{placeholder}</span>}
      </div>
    )
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (tempVal.trim() !== value.trim()) {
      onChange(tempVal.trim())
    } else {
      setTempVal(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === 'Escape') {
      setTempVal(value)
      setIsEditing(false)
    }
  }

  const commonInputStyle: React.CSSProperties = {
    fontFamily: 'inherit',
    border: '1px solid var(--border-primary)',
    borderRadius: 4,
    padding: '2px 6px',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    outline: 'none',
    width: '100%',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
    ...inputStyle
  }

  if (multiline) {
    return (
      <div style={{ ...style, width: '100%' }}>
        <textarea
          autoFocus
          ref={inputRef}
          value={tempVal}
          onChange={e => setTempVal(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={className}
          style={{ ...commonInputStyle, resize: 'vertical', minHeight: 60 }}
          placeholder={placeholder}
          onClick={e => e.stopPropagation()}
        />
      </div>
    )
  }

  return (
    <div style={{ ...style, width: '100%' }}>
      <input
        autoFocus
        ref={inputRef}
        value={tempVal}
        onChange={e => setTempVal(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={className}
        style={commonInputStyle}
        placeholder={placeholder}
        onClick={e => e.stopPropagation()}
      />
    </div>
  )
}
