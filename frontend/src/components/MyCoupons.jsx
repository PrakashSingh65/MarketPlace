import React from 'react';
import { Tag } from 'lucide-react';

export default function MyCoupons() {
  const coupons = [
    {
      id: 1,
      code: 'WELCOME10',
      description: 'Get 10% OFF on your first purchase.',
      validTill: '31 Aug 2026',
    },
    {
      id: 2,
      code: 'FREESHIP',
      description: 'Free shipping on orders above ₹499.',
      validTill: '15 Sep 2026',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-2">My Coupons</h2>
      {coupons.length === 0 ? (
        <div className="p-4 border border-gray-200 rounded-sm text-xs text-gray-500">
          No active coupons available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="p-4 border border-dashed border-blue-400 bg-blue-50 rounded-sm flex items-start gap-3">
              <Tag className="text-blue-600 mt-1" size={20} />
              <div>
                <span className="font-bold text-blue-700 text-sm tracking-wide">{coupon.code}</span>
                <p className="text-xs text-gray-600 my-1">{coupon.description}</p>
                <p className="text-[10px] text-gray-400">Valid till: {coupon.validTill}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}