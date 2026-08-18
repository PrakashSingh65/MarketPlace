import React from 'react';

export default function CustomerCare() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 text-slate-100">
      <h1 className="text-3xl font-bold mb-4">Customer Support & Care</h1>
      <p className="text-slate-400 mb-6">Need help with your orders or products? Contact us below.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Email Support</h2>
          <p className="text-slate-400">support@lelobhai.com</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Toll-Free Helpline</h2>
          <p className="text-slate-400">1800-123-4567 (Mon-Sat, 9AM - 6PM)</p>
        </div>
      </div>
    </div>
  );
}