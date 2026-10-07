import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LocationCard from '../components/LocationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EditLocationModal from '../components/EditLocationModal';
import { ArrowLeft, Star, MapPin, Tag, User, Edit, Trash2, Heart, MessageSquare, CornerDownRight, Clock, Check, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const LocationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, socket } = useAppContext();
  
  const [location, setLocation] = useState(null);
  const [relatedLocations, setRelatedLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // States for Image Gallery
  const [selectedImg, setSelectedImg] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  
  // Social States
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // comment id
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
          setSelectedImg(data.data.image); // Set initial main image
          
          // Check if author
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
          setComments(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchLocation();
    fetchComments();
    window.scrollTo(0, 0);
  }, [id, user]);

  // Handle Socket Events for Realtime
  useEffect(() => {
    if (!socket || !id) return;

    socket.emit('join_location', id);

    const handleNewComment = (newComment) => {
      setComments(prev => {
        // Prevent duplicate if we just posted it ourselves
        if (prev.find(c => c.id === newComment.id)) return prev;
        return [...prev, newComment];
      });
    };

    const handleReactionUpdate = (data) => {
      if (data.locationId === id) {
        setLocation(prev => ({
          ...prev,
          reactions: data.reactions
        }));
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
      if (data.success) {
        // We let the socket handle the update!
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
          content: newComment,
          parentId: replyingTo
        })
      });
      
      const data = await res.json();
      if (data.success) {
        // We let the socket handle the update for everyone including us!
        setNewComment('');
        setReplyingTo(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Lightbox Handlers
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
        
        // Remove from local storage authored locations
        try {
          const myLocations = JSON.parse(localStorage.getItem('my_authored_locations') || '[]');
          const updatedLocations = myLocations.filter(locId => locId !== id);
          localStorage.setItem('my_authored_locations', JSON.stringify(updatedLocations));
        } catch (e) {
          console.warn(e);
        }
        
        navigate('/'); // Go back to home page
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
        body: JSON.stringify({ status: newStatus, rejectionReason: reason })
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

  const allImages = location.images && location.images.length > 0 ? location.images : [location.image];
  
  const hasReacted = location.reactions && user && location.reactions.some(r => r.username === user.username);
  
  // Organize comments into top-level and replies
  const topLevelComments = comments.filter(c => !c.parentId);
  
  // Find top level parent for any comment
  const getTopLevelId = (c) => {
    if (!c.parentId) return c.id;
    const parent = comments.find(p => p.id === c.parentId);
    return parent ? getTopLevelId(parent) : c.parentId; // fallback
  };
  
  // Get all descendants for a top level comment
  const getThreadReplies = (topLevelId) => {
    return comments.filter(c => c.parentId && getTopLevelId(c) === topLevelId)
                   .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '5rem' }}>
      {/* Lightbox Overlay */}
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
          {/* Close Btn */}
          <button onClick={closeLightbox} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '2rem', cursor: 'pointer' }}>&times;</button>
          
          {/* Prev Btn */}
          {allImages.length > 1 && (
            <button onClick={prevImage} style={{ position: 'absolute', left: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-primary)', fontSize: '2rem', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&#10094;</button>
          )}

          <img 
            src={allImages[lightboxIndex]} 
            alt="Full size" 
            style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', borderRadius: '8px' }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
          />

          {/* Next Btn */}
          {allImages.length > 1 && (
            <button onClick={nextImage} style={{ position: 'absolute', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-primary)', fontSize: '2rem', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&#10095;</button>
          )}
        </div>
      )}

      <div className="container">
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-secondary)',
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            cursor: 'pointer',
            marginBottom: '2rem',
            padding: 0
          }}
        >
          <ArrowLeft size={16} /> Quay lại
        </button>

        {/* Approval Status Banner */}
        {location.status === 'pending' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.1))',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '16px',
            padding: '1.25rem 1.75rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 4px 20px rgba(245, 158, 11, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.2)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: '#f59e0b'
              }}>
                <Clock size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Bài viết đang chờ phê duyệt
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
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
                    background: '#10b981', color: 'white', border: 'none',
                    padding: '0.6rem 1.25rem', borderRadius: '10px',
                    fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)'
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
                    background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444',
                    border: '1px solid #ef4444', padding: '0.6rem 1.25rem',
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
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
            padding: '1.25rem 1.75rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            color: '#ef4444'
          }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.2)', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>
              <X size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>Bài viết đã bị từ chối phê duyệt</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Bài viết này không hiển thị công khai. Bạn có thể sửa lại nội dung để gửi duyệt lại.
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr lg:1.5fr', gap: '3rem' }}>
          {/* Images Gallery */}
          <div>
            <div 
              onClick={() => openLightbox(allImages.indexOf(selectedImg) !== -1 ? allImages.indexOf(selectedImg) : 0)}
              style={{ borderRadius: '16px', overflow: 'hidden', height: '400px', border: '1px solid var(--border-light)', marginBottom: '1rem', cursor: 'zoom-in' }}
            >
              <img 
                src={selectedImg || location.image} 
                alt={location.name} 
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
                      transition: 'all 0.3s'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Details */}
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {location.status === 'pending' && (
                <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={14} /> Chờ duyệt
                </span>
              )}
              {location.status === 'rejected' && (
                <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <X size={14} /> Bị từ chối
                </span>
              )}
              {location.status === 'approved' && (
                <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Check size={14} /> Đã duyệt
                </span>
              )}
              <span style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={14} fill="#fbbf24" /> {location.rating}
              </span>
              <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <MapPin size={14} /> ID Tỉnh: {location.provinceId}
              </span>
              {location.author && (
                <span style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-secondary)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <User size={14} /> Tác giả: {location.author}
                </span>
              )}
              {(isAuthor || (user && user.role === 'admin')) && (
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}
                >
                  <Edit size={14} /> Sửa bài viết
                </button>
              )}
              {(isAuthor || (user && user.role === 'admin')) && (
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: isDeleting ? 'not-allowed' : 'pointer', opacity: isDeleting ? 0.7 : 1 }}
                >
                  <Trash2 size={14} /> {isDeleting ? 'Đang xoá...' : 'Xoá bài'}
                </button>
              )}
            </div>
            
            <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>{location.name}</h1>
            
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Thông tin chi tiết</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.125rem', whiteSpace: 'pre-line' }}>
                {location.description}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Tag size={20} color="var(--text-muted)" />
              {location.tags?.map(tag => (
                <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-light)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.875rem' }}>
                  {tag}
                </span>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)' }}>
              <button 
                onClick={handleReact}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem',
                  borderRadius: '30px', border: hasReacted ? 'none' : '1px solid var(--border-light)',
                  background: hasReacted ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                  color: hasReacted ? 'white' : 'var(--text-primary)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  fontWeight: 600, fontSize: '1rem'
                }}
              >
                <Heart fill={hasReacted ? 'white' : 'transparent'} size={20} /> 
                {location.reactions?.length || 0} Yêu thích
              </button>
              
              <button 
                onClick={() => document.getElementById('comment-input').focus()}
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem',
                  borderRadius: '30px', border: '1px solid var(--border-light)',
                  background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  fontWeight: 600, fontSize: '1rem'
                }}
              >
                <MessageSquare size={20} />
                {comments.length} Bình luận
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div style={{ marginTop: '4rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare /> Bình luận
          </h3>
          
          <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            {replyingTo && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--accent-primary)' }}>
                  Đang trả lời bình luận của <b>{comments.find(c => c.id === replyingTo)?.username}</b>
                </span>
                <button onClick={() => setReplyingTo(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>&times; Hủy</button>
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user ? user.username.charAt(0).toUpperCase() : '?'}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <textarea 
                  id="comment-input"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={user ? "Viết bình luận của bạn..." : "Vui lòng đăng nhập để bình luận"}
                  disabled={!user}
                  rows={3}
                  style={{ 
                    width: '100%', padding: '1rem', borderRadius: '12px', 
                    border: '1px solid var(--border-light)', background: 'rgba(0,0,0,0.2)',
                    color: 'var(--text-primary)', resize: 'vertical', fontFamily: 'inherit'
                  }}
                />
                <button 
                  onClick={handlePostComment}
                  disabled={!user || !newComment.trim() || isSubmittingComment}
                  style={{ 
                    alignSelf: 'flex-end', padding: '0.75rem 2rem', borderRadius: '30px',
                    background: 'var(--accent-primary)', color: 'white', border: 'none',
                    fontWeight: 600, cursor: (!user || !newComment.trim() || isSubmittingComment) ? 'not-allowed' : 'pointer',
                    opacity: (!user || !newComment.trim() || isSubmittingComment) ? 0.5 : 1
                  }}
                >
                  {isSubmittingComment ? 'Đang gửi...' : 'Gửi bình luận'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {topLevelComments.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
            ) : (
              topLevelComments.map(comment => (
                <div key={comment.id} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {comment.username.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--accent-secondary)' }}>{comment.username}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(comment.createdAt).toLocaleString('vi-VN')}</span>
                      </div>
                      <p style={{ margin: 0, lineHeight: 1.5 }}>{comment.content}</p>
                    </div>
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                      <button 
                        onClick={() => { setReplyingTo(comment.id); document.getElementById('comment-input').focus(); }}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <CornerDownRight size={14} /> Trả lời
                      </button>
                    </div>

                    {/* Replies */}
                    {getThreadReplies(comment.id).length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                        {getThreadReplies(comment.id).map(reply => {
                          const replyingToUser = reply.parentId !== comment.id 
                            ? comments.find(c => c.id === reply.parentId)?.username 
                            : null;
                          return (
                          <div key={reply.id} style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.75rem' }}>
                              {reply.username.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ background: 'rgba(0,0,0,0.15)', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.02)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--accent-secondary)' }}>{reply.username}</span>
                                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(reply.createdAt).toLocaleString('vi-VN')}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
                                  {replyingToUser && <span style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>@{replyingToUser} </span>}
                                  {reply.content}
                                </p>
                              </div>
                              <div style={{ marginTop: '0.25rem' }}>
                                <button 
                                  onClick={() => { setReplyingTo(reply.id); document.getElementById('comment-input').focus(); }}
                                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                                >
                                  <CornerDownRight size={12} /> Trả lời
                                </button>
                              </div>
                            </div>
                          </div>
                        )})}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Locations */}
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
        
        {/* Edit Modal */}
        {isEditModalOpen && (
          <EditLocationModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            initialData={location}
            onSuccess={(updatedLocation) => {
              setLocation(updatedLocation);
              setSelectedImg(updatedLocation.image);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LocationDetailPage;
