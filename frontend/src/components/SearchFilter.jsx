import React from 'react';
import { Search, Map } from 'lucide-react';

const SearchFilter = ({ searchTerm, setSearchTerm, regionFilter, setRegionFilter, regions }) => {
  return (
    <div className="glass-panel" style={{ 
      padding: '1.25rem 1.5rem', 
      marginBottom: '2.5rem',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '16px',
      boxShadow: '0 4px 16px rgba(2, 50, 106, 0.05)'
    }}>
      {/* Search Input */}
      <div style={{ 
        position: 'relative', 
        flex: '1 1 300px'
      }}>
        <Search size={18} color="#64748B" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          placeholder="Tìm kiếm tỉnh thành, thủ phủ..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            background: '#F8FAFC',
            border: '1px solid #CBD5E1',
            padding: '0.7rem 1rem 0.7rem 2.75rem',
            borderRadius: '10px',
            color: '#0F172A',
            outline: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            fontWeight: 500,
            transition: 'border-color 0.2s ease'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--brand-navy)'}
          onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
        />
      </div>

      {/* Region Filter Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button 
          type="button"
          onClick={() => setRegionFilter('all')}
          style={{
            background: regionFilter === 'all' ? 'var(--brand-navy)' : '#F1F5F9',
            color: regionFilter === 'all' ? '#FFFFFF' : '#334155',
            border: '1px solid',
            borderColor: regionFilter === 'all' ? 'var(--brand-navy)' : '#CBD5E1',
            padding: '0.5rem 1.1rem',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.875rem',
            fontWeight: 700
          }}
        >
          <Map size={15} /> Tất cả
        </button>
        
        {regions.map(r => (
          <button 
            type="button"
            key={r.code}
            onClick={() => setRegionFilter(r.code)}
            style={{
              background: regionFilter === r.code ? 'var(--brand-navy)' : '#F1F5F9',
              color: regionFilter === r.code ? '#FFFFFF' : '#334155',
              border: '1px solid',
              borderColor: regionFilter === r.code ? 'var(--brand-navy)' : '#CBD5E1',
              padding: '0.5rem 1.1rem',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.875rem',
              fontWeight: 700
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
