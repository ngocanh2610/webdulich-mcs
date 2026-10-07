import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, X, Clock, Eye, MapPin, User, Calendar, 
  AlertCircle, ArrowLeft, CheckCircle2, XCircle, ShieldCheck, Tag
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminApprovalPage = () => {
  const { user, socket } = useAppContext();
  const navigate = useNavigate();

  const [pendingLocations, setPendingLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Modal xem chi tiết bài đăng (Preview Modal)
  const [previewLocation, setPreviewLocation] = useState(null);
  
  // Modal từ chối bài kèm lý do
  const [rejectModalLocation, setRejectModalLocation] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchPendingLocations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/locations/admin/pending', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      const data = await res.json();
      if (data.success) {
        setPendingLocations(data.data || []);
      } else {
        setErrorMessage(data.message || 'Không thể tải danh sách bài chờ duyệt');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Lỗi kết nối tới máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchPendingLocations();

    // Socket realtime lắng nghe khi có bài viết mới
    if (socket) {
      const handleNewNotification = (notif) => {
        if (notif.type === 'pending_approval' || notif.type === 'new_location') {
          fetchPendingLocations();
        }
      };
      socket.on('new_notification', handleNewNotification);
      return () => socket.off('new_notification', handleNewNotification);
    }
  }, [user, socket]);

  // Xử lý duyệt bài
  const handleApprove = async (id, name) => {
    setActionLoadingId(id);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/locations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ status: 'approved' })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Đã duyệt bài viết "${name}" thành công! Bài viết đã được đăng tải công khai.`);
        setPendingLocations(prev => prev.filter(item => item.id !== id));
        if (previewLocation && previewLocation.id === id) {
          setPreviewLocation(null);
        }
      } else {
        setErrorMessage(data.message || 'Lỗi khi duyệt bài viết');
      }
    } catch (err) {
      setErrorMessage('Lỗi kết nối máy chủ');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Xử lý từ chối bài
  const handleConfirmReject = async () => {
    if (!rejectModalLocation) return;
    const { id, name } = rejectModalLocation;
    setActionLoadingId(id);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/locations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ 
          status: 'rejected',
          reason: rejectReason.trim() || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Đã từ chối bài viết "${name}".`);
        setPendingLocations(prev => prev.filter(item => item.id !== id));
        setRejectModalLocation(null);
        setRejectReason('');
        if (previewLocation && previewLocation.id === id) {
          setPreviewLocation(null);
        }
      } else {
        setErrorMessage(data.message || 'Lỗi khi từ chối bài viết');
      }
    } catch (err) {
      setErrorMessage('Lỗi kết nối máy chủ');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Header bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <button 
              onClick={() => navigate(-1)} 
              style={{ 
                background: 'transparent', border: 'none', color: 'var(--text-secondary)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '0.75rem', fontSize: '0.9rem'
              }}
            >
              <ArrowLeft size={18} /> Quay lại
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0 }}>
                Duyệt Bài Đăng <span className="text-gradient">Chờ Xử Lý</span>
              </h1>
              <span style={{ 
                background: pendingLocations.length > 0 ? '#ef4444' : 'var(--accent-primary)',
                color: 'white', padding: '0.2rem 0.75rem', borderRadius: '20px',
                fontSize: '0.875rem', fontWeight: 700 
              }}>
                {pendingLocations.length} bài chờ duyệt
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Kiểm tra nội dung, duyệt hoặc từ chối các địa điểm do người dùng đóng góp trước khi hiển thị công khai.
            </p>
          </div>
        </div>

        {/* Thông báo kết quả */}
        {successMessage && (
          <div style={{
            background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
            color: '#22c55e', padding: '1rem 1.25rem', borderRadius: '12px',
            marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem'
          }}>
            <CheckCircle2 size={20} />
            <span style={{ fontWeight: 500 }}>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div style={{
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444', padding: '1rem 1.25rem', borderRadius: '12px',
            marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem'
          }}>
            <AlertCircle size={20} />
            <span style={{ fontWeight: 500 }}>{errorMessage}</span>
          </div>
        )}

        {/* Nội dung danh sách */}
        {loading ? (
          <LoadingSpinner />
        ) : pendingLocations.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '5rem 2rem',
            background: 'rgba(255,255,255,0.03)', borderRadius: '16px',
            border: '1px dashed rgba(255,255,255,0.1)'
          }}>
            <ShieldCheck size={56} color="var(--accent-primary)" style={{ margin: '0 auto 1rem auto', opacity: 0.8 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Hiện không có bài viết nào chờ duyệt
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto' }}>
              Tất cả các bài đăng đã được xử lý. Khi người dùng gửi thêm địa điểm du lịch mới, bài viết sẽ tự động xuất hiện tại đây.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {pendingLocations.map((loc) => {
              const isLoadingThis = actionLoadingId === loc.id;
              return (
                <div 
                  key={loc.id}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    alignItems: 'center',
                    transition: 'all 0.3s',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }}
                >
                  {/* Thumbnail Image */}
                  <div 
                    onClick={() => setPreviewLocation(loc)}
                    style={{
                      width: '180px', height: '130px',
                      borderRadius: '12px', overflow: 'hidden',
                      flexShrink: 0, cursor: 'pointer',
                      position: 'relative', background: '#000'
                    }}
                    title="Bấm để xem chi tiết bài đăng"
                  >
                    <img 
                      src={loc.image || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80'} 
                      alt={loc.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div style={{
                      position: 'absolute', bottom: '6px', right: '6px',
                      background: 'rgba(0,0,0,0.65)', color: '#fff',
                      padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem',
                      display: 'flex', alignItems: 'center', gap: '3px'
                    }}>
                      <Eye size={12} /> Xem
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{
                        background: 'rgba(234, 179, 8, 0.15)', color: '#eab308',
                        padding: '0.2rem 0.6rem', borderRadius: '12px',
                        fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        <Clock size={12} /> Chờ duyệt
                      </span>
                      <span style={{
                        background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6',
                        padding: '0.2rem 0.6rem', borderRadius: '12px',
                        fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        <MapPin size={12} /> {loc.provinceId || loc.province_id}
                      </span>
                      <span style={{
                        background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc',
                        padding: '0.2rem 0.6rem', borderRadius: '12px',
                        fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        <User size={12} /> Tác giả: {loc.author}
                      </span>
                      {loc.created_at && (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {new Date(loc.created_at).toLocaleString('vi-VN')}
                        </span>
                      )}
                    </div>

                    <h3 
                      onClick={() => setPreviewLocation(loc)}
                      style={{ 
                        fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.5rem 0',
                        cursor: 'pointer', color: 'var(--text-primary)'
                      }}
                      onMouseOver={e => e.currentTarget.style.color = 'var(--accent-primary)'}
                      onMouseOut={e => e.currentTarget.style.color = 'var(--text-primary)'}
                    >
                      {loc.name}
                    </h3>

                    <p style={{
                      color: 'var(--text-secondary)', fontSize: '0.9rem',
                      lineHeight: 1.5, margin: 0,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {loc.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setPreviewLocation(loc)}
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        color: 'var(--text-primary)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        padding: '0.65rem 1rem',
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                      onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                    >
                      <Eye size={16} /> Xem bài đăng
                    </button>

                    <button
                      onClick={() => handleApprove(loc.id, loc.name)}
                      disabled={isLoadingThis}
                      style={{
                        background: '#16a34a',
                        color: 'white',
                        border: 'none',
                        padding: '0.65rem 1.25rem',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        cursor: isLoadingThis ? 'not-allowed' : 'pointer',
                        opacity: isLoadingThis ? 0.7 : 1,
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#15803d'}
                      onMouseOut={e => e.currentTarget.style.background = '#16a34a'}
                    >
                      <Check size={16} /> Duyệt bài
                    </button>

                    <button
                      onClick={() => {
                        setRejectModalLocation(loc);
                        setRejectReason('');
                      }}
                      disabled={isLoadingThis}
                      style={{
                        background: 'rgba(239,68,68,0.15)',
                        color: '#ef4444',
                        border: '1px solid rgba(239,68,68,0.3)',
                        padding: '0.65rem 1rem',
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        cursor: isLoadingThis ? 'not-allowed' : 'pointer',
                        opacity: isLoadingThis ? 0.7 : 1,
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
                      onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                    >
                      <X size={16} /> Từ chối
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── MODAL XEM CHI TIẾT BÀI ĐĂNG (PREVIEW MODAL) ─── */}
        {previewLocation && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '1.5rem', backdropFilter: 'blur(5px)'
          }}>
            <div style={{
              background: '#131826', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px', width: '100%', maxWidth: '800px',
              maxHeight: '90vh', overflowY: 'auto', padding: '2rem',
              position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.7)'
            }}>
              {/* Close button */}
              <button 
                onClick={() => setPreviewLocation(null)}
                style={{
                  position: 'absolute', top: '1.25rem', right: '1.25rem',
                  background: 'rgba(255,255,255,0.1)', border: 'none',
                  color: 'white', width: '36px', height: '36px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              {/* Status Header in Modal */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{
                  background: 'rgba(234, 179, 8, 0.2)', color: '#eab308',
                  padding: '0.25rem 0.75rem', borderRadius: '20px',
                  fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <Clock size={14} /> Trạng thái: CHỜ DUYỆT
                </span>
                <span style={{
                  background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6',
                  padding: '0.25rem 0.75rem', borderRadius: '20px',
                  fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <MapPin size={14} /> Mã Tỉnh: {previewLocation.provinceId || previewLocation.province_id}
                </span>
                <span style={{
                  background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc',
                  padding: '0.25rem 0.75rem', borderRadius: '20px',
                  fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <User size={14} /> Tác giả: {previewLocation.author}
                </span>
              </div>

              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: '#fff' }}>
                {previewLocation.name}
              </h2>

              {/* Main Image */}
              <div style={{
                width: '100%', height: '320px', borderRadius: '14px',
                overflow: 'hidden', marginBottom: '1.5rem', background: '#000'
              }}>
                <img 
                  src={previewLocation.image || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80'} 
                  alt={previewLocation.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Gallery images if any */}
              {previewLocation.images && previewLocation.images.length > 1 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Các hình ảnh bổ sung ({previewLocation.images.length})
                  </h4>
                  <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {previewLocation.images.map((img, idx) => (
                      <div key={idx} style={{ width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Description */}
              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  Nội dung mô tả địa điểm:
                </h4>
                <p style={{
                  color: 'var(--text-secondary)', lineHeight: 1.8,
                  fontSize: '1rem', whiteSpace: 'pre-line', margin: 0
                }}>
                  {previewLocation.description}
                </p>
              </div>

              {/* Tags if any */}
              {previewLocation.tags && previewLocation.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  {previewLocation.tags.map((tag, idx) => (
                    <span key={idx} style={{
                      background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)',
                      padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem',
                      display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      <Tag size={12} /> {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Modal Actions */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: '1rem'
              }}>
                <button
                  onClick={() => {
                    navigate(`/locations/${previewLocation.id}`);
                    setPreviewLocation(null);
                  }}
                  style={{
                    background: 'transparent', border: '1px solid var(--text-muted)',
                    color: 'var(--text-secondary)', padding: '0.65rem 1rem', borderRadius: '8px',
                    fontSize: '0.875rem', cursor: 'pointer'
                  }}
                >
                  Mở trang chi tiết bài viết
                </button>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => {
                      setRejectModalLocation(previewLocation);
                      setRejectReason('');
                    }}
                    style={{
                      background: 'rgba(239,68,68,0.2)', color: '#ef4444',
                      border: '1px solid #ef4444', padding: '0.65rem 1.25rem',
                      borderRadius: '10px', fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    Từ chối bài
                  </button>

                  <button
                    onClick={() => handleApprove(previewLocation.id, previewLocation.name)}
                    style={{
                      background: '#16a34a', color: 'white',
                      border: 'none', padding: '0.65rem 1.5rem',
                      borderRadius: '10px', fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    Duyệt bài đăng này
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL TỪ CHỐI BÀI KÈM LÝ DO ─── */}
        {rejectModalLocation && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', zIndex: 10000,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '1.5rem'
          }}>
            <div style={{
              background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '1.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <XCircle size={28} color="#ef4444" />
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>Từ chối bài đăng</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                Bạn sắp từ chối bài viết <strong>"{rejectModalLocation.name}"</strong> của tác giả <strong>{rejectModalLocation.author}</strong>.
              </p>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Lý do từ chối (tùy chọn - sẽ gửi thông báo cho tác giả):
                </label>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Ví dụ: Nội dung chưa đầy đủ, hình ảnh mờ hoặc không phù hợp..."
                  rows={3}
                  style={{
                    width: '100%', background: '#0f172a', border: '1px solid #334155',
                    borderRadius: '8px', padding: '0.75rem', color: '#fff', fontSize: '0.9rem',
                    outline: 'none', resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={() => setRejectModalLocation(null)}
                  style={{
                    background: 'transparent', border: '1px solid #475569',
                    color: '#94a3b8', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer'
                  }}
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmReject}
                  style={{
                    background: '#ef4444', border: 'none',
                    color: '#fff', padding: '0.5rem 1.25rem', borderRadius: '8px',
                    fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Xác nhận Từ chối
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApprovalPage;
