import mongoose from 'mongoose';

const mobileSchema = new mongoose.Schema({
  category: { type: String, enum: ['mobile', 'lcd-display', 'battery', 'charging-port', 'camera', 'speaker', 'microphone', 'flex', 'fingerprint', 'vibration', 'antenna', 'buttons', 'other-parts', 'panel', 'charger', 'leds', 'charging-lead', 'charging-ic', 'power-ic-pmic', 'cpu-processor', 'emmc-ufs', 'ram', 'audio-ic', 'backlight-ic', 'display-lcd-ic', 'touch-ic', 'usb-type-c-ic', 'rf-network-ic', 'wifi-bluetooth-ic', 'flash-torch-ic', 'battery-fuel-gauge-ic', 'camera-ic'], default: 'mobile', index: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, min: 0 },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  specifications: {
    ram: String, storage: String, battery: String, display: String,
    camera: String, processor: String, operatingSystem: String, network: String
  },
  colors: [String],
  stock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Mobile', mobileSchema);
