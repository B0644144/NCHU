import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Type, Hash, CheckSquare, Link, Calendar, ChevronDown, MoreHorizontal, FileText } from 'lucide-react';

export interface CustomProperty {
  id: string;
  name: string;
  type: 'text' | 'number' | 'checkbox' | 'url' | 'date';
  value: any;
}

export type CustomProperties = Record<string, CustomProperty>;

interface PropertiesEditorProps {
  properties: CustomProperties | null | undefined;
  onChange: (newProperties: CustomProperties) => void;
  readOnly?: boolean;
}

const TYPE_ICONS = {
  text: <Type size={12} />,
  number: <Hash size={12} />,
  checkbox: <CheckSquare size={12} />,
  url: <Link size={12} />,
  date: <Calendar size={12} />
};

const TYPE_LABELS = {
  text: 'Text',
  number: 'Number',
  checkbox: 'Checkbox',
  url: 'URL',
  date: 'Date'
};

export default function PropertiesEditor({ properties, onChange, readOnly = false }: PropertiesEditorProps) {
  const [addingProp, setAddingProp] = useState(false);
  const [newPropName, setNewPropName] = useState('');
  const [newPropType, setNewPropType] = useState<CustomProperty['type']>('text');
  const addInputRef = useRef<HTMLInputElement>(null);

  const propsObj = typeof properties === 'string' ? JSON.parse(properties) : (properties || {});
  const propList = Object.values(propsObj) as CustomProperty[];

  useEffect(() => {
    if (addingProp && addInputRef.current) {
      addInputRef.current.focus();
    }
  }, [addingProp]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropName.trim()) {
      setAddingProp(false);
      return;
    }
    const newId = 'prop_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    const updated = {
      ...propsObj,
      [newId]: {
        id: newId,
        name: newPropName.trim(),
        type: newPropType,
        value: newPropType === 'checkbox' ? false : ''
      }
    };
    onChange(updated);
    setNewPropName('');
    setAddingProp(false);
  };

  const handleUpdate = (id: string, updates: Partial<CustomProperty>) => {
    const updated = {
      ...propsObj,
      [id]: { ...propsObj[id], ...updates }
    };
    onChange(updated);
  };

  const handleDelete = (id: string) => {
    const updated = { ...propsObj };
    delete updated[id];
    onChange(updated);
  };

  if (readOnly && propList.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
      {propList.map((prop) => (
        <PropertyRow 
          key={prop.id} 
          prop={prop} 
          onUpdate={(updates) => handleUpdate(prop.id, updates)}
          onDelete={() => handleDelete(prop.id)}
          readOnly={readOnly}
        />
      ))}

      {!readOnly && (
        <div style={{ marginTop: 2 }}>
          {addingProp ? (
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px', background: 'var(--bg-tertiary)', borderRadius: 6, border: '1px solid var(--border-primary)' }}>
              <select 
                value={newPropType} 
                onChange={e => setNewPropType(e.target.value as CustomProperty['type'])}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: 12, outline: 'none', cursor: 'pointer' }}
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="checkbox">Checkbox</option>
                <option value="url">URL</option>
                <option value="date">Date</option>
              </select>
              <input
                ref={addInputRef}
                value={newPropName}
                onChange={e => setNewPropName(e.target.value)}
                placeholder="Property name..."
                style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}
                onKeyDown={e => {
                  if (e.key === 'Escape') setAddingProp(false);
                }}
              />
              <button type="button" onClick={() => setAddingProp(false)} style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer' }}>×</button>
            </form>
          ) : (
            <button 
              onClick={() => setAddingProp(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', padding: '4px 6px', fontSize: 12, borderRadius: 6, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-faint)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Plus size={12} /> Add a property
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function PropertyRow({ prop, onUpdate, onDelete, readOnly }: { prop: CustomProperty, onUpdate: (u: Partial<CustomProperty>) => void, onDelete: () => void, readOnly: boolean }) {
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(prop.name);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingName && nameRef.current) nameRef.current.focus();
  }, [editingName]);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }} className="group">
      <div style={{ 
        width: 110, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', padding: '4px 0',
      }}>
        <span style={{ color: 'var(--text-faint)' }}>{TYPE_ICONS[prop.type]}</span>
        
        {editingName && !readOnly ? (
          <input 
            ref={nameRef}
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={() => { setEditingName(false); if(nameVal.trim() !== prop.name) onUpdate({ name: nameVal.trim() || 'Untitled' }); }}
            onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }}
            style={{ width: '100%', background: 'transparent', border: '1px solid var(--border-primary)', borderRadius: 4, color: 'var(--text-primary)', fontSize: 12, padding: '0 2px', outline: 'none' }}
          />
        ) : (
          <span 
            onClick={() => !readOnly && setEditingName(true)}
            style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: readOnly ? 'default' : 'text' }}
          >
            {prop.name}
          </span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <PropertyValueInput prop={prop} onUpdate={onUpdate} readOnly={readOnly} />
      </div>

      {!readOnly && (
        <button 
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100"
          style={{ background: 'none', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', padding: '4px', transition: 'opacity 0.15s' }}
          title="Delete property"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>
  );
}

function PropertyValueInput({ prop, onUpdate, readOnly }: { prop: CustomProperty, onUpdate: (u: Partial<CustomProperty>) => void, readOnly: boolean }) {
  if (prop.type === 'checkbox') {
    return (
      <div style={{ padding: '4px 0' }}>
        <input 
          type="checkbox" 
          checked={!!prop.value}
          disabled={readOnly}
          onChange={e => onUpdate({ value: e.target.checked })}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        />
      </div>
    );
  }

  if (prop.type === 'url') {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input 
          type="url"
          value={prop.value || ''}
          placeholder={readOnly ? "Empty" : "Empty"}
          disabled={readOnly}
          onChange={e => onUpdate({ value: e.target.value })}
          style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--accent)', textDecoration: 'underline', padding: '4px 6px', fontSize: 13, outline: 'none', borderRadius: 4, width: '100%' }}
          onFocus={e => { e.currentTarget.style.background = 'var(--bg-tertiary)' }}
          onBlur={e => { e.currentTarget.style.background = 'transparent' }}
        />
        {prop.value && (
          <a href={prop.value} target="_blank" rel="noopener noreferrer" style={{ padding: '4px', color: 'var(--text-faint)', display: 'flex', alignItems: 'center' }}>
            <Link size={12} />
          </a>
        )}
      </div>
    );
  }

  return (
    <input 
      type={prop.type === 'number' ? 'number' : prop.type === 'date' ? 'date' : 'text'}
      value={prop.value || ''}
      placeholder={readOnly ? "Empty" : "Empty"}
      disabled={readOnly}
      onChange={e => onUpdate({ value: prop.type === 'number' ? Number(e.target.value) : e.target.value })}
      style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', padding: '4px 6px', fontSize: 13, outline: 'none', borderRadius: 4 }}
      onFocus={e => { e.currentTarget.style.background = 'var(--bg-tertiary)' }}
      onBlur={e => { e.currentTarget.style.background = 'transparent' }}
    />
  );
}
