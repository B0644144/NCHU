import React, { useState } from 'react'
import { SKI_PACKING_LIST, PackingItem, generatePackingList } from '../../data/skiPackingChecklist'
import { CheckSquare, Square, ChevronDown, ChevronUp, Package } from 'lucide-react'

interface SkiPackingChecklistProps {
  difficultyLevels?: string[]
  durationDays?: number
}

export default function SkiPackingChecklist({
  difficultyLevels = ['intermediate'],
  durationDays = 3,
}: SkiPackingChecklistProps) {
  const [items, setItems] = useState<PackingItem[]>(() =>
    generatePackingList(difficultyLevels, durationDays)
  )
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['服裝', '裝備'])
  )

  const categories = Array.from(new Set(items.map(i => i.category)))
  const checkedCount = items.filter(i => i.checked).length
  const totalCount = items.length

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  const checkAll = () => setItems(prev => prev.map(i => ({ ...i, checked: true })))
  const uncheckAll = () => setItems(prev => prev.map(i => ({ ...i, checked: false })))

  const progress = Math.round((checkedCount / totalCount) * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Header + Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Package size={16} color="var(--text-secondary)" />
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>
          滑雪裝備清單
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>{checkedCount}/{totalCount}</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: 'var(--border-primary)', borderRadius: 99, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: progress === 100 ? '#22c55e' : 'var(--accent)',
            borderRadius: 99,
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      {/* Bulk actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={checkAll} style={{ fontSize: 11, color: 'var(--text-faint)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0' }}>
          全部勾選
        </button>
        <span style={{ color: 'var(--border-primary)' }}>|</span>
        <button onClick={uncheckAll} style={{ fontSize: 11, color: 'var(--text-faint)', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0' }}>
          取消全選
        </button>
      </div>

      {/* Categories */}
      {categories.map(cat => {
        const catItems = items.filter(i => i.category === cat)
        const catChecked = catItems.filter(i => i.checked).length
        const isExpanded = expandedCategories.has(cat)

        return (
          <div key={cat} style={{ borderRadius: 10, border: '1px solid var(--border-faint)', overflow: 'hidden' }}>
            <button
              onClick={() => toggleCategory(cat)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 12px', background: 'var(--bg-secondary)',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', flex: 1, textAlign: 'left' }}>
                {cat}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 600,
                color: catChecked === catItems.length ? '#16a34a' : 'var(--text-faint)',
                background: catChecked === catItems.length ? 'rgba(34,197,94,0.1)' : 'var(--bg-hover)',
                padding: '1px 7px', borderRadius: 99,
              }}>
                {catChecked}/{catItems.length}
              </span>
              {isExpanded ? <ChevronUp size={12} color="var(--text-faint)" /> : <ChevronDown size={12} color="var(--text-faint)" />}
            </button>

            {isExpanded && (
              <div style={{ padding: '6px 12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {catItems.map(item => (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '5px 4px', cursor: 'pointer', borderRadius: 7,
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked || false}
                      onChange={() => toggleItem(item.id)}
                      style={{ display: 'none' }}
                    />
                    {item.checked
                      ? <CheckSquare size={15} color="#22c55e" />
                      : <Square size={15} color="var(--text-faint)" />
                    }
                    <span style={{
                      fontSize: 12,
                      color: item.checked ? 'var(--text-faint)' : 'var(--text-primary)',
                      textDecoration: item.checked ? 'line-through' : 'none',
                      flex: 1,
                    }}>
                      {item.name}
                    </span>
                    {item.essential && !item.checked && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, color: '#f59e0b',
                        background: 'rgba(245,158,11,0.1)', padding: '1px 5px', borderRadius: 4,
                      }}>必備</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
