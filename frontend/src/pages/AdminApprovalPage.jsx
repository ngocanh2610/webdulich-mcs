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

  const [previewLocation, setPreviewLocation] = useState(null);
  
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
    <div style={{ paddingTop: '120px', paddingBottom: '5rem', minHeight: '100vh', background: '#F8FAFC' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <button 
              onClick={() => navigate(-1)} 
              style={{ 
                background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#475569',
                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600,
                padding: '0.5rem 1rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.color = '#02326A'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
              onMouseOut={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
            >
              <ArrowLeft size={16} /> Quay lại
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0, color: '#02326A', letterSpacing: '-0.5px' }}>
                Duyệt Bài Đăng <span style={{ color: '#0284C7' }}>Chờ Xử Lý</span>
              </h1>
              <span style={{ 
                background: pendingLocations.length > 0 ? '#FEF2F2' : '#F0FDF4',
                color: pendingLocations.length > 0 ? '#DC2626' : '#16A34A',
                border: `1px solid ${pendingLocations.length > 0 ? '#FECACA' : '#BBF7D0'}`,
                padding: '0.3rem 0.85rem', borderRadius: '20px',
                fontSize: '0.875rem', fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: pendingLocations.length > 0 ? '#DC2626' : '#16A34A' }} />
                {pendingLocations.length} bài chờ duyệt
              </span>
            </div>
            <p style={{ color: '#64748B', marginTop: '0.5rem', fontSize: '1rem' }}>
              Kiểm tra nội dung, duyệt hoặc từ chối các địa điểm do người dùng đóng góp trước khi hiển thị công khai trên ứng dụng.
            </p>
          </div>
        </div>

        {successMessage && (
          <div style={{
            background: '#F0FDF4', border: '1px solid #BBF7D0',
            color: '#15803D', padding: '1rem 1.25rem', borderRadius: '12px',
            marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
            boxShadow: '0 2px 8px rgba(34,197,94,0.08)'
          }}>
            <CheckCircle2 size={20} color="#16A34A" />
            <span style={{ fontWeight: 600 }}>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA',
            color: '#B91C1C', padding: '1rem 1.25rem', borderRadius: '12px',
            marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
            boxShadow: '0 2px 8px rgba(239,68,68,0.08)'
          }}>
            <AlertCircle size={20} color="#DC2626" />
            <span style={{ fontWeight: 600 }}>{errorMessage}</span>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : pendingLocations.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '5rem 2rem',
            background: '#FFFFFF', borderRadius: '16px',
            border: '1px dashed #CBD5E1',
            boxShadow: '0 4px 16px rgba(2, 50, 106, 0.04)'
          }}>
            <ShieldCheck size={56} color="#02326A" style={{ margin: '0 auto 1rem auto', opacity: 0.85 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#0F172A', fontWeight: 700 }}>
              Hiện không có bài viết nào chờ duyệt
            </h3>
            <p style={{ color: '#64748B', maxWidth: '450px', margin: '0 auto', lineHeight: 1.6 }}>
              Tất cả các bài đăng đã được xử lý. Khi người dùng gửi thêm địa điểm du lịch mới, bài viết sẽ tự động xuất hiện tại đây.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {pendingLocations.map((loc) => {
              const isLoadingThis = actionLoadingId === loc.id;
              return (
                <div 
                  key={loc.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    alignItems: 'center',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 4px 16px rgba(2, 50, 106, 0.05)'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = '#CBD5E1';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(2, 50, 106, 0.08)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(2, 50, 106, 0.05)';
                  }}
                >
                  <div 
                    onClick={() => setPreviewLocation(loc)}
                    style={{
                      width: '180px', height: '130px',
                      borderRadius: '12px', overflow: 'hidden',
                      flexShrink: 0, cursor: 'pointer',
                      position: 'relative', background: '#F1F5F9',
                      border: '1px solid #E2E8F0'
                    }}
                    title="Bấm để xem chi tiết bài đăng"
                  >
                    <img 
                      src={loc.image || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80'} 
                      alt={loc.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div style={{
                      position: 'absolute', bottom: '6px', right: '6px',
                      background: 'rgba(2, 50, 106, 0.85)', color: '#FFFFFF',
                      padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem',
                      fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                    }}>
                      <Eye size={12} /> Xem
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                      <span style={{
                        background: '#FEF3C7', color: '#B45309',
                        border: '1px solid #FDE68A',
                        padding: '0.2rem 0.65rem', borderRadius: '12px',
                        fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        <Clock size={12} /> Chờ duyệt
                      </span>
                      <span style={{
                        background: '#E0F2FE', color: '#0369A1',
                        border: '1px solid #BAE6FD',
                        padding: '0.2rem 0.65rem', borderRadius: '12px',
                        fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        <MapPin size={12} /> {loc.provinceId || loc.province_id}
                      </span>
                      <span style={{
                        background: '#F3E8FF', color: '#7E22CE',
                        border: '1px solid #E9D5FF',
                        padding: '0.2rem 0.65rem', borderRadius: '12px',
                        fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        <User size={12} /> Tác giả: {loc.author}
                      </span>
                      {loc.created_at && (
                        <span style={{ color: '#64748B', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {new Date(loc.created_at).toLocaleString('vi-VN')}
                        </span>
                      )}
                    </div>

                    <h3 
                      onClick={() => setPreviewLocation(loc)}
                      style={{ 
                        fontSize: '1.3rem', fontWeight: 800, margin: '0 0 0.5rem 0',
                        cursor: 'pointer', color: '#0F172A', transition: 'color 0.2s'
                      }}
                      onMouseOver={e => e.currentTarget.style.color = '#02326A'}
                      onMouseOut={e => e.currentTarget.style.color = '#0F172A'}
                    >
                      {loc.name}
                    </h3>

                    <p style={{
                      color: '#475569', fontSize: '0.925rem',
                      lineHeight: 1.6, margin: 0,
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {loc.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setPreviewLocation(loc)}
                      style={{
                        background: '#F8FAFC',
                        color: '#334155',
                        border: '1px solid #CBD5E1',
                        padding: '0.65rem 1rem',
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.borderColor = '#94A3B8'; }}
                      onMouseOut={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
                    >
                      <Eye size={16} /> Xem bài đăng
                    </button>

                    <button
                      onClick={() => handleApprove(loc.id, loc.name)}
                      disabled={isLoadingThis}
                      style={{
                        background: '#16A34A',
                        color: '#FFFFFF',
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
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#15803D'}
                      onMouseOut={e => e.currentTarget.style.background = '#16A34A'}
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
                        background: '#FEF2F2',
                        color: '#DC2626',
                        border: '1px solid #FECACA',
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
                      onMouseOver={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.borderColor = '#FCA5A5'; }}
                      onMouseOut={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.borderColor = '#FECACA'; }}
                    >
                      <X size={16} /> Từ chối
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {previewLocation && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '1.5rem', backdropFilter: 'blur(6px)'
          }}>
            <div style={{
              background: '#FFFFFF', border: '1px solid #E2E8F0',
              borderRadius: '20px', width: '100%', maxWidth: '800px',
              maxHeight: '90vh', overflowY: 'auto', padding: '2rem',
              position: 'relative', boxShadow: '0 25px 60px rgba(2, 50, 106, 0.18)'
            }}>
              <button 
                onClick={() => setPreviewLocation(null)}
                style={{
                  position: 'absolute', top: '1.25rem', right: '1.25rem',
                  background: '#F1F5F9', border: 'none',
                  color: '#475569', width: '36px', height: '36px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.color = '#0F172A'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#475569'; }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{
                  background: '#FEF3C7', color: '#B45309',
                  border: '1px solid #FDE68A',
                  padding: '0.25rem 0.75rem', borderRadius: '20px',
                  fontSize: '0.825rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <Clock size={14} /> Trạng thái: CHỜ DUYỆT
                </span>
                <span style={{
                  background: '#E0F2FE', color: '#0369A1',
                  border: '1px solid #BAE6FD',
                  padding: '0.25rem 0.75rem', borderRadius: '20px',
                  fontSize: '0.825rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <MapPin size={14} /> Mã Tỉnh: {previewLocation.provinceId || previewLocation.province_id}
                </span>
                <span style={{
                  background: '#F3E8FF', color: '#7E22CE',
                  border: '1px solid #E9D5FF',
                  padding: '0.25rem 0.75rem', borderRadius: '20px',
                  fontSize: '0.825rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <User size={14} /> Tác giả: {previewLocation.author}
                </span>
              </div>

              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '1.25rem', color: '#0F172A' }}>
                {previewLocation.name}
              </h2>

              <div style={{
                width: '100%', height: '340px', borderRadius: '14px',
                overflow: 'hidden', marginBottom: '1.5rem', background: '#F1F5F9',
                border: '1px solid #E2E8F0'
              }}>
                <img 
                  src={previewLocation.image || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80'} 
                  alt={previewLocation.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {previewLocation.images && previewLocation.images.length > 1 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '0.5rem', fontWeight: 600 }}>
                    Các hình ảnh bổ sung ({previewLocation.images.length})
                  </h4>
                  <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    {previewLocation.images.map((img, idx) => (
                      <div key={idx} style={{ width: '120px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid #E2E8F0' }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{
                background: '#F8FAFC', border: '1px solid #E2E8F0',
                borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem'
              }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0F172A' }}>
                  Nội dung mô tả địa điểm:
                </h4>
                <p style={{
                  color: '#334155', lineHeight: 1.8,
                  fontSize: '0.95rem', whiteSpace: 'pre-line', margin: 0
                }}>
                  {previewLocation.description}
                </p>
              </div>

              {previewLocation.tags && previewLocation.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  {previewLocation.tags.map((tag, idx) => (
                    <span key={idx} style={{
                      background: '#EFF6FF', color: '#1D4ED8',
                      border: '1px solid #DBEAFE',
                      padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem',
                      fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px'
                    }}>
                      <Tag size={12} /> {tag}
                    </span>
                  ))}
                </div>
              )}

              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '1rem'
              }}>
                <button
                  onClick={() => {
                    navigate(`/locations/${previewLocation.id}`);
                    setPreviewLocation(null);
                  }}
                  style={{
                    background: '#FFFFFF', border: '1px solid #CBD5E1',
                    color: '#334155', padding: '0.65rem 1rem', borderRadius: '10px',
                    fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseOut={e => e.currentTarget.style.background = '#FFFFFF'}
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
                      background: '#FEF2F2', color: '#DC2626',
                      border: '1px solid #FECACA', padding: '0.65rem 1.25rem',
                      borderRadius: '10px', fontWeight: 600, cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.borderColor = '#FCA5A5'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.borderColor = '#FECACA'; }}
                  >
                    Từ chối bài
                  </button>

                  <button
                    onClick={() => handleApprove(previewLocation.id, previewLocation.name)}
                    style={{
                      background: '#16A34A', color: '#FFFFFF',
                      border: 'none', padding: '0.65rem 1.5rem',
                      borderRadius: '10px', fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#15803D'}
                    onMouseOut={e => e.currentTarget.style.background = '#16A34A'}
                  >
                    Duyệt bài đăng này
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {rejectModalLocation && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)', zIndex: 10000,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: '1.5rem', backdropFilter: 'blur(6px)'
          }}>
            <div style={{
              background: '#FFFFFF', border: '1px solid #E2E8F0',
              borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '1.75rem',
              boxShadow: '0 25px 50px rgba(2, 50, 106, 0.16)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#DC2626'
                }}>
                  <XCircle size={24} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0F172A', fontWeight: 700 }}>Từ chối bài đăng</h3>
              </div>
              <p style={{ color: '#475569', fontSize: '0.925rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                Bạn sắp từ chối bài viết <strong style={{ color: '#0F172A' }}>"{rejectModalLocation.name}"</strong> của tác giả <strong style={{ color: '#0F172A' }}>{rejectModalLocation.author}</strong>.
              </p>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                  Lý do từ chối (tùy chọn - sẽ gửi thông báo cho tác giả):
                </label>
                <textarea
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="Ví dụ: Nội dung chưa đầy đủ, hình ảnh mờ hoặc không phù hợp..."
                  rows={3}
                  style={{
                    width: '100%', background: '#F8FAFC', border: '1px solid #CBD5E1',
                    borderRadius: '10px', padding: '0.75rem 1rem', color: '#0F172A', fontSize: '0.9rem',
                    outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                    transition: 'all 0.2s'
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#0284C7'; e.currentTarget.style.background = '#FFFFFF'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.background = '#F8FAFC'; }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={() => setRejectModalLocation(null)}
                  style={{
                    background: '#F1F5F9', border: '1px solid #E2E8F0',
                    color: '#475569', padding: '0.6rem 1.15rem', borderRadius: '8px', cursor: 'pointer',
                    fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s'
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.color = '#0F172A'; }}
                  onMouseOut={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#475569'; }}
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmReject}
                  style={{
                    background: '#DC2626', border: 'none',
                    color: '#FFFFFF', padding: '0.6rem 1.35rem', borderRadius: '8px',
                    fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                    transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#B91C1C'}
                  onMouseOut={e => e.currentTarget.style.background = '#DC2626'}
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
