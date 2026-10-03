import React from 'react';

export default function MobileIconBadge({ brandName = 'Mobile', category = 'mobile', className = '', size = 'md' }) {
  const displayBrand = brandName ? (brandName.length > 7 ? brandName.slice(0, 6) + '..' : brandName) : 'VIVO';

  if (category === 'battery') {
    return (
      <div className={`category-icon-box cat-battery ${size} ${className}`} title={`Battery - ${brandName}`}>
        <i className="bi bi-battery-charging" />
        <span className="icon-subtext">{displayBrand}</span>
      </div>
    );
  }

  if (category === 'panel') {
    return (
      <div className={`category-icon-box cat-panel ${size} ${className}`} title={`Panel - ${brandName}`}>
        <i className="bi bi-display" />
        <span className="icon-subtext">{displayBrand}</span>
      </div>
    );
  }

  if (category === 'charger') {
    return (
      <div className={`category-icon-box cat-charger ${size} ${className}`} title={`Charger - ${brandName}`}>
        <i className="bi bi-plug-fill" />
        <span className="icon-subtext">{displayBrand}</span>
      </div>
    );
  }

  if (category === 'leds') {
    return (
      <div className={`category-icon-box cat-leds ${size} ${className}`} title={`LEDs - ${brandName}`}>
        <i className="bi bi-lightbulb-fill" />
        <span className="icon-subtext">{displayBrand}</span>
      </div>
    );
  }

  if (category === 'charging-lead' || category === 'charging_lead') {
    return (
      <div className={`category-icon-box cat-charging-lead ${size} ${className}`} title={`Charging Lead - ${brandName}`}>
        <i className="bi bi-usb-c-fill" />
        <span className="icon-subtext">{displayBrand}</span>
      </div>
    );
  }

  // Default: Mobile Phone Icon with Brand Name written inside the screen (e.g., VIVO, SAMSUNG)
  return (
    <div className={`mobile-brand-icon-wrapper ${size} ${className}`} title={`Mobile - ${brandName}`}>
      <div className="mobile-phone-body">
        <div className="phone-camera-dot"></div>
        <div className="phone-screen">
          <span className="phone-brand-name">{displayBrand}</span>
        </div>
        <div className="phone-home-bar"></div>
      </div>
    </div>
  );
}
