import React, { useState } from 'react';
import { HelpCircle, Phone, Mail, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

export default function HelpCenter() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How do I track my order?',
      a: 'Go to the "Track Order" section in your profile or sidebar, enter your Order ID, and view real-time updates.',
    },
    {
      q: 'What is the return & replacement policy?',
      a: 'You can request a return or replacement within 7 days of delivery through the "My Orders" section.',
    },
    {
      q: 'How can I change my delivery address?',
      a: 'You can edit or update your saved addresses in "Account Settings > Manage Addresses".',
    },
    {
      q: 'What payment methods are supported?',
      a: 'We accept UPI, Credit/Debit Cards, Net Banking, Cash on Delivery (COD), and Gift Cards.',
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-6 p-2">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
        <HelpCircle className="text-blue-600" size={20} /> Customer Help Center
      </h2>

      {/* Support Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-200 rounded-sm bg-slate-50 flex items-center gap-3">
          <Phone className="text-blue-600" size={22} />
          <div>
            <h4 className="text-xs font-bold text-gray-800">Call Us</h4>
            <p className="text-[11px] text-gray-500">1800-123-4567 (24x7)</p>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-sm bg-slate-50 flex items-center gap-3">
          <Mail className="text-blue-600" size={22} />
          <div>
            <h4 className="text-xs font-bold text-gray-800">Email Support</h4>
            <p className="text-[11px] text-gray-500">support@example.com</p>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-sm bg-slate-50 flex items-center gap-3">
          <MessageSquare className="text-blue-600" size={22} />
          <div>
            <h4 className="text-xs font-bold text-gray-800">Live Chat</h4>
            <p className="text-[11px] text-gray-500">Chat with support team</p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) */}
      <div className="mt-4">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Frequently Asked Questions</h3>
        <div className="flex flex-col gap-2">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-sm overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center p-3 text-left bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-700"
              >
                <span>{faq.q}</span>
                {openFaq === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openFaq === index && (
                <div className="p-3 text-xs text-gray-600 bg-white border-t border-gray-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}