import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
              <div className="w-9 h-9 bg-linear-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
                <ShoppingBag size={18} className="text-white" />
              </div>
              TexMarket
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              India&apos;s premier B2B textile marketplace connecting verified suppliers with buyers worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/marketplace', label: 'Browse Fabrics' },
                { to: '/register', label: 'Become a Supplier' },
                { to: '/login', label: 'Sign In' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm hover:text-indigo-400 transition-colors flex items-center gap-1 group">
                    <ArrowRight size={14} className="opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {['Cotton', 'Silk', 'Polyester', 'Wool', 'Linen', 'Denim'].map(cat => (
                <li key={cat}>
                  <Link to={`/marketplace?category=${cat}`} className="text-sm hover:text-indigo-400 transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Mail size={14} className="text-indigo-400" />
                </div>
                support@texmarket.in
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Phone size={14} className="text-indigo-400" />
                </div>
                +91 98765 43210
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  <MapPin size={14} className="text-indigo-400" />
                </div>
                Mumbai, India
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} TexMarket B2B. All rights reserved.</p>
          <p>Made with ❤️ for India&apos;s textile industry</p>
        </div>
      </div>
    </footer>
  );
}
