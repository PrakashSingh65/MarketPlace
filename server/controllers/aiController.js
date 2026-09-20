import Product from "../models/Product.js";

/**
 * Knowledge Base for LeloBhai B2B Textile Marketplace
 */
const PROJECT_KNOWLEDGE = [
  {
    keywords: ["what is", "about lelobhai", "marketplace", "kya hai", "platform", "who are you", "what do you do"],
    answer: "🌾 **LeloBhai** is India's premier B2B Textile Marketplace. We directly connect verified weaving mills and fabric manufacturers with garment brands, exporters, and wholesale buyers across India with **0% middleman commission**, transparent mill-gate pricing, and verified lab-tested quality.",
    suggestions: ["How does Escrow work?", "How to sell fabrics?", "Estimate bulk cost", "Browse Cotton Fabrics"],
    action: { label: "Explore Marketplace", url: "/marketplace" }
  },
  {
    keywords: ["sell", "supplier", "mill", "manufacturer", "add product", "vendor", "listing", "bechna", "kaise beche"],
    answer: "🏭 **Selling on LeloBhai as a Textile Mill / Supplier:**\n1. Sign up or log in to your account.\n2. Navigate to the **Supplier Dashboard** (`/supplier-dashboard`) or click **Add Product** (`/add-product`).\n3. Enter your fabric specifications: Fiber composition, GSM, Weave type, Roll width, and Minimum Order Quantity (MOQ).\n4. Upload mill swatch photos and set your wholesale rate per meter.\n5. Once listed, your fabric is showcased to 15,000+ verified garment brands and exporters with automated GST e-way billing!",
    suggestions: ["Go to Supplier Dashboard", "How does payout work?", "Commission fees"],
    action: { label: "Go to Supplier Dashboard", url: "/supplier-dashboard" }
  },
  {
    keywords: ["escrow", "safe", "security", "payment", "razorpay", "payout", "protection", "fraud", "bharosa"],
    answer: "🛡️ **100% LeloBhai Escrow Trade Protection:**\n• When a buyer places an order, payment is securely held in an **Escrow Account** via Razorpay/banking gateways.\n• The mill produces and dispatches the fabric consignment with digital GST tracking.\n• Once the buyer inspects and confirms the shipment (or after the inspection window passes), funds are released directly to the mill's bank account.\n• Neither party risks advance defaults or payment delays!",
    suggestions: ["What payment methods are supported?", "How to track order?", "View My Cart"],
    action: { label: "View Cart & Checkout", url: "/cart" }
  },
  {
    keywords: ["gsm", "estimator", "calculate", "bulk cost", "density", "discount", "volume", "meter"],
    answer: "⚖️ **Fabric GSM & Bulk Consignment Cost Guide:**\n• **GSM (Grams per Square Meter)** defines the fabric weight and density:\n  - **Lightweight (< 130 GSM)**: Voile, cambric, summer shirts, scarves.\n  - **Medium (130 - 220 GSM)**: Formal poplin, t-shirts, suiting linen.\n  - **Heavyweight (> 220 - 450+ GSM)**: Denim, jackets, canvas, hoodies.\n• **Wholesale Discounts on LeloBhai**:\n  - 1,000+ meters: **5% off**\n  - 2,000+ meters: **10% off**\n  - 5,000+ meters: **15% off**\n• Use our interactive Bulk Estimator on the landing page to simulate instant quotes!",
    suggestions: ["Open Bulk Estimator", "Show 180 GSM Cotton", "Show Denim Fabrics"],
    action: { label: "Open Bulk Estimator", url: "/#estimator" }
  },
  {
    keywords: ["plus", "vip", "membership", "cashback", "benefits", "reward"],
    answer: "👑 **LeloBhai VIP Plus Zone:**\n• **5% Extra Cashback** on all bulk fabric consignments credited to your trade wallet.\n• **Priority Mill Dispatch**: Skip queue with guaranteed 48-hour mill lot dispatch.\n• **Complimentary Lab Testing**: Free Bureau Veritas / SITRA certified GSM and shrinkage reports on orders over 1,000 meters.\n• **Dedicated Sourcing Manager** to negotiate custom mill weaves for your apparel line.",
    suggestions: ["Explore VIP Plus Zone", "Browse Marketplace", "Contact Sourcing Manager"],
    action: { label: "Explore VIP Plus Zone", url: "/plus-zone" }
  },
  {
    keywords: ["track", "order status", "shipping", "delivery", "dispatch", "kahan hai", "mera order"],
    answer: "🚚 **Order Tracking & Consignment Shipping:**\n• Fabric consignments are typically dispatched within **48 to 72 hours** from verified partner mills in Surat, Tirupur, Ahmedabad, and Bhilwara.\n• You can track live dispatch status, GST e-way bills, and transporter details inside your **Profile > Orders** page.",
    suggestions: ["View My Orders", "Customer Care Support", "View Cart"],
    action: { label: "Check Orders in Profile", url: "/profile" }
  },
  {
    keywords: ["sample", "swatch", "inquiry", "custom", "rfq", "quote", "special weave"],
    answer: "🧵 **Custom Weaves & Fabric Swatch Inquiries:**\n• Want a specific yarn blend, custom Pantone dyeing, or swatch book before bulk ordering?\n• Open any product and click **'Send Inquiry'** or use our RFQ form to submit your target price, required GSM, and delivery timeline directly to the weaving master.",
    suggestions: ["Browse Fabric Catalog", "Estimate Bulk Cost", "Contact Care"],
    action: { label: "Explore Catalog", url: "/marketplace" }
  },
  {
    keywords: ["cotton", "kapas", "suti"],
    answer: "🌿 **Cotton Fabrics on LeloBhai:**\n• We offer **100% Combed Cotton, Organic Cotton, Poplin, Cambric, and Slub Cotton** sourced directly from mills in Coimbatore and Ahmedabad.\n• Common yarn counts available: **30s, 40s, 60s, and 80s Ne**.\n• Breathable, skin-friendly, with shrinkage guaranteed under 2%.",
    suggestions: ["Cotton under ₹250", "Estimate 180 GSM Cotton", "Mulberry Silk Fabrics"],
    action: { label: "Browse Cotton Weaves", url: "/marketplace?category=Cotton" }
  },
  {
    keywords: ["denim", "jeans", "twill", "indigo"],
    answer: "👖 **Denim & Chambray Weaves:**\n• Sourced from premium mills in Ahmedabad and Surat.\n• Ranging from **4.5 oz lightweight shirt chambray** up to **14.5 oz heavy ring-spun indigo twill**.\n• 100% Cotton and Cotton-Spandex stretch variants available with consistent rope dyeing.",
    suggestions: ["Browse Denim Catalog", "Estimate Denim Cost", "Pure Cotton Weaves"],
    action: { label: "Browse Denim Weaves", url: "/marketplace?category=Denim" }
  },
  {
    keywords: ["silk", "resham", "brocade", "mulberry"],
    answer: "✨ **Silk & Luxury Weaves:**\n• Direct-from-weaver Mulberry Silk, Crepe Silk, Chanderi, and Banarasi Brocades.\n• Ideal for high-end ethnic wear, bridal collections, and luxury fashion labels.",
    suggestions: ["Browse Silk Weaves", "Estimate Silk Cost", "Linen Fabrics"],
    action: { label: "Browse Silk Collection", url: "/marketplace?category=Silk" }
  },
  {
    keywords: ["linen", "flax", "hemp"],
    answer: "🌾 **Organic Linen & Hemp:**\n• 100% European flax linen and blended cotton-linen with natural slub textures.\n• Highly breathable, thermo-regulating, and pre-washed for soft hand-feel.",
    suggestions: ["Browse Linen Weaves", "Estimate Linen Cost", "Cotton Fabrics"],
    action: { label: "Browse Linen Collection", url: "/marketplace?category=Linen" }
  }
];

/**
 * Handle AI Chat Request
 * POST /api/v1/ai/chat
 */
export const handleAIChat = async (req, res) => {
  try {
    const { message } = req.body;
    const query = (message || "").trim().toLowerCase();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Message query is required"
      });
    }

    // 1. Check Project Knowledge Base for matches
    let matchedKnowledge = null;
    let highestScore = 0;

    for (const item of PROJECT_KNOWLEDGE) {
      let score = 0;
      for (const kw of item.keywords) {
        if (query.includes(kw)) {
          score += kw.length;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        matchedKnowledge = item;
      }
    }

    // 2. Parse price filters e.g. "under 300", "below 250", "under ₹500"
    let maxPrice = null;
    const priceMatch = query.match(/(?:under|below|less than|upto|sub)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
    if (priceMatch && priceMatch[1]) {
      maxPrice = parseInt(priceMatch[1], 10);
    }

    // 3. Search Products in MongoDB
    const searchConditions = [];

    // Keyword matching on product name, category, or description
    const keywords = query.split(/\s+/).filter(w => w.length > 2 && !["what", "show", "tell", "give", "fabric", "fabrics", "price", "rate", "under", "below"].includes(w));
    if (keywords.length > 0) {
      const regexPatterns = keywords.map(kw => new RegExp(kw, "i"));
      searchConditions.push({
        $or: [
          { name: { $in: regexPatterns } },
          { category: { $in: regexPatterns } },
          { description: { $in: regexPatterns } }
        ]
      });
    }

    if (maxPrice !== null && !isNaN(maxPrice)) {
      searchConditions.push({ price: { $lte: maxPrice } });
    }

    let matchedProducts = [];
    try {
      const mongoQuery = searchConditions.length > 0 ? { $and: searchConditions } : {};
      matchedProducts = await Product.find(mongoQuery).limit(4).lean();

      // If no exact keyword match, but user asked about products, fallback to top available products
      if (matchedProducts.length === 0 && (query.includes("product") || query.includes("fabric") || query.includes("cloth") || maxPrice !== null)) {
        const fallbackFilter = maxPrice ? { price: { $lte: maxPrice } } : {};
        matchedProducts = await Product.find(fallbackFilter).limit(4).lean();
      }
    } catch (err) {
      console.warn("AI Product search query warning:", err.message);
    }

    // 4. Construct AI Response
    let replyAnswer = "";
    let replySuggestions = ["Show Cotton Fabrics", "Estimate Bulk Cost", "How does Escrow work?", "How to sell on LeloBhai?"];
    let replyAction = null;

    if (matchedKnowledge) {
      replyAnswer = matchedKnowledge.answer;
      replySuggestions = matchedKnowledge.suggestions;
      replyAction = matchedKnowledge.action;

      if (matchedProducts.length > 0) {
        replyAnswer += `\n\nHere are some relevant consignments available from our verified mills:`;
      }
    } else if (matchedProducts.length > 0) {
      replyAnswer = `I found **${matchedProducts.length} matching fabric consignments** in our marketplace matching your inquiry:`;
      replySuggestions = ["Show Denim Fabrics", "Fabrics under ₹300", "How does Escrow work?", "Estimate Bulk Cost"];
      replyAction = { label: "View All in Marketplace", url: "/marketplace" };
    } else {
      replyAnswer = `Namaste! I am your **LeloBhai Textile & Marketplace AI Advisor**.\n\nYou can ask me about:\n• **Fabric details**: GSM density, weaves (Cotton, Denim, Silk, Linen), shrinkage, and yarn counts.\n• **Platform features**: Escrow safe payouts, bulk price calculations, becoming a mill supplier, or tracking orders.\n• **Wholesale catalog**: Search live fabric lots by price or type.`;
      replySuggestions = [
        "What is LeloBhai?",
        "Estimate bulk consignment cost",
        "Cotton fabrics under ₹300",
        "How to register as a mill?"
      ];
    }

    return res.status(200).json({
      success: true,
      answer: replyAnswer,
      products: matchedProducts.map(p => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        category: p.category,
        image: p.image || (p.images && p.images[0]) || "",
        stock: p.stock || 100,
        description: p.description || ""
      })),
      suggestions: replySuggestions,
      action: replyAction
    });
  } catch (error) {
    console.error("AI Controller error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your AI request",
      error: error.message
    });
  }
};
