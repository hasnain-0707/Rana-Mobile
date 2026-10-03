import Mobile from '../models/Mobile.js';

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export async function listMobiles(req, res) {
  const filter = {};
  filter.category = req.query.category || 'mobile';
  if (req.query.brand) filter.brand = req.query.brand;
  if (req.query.featured === 'true') filter.featured = true;
  if (req.query.stock === 'true') filter.stock = true;
  if (req.query.minPrice || req.query.maxPrice) filter.price = {};
  if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
  if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
  if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };
  const sort = req.query.sort === 'price-desc' ? { price: -1 } : req.query.sort === 'price-asc' ? { price: 1 } : { createdAt: -1 };
  res.json(await Mobile.find(filter).populate('brand', 'name slug logo').sort(sort));
}

export async function getMobile(req, res) {
  const mobile = await Mobile.findOne({ slug: req.params.slug }).populate('brand', 'name slug logo');
  if (!mobile) return res.status(404).json({ message: 'Mobile not found' });
  const related = await Mobile.find({ category: mobile.category, brand: mobile.brand._id, _id: { $ne: mobile._id } }).limit(4).populate('brand', 'name slug');
  res.json({ mobile, related });
}

export async function createMobile(req, res) {
  const data = { ...req.body };
  if (typeof req.body.specifications === 'string') {
    try { data.specifications = JSON.parse(req.body.specifications); } catch (e) {}
  }
  if (typeof req.body.colors === 'string') {
    try { data.colors = JSON.parse(req.body.colors); } catch (e) {}
  }
  if (req.body.price !== undefined) data.price = Number(req.body.price);
  if (req.body.oldPrice !== undefined) data.oldPrice = req.body.oldPrice ? Number(req.body.oldPrice) : undefined;
  if (req.body.stock !== undefined) data.stock = req.body.stock === 'true' || req.body.stock === true;
  if (req.body.featured !== undefined) data.featured = req.body.featured === 'true' || req.body.featured === true;

  const category = req.body.category || 'mobile';
  data.category = category;
  data.slug = slugify(category === 'mobile' ? req.body.name : `${category}-${req.body.name}`);
  if (req.file) {
    data.image = `/uploads/${req.file.filename}`;
  } else if (req.body.removeImage === 'true' || req.body.removeImage === true) {
    data.image = '';
  } else if (req.body.image !== undefined) {
    data.image = req.body.image;
  }

  const mobile = await Mobile.create(data);
  res.status(201).json(await mobile.populate('brand', 'name slug'));
}

export async function updateMobile(req, res) {
  const data = { ...req.body };
  if (req.body.category) data.category = req.body.category;
  if (req.body.name) data.slug = slugify((req.body.category || 'mobile') === 'mobile' ? req.body.name : `${req.body.category}-${req.body.name}`);
  if (typeof req.body.specifications === 'string') {
    try { data.specifications = JSON.parse(req.body.specifications); } catch (e) {}
  }
  if (typeof req.body.colors === 'string') {
    try { data.colors = JSON.parse(req.body.colors); } catch (e) {}
  }
  if (req.body.price !== undefined) data.price = Number(req.body.price);
  if (req.body.oldPrice !== undefined) data.oldPrice = req.body.oldPrice ? Number(req.body.oldPrice) : null;
  if (req.body.stock !== undefined) data.stock = req.body.stock === 'true' || req.body.stock === true;
  if (req.body.featured !== undefined) data.featured = req.body.featured === 'true' || req.body.featured === true;

  if (req.file) {
    data.image = `/uploads/${req.file.filename}`;
  } else if (req.body.removeImage === 'true' || req.body.removeImage === true) {
    data.image = '';
  } else if (req.body.image !== undefined) {
    data.image = req.body.image;
  }

  const mobile = await Mobile.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).populate('brand', 'name slug');
  if (!mobile) return res.status(404).json({ message: 'Mobile not found' });
  res.json(mobile);
}

export async function deleteMobile(req, res) {
  const mobile = await Mobile.findByIdAndDelete(req.params.id);
  if (!mobile) return res.status(404).json({ message: 'Mobile not found' });
  res.json({ message: 'Mobile deleted' });
}
