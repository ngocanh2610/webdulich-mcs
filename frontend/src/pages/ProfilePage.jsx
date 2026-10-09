import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  User, Mail, Lock, Shield, ShieldCheck, ShieldAlert, Camera, 
  Upload, Trash2, Ban, CheckCircle, RefreshCw, Search, Filter, 
  AlertTriangle, Key, Edit, X, Check, Image as ImageIcon, 
  Calendar, ArrowRight, UserCheck, UserX, Users, Sparkles
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// Gợi ý danh sách avatar mẫu phong cách du lịch
const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80'
];

const ProfilePage = () => {
  const { user, updateUser, logout } = useAppContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab: 'profile' hoặc 'users'
  const initialTab = searchParams.get('tab') === 'users' && user?.role === 'admin' ? 'users' : 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);

  // States for Personal Profile
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [avatarInputUrl, setAvatarInputUrl] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const fileInputRef = useRef(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Email update state
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

  // Toast alert
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  };

  // States for Admin User Management
  const [usersList, setUsersList] = useState([]);
  const [usersCounts, setUsersCounts] = useState({ total: 0, activeCount: 0, disabledCount: 0, adminCount: 0, userCount: 0 });
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Confirmation Modals for Admin Actions
  const [actionModal, setActionModal] = useState({
    show: false,
    type: '', // 'disable', 'enable', 'delete'
    targetUser: null,
    isProcessing: false
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      setAvatarUrl(user.avatar || '');
      setAvatarPreview(user.avatar || '');
      setEmailInput(user.email || '');
    }
  }, [user, navigate]);

  // Sync tab with URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'users' && user?.role === 'admin') {
      setActiveTab('users');
    } else {
      setActiveTab('profile');
    }
  }, [searchParams, user]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'users') {
      setSearchParams({ tab: 'users' });
    } else {
      setSearchParams({});
    }
  };

  // Fetch users list for Admin
  const fetchUsers = async () => {
    if (user?.role !== 'admin') return;
    setIsLoadingUsers(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('q', searchQuery.trim());
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const res = await fetch(`/api/users?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(data.users || []);
        if (data.counts) setUsersCounts(data.counts);
      } else {
        showToast(data.message || 'Không thể tải danh sách người dùng', 'error');
      }
    } catch (err) {
      console.error('Lỗi tải danh sách người dùng:', err);
      showToast('Lỗi kết nối khi tải danh sách người dùng', 'error');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users' && user?.role === 'admin') {
      fetchUsers();
    }
  }, [activeTab, searchQuery, roleFilter, statusFilter]);

  // Handle avatar file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WEBP...)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Dung lượng ảnh không được vượt quá 10MB', 'error');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('images', file);

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success && data.data && data.data.length > 0) {
        const uploadedUrl = data.data[0];
        setAvatarPreview(uploadedUrl);
        setAvatarInputUrl(uploadedUrl);
        showToast('Tải ảnh lên thành công! Nhấn "Lưu ảnh đại diện" để hoàn tất');
      } else {
        showToast(data.message || 'Lỗi khi tải ảnh lên', 'error');
      }
    } catch (err) {
      console.error('Lỗi tải ảnh:', err);
      showToast('Lỗi khi tải ảnh lên server', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Save Avatar to profile
  const handleSaveAvatar = async (urlToSave) => {
    const finalUrl = urlToSave !== undefined ? urlToSave : avatarPreview;
    setIsSavingAvatar(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: finalUrl })
      });
      const data = await res.json();

      if (data.success) {
        setAvatarUrl(finalUrl);
        setAvatarPreview(finalUrl);
        updateUser({ avatar: finalUrl });
        setShowAvatarModal(false);
        showToast('Cập nhật ảnh đại diện thành công!');
      } else {
        showToast(data.message || 'Không thể lưu ảnh đại diện', 'error');
      }
    } catch (err) {
      console.error('Lỗi lưu avatar:', err);
      showToast('Lỗi máy chủ khi cập nhật ảnh đại diện', 'error');
    } finally {
      setIsSavingAvatar(false);
    }
  };

  // Remove avatar
  const handleRemoveAvatar = async () => {
    if (!avatarUrl) return;
    if (window.confirm('Bạn có chắc muốn gỡ ảnh đại diện hiện tại?')) {
      await handleSaveAvatar(null);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Vui lòng nhập mật khẩu hiện tại', 'error');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showToast('Mật khẩu mới phải có tối thiểu 6 ký tự', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Xác nhận mật khẩu mới không trùng khớp', 'error');
      return;
    }

    setIsChangingPassword(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();

      if (data.success) {
        showToast('Đổi mật khẩu thành công!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(data.message || 'Đổi mật khẩu thất bại', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Lỗi máy chủ khi đổi mật khẩu', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Admin: Execute Status Update or Deletion
  const handleConfirmAction = async () => {
    const { type, targetUser } = actionModal;
    if (!targetUser) return;

    setActionModal(prev => ({ ...prev, isProcessing: true }));
    const token = localStorage.getItem('token');

    try {
      if (type === 'disable' || type === 'enable') {
        const newStatus = type === 'disable' ? 'disabled' : 'active';
        const res = await fetch(`/api/users/${targetUser.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        });
        const data = await res.json();

        if (data.success) {
          showToast(data.message || 'Cập nhật trạng thái thành công');
          fetchUsers();
          setActionModal({ show: false, type: '', targetUser: null, isProcessing: false });
        } else {
          showToast(data.message || 'Lỗi khi cập nhật trạng thái', 'error');
          setActionModal(prev => ({ ...prev, isProcessing: false }));
        }
      } else if (type === 'delete') {
        const res = await fetch(`/api/users/${targetUser.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.success) {
          showToast(data.message || 'Đã xóa tài khoản người dùng');
          fetchUsers();
          setActionModal({ show: false, type: '', targetUser: null, isProcessing: false });
        } else {
          showToast(data.message || 'Lỗi khi xóa người dùng', 'error');
          setActionModal(prev => ({ ...prev, isProcessing: false }));
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Lỗi kết nối khi thực hiện thao tác', 'error');
      setActionModal(prev => ({ ...prev, isProcessing: false }));
    }
  };

  if (!user) return null;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
      paddingTop: '80px',
      paddingBottom: '60px'
    }}>
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '24px',
          zIndex: 9999,
          background: toast.type === 'error' ? '#EF4444' : '#10B981',
          color: '#FFFFFF',
          padding: '0.85rem 1.4rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontWeight: 600,
          fontSize: '0.9rem',
          animation: 'slideInRight 0.3s ease-out'
        }}>
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Cover Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #FF385C 0%, #E0284F 50%, #BD1E59 100%)',
          borderRadius: '24px',
          padding: '2.5rem 2rem 2rem',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 12px 30px rgba(255, 56, 92, 0.25)',
          marginBottom: '2rem'
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-40px',
            left: '30%',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.06)',
            pointerEvents: 'none'
          }} />

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
              {/* Large Avatar with camera trigger */}
              <div style={{ position: 'relative' }}>
                <div 
                  onClick={() => setShowAvatarModal(true)}
                  style={{
                    width: '105px',
                    height: '105px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '4px solid rgba(255, 255, 255, 0.85)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  title="Nhấn để đổi ảnh đại diện"
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.username} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.innerHTML = `<span style="font-size: 2.5rem; font-weight: 800; color: #FF385C;">${user.username.charAt(0).toUpperCase()}</span>`;
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FF385C' }}>
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                  {/* Overlay camera icon on hover */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    <Camera size={26} color="#FFFFFF" />
                  </div>
                </div>

                {/* Camera Floating Button */}
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(true)}
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    color: '#FF385C',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  title="Cập nhật ảnh đại diện"
                >
                  <Camera size={16} />
                </button>
              </div>

              {/* User Bio Information */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                    {user.username}
                  </h1>
                  {user.role === 'admin' ? (
                    <span style={{
                      background: '#FFFFFF',
                      color: '#EF4444',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '12px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}>
                      QUẢN TRỊ VIÊN
                    </span>
                  ) : (
                    <span style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '12px'
                    }}>
                      THÀNH VIÊN
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.9rem', opacity: 0.9 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={16} />
                    <span>{user.email || 'Chưa cập nhật email'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={16} />
                    <span>
                      Tham gia: {user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'Gần đây'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Button */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowAvatarModal(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  padding: '0.6rem 1.1rem',
                  borderRadius: '14px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  backdropFilter: 'blur(8px)',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              >
                <Camera size={16} />
                <span>Đổi ảnh đại diện</span>
              </button>

              <button
                type="button"
                onClick={logout}
                style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '0.6rem 1.1rem',
                  borderRadius: '14px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.7)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.25)'}
              >
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          background: '#FFFFFF',
          padding: '0.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          marginBottom: '2rem',
          border: '1px solid #E2E8F0'
        }}>
          <button
            type="button"
            onClick={() => handleTabChange('profile')}
            style={{
              flex: 1,
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'profile' ? 'var(--accent-gradient)' : 'transparent',
              color: activeTab === 'profile' ? '#FFFFFF' : '#64748B',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === 'profile' ? '0 4px 12px rgba(255, 56, 92, 0.25)' : 'none'
            }}
          >
            <User size={18} />
            <span>Thông Tin Cá Nhân</span>
          </button>

          {user.role === 'admin' && (
            <button
              type="button"
              onClick={() => handleTabChange('users')}
              style={{
                flex: 1,
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'users' ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : 'transparent',
                color: activeTab === 'users' ? '#FFFFFF' : '#64748B',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.55rem',
                transition: 'all 0.2s ease',
                boxShadow: activeTab === 'users' ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'none'
              }}
            >
              <Users size={18} />
              <span>Quản Lý Tài Khoản Người Dùng</span>
              <span style={{
                background: activeTab === 'users' ? '#FFFFFF' : '#EFF6FF',
                color: activeTab === 'users' ? '#1D4ED8' : '#2563EB',
                padding: '0.1rem 0.5rem',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                {usersCounts.total || 0}
              </span>
            </button>
          )}
        </div>

        {/* TAB 1: THÔNG TIN CÁ NHÂN */}
        {activeTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            
            {/* Thẻ 1: Chi tiết tài khoản */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '1.75rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#FEE2E2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#EF4444'
                }}>
                  <User size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#1E293B' }}>
                  Hồ Sơ Của Bạn
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '0.3rem' }}>
                    TÊN ĐĂNG NHẬP
                  </label>
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: '#F8FAFC',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#1E293B'
                  }}>
                    {user.username}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '0.3rem' }}>
                    ĐỊA CHỈ EMAIL
                  </label>
                  <div style={{
                    padding: '0.75rem 1rem',
                    background: '#F8FAFC',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '0.95rem',
                    color: '#334155'
                  }}>
                    {user.email || 'Chưa cập nhật'}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '0.3rem' }}>
                    VAI TRÒ TRÊN HỆ THỐNG
                  </label>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.5rem 0.9rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    background: user.role === 'admin' ? '#FEF2F2' : '#F0FDF4',
                    color: user.role === 'admin' ? '#DC2626' : '#16A34A',
                    border: user.role === 'admin' ? '1px solid #FECACA' : '1px solid #BBF7D0'
                  }}>
                    {user.role === 'admin' ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                    <span>{user.role === 'admin' ? 'Quản trị viên (Admin)' : 'Người dùng thông thường (User)'}</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '0.3rem' }}>
                    TRẠNG THÁI TÀI KHOẢN
                  </label>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.5rem 0.9rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    background: '#F0FDF4',
                    color: '#16A34A',
                    border: '1px solid #BBF7D0'
                  }}>
                    <CheckCircle size={16} />
                    <span>Đang hoạt động bình thường</span>
                  </div>
                </div>
              </div>

              {/* Avatar Quick Switch Box */}
              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
                  Ảnh đại diện hiển thị
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowAvatarModal(true)}
                    style={{
                      background: '#EFF6FF',
                      color: '#2563EB',
                      border: '1px solid #BFDBFE',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '10px',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Thay đổi
                  </button>
                  {user.avatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      style={{
                        background: '#FEF2F2',
                        color: '#EF4444',
                        border: '1px solid #FECACA',
                        padding: '0.45rem 0.85rem',
                        borderRadius: '10px',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Gỡ ảnh
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Thẻ 2: Đổi Mật Khẩu */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '1.75rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#EEF2FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4F46E5'
                }}>
                  <Key size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#1E293B' }}>
                  Bảo Mật & Đổi Mật Khẩu
                </h3>
              </div>

              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '0.35rem' }}>
                    MẬT KHẨU HIỆN TẠI
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại..."
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '0.35rem' }}>
                    MẬT KHẨU MỚI
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự..."
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '0.35rem' }}>
                    XÁC NHẬN MẬT KHẨU MỚI
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới..."
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.95rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  style={{
                    marginTop: '0.5rem',
                    padding: '0.8rem 1.25rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: isChangingPassword ? '#94A3B8' : 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: isChangingPassword ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isChangingPassword ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>Đang cập nhật...</span>
                    </>
                  ) : (
                    <>
                      <Key size={18} />
                      <span>Cập Nhật Mật Khẩu</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG (DÀNH CHO ADMIN) */}
        {activeTab === 'users' && user.role === 'admin' && (
          <div>
            {/* Quick Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#EFF6FF',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Users size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>TỔNG TÀI KHOẢN</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B' }}>{usersCounts.total || 0}</div>
                </div>
              </div>

              <div style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#F0FDF4',
                  color: '#16A34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UserCheck size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>ĐANG HOẠT ĐỘNG</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16A34A' }}>{usersCounts.activeCount || 0}</div>
                </div>
              </div>

              <div style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#FEF2F2',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UserX size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>BỊ VÔ HIỆU HÓA</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#DC2626' }}>{usersCounts.disabledCount || 0}</div>
                </div>
              </div>

              <div style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: '#FEF9C3',
                  color: '#CA8A04',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Shield size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>QUẢN TRỊ VIÊN</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#854D0E' }}>{usersCounts.adminCount || 0}</div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              padding: '1.25rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              border: '1px solid #E2E8F0',
              marginBottom: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}>
              {/* Search input */}
              <div style={{
                position: 'relative',
                flex: '1 1 300px',
                minWidth: '240px'
              }}>
                <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên đăng nhập hoặc email..."
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem 0.7rem 2.6rem',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{
                    padding: '0.65rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    background: '#FFFFFF',
                    color: '#334155',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="all">Tất cả vai trò</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                  <option value="user">Người dùng (User)</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '0.65rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.875rem',
                    background: '#FFFFFF',
                    color: '#334155',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="disabled">Đã vô hiệu hóa</option>
                </select>

                <button
                  type="button"
                  onClick={fetchUsers}
                  disabled={isLoadingUsers}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.65rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    color: '#475569',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  title="Tải lại danh sách"
                >
                  <RefreshCw size={16} className={isLoadingUsers ? 'animate-spin' : ''} />
                  <span>Làm mới</span>
                </button>
              </div>
            </div>

            {/* Users Data Table */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              border: '1px solid #E2E8F0',
              overflow: 'hidden'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.5px' }}>
                        NGƯỜI DÙNG
                      </th>
                      <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.5px' }}>
                        EMAIL
                      </th>
                      <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.5px' }}>
                        VAI TRÒ
                      </th>
                      <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.5px' }}>
                        TRẠNG THÁI
                      </th>
                      <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.5px' }}>
                        NGÀY TẠO
                      </th>
                      <th style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748B', letterSpacing: '0.5px', textAlign: 'right' }}>
                        HÀNH ĐỘNG
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingUsers ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
                          <div>Đang tải danh sách người dùng...</div>
                        </td>
                      </tr>
                    ) : usersList.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                          <Users size={36} color="#CBD5E1" style={{ margin: '0 auto 0.5rem' }} />
                          <div style={{ fontWeight: 600 }}>Không tìm thấy người dùng nào phù hợp</div>
                          <div style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '0.25rem' }}>Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc</div>
                        </td>
                      </tr>
                    ) : (
                      usersList.map((u) => {
                        const isSelf = u.id === user.id || u.username === user.username;
                        const isRootAdmin = u.username === 'admin';
                        const isDisabled = u.status === 'disabled';

                        return (
                          <tr 
                            key={u.id}
                            style={{ 
                              borderBottom: '1px solid #F1F5F9',
                              transition: 'background 0.1s ease',
                              background: isDisabled ? '#FDF2F2' : 'transparent'
                            }}
                            onMouseEnter={e => {
                              if (!isDisabled) e.currentTarget.style.background = '#F8FAFC';
                            }}
                            onMouseLeave={e => {
                              if (!isDisabled) e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            {/* User Avatar + Username */}
                            <td style={{ padding: '1rem 1.25rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  background: 'var(--accent-gradient)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#FFFFFF',
                                  fontWeight: 700,
                                  fontSize: '0.9rem',
                                  flexShrink: 0,
                                  overflow: 'hidden'
                                }}>
                                  {u.avatar ? (
                                    <img 
                                      src={u.avatar} 
                                      alt={u.username} 
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement.innerText = u.username.charAt(0).toUpperCase();
                                      }}
                                    />
                                  ) : (
                                    u.username.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <div style={{ fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <span>{u.username}</span>
                                    {isSelf && (
                                      <span style={{ fontSize: '0.65rem', background: '#DBEAFE', color: '#1E40AF', padding: '1px 6px', borderRadius: '8px' }}>
                                        Bạn
                                      </span>
                                    )}
                                    {isRootAdmin && !isSelf && (
                                      <span style={{ fontSize: '0.65rem', background: '#FEF3C7', color: '#92400E', padding: '1px 6px', borderRadius: '8px' }}>
                                        Gốc
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>ID: {u.id}</div>
                                </div>
                              </div>
                            </td>

                            {/* Email */}
                            <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', color: '#475569' }}>
                              {u.email}
                            </td>

                            {/* Role */}
                            <td style={{ padding: '1rem 1.25rem' }}>
                              {u.role === 'admin' ? (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: '0.25rem 0.65rem',
                                  borderRadius: '12px',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  background: '#FEF2F2',
                                  color: '#DC2626',
                                  border: '1px solid #FECACA'
                                }}>
                                  <Shield size={13} />
                                  <span>ADMIN</span>
                                </span>
                              ) : (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: '0.25rem 0.65rem',
                                  borderRadius: '12px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  background: '#EFF6FF',
                                  color: '#2563EB',
                                  border: '1px solid #BFDBFE'
                                }}>
                                  <User size={13} />
                                  <span>USER</span>
                                </span>
                              )}
                            </td>

                            {/* Status */}
                            <td style={{ padding: '1rem 1.25rem' }}>
                              {isDisabled ? (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: '0.25rem 0.65rem',
                                  borderRadius: '12px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  background: '#FEE2E2',
                                  color: '#991B1B',
                                  border: '1px solid #FCA5A5'
                                }}>
                                  <Ban size={13} />
                                  <span>ĐÃ VÔ HIỆU HÓA</span>
                                </span>
                              ) : (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: '0.25rem 0.65rem',
                                  borderRadius: '12px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  background: '#F0FDF4',
                                  color: '#16A34A',
                                  border: '1px solid #BBF7D0'
                                }}>
                                  <CheckCircle size={13} />
                                  <span>HOẠT ĐỘNG</span>
                                </span>
                              )}
                            </td>

                            {/* Created date */}
                            <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#64748B' }}>
                              {u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : '—'}
                            </td>

                            {/* Actions */}
                            <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                {/* Vô hiệu hóa / Mở khóa button */}
                                {isDisabled ? (
                                  <button
                                    type="button"
                                    onClick={() => setActionModal({ show: true, type: 'enable', targetUser: u, isProcessing: false })}
                                    disabled={isSelf || isRootAdmin}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.35rem',
                                      background: '#F0FDF4',
                                      color: '#16A34A',
                                      border: '1px solid #86EFAC',
                                      padding: '0.4rem 0.75rem',
                                      borderRadius: '10px',
                                      fontSize: '0.8rem',
                                      fontWeight: 600,
                                      cursor: (isSelf || isRootAdmin) ? 'not-allowed' : 'pointer',
                                      opacity: (isSelf || isRootAdmin) ? 0.4 : 1
                                    }}
                                    title="Kích hoạt lại tài khoản này"
                                  >
                                    <CheckCircle size={14} />
                                    <span>Kích hoạt</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setActionModal({ show: true, type: 'disable', targetUser: u, isProcessing: false })}
                                    disabled={isSelf || isRootAdmin}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.35rem',
                                      background: '#FFFBEB',
                                      color: '#D97706',
                                      border: '1px solid #FCD34D',
                                      padding: '0.4rem 0.75rem',
                                      borderRadius: '10px',
                                      fontSize: '0.8rem',
                                      fontWeight: 600,
                                      cursor: (isSelf || isRootAdmin) ? 'not-allowed' : 'pointer',
                                      opacity: (isSelf || isRootAdmin) ? 0.4 : 1
                                    }}
                                    title="Vô hiệu hóa tạm thời tài khoản này"
                                  >
                                    <Ban size={14} />
                                    <span>Vô hiệu hóa</span>
                                  </button>
                                )}

                                {/* Xóa tài khoản button */}
                                <button
                                  type="button"
                                  onClick={() => setActionModal({ show: true, type: 'delete', targetUser: u, isProcessing: false })}
                                  disabled={isSelf || isRootAdmin}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '32px',
                                    height: '32px',
                                    background: '#FEF2F2',
                                    color: '#EF4444',
                                    border: '1px solid #FECACA',
                                    borderRadius: '10px',
                                    cursor: (isSelf || isRootAdmin) ? 'not-allowed' : 'pointer',
                                    opacity: (isSelf || isRootAdmin) ? 0.4 : 1
                                  }}
                                  title="Xóa vĩnh viễn tài khoản người dùng"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ĐỔI ẢNH ĐẠI DIỆN */}
      {showAvatarModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid #F1F5F9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Camera size={20} color="#FF385C" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1E293B' }}>
                  Cập Nhật Ảnh Đại Diện
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.5rem' }}>
              {/* Preview Avatar Center */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  border: '4px solid #FEE2E2',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  overflow: 'hidden',
                  marginBottom: '0.75rem'
                }}>
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={() => setAvatarPreview('')}
                    />
                  ) : (
                    <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Xem trước ảnh đại diện của bạn
                </span>
              </div>

              {/* Tùy chọn 1: Tải ảnh từ máy */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                  Cách 1: Chọn ảnh từ máy tính của bạn
                </label>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    border: '2px dashed #CBD5E1',
                    background: '#F8FAFC',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: isUploadingAvatar ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'border-color 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#FF385C'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#CBD5E1'}
                >
                  {isUploadingAvatar ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" color="#FF385C" />
                      <span>Đang tải ảnh lên...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={18} color="#FF385C" />
                      <span>Bấm vào đây để chọn file ảnh (Tối đa 10MB)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Tùy chọn 2: Dán link URL */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                  Cách 2: Hoặc dán đường dẫn ảnh (URL)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="url"
                    value={avatarInputUrl}
                    onChange={(e) => {
                      setAvatarInputUrl(e.target.value);
                      setAvatarPreview(e.target.value);
                    }}
                    placeholder="https://example.com/avatar.jpg"
                    style={{
                      flex: 1,
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (avatarInputUrl.trim()) setAvatarPreview(avatarInputUrl.trim());
                    }}
                    style={{
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      borderRadius: '10px',
                      padding: '0.65rem 0.85rem',
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Thử
                  </button>
                </div>
              </div>

              {/* Tùy chọn 3: Bộ sưu tập mẫu */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
                  Cách 3: Chọn nhanh từ avatar du lịch gợi ý
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.35rem' }}>
                  {PRESET_AVATARS.map((preset, idx) => (
                    <img
                      key={idx}
                      src={preset}
                      alt="Preset"
                      onClick={() => {
                        setAvatarPreview(preset);
                        setAvatarInputUrl(preset);
                      }}
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: avatarPreview === preset ? '3px solid #FF385C' : '2px solid transparent',
                        transition: 'transform 0.15s ease',
                        flexShrink: 0
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              padding: '1rem 1.5rem',
              borderTop: '1px solid #F1F5F9',
              background: '#F8FAFC'
            }}>
              <button
                type="button"
                onClick={() => setShowAvatarModal(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid #CBD5E1',
                  color: '#475569',
                  padding: '0.6rem 1.1rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                onClick={() => handleSaveAvatar()}
                disabled={isSavingAvatar || !avatarPreview}
                style={{
                  background: 'var(--accent-gradient)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.6rem 1.4rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: (isSavingAvatar || !avatarPreview) ? 'not-allowed' : 'pointer',
                  opacity: (isSavingAvatar || !avatarPreview) ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 12px rgba(255, 56, 92, 0.25)'
                }}
              >
                {isSavingAvatar ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Lưu ảnh đại diện</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN HÀNH ĐỘNG CỦA ADMIN (VÔ HIỆU HÓA / KÍCH HOẠT / XÓA) */}
      {actionModal.show && actionModal.targetUser && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '460px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ padding: '1.75rem', textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: actionModal.type === 'delete' ? '#FEE2E2' : actionModal.type === 'disable' ? '#FEF3C7' : '#DCFCE7',
                color: actionModal.type === 'delete' ? '#DC2626' : actionModal.type === 'disable' ? '#D97706' : '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                {actionModal.type === 'delete' ? (
                  <Trash2 size={28} />
                ) : actionModal.type === 'disable' ? (
                  <Ban size={28} />
                ) : (
                  <CheckCircle size={28} />
                )}
              </div>

              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 800, color: '#1E293B' }}>
                {actionModal.type === 'delete' ? 'Xác Nhận Xóa Tài Khoản?' : actionModal.type === 'disable' ? 'Vô Hiệu Hóa Tài Khoản?' : 'Kích Hoạt Lại Tài Khoản?'}
              </h3>

              <p style={{ margin: '0 0 1.25rem', fontSize: '0.9rem', color: '#64748B', lineHeight: 1.5 }}>
                {actionModal.type === 'delete' ? (
                  <>
                    Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản <strong>"{actionModal.targetUser.username}"</strong>? Toàn bộ bài đăng, bình luận và dữ liệu liên quan sẽ bị xóa và không thể khôi phục.
                  </>
                ) : actionModal.type === 'disable' ? (
                  <>
                    Người dùng <strong>"{actionModal.targetUser.username}"</strong> sẽ không thể đăng nhập hoặc thao tác trên hệ thống cho đến khi được kích hoạt lại.
                  </>
                ) : (
                  <>
                    Khôi phục quyền truy cập cho người dùng <strong>"{actionModal.targetUser.username}"</strong>. Người này sẽ có thể đăng nhập bình thường.
                  </>
                )}
              </p>

              <div style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'center'
              }}>
                <button
                  type="button"
                  onClick={() => setActionModal({ show: false, type: '', targetUser: null, isProcessing: false })}
                  disabled={actionModal.isProcessing}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    cursor: actionModal.isProcessing ? 'not-allowed' : 'pointer'
                  }}
                >
                  Hủy bỏ
                </button>

                <button
                  type="button"
                  onClick={handleConfirmAction}
                  disabled={actionModal.isProcessing}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: actionModal.type === 'delete' ? '#DC2626' : actionModal.type === 'disable' ? '#D97706' : '#16A34A',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: actionModal.isProcessing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                  }}
                >
                  {actionModal.isProcessing ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <span>
                      {actionModal.type === 'delete' ? 'Xóa Vĩnh Viễn' : actionModal.type === 'disable' ? 'Vô Hiệu Hóa' : 'Kích Hoạt Ngay'}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
