import React from 'react';
import { Bell } from 'lucide-react';

export default function AllNotifications() {
  const notifications = [
    {
      id: 1,
      title: 'Order Delivered',
      message: 'Your order #12345 has been delivered successfully.',
      time: '2 hours ago',
    },
    {
      id: 2,
      title: 'Price Drop Alert',
      message: 'An item in your wishlist is now on sale!',
      time: '1 day ago',
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-2">All Notifications</h2>
      {notifications.length === 0 ? (
        <div className="p-4 border border-gray-200 rounded-sm text-xs text-gray-500">
          No new notifications.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notifications.map((item) => (
            <div key={item.id} className="p-3 border border-gray-100 rounded-sm bg-white shadow-sm flex items-start gap-3">
              <Bell size={18} className="text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-xs text-gray-800">{item.title}</h4>
                <p className="text-xs text-gray-600">{item.message}</p>
                <span className="text-[10px] text-gray-400">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}