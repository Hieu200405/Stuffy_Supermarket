import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="ds-glass-card" style={{ padding: '0', height: '420px', display: 'flex', flexDirection: 'column' }}>
      {/* Product Image Skeleton */}
      <div className="ds-skeleton" style={{ height: '240px', width: '100%', borderRadius: '20px 20px 0 0' }} />
      
      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Category Badge Skeleton */}
        <div className="ds-skeleton" style={{ height: '20px', width: '30%', borderRadius: '99px' }} />
        
        {/* Title Skeleton */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="ds-skeleton" style={{ height: '24px', width: '90%' }} />
          <div className="ds-skeleton" style={{ height: '24px', width: '60%' }} />
        </div>
        
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Price Skeleton */}
          <div className="ds-skeleton" style={{ height: '32px', width: '25%' }} />
          {/* Button Skeleton */}
          <div className="ds-skeleton" style={{ height: '42px', width: '35%', borderRadius: '12px' }} />
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
