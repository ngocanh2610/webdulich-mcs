// Verified 200 OK Unsplash CDN landscape & Vietnam tourism fallback images
export const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1528127269322-539801943592?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573790387438-4da905039392?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555921015-5532091f6026?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504457047772-27faf1c00561?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80'
];

export const getFallbackImage = (seed = '') => {
  const str = String(seed || 'vietnam');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  const idx = Math.abs(hash) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[idx];
};

export const handleImageError = (e, seed = '') => {
  const target = e?.currentTarget;
  if (!target) return;
  const fallback = getFallbackImage(seed);
  if (target.dataset.fallbackApplied === '1') {
    target.onerror = null;
    return;
  }
  target.dataset.fallbackApplied = '1';
  target.src = fallback;
};

