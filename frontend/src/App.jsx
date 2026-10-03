import { useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api, { assetUrl } from './services/api';
import AdminAuth from './admin/AdminAuth.jsx';
import MobileIconBadge from './components/MobileIconBadge.jsx';

const fallbackImage = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=85';
const inventoryCategories = [
  { key: 'mobile', label: 'Mobiles', icon: 'bi-phone' },
  { key: 'lcd-display', label: 'LCD / Display', icon: 'bi-display' },
  { key: 'battery', label: 'Batteries', icon: 'bi-battery-half' },
  { key: 'charging-port', label: 'Charging Port', icon: 'bi-usb-plug' },
  { key: 'camera', label: 'Camera', icon: 'bi-camera' },
  { key: 'speaker', label: 'Speaker', icon: 'bi-volume-up' },
  { key: 'microphone', label: 'Microphone', icon: 'bi-mic' },
  { key: 'flex', label: 'Flex', icon: 'bi-bezier2' },
  { key: 'fingerprint', label: 'Fingerprint', icon: 'bi-fingerprint' },
  { key: 'vibration', label: 'Vibration', icon: 'bi-phone-vibrate' },
  { key: 'antenna', label: 'Antenna', icon: 'bi-broadcast' },
  { key: 'buttons', label: 'Buttons', icon: 'bi-toggle-on' },
  { key: 'other-parts', label: 'Other Parts', icon: 'bi-three-dots' },
  { key: 'panel', label: 'Panels', icon: 'bi-grid-3x3-gap' },
  { key: 'charger', label: 'Chargers', icon: 'bi-plug' },
  { key: 'leds', label: 'LEDs', icon: 'bi-lightbulb' },
  { key: 'charging-lead', label: 'Charging Leads', icon: 'bi-usb-plug' },
  { key: 'charging-ic', label: 'Charging IC', icon: 'bi-cpu' },
  { key: 'power-ic-pmic', label: 'Power IC / PMIC', icon: 'bi-cpu-fill' },
  { key: 'cpu-processor', label: 'CPU / Processor', icon: 'bi-memory' },
  { key: 'emmc-ufs', label: 'eMMC / UFS', icon: 'bi-device-ssd' },
  { key: 'ram', label: 'RAM', icon: 'bi-memory' },
  { key: 'audio-ic', label: 'Audio IC', icon: 'bi-soundwave' },
  { key: 'backlight-ic', label: 'Backlight IC', icon: 'bi-brightness-high' },
  { key: 'display-lcd-ic', label: 'Display / LCD IC', icon: 'bi-display' },
  { key: 'touch-ic', label: 'Touch IC', icon: 'bi-hand-index' },
  { key: 'usb-type-c-ic', label: 'USB / Type-C IC', icon: 'bi-usb-c' },
  { key: 'rf-network-ic', label: 'RF / Network IC', icon: 'bi-reception-4' },
  { key: 'wifi-bluetooth-ic', label: 'Wi-Fi / Bluetooth IC', icon: 'bi-wifi' },
  { key: 'flash-torch-ic', label: 'Flash / Torch IC', icon: 'bi-flashlight' },
  { key: 'battery-fuel-gauge-ic', label: 'Battery / Fuel Gauge IC', icon: 'bi-battery-charging' },
  { key: 'camera-ic', label: 'Camera IC', icon: 'bi-camera-reels' }
];
const categoryInfo = (key) => inventoryCategories.find((category) => category.key === key) || inventoryCategories[0];
const fallbackCategory = (mobile) => mobile.category || 'mobile';
const brandLabel = (mobile) => mobile.brand?.name || mobile.name;

function CategoryLinks({ selectedCategory, onSelectCategory }) {
  const navigate = useNavigate();

  return (
    <div className="category-link-grid home-category-grid">
      {inventoryCategories.map((category) => (
        <button
          type="button"
          aria-pressed={selectedCategory === category.key}
          className={`category-link ${selectedCategory === category.key ? 'active' : ''}`}
          key={category.key}
          onClick={() => {
            onSelectCategory(category.key);
            navigate(`/inventory/${category.key}`);
          }}
        >
          <i className={`bi ${category.icon}`} />
          <span>{category.label}</span>
          <i className="bi bi-arrow-up-right" />
        </button>
      ))}
    </div>
  );
}
function SplashScreen() { return <main className="splash-screen"><div className="splash-logo"><span className="splash-mark">RM</span><strong>RANA MOBILE</strong><small>MOBILE</small></div></main> }

function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return <><nav className="navbar navbar-expand-lg navbar-dark site-nav"><div className="container"><Link className="navbar-brand" to="/" onClick={closeMenu}><span className="brand-mark">R</span> Rana <b>Mobile</b></Link><button className="navbar-toggler" type="button" onClick={() => setMenuOpen((open) => !open)} aria-controls="nav" aria-expanded={menuOpen} aria-label="Toggle navigation"><span className="navbar-toggler-icon" /></button><div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`} id="nav"><div className="navbar-nav ms-auto align-items-lg-center gap-lg-2"><Link className="nav-link" to="/" onClick={closeMenu}>Home</Link><Link className="nav-link" to="/brands" onClick={closeMenu}>Brands</Link><Link className="nav-link" to="/mobiles" onClick={closeMenu}>Mobiles</Link><Link className="nav-link" to="/inventory/battery" onClick={closeMenu}>Batteries</Link><Link className="nav-link" to="/inventory/panel" onClick={closeMenu}>Panels</Link><Link className="nav-link" to="/contact" onClick={closeMenu}>Contact</Link><Link className="nav-link nav-admin" to="/admin" onClick={closeMenu}>Admin <i className="bi bi-arrow-up-right" /></Link></div></div></div></nav>{children}<footer className="footer"><div className="container d-flex justify-content-between flex-wrap gap-3"><div><h5>Rana Mobile Shop</h5><p>Clear information for your next smart choice.</p></div><div><small>Explore</small><div className="d-flex gap-3 mt-2"><Link to="/brands">Brands</Link><Link to="/mobiles">Mobiles</Link><Link to="/inventory/battery">Batteries</Link><Link to="/contact">Contact</Link></div></div></div><div className="container copyright"><span>© {new Date().getFullYear()} Rana Mobile Shop. Built for better choices.</span><span className="developer-credit">Website designed and developed by <strong>Hasnain</strong>.</span></div></footer></>;
}
function Loading() { return <div className="text-center py-5"><div className="spinner-border text-primary" /></div> }
function Empty({ text }) { return <div className="empty-state"><i className="bi bi-box-seam" /><h4>{text}</h4><p>Try adjusting your search or check back soon.</p></div> }
function BrandCard({ brand }) { return <Link className="brand-card" to={`/brands/${brand.slug}`}><div className="logo-tile">{brand.logo ? <img src={assetUrl(brand.logo)} alt="" /> : <span>{brand.name?.slice(0, 1)}</span>}</div><div><h5>{brand.name}</h5><p>{brand.modelCount || 0} models <i className="bi bi-arrow-up-right" /></p></div></Link> }
function MobileCard({ mobile }) { return <Link className="mobile-card" to={`/mobiles/${mobile.slug}`}><div className="mobile-image">{mobile.featured && <span className="badge-sale">Featured</span>}<strong className="image-name-fallback">{mobile.name}</strong>{mobile.image ? <img src={assetUrl(mobile.image)} alt={mobile.name} /> : <MobileIconBadge brandName={brandLabel(mobile)} category={fallbackCategory(mobile)} size="md" className="product-fallback-icon" />}</div><div className="mobile-card-details"><small className="eyebrow">{mobile.brand?.name}</small><h5>{mobile.name}</h5><div className="d-flex justify-content-between align-items-center"><strong>Rs. {Number(mobile.price).toLocaleString()}</strong>{mobile.stock ? <span className="stock">In stock</span> : <span className="out-stock">Out of stock</span>}</div></div></Link> }
function Home() {
  const [brands, setBrands] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('mobile');
  const selectedCategoryInfo = categoryInfo(selectedCategory);

  useEffect(() => {
    Promise.all([
      api.get('/brands'),
      api.get('/mobiles?featured=true'),
      api.get(`/mobiles?category=${selectedCategory}`)
    ]).then(([b, f, l]) => {
      setBrands(b.data.slice(0, 6));
      setFeatured(f.data.slice(0, 4));
      setLatest(l.data.slice(0, 8));
    }).catch(console.error);
  }, [selectedCategory]);

  return <Layout>
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <div className="eyebrow light">THE SMARTER WAY TO SHOP</div>
          <h1>Find your<br /><em>perfect mobile.</em></h1>
          <p>Compare the latest smartphones from trusted brands with the details you need to choose confidently.</p>
          <div className="d-flex gap-3 flex-wrap">
            <Link className="btn btn-light btn-lg" to="/mobiles">Explore mobiles <i className="bi bi-arrow-up-right" /></Link>
            <Link className="btn btn-outline-light btn-lg" to="/brands">View brands</Link>
          </div>
        </div>
        <div className="hero-stat"><span>Curated for you</span><strong>01</strong><small>Explore. Compare.<br />Choose better.</small></div>
      </div>
    </section>
    <main className="container py-5">
      <CategoryLinks selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      <div className="section-heading">
        <div>
          <div className="eyebrow">Latest arrivals</div>
          <h2>{selectedCategoryInfo.label}</h2>
        </div>
        <Link to={`/inventory/${selectedCategoryInfo.key}`}>View all {selectedCategoryInfo.label.toLowerCase()} <i className="bi bi-arrow-up-right" /></Link>
      </div>
      <div className="mobile-grid">{latest.length ? latest.map((mobile) => <MobileCard key={mobile._id} mobile={mobile} />) : <Empty text={`No ${selectedCategoryInfo.label.toLowerCase()} found.`} />}</div>

      <SectionHeading eyebrow="Editor’s picks" title="Worth a closer look" link="/mobiles?featured=true" text="See all picks" />
      <div className="mobile-grid">{featured.length ? featured.map((mobile) => <MobileCard key={mobile._id} mobile={mobile} />) : <Empty text="Featured mobiles are coming soon." />}</div>
      <section className="why-section"><div><div className="eyebrow">WHY RANA MOBILE</div><h2>Less guesswork.<br /><em>More confidence.</em></h2></div><div className="why-grid">{[['bi-stars','Curated selection','The models people are actually looking for.'],['bi-search','Useful details','Specs that make comparing simple.'],['bi-shield-check','Trust the choice','Clear, current information at a glance.']].map(([icon,title,copy]) => <div className="why-item" key={title}><i className={`bi ${icon}`} /><h5>{title}</h5><p>{copy}</p></div>)}</div></section>
    </main>
  </Layout>
}
function SectionHeading({ eyebrow, title, link, text }) {
  return <div className="section-heading"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2></div>{link && <Link to={link}>{text} <i className="bi bi-arrow-up-right" /></Link>}</div>
}
function Brands() { const [brands, setBrands] = useState([]); const [search, setSearch] = useState(''); useEffect(() => { api.get(`/brands${search ? `?search=${encodeURIComponent(search)}` : ''}`).then((r) => setBrands(r.data)); }, [search]); return <Layout><main className="container page-space"><SectionHeading eyebrow="The collection" title="Shop by brand" /><div className="search-box mb-4"><i className="bi bi-search" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search brands" /></div><div className="brand-grid">{brands.length ? brands.map((brand) => <BrandCard key={brand._id} brand={brand} />) : <Empty text="No brands found." />}</div></main></Layout> }
function Mobiles() { const [mobiles, setMobiles] = useState([]); const [searchParams, setSearchParams] = useSearchParams(); const search = searchParams.get('search') || ''; useEffect(() => { const params = new URLSearchParams(searchParams); params.set('category', 'mobile'); api.get(`/mobiles?${params.toString()}`).then((r) => setMobiles(r.data)).catch(console.error); }, [searchParams]); return <Layout><main className="container page-space"><SectionHeading eyebrow="The collection" title="Find your next mobile" /><div className="toolbar"><div className="search-box"><i className="bi bi-search" /><input value={search} onChange={(e) => setSearchParams({ search: e.target.value })} placeholder="Search models" /></div><select value={searchParams.get('sort') || ''} onChange={(e) => { const next = new URLSearchParams(searchParams); e.target.value ? next.set('sort', e.target.value) : next.delete('sort'); setSearchParams(next); }}><option value="">Recently added</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select></div><div className="mobile-grid">{mobiles.length ? mobiles.map((mobile) => <MobileCard key={mobile._id} mobile={mobile} />) : <Empty text="No mobile models found." />}</div></main></Layout> }
function InventoryPage() {
  const { category: requestedCategory } = useParams();
  const category = categoryInfo(requestedCategory);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .get(`/mobiles?category=${category.key}&stock=true`)
      .then((response) => setItems(response.data))
      .catch(console.error);
  }, [category.key]);

  const filteredItems = items.filter((item) => {
    const term = search.toLowerCase();
    return !term || item.name.toLowerCase().includes(term) || item.brand?.name?.toLowerCase().includes(term);
  });

  const groupedByBrand = filteredItems.reduce((groups, item) => {
    const brandName = item.brand?.name || 'Other';
    if (!groups[brandName]) groups[brandName] = [];
    groups[brandName].push(item);
    return groups;
  }, {});

  return (
    <Layout>
      <main className="container page-space">
        <SectionHeading eyebrow="Inventory section" title={category.label} />
        <div className="search-box mb-4">
          <i className="bi bi-search" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${category.label.toLowerCase()}`}
          />
        </div>

        {Object.keys(groupedByBrand).length ? (
          <div className="brand-section-list">
            {Object.entries(groupedByBrand).map(([brandName, brandItems]) => (
              <section key={brandName} className="brand-section-panel mb-5">
                <div className="section-heading brand-section-heading">
                  <div>
                    <div className="eyebrow">Brand</div>
                    <h3>{brandName}</h3>
                  </div>
                </div>

                <div className="mobile-grid">
                  {brandItems.map((item) => (
                    <MobileCard key={item._id} mobile={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <Empty text={`No stock available in ${category.label.toLowerCase()} right now.`} />
        )}
      </main>
    </Layout>
  );
}
function BrandDetails() { const { slug } = useParams(); const [data, setData] = useState(null); useEffect(() => { api.get(`/brands/${slug}`).then((r) => setData(r.data)).catch(console.error); }, [slug]); if (!data) return <Layout><Loading /></Layout>; return <Layout><main className="container page-space"><Link className="back-link" to="/brands"><i className="bi bi-arrow-left" /> All brands</Link><div className="brand-hero"><div className="logo-tile large">{data.brand.logo ? <img src={assetUrl(data.brand.logo)} alt="" /> : <span>{data.brand.name[0]}</span>}</div><div><div className="eyebrow">Brand collection</div><h1>{data.brand.name}</h1><p>{data.brand.description || `Explore the latest ${data.brand.name} models and compare the details that matter.`}</p><small>{data.mobiles.length} models listed</small></div></div><div className="mobile-grid">{data.mobiles.length ? data.mobiles.map((mobile) => <MobileCard key={mobile._id} mobile={mobile} />) : <Empty text="No mobile models found for this brand." />}</div></main></Layout> }
function MobileDetails() { const { slug } = useParams(); const [data, setData] = useState(null); useEffect(() => { api.get(`/mobiles/${slug}`).then((r) => setData(r.data)).catch(console.error); }, [slug]); if (!data) return <Layout><Loading /></Layout>; const { mobile } = data; return <Layout><main className="container page-space"><Link className="back-link" to={`/brands/${mobile.brand.slug}`}><i className="bi bi-arrow-left" /> Back to {mobile.brand.name}</Link><div className="product-detail"><div className="product-photo">{mobile.image ? <img src={assetUrl(mobile.image)} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackImage; }} alt={mobile.name} /> : <MobileIconBadge brandName={brandLabel(mobile)} category={fallbackCategory(mobile)} size="lg" className="product-fallback-icon" />}</div><div className="product-info"><div className="eyebrow">{mobile.brand.name}</div><h1>{mobile.name}</h1><p className="product-description">{mobile.description || 'A closer look at the features and details of this mobile.'}</p><div className="price-line"><strong>Rs. {Number(mobile.price).toLocaleString()}</strong>{mobile.oldPrice && <del>Rs. {Number(mobile.oldPrice).toLocaleString()}</del>}</div><p className={mobile.stock ? 'stock' : 'out-stock'}><i className="bi bi-circle-fill" /> {mobile.stock ? 'In stock' : 'Currently unavailable'}</p><div className="d-flex gap-2 mt-4"><a className="btn btn-primary" href="https://wa.me/923000000000?text=I%20am%20interested%20in%20${encodeURIComponent(mobile.name)}"><i className="bi bi-whatsapp" /> WhatsApp inquiry</a><Link className="btn btn-outline-dark" to="/contact">Contact shop</Link></div></div></div><section className="specs-section"><div className="eyebrow">The details</div><h2>Specifications</h2><div className="spec-table">{Object.entries(mobile.specifications || {}).filter(([, value]) => value).map(([key, value]) => <div key={key}><span>{key.replace(/([A-Z])/g, ' $1')}</span><strong>{value}</strong></div>)}</div>{mobile.colors?.length > 0 && <p className="colors"><b>Available colors:</b> {mobile.colors.join(' · ')}</p>}</section></main></Layout> }
function Contact() { return <Layout><main className="container page-space narrow"><div className="eyebrow">We’re here to help</div><h1>Talk to the shop.</h1><p className="lead">Have a question about a model, availability, or what to choose? Reach out and we’ll help you find the right fit.</p><div className="contact-list"><a href="https://wa.me/923000000000"><i className="bi bi-whatsapp" /><span><small>WhatsApp</small><b>+92 300 0000000</b></span><i className="bi bi-arrow-up-right" /></a><a href="mailto:hello@ranamobile.com"><i className="bi bi-envelope" /><span><small>Email</small><b>hello@ranamobile.com</b></span><i className="bi bi-arrow-up-right" /></a></div></main></Layout> }
export default function App() { const [showSplash, setShowSplash] = useState(true); useEffect(() => { const timer = window.setTimeout(() => setShowSplash(false), 3000); return () => window.clearTimeout(timer); }, []); if (showSplash) return <SplashScreen />; return <Routes><Route path="/" element={<Home />} /><Route path="/brands" element={<Brands />} /><Route path="/brands/:slug" element={<BrandDetails />} /><Route path="/mobiles" element={<Mobiles />} /><Route path="/inventory/:category" element={<InventoryPage />} /><Route path="/mobiles/:slug" element={<MobileDetails />} /><Route path="/contact" element={<Contact />} /><Route path="/admin" element={<AdminAuth />} /><Route path="/admin/*" element={<AdminAuth />} /><Route path="*" element={<Layout><div className="container page-space"><h1>Page not found.</h1><Link to="/">Return home</Link></div></Layout>} /></Routes> }
