export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const openRazorpayCheckout = async ({
  keyId,
  orderId,
  amount,
  currency = "INR",
  name = "MarketPlace B2B",
  description = "Fabric Order Payment",
  prefill = {},
  onSuccess,
  onDismiss,
}) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    alert("Razorpay SDK failed to load. Please check your internet connection.");
    return false;
  }

  const options = {
    key: keyId,
    amount: amount, // in paise
    currency: currency,
    name: name,
    description: description,
    order_id: orderId,
    handler: function (response) {
      if (onSuccess) {
        onSuccess({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
      }
    },
    prefill: {
      name: prefill.name || "",
      email: prefill.email || "",
      contact: prefill.phone || prefill.contact || "",
    },
    theme: {
      color: "#4f46e5",
    },
    modal: {
      ondismiss: function () {
        if (onDismiss) onDismiss();
      },
    },
  };

  const razorpayInstance = new window.Razorpay(options);
  razorpayInstance.open();
  return true;
};
