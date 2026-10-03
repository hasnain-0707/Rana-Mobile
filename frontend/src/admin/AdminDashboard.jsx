import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api, { assetUrl } from '../services/api';

const inventoryCategories = [
  { key: 'mobile', label: 'Mobiles', itemLabel: 'Mobile', icon: 'bi-phone' },
  { key: 'lcd-display', label: 'LCD / Display', itemLabel: 'LCD / Display', icon: 'bi-display' },
  { key: 'battery', label: 'Batteries', itemLabel: 'Battery', icon: 'bi-battery-half' },
  { key: 'charging-port', label: 'Charging Port', itemLabel: 'Charging Port', icon: 'bi-usb-plug' },
  { key: 'camera', label: 'Camera', itemLabel: 'Camera', icon: 'bi-camera' },
  { key: 'speaker', label: 'Speaker', itemLabel: 'Speaker', icon: 'bi-volume-up' },
  { key: 'microphone', label: 'Microphone', itemLabel: 'Microphone', icon: 'bi-mic' },
  { key: 'flex', label: 'Flex', itemLabel: 'Flex', icon: 'bi-bezier2' },
  { key: 'fingerprint', label: 'Fingerprint', itemLabel: 'Fingerprint', icon: 'bi-fingerprint' },
  { key: 'vibration', label: 'Vibration', itemLabel: 'Vibration', icon: 'bi-phone-vibrate' },
  { key: 'antenna', label: 'Antenna', itemLabel: 'Antenna', icon: 'bi-broadcast' },
  { key: 'buttons', label: 'Buttons', itemLabel: 'Buttons', icon: 'bi-toggle-on' },
  { key: 'other-parts', label: 'Other Parts', itemLabel: 'Other Part', icon: 'bi-three-dots' },
  { key: 'panel', label: 'Panels', itemLabel: 'Panel', icon: 'bi-grid-3x3-gap' },
  { key: 'charger', label: 'Chargers', itemLabel: 'Charger', icon: 'bi-plug' },
  { key: 'leds', label: 'LEDs', itemLabel: 'LED', icon: 'bi-lightbulb' },
  { key: 'charging-lead', label: 'Charging Leads', itemLabel: 'Charging Lead', icon: 'bi-usb-plug' },
  { key: 'charging-ic', label: 'Charging IC', itemLabel: 'Charging IC', icon: 'bi-cpu' },
  { key: 'power-ic-pmic', label: 'Power IC / PMIC', itemLabel: 'Power IC / PMIC', icon: 'bi-cpu-fill' },
  { key: 'cpu-processor', label: 'CPU / Processor', itemLabel: 'CPU / Processor', icon: 'bi-memory' },
  { key: 'emmc-ufs', label: 'eMMC / UFS', itemLabel: 'eMMC / UFS', icon: 'bi-device-ssd' },
  { key: 'ram', label: 'RAM', itemLabel: 'RAM', icon: 'bi-memory' },
  { key: 'audio-ic', label: 'Audio IC', itemLabel: 'Audio IC', icon: 'bi-soundwave' },
  { key: 'backlight-ic', label: 'Backlight IC', itemLabel: 'Backlight IC', icon: 'bi-brightness-high' },
  { key: 'display-lcd-ic', label: 'Display / LCD IC', itemLabel: 'Display / LCD IC', icon: 'bi-display' },
  { key: 'touch-ic', label: 'Touch IC', itemLabel: 'Touch IC', icon: 'bi-hand-index' },
  { key: 'usb-type-c-ic', label: 'USB / Type-C IC', itemLabel: 'USB / Type-C IC', icon: 'bi-usb-c' },
  { key: 'rf-network-ic', label: 'RF / Network IC', itemLabel: 'RF / Network IC', icon: 'bi-reception-4' },
  { key: 'wifi-bluetooth-ic', label: 'Wi-Fi / Bluetooth IC', itemLabel: 'Wi-Fi / Bluetooth IC', icon: 'bi-wifi' },
  { key: 'flash-torch-ic', label: 'Flash / Torch IC', itemLabel: 'Flash / Torch IC', icon: 'bi-flashlight' },
  { key: 'battery-fuel-gauge-ic', label: 'Battery / Fuel Gauge IC', itemLabel: 'Battery / Fuel Gauge IC', icon: 'bi-battery-charging' },
  { key: 'camera-ic', label: 'Camera IC', itemLabel: 'Camera IC', icon: 'bi-camera-reels' }
];

export default function AdminDashboard({ onLogout }) {
  const [brands, setBrands] = useState([]);
  const [mobiles, setMobiles] = useState([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [activeCategory, setActiveCategory] = useState('mobile');

  // Add Brand state
  const [brandName, setBrandName] = useState('');

  // Add Mobile state
  const [mobileName, setMobileName] = useState('');
  const [mobileBrand, setMobileBrand] = useState('');
  const [mobilePrice, setMobilePrice] = useState('');
  const [mobileOldPrice, setMobileOldPrice] = useState('');
  const [mobileDescription, setMobileDescription] = useState('');
  
  // Picture choice state: 'upload' | 'none' | 'url'
  const [imageOption, setImageOption] = useState('upload');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Specs state
  const [showMoreSpecs, setShowMoreSpecs] = useState(false);
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [battery, setBattery] = useState('');
  const [camera, setCamera] = useState('');

  // Edit Mobile modal state
  const [editingMobile, setEditingMobile] = useState(null);
  const [editName, setEditName] = useState('');
  const [editMobileBrand, setEditMobileBrand] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editOldPrice, setEditOldPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStock, setEditStock] = useState(true);
  const [editFeatured, setEditFeatured] = useState(false);
  const [editCategory, setEditCategory] = useState('mobile');

  // Edit Picture choice: 'keep' | 'upload' | 'none' | 'url'
  const [editImageOption, setEditImageOption] = useState('keep');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editImagePreview, setEditImagePreview] = useState('');

  const addFileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const load = async () => {
    const [brandResponse, mobileResponse] = await Promise.all([api.get('/brands'), api.get('/mobiles')]);
    setBrands(brandResponse.data);
    setMobiles(mobileResponse.data);
  };

  useEffect(() => {
    load().catch(() => setMessage('Could not load catalog'));
  }, []);

  const notify = (text) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 3000);
  };

  const activeCategoryInfo = inventoryCategories.find(({ key }) => key === activeCategory) || inventoryCategories[0];
  const categoryMobiles = mobiles.filter((item) => (item.category || 'mobile') === activeCategory);

  const selectCategory = (category) => {
    setActiveCategory(category);
    setMobileName('');
    setMobileBrand('');
    setMobilePrice('');
    setMobileOldPrice('');
    setMobileDescription('');
    setImageFile(null);
    setImageUrl('');
    setImagePreview('');
    setRam('');
    setStorage('');
    setBattery('');
    setCamera('');
    setShowMoreSpecs(false);
    if (addFileInputRef.current) addFileInputRef.current.value = '';
  };

  // Handle Add Mobile File Selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle Edit Mobile File Selection
  const handleEditFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  const addBrand = async (event) => {
    event.preventDefault();
    if (!brandName.trim()) return;
    try {
      await api.post('/brands', { name: brandName.trim() });
      setBrandName('');
      await load();
      notify('Brand added successfully');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to add brand');
    }
  };

  const addMobile = async (event) => {
    event.preventDefault();
    if (!mobileName.trim() || !mobileBrand || !mobilePrice) {
      notify('Please fill in Model Name, Brand, and Price');
      return;
    }

    setBusy(true);
    try {
      const formData = new FormData();
      formData.append('category', activeCategory);
      formData.append('name', mobileName.trim());
      formData.append('brand', mobileBrand);
      formData.append('price', mobilePrice);
      if (mobileOldPrice) formData.append('oldPrice', mobileOldPrice);
      if (mobileDescription) formData.append('description', mobileDescription);

      const specs = {};
      if (ram) specs.ram = ram;
      if (storage) specs.storage = storage;
      if (battery) specs.battery = battery;
      if (camera) specs.camera = camera;
      if (Object.keys(specs).length > 0) {
        formData.append('specifications', JSON.stringify(specs));
      }

      // Picture Option Handling
      if (imageOption === 'upload' && imageFile) {
        formData.append('image', imageFile);
      } else if (imageOption === 'url' && imageUrl.trim()) {
        formData.append('image', imageUrl.trim());
      } else if (imageOption === 'none') {
        formData.append('image', '');
      }

      await api.post('/mobiles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Reset form
      setMobileName('');
      setMobileBrand('');
      setMobilePrice('');
      setMobileOldPrice('');
      setMobileDescription('');
      setImageOption('upload');
      setImageFile(null);
      setImageUrl('');
      setImagePreview('');
      setRam('');
      setStorage('');
      setBattery('');
      setCamera('');
      if (addFileInputRef.current) addFileInputRef.current.value = '';

      await load();
      notify('Mobile model added successfully');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to add mobile');
    } finally {
      setBusy(false);
    }
  };

  const openEditModal = (mobile) => {
    setEditingMobile(mobile);
    setEditName(mobile.name || '');
    setEditCategory(mobile.category || 'mobile');
    setEditMobileBrand(mobile.brand?._id || mobile.brand || '');
    setEditPrice(mobile.price || '');
    setEditOldPrice(mobile.oldPrice || '');
    setEditDescription(mobile.description || '');
    setEditStock(mobile.stock !== false);
    setEditFeatured(!!mobile.featured);

    setEditImageOption('keep');
    setEditImageFile(null);
    setEditImageUrl('');
    setEditImagePreview(mobile.image ? assetUrl(mobile.image) : '');
  };

  const saveEditMobile = async (e) => {
    e.preventDefault();
    if (!editingMobile) return;

    setBusy(true);
    try {
      const formData = new FormData();
      formData.append('category', editCategory);
      formData.append('name', editName.trim());
      formData.append('brand', editMobileBrand);
      formData.append('price', editPrice);
      formData.append('oldPrice', editOldPrice || '');
      formData.append('description', editDescription);
      formData.append('stock', editStock);
      formData.append('featured', editFeatured);

      // Handle Picture Option in Edit Mode
      if (editImageOption === 'upload' && editImageFile) {
        formData.append('image', editImageFile);
      } else if (editImageOption === 'url' && editImageUrl.trim()) {
        formData.append('image', editImageUrl.trim());
      } else if (editImageOption === 'none') {
        formData.append('removeImage', 'true');
      }

      await api.put(`/mobiles/${editingMobile._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setEditingMobile(null);
      await load();
      notify('Mobile model updated successfully');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to update mobile');
    } finally {
      setBusy(false);
    }
  };

  const editBrandAction = async (brand) => {
    const name = window.prompt('Brand name', brand.name);
    if (name && name !== brand.name) {
      await api.put(`/brands/${brand._id}`, { name });
      await load();
      notify('Brand updated');
    }
  };

  const remove = async (type, item) => {
    if (!window.confirm(`Delete ${item.name}? This cannot be undone.`)) return;
    await api.delete(`/${type}/${item._id}`);
    await load();
    notify(`${type === 'brands' ? 'Brand' : 'Mobile'} deleted`);
  };

  const toggleStock = async (mobile) => {
    await api.put(`/mobiles/${mobile._id}`, { stock: !mobile.stock });
    await load();
  };

  return (
    <main className="admin-shell">
      {/* Top Navbar */}
      <div className="admin-top">
        <Link className="navbar-brand" to="/">
          <span className="brand-mark brand-logo">RM</span> Rana <b>Mobile</b>
        </Link>
        <button className="btn btn-sm btn-outline-dark" onClick={onLogout}>
          Log out <i className="bi bi-box-arrow-right ms-1" />
        </button>
      </div>

      <div className="container py-5">
        <div className="eyebrow">Catalog Control Center</div>
        <h1>Good morning, Admin.</h1>

        {message && <div className="alert alert-success shadow-sm">{message}</div>}

        {/* Dashboard Stats */}
        <div className="stats-row">
          <div><span>Total Brands</span><strong>{brands.length}</strong></div>
          <div><span>Total Inventory</span><strong>{mobiles.length}</strong></div>
          <div><span>In Stock</span><strong>{mobiles.filter((m) => m.stock).length}</strong></div>
        </div>

        <div className="inventory-tabs" role="tablist" aria-label="Inventory categories">
          {inventoryCategories.map((category) => (
            <button
              key={category.key}
              type="button"
              className={`inventory-tab ${activeCategory === category.key ? 'active' : ''}`}
              onClick={() => selectCategory(category.key)}
            >
              <i className={`bi ${category.icon}`} />
              <span>{category.label}</span>
              <small>{mobiles.filter((item) => (item.category || 'mobile') === category.key).length}</small>
            </button>
          ))}
        </div>

        <div className="admin-grid">
          <section className="admin-panel">
            <h3>Add a Brand</h3>
            <form onSubmit={addBrand} className="d-flex gap-2 mb-4">
              <input
                className="form-control"
                placeholder="e.g. Samsung, Vivo, iPhone"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                required
              />
              <button className="btn btn-primary px-4">Add</button>
            </form>

            <h3>Brand List ({brands.length})</h3>
            <div className="admin-list">
              {brands.map((brand) => (
                <div key={brand._id}>
                  <span>
                    <strong>{brand.name}</strong>
                    <small>{brand.modelCount || 0} models</small>
                  </span>
                  <span className="d-flex gap-2">
                    <button className="btn btn-sm btn-link" onClick={() => editBrandAction(brand)}>Edit</button>
                    <button className="btn btn-sm btn-link text-danger" onClick={() => remove('brands', brand)}>Delete</button>
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Add Mobile with Picture Options */}
          <section className="admin-panel">
            <h3>Add {activeCategoryInfo.itemLabel}</h3>
            <form onSubmit={addMobile} className="vstack gap-3">
              <div>
                <label className="form-label font-weight-semibold">Model Name *</label>
                <input
                  className="form-control"
                  placeholder={activeCategory === 'mobile' ? 'e.g. Vivo V30' : `e.g. ${activeCategoryInfo.itemLabel} Model`}
                  value={mobileName}
                  onChange={(e) => setMobileName(e.target.value)}
                  required
                />
              </div>

              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label font-weight-semibold">Brand *</label>
                  <select
                    className="form-select"
                    value={mobileBrand}
                    onChange={(e) => setMobileBrand(e.target.value)}
                    required
                  >
                    <option value="">Choose brand</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand._id}>{brand.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label font-weight-semibold">Price (Rs.) *</label>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    placeholder="e.g. 150000"
                    value={mobilePrice}
                    onChange={(e) => setMobilePrice(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Picture Options Choice (Upload Pick vs No Pick vs URL) */}
              <div className="picture-selection-box p-3 bg-light rounded-3 border">
                  <label className="form-label fw-bold d-block mb-2">
                  <i className={`bi ${activeCategoryInfo.icon} text-primary me-1`} /> {activeCategoryInfo.itemLabel} Picture Option
                </label>
                <div className="d-flex gap-3 mb-3 flex-wrap">
                  <label className={`btn btn-sm flex-fill ${imageOption === 'upload' ? 'btn-primary' : 'btn-outline-secondary'}`}>
                    <input
                      type="radio"
                      name="imageOption"
                      value="upload"
                      checked={imageOption === 'upload'}
                      onChange={() => setImageOption('upload')}
                      className="d-none"
                    />
                    <i className="bi bi-upload me-1" /> Upload Picture File
                  </label>

                  <label className={`btn btn-sm flex-fill ${imageOption === 'none' ? 'btn-dark' : 'btn-outline-secondary'}`}>
                    <input
                      type="radio"
                      name="imageOption"
                      value="none"
                      checked={imageOption === 'none'}
                      onChange={() => setImageOption('none')}
                      className="d-none"
                    />
                    <i className="bi bi-slash-circle me-1" /> No Picture (Skip)
                  </label>

                  <label className={`btn btn-sm flex-fill ${imageOption === 'url' ? 'btn-info text-white' : 'btn-outline-secondary'}`}>
                    <input
                      type="radio"
                      name="imageOption"
                      value="url"
                      checked={imageOption === 'url'}
                      onChange={() => setImageOption('url')}
                      className="d-none"
                    />
                    <i className="bi bi-link-45deg me-1" /> Image Web URL
                  </label>
                </div>

                {/* Option 1: File Input */}
                {imageOption === 'upload' && (
                  <div className="upload-section">
                    <input
                      ref={addFileInputRef}
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleFileChange}
                    />
                    {imagePreview && (
                      <div className="mt-2 text-center">
                        <img src={imagePreview} alt="Preview" className="img-thumbnail" style={{ maxHeight: '120px', objectFit: 'contain' }} />
                        <small className="d-block text-muted mt-1">Selected Photo Preview</small>
                      </div>
                    )}
                  </div>
                )}

                {/* Option 2: No Picture selected */}
                {imageOption === 'none' && (
                    <div className="alert alert-secondary py-2 mb-0 small text-center">
                    <i className="bi bi-info-circle me-1" /> No picture will be uploaded. A category icon will be shown.
                  </div>
                )}

                {/* Option 3: Image URL */}
                {imageOption === 'url' && (
                  <div className="url-section">
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://images.example.com/mobile.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                    {imageUrl && (
                      <div className="mt-2 text-center">
                        <img src={imageUrl} alt="Preview" className="img-thumbnail" style={{ maxHeight: '120px', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Optional Details Accordion */}
              <div>
                <button
                  type="button"
                  className="btn btn-sm btn-link p-0 text-decoration-none"
                  onClick={() => setShowMoreSpecs(!showMoreSpecs)}
                >
                  {showMoreSpecs ? '− Hide Specs & Description' : '+ Add Optional Specs (RAM, Storage, Battery)'}
                </button>

                {showMoreSpecs && (
                  <div className="vstack gap-2 mt-2 p-3 bg-light border rounded">
                    <div className="row g-2">
                      <div className="col-6">
                        <input className="form-control form-control-sm" placeholder="RAM (e.g. 8GB)" value={ram} onChange={(e) => setRam(e.target.value)} />
                      </div>
                      <div className="col-6">
                        <input className="form-control form-control-sm" placeholder="Storage (e.g. 256GB)" value={storage} onChange={(e) => setStorage(e.target.value)} />
                      </div>
                    </div>
                    <div className="row g-2">
                      <div className="col-6">
                        <input className="form-control form-control-sm" placeholder="Battery (e.g. 5000mAh)" value={battery} onChange={(e) => setBattery(e.target.value)} />
                      </div>
                      <div className="col-6">
                        <input className="form-control form-control-sm" placeholder="Camera (e.g. 50MP)" value={camera} onChange={(e) => setCamera(e.target.value)} />
                      </div>
                    </div>
                    <input className="form-control form-control-sm" placeholder="Old Original Price (Optional)" value={mobileOldPrice} onChange={(e) => setMobileOldPrice(e.target.value)} />
                    <textarea className="form-control form-control-sm" rows="2" placeholder="Description" value={mobileDescription} onChange={(e) => setMobileDescription(e.target.value)} />
                  </div>
                )}
              </div>

              <button className="btn btn-primary w-100 py-2 fw-bold" disabled={busy}>
                {busy ? 'Adding...' : `+ Add ${activeCategoryInfo.itemLabel}`}
              </button>
            </form>

            {/* List of Mobile Models with Edit & Delete */}
            <h3 className="mt-5">{activeCategoryInfo.label} ({categoryMobiles.length})</h3>
            <div className="admin-list">
              {categoryMobiles.map((mobile) => (
                <div key={mobile._id} className="align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    {mobile.image ? (
                      <img src={assetUrl(mobile.image)} alt={mobile.name} style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '6px', background: '#f1f5f9' }} />
                    ) : (
                      <div style={{ width: '110px', minHeight: '40px', padding: '6px 8px', display: 'grid', placeItems: 'center', background: '#e2e8f0', borderRadius: '6px', color: '#0f172a', textAlign: 'center', fontWeight: 700, fontSize: '0.75rem', lineHeight: 1.1 }}>
                        {mobile.name}
                      </div>
                    )}
                    <div>
                      <strong>{mobile.name}</strong>
                      <small>{mobile.brand?.name} · Rs. {Number(mobile.price).toLocaleString()}</small>
                    </div>
                  </div>

                  <span className="d-flex gap-2 align-items-center">
                    <button className="btn btn-sm btn-link" onClick={() => toggleStock(mobile)}>
                      {mobile.stock ? <span className="badge bg-success">In Stock</span> : <span className="badge bg-secondary">Out</span>}
                    </button>
                    <button className="btn btn-sm btn-outline-primary py-1 px-2" onClick={() => openEditModal(mobile)}>
                      <i className="bi bi-pencil me-1" /> Edit
                    </button>
                    <button className="btn btn-sm btn-link text-danger" onClick={() => remove('mobiles', mobile)}>
                      <i className="bi bi-trash" />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Edit Mobile Modal */}
      {editingMobile && (
        <div className="modal-backdrop-custom d-flex align-items-center justify-content-center">
          <div className="modal-card-custom bg-white p-4 rounded-4 shadow-lg" style={{ maxWidth: '560px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
              <h4 className="mb-0 fw-bold">Edit Mobile Model</h4>
              <button type="button" className="btn-close" onClick={() => setEditingMobile(null)} />
            </div>

            <form onSubmit={saveEditMobile} className="vstack gap-3">
              <div>
                <label className="form-label font-weight-semibold">Model Name</label>
                <input className="form-control" value={editName} onChange={(e) => setEditName(e.target.value)} required />
              </div>

              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label font-weight-semibold">Inventory section</label>
                  <select className="form-select" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} required>
                    {inventoryCategories.map((category) => (
                      <option key={category.key} value={category.key}>{category.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label font-weight-semibold">Brand</label>
                  <select className="form-select" value={editMobileBrand} onChange={(e) => setEditMobileBrand(e.target.value)} required>
                    {brands.map((b) => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label font-weight-semibold">Price (Rs.)</label>
                  <input className="form-control" type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} required />
                </div>
              </div>

              {/* Edit Picture Options */}
              <div className="picture-selection-box p-3 bg-light rounded-3 border">
                <label className="form-label fw-bold d-block mb-2">
                  <i className="bi bi-image text-primary me-1" /> Change Mobile Picture
                </label>

                <div className="d-flex gap-2 mb-3 flex-wrap">
                  <button
                    type="button"
                    className={`btn btn-sm ${editImageOption === 'keep' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                    onClick={() => setEditImageOption('keep')}
                  >
                    Keep Current Picture
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm ${editImageOption === 'upload' ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setEditImageOption('upload')}
                  >
                    <i className="bi bi-upload me-1" /> Upload New Picture
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm ${editImageOption === 'none' ? 'btn-danger' : 'btn-outline-secondary'}`}
                    onClick={() => setEditImageOption('none')}
                  >
                    <i className="bi bi-trash me-1" /> Remove Picture
                  </button>

                  <button
                    type="button"
                    className={`btn btn-sm ${editImageOption === 'url' ? 'btn-info text-white' : 'btn-outline-secondary'}`}
                    onClick={() => setEditImageOption('url')}
                  >
                    <i className="bi bi-link-45deg me-1" /> Image URL
                  </button>
                </div>

                {editImageOption === 'keep' && (
                  <div className="text-center py-2">
                    {editingMobile.image ? (
                      <img src={assetUrl(editingMobile.image)} alt="Current" className="img-thumbnail" style={{ maxHeight: '100px', objectFit: 'contain' }} />
                    ) : (
                      <small className="text-muted">No picture set currently.</small>
                    )}
                  </div>
                )}

                {editImageOption === 'upload' && (
                  <div>
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleEditFileChange}
                    />
                    {editImagePreview && (
                      <div className="mt-2 text-center">
                        <img src={editImagePreview} alt="Preview" className="img-thumbnail" style={{ maxHeight: '100px', objectFit: 'contain' }} />
                      </div>
                    )}
                  </div>
                )}

                {editImageOption === 'none' && (
                  <div className="alert alert-warning py-2 mb-0 small text-center">
                    Picture will be removed and cleared for this mobile model.
                  </div>
                )}

                {editImageOption === 'url' && (
                  <div>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://images.example.com/mobile.jpg"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label">Old Price (Optional)</label>
                  <input className="form-control" value={editOldPrice} onChange={(e) => setEditOldPrice(e.target.value)} placeholder="Original Price" />
                </div>
                <div className="col-6 d-flex align-items-end gap-3 pb-1">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="stockCheck" checked={editStock} onChange={(e) => setEditStock(e.target.checked)} />
                    <label className="form-check-label" htmlFor="stockCheck">In Stock</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="featuredCheck" checked={editFeatured} onChange={(e) => setEditFeatured(e.target.checked)} />
                    <label className="form-check-label" htmlFor="featuredCheck">Featured</label>
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="2" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              </div>

              <div className="d-flex gap-2 mt-3">
                <button type="button" className="btn btn-outline-secondary w-50" onClick={() => setEditingMobile(null)}>Cancel</button>
                <button className="btn btn-primary w-50" disabled={busy}>{busy ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
