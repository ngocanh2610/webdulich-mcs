import React from 'react';
import { Search, Map } from 'lucide-react';

const SearchFilter = ({ searchTerm, setSearchTerm, regionFilter, setRegionFilter, regions }) => {
  return (
    <div className="glass-panel" style={{ 
      padding: '1.5rem', 
      marginBottom: '3rem',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ 
        position: 'relative', 
        flex: '1 1 300px'
      }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder="Tìm kiếm tỉnh thành..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--border-strong)',
            padding: '0.75rem 1rem 0.75rem 3rem',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            outline: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setRegionFilter('all')}
          style={{
            background: regionFilter === 'all' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
            color: regionFilter === 'all' ? 'white' : 'var(--text-secondary)',
            border: '1px solid',
            borderColor: regionFilter === 'all' ? 'var(--accent-primary)' : 'var(--border-light)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Map size={16} /> Tất cả
        </button>
        
        {regions.map(r => (
          <button 
            key={r.code}
            onClick={() => setRegionFilter(r.code)}
            style={{
              background: regionFilter === r.code ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
              color: regionFilter === r.code ? 'white' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: regionFilter === r.code ? 'var(--border-strong)' : 'var(--border-light)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>{r.icon}</span> {r.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;
