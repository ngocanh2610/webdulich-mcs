import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LocationCard from '../components/LocationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EditLocationModal from '../components/EditLocationModal';
import { getFallbackImage, handleImageError } from '../utils/fallbackImages';
import { ArrowLeft, Star, MapPin, Tag, User, Edit, Trash2, Heart, MessageSquare, CornerDownRight, Clock, Check, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const formatCommentDate = (comment) => {
  const raw = comment?.createdAt || comment?.created_at;
  if (!raw) return 'Vừa xong';
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return 'Vừa xong';
  return d.toLocaleString('vi-VN');
};

const getCommentTimestamp = (comment) => {
  const raw = comment?.createdAt || comment?.created_at;
  if (!raw) return 0;
  const t = new Date(raw).getTime();
  return Number.isNaN(t) ? 0 : t;
};

const LocationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, socket } = useAppContext();

  const [location, setLocation] = useState(null);
  const [relatedLocations, setRelatedLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const [selectedImg, setSelectedImg] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [isReacting, setIsReacting] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/locations/${id}`);
        const data = await res.json();
        if (data.success) {
          setLocation(data.data);
          setRelatedLocations(data.related || []);
          setSelectedImg(data.data.image || (data.data.images && data.data.images[0]) || '');

          let authorMatch = false;
          if (user && user.username === data.data.author) {
            authorMatch = true;
          }
          setIsAuthor(authorMatch);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/locations/${id}/comments`);
        const data = await res.json();
        if (data.success) {
          setComments(data.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchLocation();
    fetchComments();
    window.scrollTo(0, 0);
  }, [id, user]);

  useEffect(() => {
    if (!socket || !id) return;

    socket.emit('join_location', id);

    const handleNewComment = (incomingComment) => {
      setComments(prev => {
        if (prev.find(c => c.id === incomingComment.id)) return prev;
        return [...prev, incomingComment];
      });
    };

    const handleReactionUpdate = (data) => {
      if (data.locationId === id) {
        setLocation(prev => prev ? ({
          ...prev,
          reactions: data.reactions
        }) : prev);
      }
    };

    socket.on('new_comment', handleNewComment);
    socket.on('reaction_update', handleReactionUpdate);

    return () => {
      socket.emit('leave_location', id);
      socket.off('new_comment', handleNewComment);
      socket.off('reaction_update', handleReactionUpdate);
    };
  }, [socket, id]);

  const handleReact = async () => {
    if (!user) return alert('Vui lòng đăng nhập để thả cảm xúc!');
    if (isReacting) return;
    setIsReacting(true);

    try {
      const res = await fetch(`/api/locations/${id}/react`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.reactions)) {
        setLocation(prev => prev ? ({ ...prev, reactions: data.reactions }) : prev);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsReacting(false);
    }
  };

  const handlePostComment = async () => {
    if (!user) return alert('Vui lòng đăng nhập để bình luận!');
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/locations/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: newComment.trim(),
          parentId: replyingTo
        })
      });

      const data = await res.json();
      if (data.success) {
        if (data.data) {
          setComments(prev => prev.some(c => c.id === data.data.id) ? prev : [...prev, data.data]);
        }
        setNewComment('');
        setReplyingTo(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = (e) => {
    e.stopPropagation();
    if (!location?.images) return;
    setLightboxIndex((prev) => (prev + 1) % location.images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (!location?.images) return;
    setLightboxIndex((prev) => (prev - 1 + location.images.length) % location.images.length);
  };

  if (loading) return <div style={{ paddingTop: '100px' }}><LoadingSpinner /></div>;
  if (!location) return <div style={{ paddingTop: '150px', textAlign: 'center' }}><h2>Không tìm thấy địa điểm</h2></div>;

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xoá địa điểm này không? Hành động này không thể hoàn tác.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/locations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        }
      });
      const data = await res.json();

      if (data.success) {
        alert('Đã xoá địa điểm thành công!');

        try {
          const myLocations = JSON.parse(localStorage.getItem('my_authored_locations') || '[]');
          const updatedLocations = myLocations.filter(locId => locId !== id);
          localStorage.setItem('my_authored_locations', JSON.stringify(updatedLocations));
        } catch (e) {
          console.warn(e);
        }

        navigate('/');
      } else {
        alert('Xoá thất bại: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Đã xảy ra lỗi khi xoá địa điểm.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateStatus = async (newStatus, reason = '') => {
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/locations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        },
        body: JSON.stringify({ status: newStatus, reason, rejectionReason: reason })
      });
      const data = await res.json();
      if (data.success) {
        alert(newStatus === 'approved' ? '✅ Đã duyệt bài viết thành công!' : '❌ Đã từ chối bài viết.');
        setLocation(prev => ({ ...prev, status: newStatus }));
      } else {
        alert('Lỗi: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Đã xảy ra lỗi khi cập nhật trạng thái.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const imgSeed = location.id || location.name;
  const fallbackImg = getFallbackImage(imgSeed);
  const allImages = location.images && location.images.length > 0
    ? location.images
    : [location.image || fallbackImg];

  const hasReacted = location.reactions && user && location.reactions.some(r => r.username === user.username);

  const topLevelComments = comments.filter(c => !c.parentId && !c.parent_id);

  const getParentId = (c) => c?.parentId || c?.parent_id || null;

  const getTopLevelId = (c) => {
    const pid = getParentId(c);
    if (!pid) return c.id;
    const parent = comments.find(p => p.id === pid);
    return parent ? getTopLevelId(parent) : pid;
  };

  const getThreadReplies = (topLevelId) => {
    return comments
      .filter(c => getParentId(c) && getTopLevelId(c) === topLevelId)
      .sort((a, b) => getCommentTimestamp(a) - getCommentTimestamp(b));
  };

  return (
    <div style={{ paddingTop: '115px', paddingBottom: '5rem' }}>
      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            backdropFilter: 'blur(10px)'
          }}
        >
          <button onClick={closeLightbox} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#FFFFFF', fontSize: '2rem', cursor: 'pointer' }}>&times;</button>

          {allImages.length > 1 && (
            <button onClick={prevImage} style={{ position: 'absolute', left: '20px', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFFFFF', fontSize: '2rem', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&#10094;</button>
          )}

          <img
            src={allImages[lightboxIndex] || fallbackImg}
            alt="Full size"
            onError={(e) => handleImageError(e, imgSeed)}
            style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', borderRadius: '8px' }}
            onClick={(e) => e.stopPropagation()}
          />

          {allImages.length > 1 && (
            <button onClick={nextImage} style={{ position: 'absolute', right: '20px', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFFFFF', fontSize: '2rem', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&#10095;</button>
          )}
        </div>
      )}

      <div className="container">
        <button
          onClick={() => navigate(-1)}
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            color: '#334155',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            marginBottom: '1.75rem',
            padding: '0.5rem 1rem',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '0.875rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        >
          <ArrowLeft size={16} /> Quay lại
        </button>

        {location.status === 'pending' && (
          <div style={{
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '10px',
            padding: '1.25rem 1.75rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: '#FEF3C7', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#D97706'
              }}>
                <Clock size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#B45309', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Bài viết đang chờ phê duyệt
                </div>
                <div style={{ fontSize: '0.875rem', color: '#78350F', marginTop: '0.2rem' }}>
                  Địa điểm này chỉ hiển thị với bạn và Quản trị viên. Cần được duyệt để hiển thị công khai trên ứng dụng.
                </div>
              </div>
            </div>

            {user && user.role === 'admin' && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => handleUpdateStatus('approved')}
                  disabled={isUpdatingStatus}
                  style={{
                    background: '#16A34A', color: 'white', border: 'none',
                    padding: '0.6rem 1.25rem', borderRadius: '10px',
                    fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    boxShadow: '0 2px 10px rgba(22, 163, 74, 0.25)'
                  }}
                >
                  <Check size={18} /> {isUpdatingStatus ? 'Đang duyệt...' : 'Duyệt bài ngay'}
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Nhập lý do từ chối (tùy chọn):');
                    if (reason !== null) handleUpdateStatus('rejected', reason);
                  }}
                  disabled={isUpdatingStatus}
                  style={{
                    background: '#FEF2F2', color: '#DC2626',
                    border: '1px solid #FECACA', padding: '0.6rem 1.25rem',
                    borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                  }}
                >
                  <X size={18} /> Từ chối
                </button>
              </div>
            )}
          </div>
        )}

        {location.status === 'rejected' && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '10px',
            padding: '1.25rem 1.75rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            color: '#DC2626'
          }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: '#FEE2E2', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <X size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Bài viết đã bị từ chối phê duyệt</div>
              <div style={{ fontSize: '0.875rem', color: '#991B1B', marginTop: '0.2rem' }}>
                Bài viết này không hiển thị công khai. Bạn có thể sửa lại nội dung để gửi duyệt lại.
              </div>
            </div>
          </div>
        )}

        <div className="location-detail-grid">
          <div>
            <div
              onClick={() => openLightbox(allImages.indexOf(selectedImg) !== -1 ? allImages.indexOf(selectedImg) : 0)}
              style={{ borderRadius: '10px', overflow: 'hidden', height: '420px', border: '1px solid var(--border-light)', marginBottom: '1rem', cursor: 'zoom-in', background: '#F1F5F9' }}
            >
              <img
                src={selectedImg || location.image || fallbackImg}
                alt={location.name}
                onError={(e) => handleImageError(e, imgSeed)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {allImages.length > 1 && (
              <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                {allImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImg(img)}
                    style={{
                      minWidth: '120px',
                      height: '80px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: img === selectedImg ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                      cursor: 'pointer',
                      opacity: img === selectedImg ? 1 : 0.7,
                      transition: 'all 0.3s',
                      background: '#F1F5F9'
                    }}
                  >
                    <img
                      src={img || fallbackImg}
                      alt=""
                      onError={(e) => handleImageError(e, `${imgSeed}-${idx}`)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {location.status === 'pending' && (
                <span style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={14} /> Chờ duyệt
                </span>
              )}
              {location.status === 'rejected' && (
                <span style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <X size={14} /> Bị từ chối
                </span>
              )}
              {location.status === 'approved' && (
                <span style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Check size={14} /> Đã duyệt
                </span>
              )}
              <span style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={14} fill="#F59E0B" color="#F59E0B" /> {location.rating || '4.8'}
              </span>
              <span style={{ background: '#EFF6FF', color: 'var(--accent-primary)', border: '1px solid #BFDBFE', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={14} /> Mã Tỉnh: {location.provinceId || location.province_id}
              </span>
              {location.author && (
                <span style={{ background: '#FFF1F2', color: 'var(--accent-secondary)', border: '1px solid #FECDD3', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <User size={14} /> Tác giả: {location.author}
                </span>
              )}
              {(isAuthor || (user && user.role === 'admin')) && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.25rem 0.85rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}
                >
                  <Edit size={14} /> Sửa bài viết
                </button>
              )}
              {(isAuthor || (user && user.role === 'admin')) && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', padding: '0.25rem 0.85rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: isDeleting ? 'not-allowed' : 'pointer', opacity: isDeleting ? 0.7 : 1 }}
                >
                  <Trash2 size={14} /> {isDeleting ? 'Đang xoá...' : 'Xoá bài'}
                </button>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '1.25rem', lineHeight: 1.25, color: 'var(--brand-navy)', fontWeight: 900 }}>{location.name}</h1>

            <div className="glass-panel" style={{ padding: '1.75rem 2rem', marginBottom: '2rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '10px', boxShadow: '0 4px 16px rgba(2, 50, 106, 0.05)' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.85rem', color: 'var(--brand-navy)', fontWeight: 800 }}>Thông Tin Giới Thiệu</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
                {location.description}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Tag size={18} color="var(--brand-navy)" />
              {location.tags?.map(tag => (
                <span key={tag} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#334155', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.825rem', fontWeight: 600 }}>
                  #{tag}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap' }}>
              <button
                onClick={handleReact}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.4rem',
                  borderRadius: '8px',
                  border: hasReacted ? 'none' : '1px solid #FECDD3',
                  background: hasReacted ? 'var(--brand-red)' : '#FFF1F2',
                  color: hasReacted ? 'white' : 'var(--brand-red)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  fontWeight: 700, fontSize: '0.95rem'
                }}
              >
                <Heart fill={hasReacted ? 'white' : 'transparent'} size={18} />
                {location.reactions?.length || 0} Yêu thích
              </button>

              <button
                onClick={() => document.getElementById('comment-input')?.focus()}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.4rem',
                  borderRadius: '8px',
                  border: '1px solid #BFDBFE',
                  background: '#EFF6FF',
                  color: 'var(--brand-navy)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  fontWeight: 700, fontSize: '0.95rem'
                }}
              >
                <MessageSquare size={18} />
                {comments.length} Bình luận
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '4rem', padding: '2rem', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(2, 50, 106, 0.04)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-navy)' }}>
            <MessageSquare /> Bình luận ({comments.length})
          </h3>

          <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            {replyingTo && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '0.55rem 1rem', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--accent-primary)' }}>
                  Đang trả lời bình luận của <b>{comments.find(c => c.id === replyingTo)?.username}</b>
                </span>
                <button onClick={() => setReplyingTo(null)} style={{ background: 'none', border: 'none', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>&times; Hủy</button>
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-gradient)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>
                {user ? user.username.charAt(0).toUpperCase() : '?'}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <textarea
                  id="comment-input"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={user ? 'Viết bình luận chia sẻ cảm nhận của bạn...' : 'Vui lòng đăng nhập để bình luận'}
                  disabled={!user}
                  rows={3}
                  style={{
                    width: '100%', padding: '0.9rem 1rem', borderRadius: '12px',
                    border: '1px solid #CBD5E1', background: user ? '#F8FAFC' : '#F1F5F9',
                    color: '#0F172A', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.95rem', outline: 'none'
                  }}
                />
                <button
                  onClick={handlePostComment}
                  disabled={!user || !newComment.trim() || isSubmittingComment}
                  style={{
                    alignSelf: 'flex-end', padding: '0.7rem 1.85rem', borderRadius: '8px',
                    background: 'var(--accent-primary)', color: 'white', border: 'none',
                    fontWeight: 700, cursor: (!user || !newComment.trim() || isSubmittingComment) ? 'not-allowed' : 'pointer',
                    opacity: (!user || !newComment.trim() || isSubmittingComment) ? 0.5 : 1
                  }}
                >
                  {isSubmittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {topLevelComments.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem 0' }}>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
            ) : (
              topLevelComments.map(comment => (
                <div key={comment.id} style={{ display: 'flex', gap: '0.85rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EFF6FF', color: 'var(--brand-navy)', border: '1px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>
                    {(comment.username || '?').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ background: '#F8FAFC', padding: '0.95rem 1.15rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, color: 'var(--brand-navy)' }}>{comment.username}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{formatCommentDate(comment)}</span>
                      </div>
                      <p style={{ margin: 0, lineHeight: 1.55, color: '#1E293B' }}>{comment.content}</p>
                    </div>
                    <div style={{ marginTop: '0.4rem', display: 'flex', gap: '1rem' }}>
                      <button
                        onClick={() => { setReplyingTo(comment.id); document.getElementById('comment-input')?.focus(); }}
                        style={{ background: 'none', border: 'none', color: '#0284C7', fontWeight: 600, fontSize: '0.825rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <CornerDownRight size={14} /> Trả lời
                      </button>
                    </div>

                    {getThreadReplies(comment.id).length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.85rem', paddingLeft: '1rem', borderLeft: '2px solid #E2E8F0' }}>
                        {getThreadReplies(comment.id).map(reply => {
                          const replyParentId = getParentId(reply);
                          const replyingToUser = replyParentId !== comment.id
                            ? comments.find(c => c.id === replyParentId)?.username
                            : null;
                          return (
                            <div key={reply.id} style={{ display: 'flex', gap: '0.75rem' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                                {(reply.username || '?').charAt(0).toUpperCase()}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--brand-navy)' }}>{reply.username}</span>
                                    <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{formatCommentDate(reply)}</span>
                                  </div>
                                  <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5, color: '#1E293B' }}>
                                    {replyingToUser && <span style={{ color: '#0284C7', fontWeight: 700 }}>@{replyingToUser} </span>}
                                    {reply.content}
                                  </p>
                                </div>
                                <div style={{ marginTop: '0.25rem' }}>
                                  <button
                                    onClick={() => { setReplyingTo(reply.id); document.getElementById('comment-input')?.focus(); }}
                                    style={{ background: 'none', border: 'none', color: '#0284C7', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                  >
                                    <CornerDownRight size={12} /> Trả lời
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {relatedLocations.length > 0 && (
          <div style={{ marginTop: '5rem', borderTop: '1px solid var(--border-light)', paddingTop: '4rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Địa điểm khác cùng khu vực</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {relatedLocations.map(loc => (
                <LocationCard key={loc.id} location={loc} />
              ))}
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <EditLocationModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            initialData={location}
            onSuccess={(updatedLocation) => {
              setLocation(updatedLocation);
              setSelectedImg(updatedLocation.image || (updatedLocation.images && updatedLocation.images[0]) || '');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LocationDetailPage;
