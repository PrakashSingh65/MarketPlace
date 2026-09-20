import { useState } from 'react';
import toast from 'react-hot-toast';
import { axiosClient } from '../api/axiosClient';

export default function CheckoutButton({ amount, orderDetails, onSuccess }) {
  const [loading, setLoading] = useState(false);

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
        toast.error('Razorpay SDK failed to load.');
        setLoading(false);
        return;
      }

      const orderRes = await axiosClient.post('/payment/create-order', {
        amount,
        orderDetails,
      });

      const orderData = orderRes.data;

      const options = {
        key: orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TRBoLxjgyo8CWl',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'LeloBhai Textile Market',
        description: 'B2B Consignment Order Payment',
        order_id: orderData.orderId || orderData.id,
        handler: async function (response) {
          try {
            const verifyRes = await axiosClient.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const verifyData = verifyRes.data;

            if (verifyData.success) {
              toast.success('Payment Successful! Order Confirmed.');
              if (onSuccess) onSuccess(verifyData);
            } else {
              toast.error('Payment Verification Failed!');
            }
          } catch (verErr) {
            console.error('Verification error:', verErr);
            toast.error(verErr.response?.data?.message || 'Payment verification failed');
          }
        },
        theme: {
          color: '#ea580c',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error('Payment Error:', err);
      toast.error(err.response?.data?.message || 'Payment initiation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-black rounded-xl transition disabled:opacity-50 cursor-pointer shadow-lg shadow-orange-500/20 text-xs sm:text-sm"
    >
      {loading ? 'Processing Payment...' : `Pay ₹${amount} via Razorpay`}
    </button>
  );
}