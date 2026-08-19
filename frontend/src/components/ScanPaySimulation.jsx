import React, { useState } from 'react';
import { QrCode, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ScanPaySimulation({ amount = 499, onSuccess }) {
  const [upiId, setUpiId] = useState('marketplace@upi');
  const [status, setStatus] = useState('idle'); // 'idle' | 'processing' | 'success' | 'failed'

  const handlePayment = (e) => {
    e.preventDefault();
    if (!upiId) return;

    setStatus('processing');

    // Simulate Payment Gateway Response
    setTimeout(() => {
      if (upiId.trim().toLowerCase() === 'marketplace@upi') {
        setStatus('success');
        if (onSuccess) onSuccess();
      } else {
        setStatus('failed');
      }
    }, 1500);
  };

  return (
    <div className="bg-purple-950/40 border border-purple-900/60 rounded-2xl p-6 max-w-md mx-auto text-slate-100 shadow-xl">
      <h2 className="text-xl font-bold text-center mb-4 text-orange-400">Scan & Pay Simulation</h2>

      {/* QR Code Placeholder */}
      <div className="flex flex-col items-center justify-center p-4 bg-slate-900/80 border border-purple-800/40 rounded-xl mb-4">
        <QrCode size={120} className="text-orange-400 mb-2" />
        <p className="text-xs text-purple-300">Scan QR or use UPI ID below</p>
      </div>

      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">UPI ID</label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="enter upi id"
            className="w-full bg-purple-900/20 border border-purple-700/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Amount to Pay</label>
          <div className="w-full bg-purple-900/20 border border-purple-700/40 rounded-lg px-3 py-2 text-sm font-bold text-orange-400">
            ₹{amount}
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'processing'}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 text-slate-950 font-bold py-2.5 rounded-lg transition text-sm flex items-center justify-center gap-2"
        >
          {status === 'processing' ? 'Processing Payment...' : 'Pay Now'}
        </button>
      </form>

      {/* Payment Status Feedbacks */}
      {status === 'success' && (
        <div className="mt-4 p-3 bg-green-950/60 border border-green-500/40 rounded-lg flex items-center gap-2 text-green-400 text-xs font-semibold">
          <CheckCircle2 size={18} />
          <span>Payment Successful! Order Confirmed.</span>
        </div>
      )}

      {status === 'failed' && (
        <div className="mt-4 p-3 bg-red-950/60 border border-red-500/40 rounded-lg flex items-center gap-2 text-red-400 text-xs font-semibold">
          <AlertCircle size={18} />
          <span>Invalid UPI ID. Please use <b>marketplace@upi</b></span>
        </div>
      )}
    </div>
  );
}