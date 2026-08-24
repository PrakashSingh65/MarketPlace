import React, { useState } from 'react';

export default function CheckoutButton({ amount, orderDetails, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || '';

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Razorpay SDK load nahi ho saka.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');

      const orderRes = await fetch(`${apiUrl}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount, orderDetails })
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        alert(orderData.message || 'Payment initiation failed.');
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'LeloBhai',
        description: 'Order Payment',
        order_id: orderData.id,
        handler: async function (response) {
          const verifyRes = await fetch(`${apiUrl}/api/payment/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.success) {
            alert('Payment Successful!');
            if (onSuccess) onSuccess(verifyData);
          } else {
            alert('Payment Verification Failed!');
          }
        },
        theme: {
          color: '#4f46e5'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error('Payment Error:', err);
      alert('Payment process me error aaya.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition disabled:bg-indigo-900"
    >
      {loading ? 'Processing Payment...' : `Pay ₹${amount}`}
    </button>
  );
}