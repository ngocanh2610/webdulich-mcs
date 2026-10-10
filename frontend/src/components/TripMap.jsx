import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Navigation, Layers, Compass, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

/**
 * Interactive Trip Map Component
 * Hiển thị bản đồ hành trình từng ngày với các điểm đánh số 1, 2, 3, 4,
 * tuyến đường polyline kết nối, popup thông tin chi tiết và đồng bộ hai chiều với timeline.
 */
const TripMap = ({
  activities = [],
  activeDay = 1,
  selectedActivity = null,
  onSelectActivity = () => {},
  destinationName = 'Đà Nẵng'
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const polylineRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, attraction, food, hotel, transit
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Lọc các địa điểm theo từ khóa tìm kiếm và loại
  const filteredActivities = activities.filter(act => {
    const matchesSearch = !searchQuery.trim() || 
      (act.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.address || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'ALL' || 
      (filterType === 'attraction' && (act.type === 'attraction' || act.type === 'beach' || act.type === 'culture' || act.type === 'entertainment' || act.type === 'nature')) ||
      (filterType === 'food' && act.type === 'food') ||
      (filterType === 'hotel' && act.type === 'hotel') ||
      (filterType === 'transit' && act.type === 'transit');

    return matchesSearch && matchesType;
  });

  // Khởi tạo Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const checkLeaflet = () => {
      if (typeof window !== 'undefined' && window.L) {
        if (!mapInstanceRef.current) {
          try {
            // Tọa độ mặc định trung tâm Đà Nẵng
            const defaultCenter = [16.0544, 108.2022];
            
            const map = window.L.map(mapContainerRef.current, {
              center: defaultCenter,
              zoom: 12,
              zoomControl: false,
              attributionControl: false
            });

            // Sử dụng CartoDB Voyager tiles (sáng rõ, màu sắc du lịch tương tự Google Maps trong ảnh)
            window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
              maxZoom: 19,
              subdomains: 'abcd',
            }).addTo(map);

            // Layer group chứa các markers
            const markersGroup = window.L.featureGroup().addTo(map);
            markersGroupRef.current = markersGroup;

            mapInstanceRef.current = map;
            setMapLoaded(true);
          } catch (e) {
            console.warn('Leaflet initialization error:', e);
          }
        }
      } else {
        setTimeout(checkLeaflet, 200);
      }
    };

    checkLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Cập nhật Markers và Tuyến đường (Polyline) khi activities hoặc activeDay thay đổi
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = window.L;
    if (!map || !L || !markersGroupRef.current) return;

    // Xóa markers cũ và polyline cũ
    markersGroupRef.current.clearLayers();
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (!activities || activities.length === 0) return;

    const latLngs = [];

    // Vẽ từng marker đánh số 1, 2, 3, 4
    activities.forEach((act, idx) => {
      const lat = act.lat || 16.0544;
      const lng = act.lng || 108.2022;
      latLngs.push([lat, lng]);

      const isSelected = selectedActivity && selectedActivity.name === act.name;
      const badgeNumber = act.order || (idx + 1);

      // Màu sắc pin: transit (xanh navy), food/attraction (đỏ thắm), hotel (tím/xanh)
      let pinColor = '#E11D48'; // Đỏ thương hiệu du lịch chuẩn
      if (act.type === 'transit') pinColor = '#02326A';
      else if (act.type === 'hotel') pinColor = '#7C3AED';
      else if (act.type === 'beach') pinColor = '#0284C7';

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-trip-marker',
        html: `
          <div style="
            position: relative;
            cursor: pointer;
            transform: translate(-50%, -100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.25));
          ">
            <div style="
              width: ${isSelected ? '36px' : '30px'};
              height: ${isSelected ? '36px' : '30px'};
              background: ${pinColor};
              border: 2.5px solid #FFFFFF;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #FFFFFF;
              font-weight: 800;
              font-size: ${isSelected ? '15px' : '13px'};
              font-family: inherit;
              box-shadow: ${isSelected ? '0 0 0 4px rgba(225, 29, 72, 0.35)' : 'none'};
            ">
              ${badgeNumber}
            </div>
            <div style="
              width: 0; 
              height: 0; 
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 7px solid ${pinColor};
              margin-top: -1px;
            "></div>
          </div>
        `,
        iconSize: [36, 42],
        iconAnchor: [18, 42]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Popup hiển thị chi tiết khi click vào marker
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div style="font-family: inherit; padding: 2px; min-width: 200px; max-width: 250px;">
          ${act.image ? `<img src="${act.image}" alt="${act.name}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />` : ''}
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="background: ${pinColor}; color: #fff; font-size: 11px; font-weight: 700; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              ${badgeNumber}
            </span>
            <span style="font-size: 11px; font-weight: 700; color: #64748B;">${act.time || ''}</span>
          </div>
          <h4 style="font-size: 14px; font-weight: 800; color: #0F172A; margin: 0 0 4px 0; line-height: 1.3;">
            ${act.name}
          </h4>
          <p style="font-size: 12px; color: #475569; margin: 0 0 6px 0; line-height: 1.4;">
            ${act.address || ''}
          </p>
          ${act.costText ? `<div style="font-size: 12px; font-weight: 700; color: #E11D48;">${act.costText}</div>` : ''}
        </div>
      `;

      marker.bindPopup(popupContent, { offset: [0, -32] });

      marker.on('click', () => {
        onSelectActivity(act);
      });

      markersGroupRef.current.addLayer(marker);
    });

    // Vẽ Polyline nét đứt hoặc nét liền nối các điểm trong ngày
    if (latLngs.length > 1) {
      polylineRef.current = L.polyline(latLngs, {
        color: '#0284C7',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '6, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
    }

    // Tự động căn chỉnh vừa khung nhìn (fitBounds)
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [activities, activeDay, selectedActivity]);

  // Khi selectedActivity thay đổi từ timeline, bay camera tới điểm đó
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedActivity) return;

    if (selectedActivity.lat && selectedActivity.lng) {
      map.flyTo([selectedActivity.lat, selectedActivity.lng], 15, {
        duration: 1.2
      });
    }
  }, [selectedActivity]);

  // Hành động zoom & fitBounds
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleFitRoute = () => {
    const map = mapInstanceRef.current;
    const L = window.L;
    if (!map || !L || activities.length === 0) return;

    const latLngs = activities.map(a => [a.lat || 16.0544, a.lng || 108.2022]);
    const bounds = L.latLngBounds(latLngs);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
  };

  const handleOpenGoogleMaps = () => {
    if (!activities || activities.length === 0) return;
    const origin = encodeURIComponent(activities[0].name + ' ' + (activities[0].address || ''));
    const destination = encodeURIComponent(activities[activities.length - 1].name + ' ' + (activities[activities.length - 1].address || ''));
    const waypoints = activities.slice(1, -1).map(a => encodeURIComponent(a.name)).join('|');
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? '&waypoints=' + waypoints : ''}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: '520px',
      display: 'flex',
      flexDirection: 'column',
      background: '#E2E8F0',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid #CBD5E1'
    }}>
      
      {/* MAP TOP BAR (Tìm kiếm, Lọc địa điểm, Xem lộ trình) */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        pointerEvents: 'none'
      }}>
        {/* Search input */}
        <div style={{
          pointerEvents: 'auto',
          position: 'relative',
          background: '#FFFFFF',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          height: '38px',
          flex: '1 1 180px',
          minWidth: '160px'
        }}>
          <Search size={16} color="#64748B" style={{ marginRight: '6px' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nhập địa điểm..."
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '13px',
              fontFamily: 'inherit',
              width: '100%',
              color: '#0F172A',
              background: 'transparent'
            }}
          />
        </div>

        {/* Category filter */}
        <div style={{ pointerEvents: 'auto' }}>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              height: '38px',
              padding: '0 10px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">Lọc địa điểm: Tất cả</option>
            <option value="attraction">Điểm tham quan</option>
            <option value="food">Ẩm thực / Ăn uống</option>
            <option value="hotel">Khách sạn lưu trú</option>
            <option value="transit">Sân bay / Di chuyển</option>
          </select>
        </div>

        {/* Button: Xem lộ trình ngày */}
        <button
          type="button"
          onClick={handleFitRoute}
          style={{
            pointerEvents: 'auto',
            height: '38px',
            padding: '0 12px',
            borderRadius: '10px',
            border: 'none',
            background: '#FFFFFF',
            color: '#0284C7',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
            transition: 'all 0.15s'
          }}
          title="Thu phóng toàn bộ lộ trình ngày hôm nay"
        >
          <span style={{ color: '#E11D48', fontWeight: 900 }}>G</span>
          <span>Xem lộ trình ngày {activeDay}</span>
        </button>
      </div>

      {/* MAP CANVAS CONTAINER */}
      <div 
        ref={mapContainerRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          flex: 1,
          minHeight: '480px' 
        }} 
      />

      {/* MAP CONTROLS OVERLAY (Bottom Right) */}
      <div style={{
        position: 'absolute',
        right: '12px',
        bottom: '48px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <button
          type="button"
          onClick={handleZoomIn}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            color: '#334155'
          }}
          title="Phóng to"
        >
          <ZoomIn size={18} />
        </button>

        <button
          type="button"
          onClick={handleZoomOut}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            color: '#334155'
          }}
          title="Thu nhỏ"
        >
          <ZoomOut size={18} />
        </button>

        <button
          type="button"
          onClick={handleOpenGoogleMaps}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            color: '#0284C7'
          }}
          title="Mở chỉ đường trên Google Maps"
        >
          <Navigation size={18} />
        </button>
      </div>

      {/* MAP BOTTOM STATUS BAR (Giống thanh thông báo trong ảnh của người dùng) */}
      <div style={{
        height: '34px',
        background: '#02326A',
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 12px',
        zIndex: 999,
        letterSpacing: '0.2px'
      }}>
        <span>Click chọn địa điểm để xem chi tiết trên bản đồ</span>
      </div>

    </div>
  );
};

export default TripMap;
