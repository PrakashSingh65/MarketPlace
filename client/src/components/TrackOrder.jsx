import React, { useState } from 'react';
import { Search, Package, CheckCircle2, Clock, Truck } from 'lucide-react';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);

  // Sample Tracking Data
  const sampleData = {
    id: 'ORD12345',
    item: 'Wireless Bluetooth Headphones',
    status: 'In Transit',
    expectedDelivery: '22 Aug 2026',
    steps: [
      { title: 'Order Placed', date: '18 Aug 2026', completed: true },
      { title: 'Shipped', date: '19 Aug 2026', completed: true },
      { title: 'Out for Delivery', date: '21 Aug 2026', completed: false },
      { title: 'Delivered', date: 'Expected 22 Aug', completed: false },
    ],
  };

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      alert('Please enter a valid Order ID');
      return;
    }
    // Simple mock logic
    setTrackedOrder(sampleData);
  };

  return (
    <div className="flex flex-col gap-6 p-2">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
        <Truck className="text-blue-600" size={20} /> Track Your Order
      </h2>

      {/* Search Input Form */}
      <form onSubmit={handleTrack} className="flex gap-2 max-w-md">
        <input
          type="text"
          placeholder="Enter Order ID (e.g. ORD12345)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="border border-gray-300 p-2.5 rounded-sm text-xs flex-1 focus:outline-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white text-xs font-bold px-4 py-2.5 rounded-sm hover:bg-blue-700 flex items-center gap-1"
        >
          <Search size={14} /> Track
        </button>
      </form>

      {/* Tracking Details Display */}
      {trackedOrder && (
        <div className="border border-gray-200 rounded-sm p-4 bg-slate-50 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div>
              <p className="text-xs text-gray-500">Order ID: <span className="font-bold text-gray-800">{trackedOrder.id}</span></p>
              <h3 className="font-bold text-sm text-gray-800 mt-0.5">{trackedOrder.item}</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full">
                {trackedOrder.status}
              </span>
              <p className="text-[11px] text-gray-500 mt-1">Expected Delivery: {trackedOrder.expectedDelivery}</p>
            </div>
          </div>

          {/* Timeline / Progress Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-2">
            {trackedOrder.steps.map((step, index) => (
              <div key={index} className="flex items-center gap-3 md:flex-col md:items-center text-left md:text-center flex-1">
                <div className={`p-2 rounded-full ${step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {step.completed ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                </div>
                <div>
                  <p className={`text-xs font-semibold ${step.completed ? 'text-gray-800' : 'text-gray-400'}`}>
                    {step.title}
                  </p>
                  <p className="text-[10px] text-gray-400">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}