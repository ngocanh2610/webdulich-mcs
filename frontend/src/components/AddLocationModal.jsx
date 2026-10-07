import React, { useState } from 'react';
import { X, Upload, MapPin, User, FileText, Image as ImageIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const AddLocationModal = ({ isOpen, onClose, onSuccess }) => {
  const { provinces } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: '',
    provinceId: '',
    description: ''
  });
  
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let uploadedUrls = [];
      
      // Step 1: Upload images
      if (files.length > 0) {
        const formDataFiles = new FormData();
        files.forEach(file => {
          formDataFiles.append('images', file);
        });

        const uploadRes = await fetch('/api/media/upload', {
          method: 'POST',
          body: formDataFiles,
        });
        
        const uploadData = await uploadRes.json();
        
        if (!uploadData.success) {
          throw new Error(uploadData.message || 'Lỗi khi tải ảnh lên');
        }
        
        uploadedUrls = uploadData.data;
      }

      // Step 2: Save location data
      const locationData = {
        ...formData,
        images: uploadedUrls,
        tags: ['Khám phá mới']
      };

      const locationRes = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        },
        body: JSON.stringify(locationData),
      });

      const locationResponseData = await locationRes.json();

      if (!locationResponseData.success) {
        throw new Error(locationResponseData.message || 'Lỗi khi lưu địa điểm');
      }

      // Save author ID to localStorage to allow editing later
      try {
        const myLocations = JSON.parse(localStorage.getItem('my_authored_locations') || '[]');
        if (!myLocations.includes(locationResponseData.data.id)) {
          myLocations.push(locationResponseData.data.id);
          localStorage.setItem('my_authored_locations', JSON.stringify(myLocations));
        }
      } catch (e) {
        console.warn('Could not save to localStorage', e);
      }

      // Success
      setFormData({ name: '', provinceId: '', description: '' });
      setFiles([]);
      if (locationResponseData.data.status === 'pending') {
        alert('🎉 Bài viết của bạn đã được gửi thành công và đang chờ Admin duyệt trước khi xuất hiện trên bản đồ!');
      } else {
        alert('🎉 Đăng địa điểm thành công!');
      }
      onSuccess(locationResponseData.data);
      onClose();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        background: 'var(--bg-secondary)',
        padding: '0'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: 'var(--bg-secondary)',
          zIndex: 10
        }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin color="var(--accent-primary)" /> Đóng góp địa điểm mới
          </h2>
          <button 
            onClick={onClose}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)',
              cursor: 'pointer' 
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: '#ef4444', 
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid rgba(239, 68, 68, 0.2)'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Input fields */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Tên địa điểm *
              </label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="VD: Mù Cang Chải..."
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Thuộc Tỉnh/Thành phố *
              </label>
              <select 
                name="provinceId"
                value={formData.provinceId}
                onChange={handleInputChange}
                required
                style={inputStyle}
              >
                <option value="">-- Chọn tỉnh thành --</option>
                {provinces.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <ImageIcon size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Hình ảnh (Chọn nhiều file)
              </label>
              <div style={{ 
                border: '1px dashed var(--border-strong)', 
                padding: '1.5rem',
                borderRadius: '8px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)'
              }}>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <Upload size={32} color="var(--accent-primary)" />
                  <span style={{ color: 'var(--text-primary)' }}>Nhấn vào đây để tải ảnh từ máy tính</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Hỗ trợ JPG, PNG, WEBP</span>
                </label>
                
                {files.length > 0 && (
                  <div style={{ marginTop: '1rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--accent-secondary)' }}>
                    Đã chọn {files.length} tập tin.
                  </div>
                )}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <FileText size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Mô tả chi tiết *
              </label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Chia sẻ cảm nhận hoặc mô tả về địa điểm này..."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>



            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                Hủy
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng Bài'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  background: 'rgba(0,0,0,0.2)',
  border: '1px solid var(--border-strong)',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  color: 'var(--text-primary)',
  outline: 'none',
  fontFamily: 'var(--font-body)',
  fontSize: '1rem'
};

export default AddLocationModal;
