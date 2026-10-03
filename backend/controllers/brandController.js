import Brand from '../models/Brand.js';
import Mobile from '../models/Mobile.js';

const slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export async function listBrands(req, res) {
  const query = req.query.search ? { name: { $regex: req.query.search, $options: 'i' } } : {};
  const brands = await Brand.find(query).sort({ name: 1 }).lean();
  const counts = await Mobile.aggregate([{ $group: { _id: '$brand', count: { $sum: 1 } } }]);
  const countMap = Object.fromEntries(counts.map((item) => [item._id.toString(), item.count]));
  res.json(brands.map((brand) => ({ ...brand, modelCount: countMap[brand._id.toString()] || 0 })));
}

export async function getBrand(req, res) {
  const brand = await Brand.findOne({ slug: req.params.slug });
  if (!brand) return res.status(404).json({ message: 'Brand not found' });
  const mobiles = await Mobile.find({ brand: brand._id, $or: [{ category: 'mobile' }, { category: { $exists: false } }] }).sort({ createdAt: -1 });
  res.json({ brand, mobiles });
}

export async function createBrand(req, res) {
  const brand = await Brand.create({ ...req.body, slug: slugify(req.body.name), logo: req.file ? `/uploads/${req.file.filename}` : req.body.logo });
  res.status(201).json(brand);
}

export async function updateBrand(req, res) {
  const data = { ...req.body };
  if (req.body.name) data.slug = slugify(req.body.name);
  if (req.file) data.logo = `/uploads/${req.file.filename}`;
  const brand = await Brand.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!brand) return res.status(404).json({ message: 'Brand not found' });
  res.json(brand);
}

export async function deleteBrand(req, res) {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) return res.status(404).json({ message: 'Brand not found' });
  await Mobile.deleteMany({ brand: brand._id });
  res.json({ message: 'Brand and its models deleted' });
}
