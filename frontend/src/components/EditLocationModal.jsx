import React, { useState, useEffect } from 'react';
import { X, Upload, MapPin, FileText, Image as ImageIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const EditLocationModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  const { provinces } = useAppContext();

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    provinceId: initialData?.provinceId || initialData?.province_id || '',
    description: initialData?.description || ''
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name || '',
        provinceId: initialData.provinceId || initialData.province_id || '',
        description: initialData.description || ''
      });
      setFiles([]);
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

      const locationData = {
        ...formData,
        type: initialData?.type || 'discovery',
      };

      if (uploadedUrls.length > 0) {
        locationData.images = uploadedUrls;
      }

      const locationRes = await fetch(`/api/locations/${initialData.id}`, {
        method: 'PUT',
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
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
        background: '#FFFFFF',
        padding: '0',
        border: '1px solid #E2E8F0',
        boxShadow: '0 24px 48px rgba(2, 50, 106, 0.16)'
      }}>
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: '#FFFFFF',
          zIndex: 10
        }}>
          <h2 style={{ fontSize: '1.4rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--brand-navy)' }}>
            <MapPin color="var(--accent-primary)" /> Chỉnh sửa địa điểm
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              color: 'var(--text-secondary)',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{
              background: '#FEF2F2',
              color: '#DC2626',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              marginBottom: '1.25rem',
              border: '1px solid #FECACA',
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
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
              <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
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
              <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
                <ImageIcon size={14} style={{ display: 'inline', marginRight: '4px' }} />
                Hình ảnh (Tải ảnh mới nếu muốn thay đổi)
              </label>
              <div style={{
                border: '1.5px dashed #CBD5E1',
                padding: '1.35rem',
                borderRadius: '12px',
                textAlign: 'center',
                background: '#F8FAFC'
              }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="edit-location-file-upload"
                />
                <label htmlFor="edit-location-file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.45rem' }}>
                  <Upload size={30} color="var(--accent-primary)" />
                  <span style={{ color: '#0F172A', fontWeight: 600, fontSize: '0.92rem' }}>Nhấn vào đây để tải ảnh từ máy tính</span>
                  <span style={{ color: '#64748B', fontSize: '0.78rem' }}>Hỗ trợ JPG, PNG, WEBP (tối đa 5 ảnh)</span>
                </label>

                {files.length > 0 && (
                  <div style={{ marginTop: '0.85rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, color: '#0284C7' }}>
                    Đã chọn {files.length} tập tin mới.
                  </div>
                )}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.45rem', fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '0.5rem' }}>
              <button type="button" onClick={onClose} className="btn-secondary">
                Hủy
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Lưu Thay Đổi'}
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
  background: '#F8FAFC',
  border: '1px solid #CBD5E1',
  padding: '0.75rem 1rem',
  borderRadius: '10px',
  color: '#0F172A',
  outline: 'none',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem'
};

export default EditLocationModal;
