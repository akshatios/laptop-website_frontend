import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import Icon from './Icon';

const CATEGORIES = ['Laptop', 'Mobile', 'Accessories'];
const CONDITIONS = ['Used', 'New', 'Refurbished'];
const blank = { title: '', description: '', price: '', category: '', condition: 'Used', status: 'AVAILABLE', whatsapp_number: '', images: [] };

export default function ProductForm({ initialData, onSubmit, submitLabel, isEdit = false }) {
  const [form, setForm] = useState(initialData ? {
    ...blank, ...initialData,
    price: initialData.price ?? '',
    images: (initialData.images || []).map(i => i.image_url || i),
  } : blank);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const toast = useToast();

  const set = (k) => (e) => {
    const v = e.target ? e.target.value : e;
    setForm(f => ({ ...f, [k]: v }));
    setErrors(er => ({ ...er, [k]: '' }));
  };

  const handleFileChange = (e) => {
    const files = [...e.target.files];
    const valid = files.filter(f => {
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(f.type)) {
        toast(`${f.name}: unsupported type`, 'error'); return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast(`${f.name}: exceeds 5 MB`, 'error'); return false;
      }
      return true;
    });
    setSelectedFiles(valid);
    setFilePreviews(valid.map(f => URL.createObjectURL(f)));
  };

  const removeFile = (idx) => {
    setSelectedFiles(f => f.filter((_, i) => i !== idx));
    setFilePreviews(p => p.filter((_, i) => i !== idx));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Enter a valid price > 0';
    if (!form.category.trim()) e.category = 'Category is required';
    if (!form.whatsapp_number.trim()) e.whatsapp_number = 'WhatsApp number required';
    else if (!/\d{10,}/.test(form.whatsapp_number)) e.whatsapp_number = 'Minimum 10 digits';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); toast('Please fix form errors', 'error'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('price', Number(form.price));
      fd.append('category', form.category);
      fd.append('condition', form.condition);
      fd.append('status', form.status);
      fd.append('whatsapp_number', form.whatsapp_number);
      if (form.description) fd.append('description', form.description);
      selectedFiles.forEach(f => fd.append('images', f));
      await onSubmit(fd);
    } catch (err) {
      toast(err?.message || err?.detail || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="admin-form-grid admin-form-grid-2">
        <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
          <label>Title<span className="admin-required">*</span></label>
          <input type="text" placeholder="e.g. Dell Latitude 5420 i5 8GB 256SSD" value={form.title} onChange={set('title')} className={errors.title ? 'error' : ''} />
          {errors.title && <div className="admin-field-error">{errors.title}</div>}
        </div>
        <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
          <label>Description</label>
          <textarea placeholder="Condition details, specs…" value={form.description} onChange={set('description')} />
        </div>
        <div className="admin-field">
          <label>Price (₹)<span className="admin-required">*</span></label>
          <input type="number" placeholder="e.g. 25000" value={form.price} onChange={set('price')} className={errors.price ? 'error' : ''} min="1" />
          {errors.price && <div className="admin-field-error">{errors.price}</div>}
        </div>
        <div className="admin-field">
          <label>WhatsApp Number<span className="admin-required">*</span></label>
          <input type="text" placeholder="e.g. 919876543210" value={form.whatsapp_number} onChange={set('whatsapp_number')} className={errors.whatsapp_number ? 'error' : ''} />
          {errors.whatsapp_number && <div className="admin-field-error">{errors.whatsapp_number}</div>}
        </div>
        <div className="admin-field">
          <label>Category<span className="admin-required">*</span></label>
          <select value={form.category} onChange={set('category')} className={errors.category ? 'error' : ''}>
            <option value="">Select category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <div className="admin-field-error">{errors.category}</div>}
        </div>
        <div className="admin-field">
          <label>Condition</label>
          <select value={form.condition} onChange={set('condition')}>
            {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="admin-field">
          <label>Status</label>
          <select value={form.status} onChange={set('status')}>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="SOLD">SOLD</option>
          </select>
        </div>
        <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
          <label>Images</label>
          {isEdit && form.images.length > 0 && (
            <div className="admin-upload-preview" style={{ marginBottom: 10 }}>
              {form.images.map((url, idx) => (
                <div key={idx} className="admin-preview-item">
                  <img src={url} alt={`existing-${idx}`} onError={e => { e.target.style.display = 'none'; }} />
                  <div style={{ position: 'absolute', bottom: 2, left: 2, background: 'rgba(0,0,0,0.6)', borderRadius: 3, padding: '1px 4px', fontSize: 9, color: '#aaa' }}>saved</div>
                </div>
              ))}
            </div>
          )}
          <div className="admin-uploader-zone">
            <input type="file" multiple accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
            <div style={{ fontSize: 32, marginBottom: 8 }}><Icon name="add_img" size={32} /></div>
            <p><strong>{isEdit ? 'Upload new images (replaces existing)' : 'Click to select images'}</strong></p>
            <p style={{ fontSize: 11, marginTop: 4 }}>JPG, PNG, WebP — max 5 MB each</p>
          </div>
          {filePreviews.length > 0 && (
            <div className="admin-upload-preview">
              {filePreviews.map((src, idx) => (
                <div key={idx} className="admin-preview-item">
                  <img src={src} alt={`preview-${idx}`} />
                  <button className="admin-remove-btn" onClick={() => removeFile(idx)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
        <button className="admin-btn admin-btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving…' : submitLabel}
        </button>
      </div>
    </div>
  );
}
