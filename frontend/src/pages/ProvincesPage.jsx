import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import ProvinceCard from '../components/ProvinceCard';
import SearchFilter from '../components/SearchFilter';
import LoadingSpinner from '../components/LoadingSpinner';

const ProvincesPage = () => {
  const { mode, provinces, loading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [regions, setRegions] = useState([]);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    // Fetch regions
    fetch('/api/provinces/meta/regions')
      .then(res => res.json())
      .then(data => {
        if (data.success) setRegions(data.data);
      })
      .catch(err => console.error(err));
      
    // Fetch location counts
    fetch('/api/locations/meta/counts')
      .then(res => res.json())
      .then(data => {
        if (data.success) setCounts(data.data);
      })
      .catch(err => console.error(err));
  }, []);

  const filteredProvinces = useMemo(() => {
    const normalize = (str) => {
      if (!str) return '';
      return str.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D')
                .toLowerCase();
    };
    
    const searchNormalized = normalize(searchTerm);

    return provinces.filter(p => {
      const matchRegion = regionFilter === 'all' || p.regionCode === regionFilter;
      const matchSearch = normalize(p.name).includes(searchNormalized) || 
                          normalize(p.capital).includes(searchNormalized);
      return matchRegion && matchSearch;
    }).sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0));
  }, [provinces, searchTerm, regionFilter, counts]);

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            Khám Phá <span className="text-gradient">{mode} Tỉnh Thành</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            {mode === '63' 
              ? 'Khám phá vẻ đẹp đa dạng của 63 tỉnh thành Việt Nam qua lăng kính bản đồ hành chính hiện tại.'
              : 'Trải nghiệm bản đồ mở rộng với 34 tỉnh thành sau đề án quy hoạch không gian phát triển mới năm 2025.'}
          </p>
        </div>

        <SearchFilter 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          regionFilter={regionFilter} 
          setRegionFilter={setRegionFilter}
          regions={regions}
        />

        {loading ? (
          <LoadingSpinner />
        ) : filteredProvinces.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '2rem' 
          }}>
            {filteredProvinces.map(province => (
              <ProvinceCard key={province.id} province={province} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Không tìm thấy kết quả</h3>
            <p>Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvincesPage;
