// Realistic Bangladeshi e-commerce mock data. All prices in BDT.
// Images use picsum.photos with unique seeds per product = never duplicated.

export type Category = {
  slug: string;
  name: string;
  icon: string;
  banner: string;
  description: string;
  subcategories: string[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number; // BDT
  originalPrice: number;
  discount: number; // percent
  image: string;
  gallery: string[];
  rating: number;
  reviews: number;
  sold: number;
  stock: number;
  brand: string;
  seller: string;
  category: string; // slug
  subcategory: string;
  tags: string[];
  specs: Record<string, string>;
  badge?: "flash" | "new" | "trending" | "bestseller";
};

export type BrandSpotlight = {
  id: number;
  name: string;
  image_url: string;
  position: number;
  active: boolean;
};

export type CategoryBanner = {
  id: number;
  category_slug: string;
  image_url: string;
  title: string;
  subtitle: string;
  link_url: string;
  position: number;
  active: boolean;
};

export const categories: Category[] = [
  { slug: "electronics", name: "Electronics", icon: "Cpu", banner: "https://picsum.photos/seed/cat-electronics/1600/500", description: "Latest gadgets, smartphones, laptops and accessories.", subcategories: ["Smartphones", "Laptops", "Headphones", "Cameras", "Smartwatches"] },
  { slug: "fashion", name: "Fashion", icon: "Shirt", banner: "https://picsum.photos/seed/cat-fashion/1600/500", description: "Trending styles for men, women and kids.", subcategories: ["Men", "Women", "Kids", "Shoes", "Bags"] },
  { slug: "home-living", name: "Home & Living", icon: "Sofa", banner: "https://picsum.photos/seed/cat-home/1600/500", description: "Furniture, décor and everyday essentials.", subcategories: ["Furniture", "Décor", "Kitchen", "Bedding", "Lighting"] },
  { slug: "beauty", name: "Beauty & Health", icon: "Sparkles", banner: "https://picsum.photos/seed/cat-beauty/1600/500", description: "Skincare, makeup and wellness.", subcategories: ["Skincare", "Makeup", "Fragrance", "Haircare", "Wellness"] },
  { slug: "cosmetics", name: "Cosmetics", icon: "Palette", banner: "https://picsum.photos/seed/cat-cosmetics/1600/500", description: "Makeup, beauty tools and cosmetic essentials.", subcategories: ["Lipstick", "Foundation", "Eyeliner", "Nail Polish", "Beauty Tools"] },
  { slug: "grocery", name: "Grocery", icon: "ShoppingBasket", banner: "https://picsum.photos/seed/cat-grocery/1600/500", description: "Daily essentials delivered fast.", subcategories: ["Snacks", "Beverages", "Rice & Dal", "Spices", "Dairy"] },
  { slug: "sports", name: "Sports & Outdoor", icon: "Dumbbell", banner: "https://picsum.photos/seed/cat-sports/1600/500", description: "Gear up for the win.", subcategories: ["Fitness", "Cricket", "Football", "Cycling", "Yoga"] },
  { slug: "toys", name: "Toys & Baby", icon: "Baby", banner: "https://picsum.photos/seed/cat-toys/1600/500", description: "Fun and safe products for little ones.", subcategories: ["Toys", "Diapers", "Feeding", "Baby Care", "Learning"] },
  { slug: "automotive", name: "Automotive", icon: "Car", banner: "https://picsum.photos/seed/cat-auto/1600/500", description: "Everything for your ride.", subcategories: ["Car Care", "Accessories", "Bike Gear", "Tools", "Tires"] },
];

const productData: Array<Omit<Product, "id" | "slug" | "image" | "gallery">> = [
  // Electronics
  { title: "Aurora Pro 5G Smartphone 256GB", description: "6.7-inch AMOLED 120Hz display, triple 108MP camera, Snapdragon 8 Gen 3, 5000mAh battery with 80W fast charging.", price: 84990, originalPrice: 99900, discount: 15, rating: 4.7, reviews: 2841, sold: 6120, stock: 42, brand: "Aurora", seller: "Aurora Official BD", category: "electronics", subcategory: "Smartphones", tags: ["5G", "AMOLED", "108MP"], specs: { Display: "6.7\" AMOLED 120Hz", Processor: "Snapdragon 8 Gen 3", RAM: "12GB", Storage: "256GB", Battery: "5000mAh", OS: "Android 14" }, badge: "trending" },
  { title: "NimbusBook Air 14 Ultrabook i7", description: "14-inch 2.8K OLED, Intel Core i7-1360P, 16GB LPDDR5, 1TB NVMe SSD, all-day battery in a 1.2kg chassis.", price: 129900, originalPrice: 149900, discount: 13, rating: 4.8, reviews: 934, sold: 1580, stock: 18, brand: "Nimbus", seller: "TechHub Dhaka", category: "electronics", subcategory: "Laptops", tags: ["OLED", "Ultrabook"], specs: { Display: "14\" 2.8K OLED", CPU: "Intel i7-1360P", RAM: "16GB LPDDR5", Storage: "1TB SSD", Weight: "1.2kg" }, badge: "bestseller" },
  { title: "SonicWave X7 ANC Wireless Headphones", description: "Hybrid active noise cancellation, 40h battery, LDAC hi-res audio, plush memory-foam earcups.", price: 8990, originalPrice: 13500, discount: 33, rating: 4.6, reviews: 5320, sold: 12400, stock: 210, brand: "SonicWave", seller: "AudioZone", category: "electronics", subcategory: "Headphones", tags: ["ANC", "Bluetooth 5.3"], specs: { Battery: "40 hours", Codec: "LDAC / AAC", Weight: "252g", Warranty: "1 year" }, badge: "flash" },
  { title: "PixelSnap Mirrorless Camera 32MP", description: "APS-C 32MP sensor, 4K60 video, in-body stabilization, weather-sealed magnesium body.", price: 74500, originalPrice: 82000, discount: 9, rating: 4.7, reviews: 412, sold: 890, stock: 24, brand: "PixelSnap", seller: "Camera World BD", category: "electronics", subcategory: "Cameras", tags: ["4K60", "IBIS"], specs: { Sensor: "APS-C 32MP", Video: "4K60", Mount: "PS-Mount", Weight: "480g" } },
  { title: "PulseFit 3 Smartwatch AMOLED", description: "1.9\" AMOLED, GPS, SpO₂, sleep coaching, 14-day battery, 5ATM waterproof.", price: 4990, originalPrice: 7990, discount: 38, rating: 4.5, reviews: 3120, sold: 8450, stock: 350, brand: "PulseFit", seller: "PulseFit BD", category: "electronics", subcategory: "Smartwatches", tags: ["GPS", "AMOLED"], specs: { Display: "1.9\" AMOLED", Battery: "14 days", Water: "5ATM" }, badge: "flash" },

  // Fashion
  { title: "Heritage Cotton Panjabi — Off White", description: "Hand-stitched premium cotton panjabi with subtle embroidery, breathable and perfect for Eid.", price: 2450, originalPrice: 3200, discount: 23, rating: 4.6, reviews: 1120, sold: 3400, stock: 120, brand: "Aarong Heritage", seller: "Heritage Bazaar", category: "fashion", subcategory: "Men", tags: ["Eid", "Cotton"], specs: { Fabric: "100% Cotton", Fit: "Regular", Care: "Machine wash cold" } },
  { title: "Silk Blend Saree — Emerald", description: "Lightweight silk blend saree with zari border and matching blouse piece.", price: 3890, originalPrice: 5500, discount: 29, rating: 4.7, reviews: 780, sold: 1980, stock: 65, brand: "Rang Bangla", seller: "Rang Bangla Store", category: "fashion", subcategory: "Women", tags: ["Saree", "Silk"], specs: { Fabric: "Silk Blend", Length: "5.5m", Blouse: "0.8m included" }, badge: "trending" },
  { title: "Kids Denim Jacket — Indigo", description: "Soft washed denim with cozy fleece lining, snap buttons, perfect for winter mornings.", price: 1290, originalPrice: 1890, discount: 32, rating: 4.5, reviews: 420, sold: 1230, stock: 88, brand: "Little Chums", seller: "Little Chums BD", category: "fashion", subcategory: "Kids", tags: ["Winter", "Denim"], specs: { Fabric: "Denim + Fleece", Ages: "3-10 yr", Care: "Hand wash" } },
  { title: "Trailblazer Running Shoes", description: "Responsive foam midsole, breathable knit upper, rubber outsole with 6mm lugs.", price: 3490, originalPrice: 4990, discount: 30, rating: 4.6, reviews: 2140, sold: 5200, stock: 140, brand: "Trailblazer", seller: "SportsMart", category: "fashion", subcategory: "Shoes", tags: ["Running"], specs: { Drop: "8mm", Weight: "260g", Sizes: "39-46" }, badge: "bestseller" },
  { title: "Voyager Leather Backpack 22L", description: "Full-grain leather, padded 15\" laptop sleeve, YKK zippers, water-resistant lining.", price: 4590, originalPrice: 6200, discount: 26, rating: 4.7, reviews: 640, sold: 1420, stock: 55, brand: "Voyager", seller: "Voyager BD", category: "fashion", subcategory: "Bags", tags: ["Leather"], specs: { Capacity: "22L", Material: "Full-grain leather", Warranty: "2 years" } },

  // Home
  { title: "Nordic Fabric Sofa 3-Seater", description: "Solid wood frame, high-density foam, stain-resistant premium fabric in warm sand tone.", price: 34990, originalPrice: 44900, discount: 22, rating: 4.6, reviews: 210, sold: 480, stock: 12, brand: "HomeCraft", seller: "HomeCraft Dhaka", category: "home-living", subcategory: "Furniture", tags: ["Sofa"], specs: { Dimensions: "210×85×88cm", Frame: "Mahogany", Warranty: "3 years" } },
  { title: "Terracotta Ceramic Vase Set (3)", description: "Handcrafted matte-finish vases inspired by Bengali pottery traditions.", price: 1490, originalPrice: 1990, discount: 25, rating: 4.7, reviews: 320, sold: 890, stock: 78, brand: "MittiKatha", seller: "MittiKatha Studio", category: "home-living", subcategory: "Décor", tags: ["Handmade"], specs: { Material: "Ceramic", Count: "3 pieces", Origin: "Bangladesh" } },
  { title: "ChefPro 5L Non-Stick Wok", description: "Diamond-coated non-stick, induction-compatible, ergonomic stay-cool handle.", price: 2290, originalPrice: 2990, discount: 23, rating: 4.5, reviews: 560, sold: 1780, stock: 140, brand: "ChefPro", seller: "Kitchen Essentials", category: "home-living", subcategory: "Kitchen", tags: ["Non-stick"], specs: { Capacity: "5L", Diameter: "32cm", Base: "Induction-ready" } },
  { title: "CloudRest King Bedding Set", description: "300TC Egyptian cotton, comforter + 2 pillow covers + fitted sheet.", price: 3990, originalPrice: 5490, discount: 27, rating: 4.6, reviews: 410, sold: 1120, stock: 60, brand: "CloudRest", seller: "CloudRest BD", category: "home-living", subcategory: "Bedding", tags: ["Cotton"], specs: { Size: "King", Thread: "300TC", Pieces: "4" }, badge: "new" },
  { title: "Aura Smart LED Ceiling Light", description: "48W dimmable smart light, app control, 16M colors, voice-assistant compatible.", price: 3290, originalPrice: 4290, discount: 23, rating: 4.5, reviews: 290, sold: 640, stock: 95, brand: "Aura", seller: "Aura Lighting", category: "home-living", subcategory: "Lighting", tags: ["Smart"], specs: { Power: "48W", Diameter: "48cm", Control: "App + Voice" } },

  // Beauty
  { title: "GlowLab Vitamin-C Serum 30ml", description: "15% L-ascorbic acid + hyaluronic acid, brightens and hydrates.", price: 1290, originalPrice: 1790, discount: 28, rating: 4.7, reviews: 3120, sold: 8900, stock: 320, brand: "GlowLab", seller: "GlowLab BD", category: "beauty", subcategory: "Skincare", tags: ["Vitamin C"], specs: { Volume: "30ml", Skin: "All types", Cruelty: "Cruelty-free" }, badge: "bestseller" },
  { title: "VelvetMatte Lipstick — Rose Nude", description: "12h wear, weightless matte finish, enriched with shea butter.", price: 690, originalPrice: 990, discount: 30, rating: 4.6, reviews: 2140, sold: 6200, stock: 240, brand: "VelvetMatte", seller: "Beauty Palette", category: "beauty", subcategory: "Makeup", tags: ["Matte"], specs: { Shade: "Rose Nude", Wear: "12h", Weight: "3.8g" } },
  { title: "Amber Oud Eau de Parfum 100ml", description: "Warm oud, amber and vanilla — long-lasting oriental fragrance.", price: 2990, originalPrice: 3990, discount: 25, rating: 4.7, reviews: 540, sold: 1240, stock: 78, brand: "Maison Ora", seller: "Fragrance House", category: "beauty", subcategory: "Fragrance", tags: ["Unisex"], specs: { Size: "100ml", Family: "Oriental", Longevity: "8-10h" } },
  { title: "SilkStrand Argan Hair Oil 100ml", description: "Cold-pressed Moroccan argan oil for shine, frizz control and scalp health.", price: 890, originalPrice: 1290, discount: 31, rating: 4.5, reviews: 1780, sold: 4500, stock: 210, brand: "SilkStrand", seller: "SilkStrand BD", category: "beauty", subcategory: "Haircare", tags: ["Argan"], specs: { Volume: "100ml", Type: "All hair types" } },
  { title: "VitalDaily Multivitamin (60 tabs)", description: "Complete daily multivitamin with 23 vitamins & minerals.", price: 1490, originalPrice: 1990, discount: 25, rating: 4.6, reviews: 890, sold: 2340, stock: 180, brand: "VitalDaily", seller: "HealthPlus BD", category: "beauty", subcategory: "Wellness", tags: ["Vitamins"], specs: { Count: "60 tablets", Serving: "1/day" } },

  // Grocery
  { title: "Premium Kalijira Rice 5kg", description: "Aromatic fine-grain kalijira rice, farm-fresh from Dinajpur.", price: 890, originalPrice: 1050, discount: 15, rating: 4.8, reviews: 4210, sold: 12400, stock: 540, brand: "Pran", seller: "Pran Retail", category: "grocery", subcategory: "Rice & Dal", tags: ["Rice"], specs: { Weight: "5kg", Origin: "Dinajpur" }, badge: "bestseller" },
  { title: "Radhuni Beef Masala 500g", description: "Signature spice blend for authentic Bangladeshi beef curry.", price: 220, originalPrice: 280, discount: 21, rating: 4.7, reviews: 2100, sold: 8900, stock: 620, brand: "Radhuni", seller: "Radhuni Official", category: "grocery", subcategory: "Spices", tags: ["Masala"], specs: { Weight: "500g" } },
  { title: "Fresh Farm Cow Milk 1L (UHT)", description: "Ultra-heat-treated pure cow milk, no preservatives.", price: 130, originalPrice: 150, discount: 13, rating: 4.6, reviews: 3400, sold: 15600, stock: 890, brand: "Aarong Dairy", seller: "Aarong Dairy", category: "grocery", subcategory: "Dairy", tags: ["Milk"], specs: { Volume: "1L", Shelf: "6 months" } },
  { title: "Nescafé Gold Instant Coffee 200g", description: "Rich, aromatic 100% arabica instant coffee.", price: 890, originalPrice: 1150, discount: 23, rating: 4.7, reviews: 1240, sold: 3800, stock: 180, brand: "Nescafé", seller: "Coffee Corner", category: "grocery", subcategory: "Beverages", tags: ["Coffee"], specs: { Weight: "200g" } },
  { title: "Bombay Sweets Chips Mix Pack (12)", description: "Assorted crispy chips — perfect party pack.", price: 340, originalPrice: 480, discount: 29, rating: 4.5, reviews: 890, sold: 2100, stock: 320, brand: "Bombay Sweets", seller: "Snack World", category: "grocery", subcategory: "Snacks", tags: ["Snacks"], specs: { Count: "12 packs" }, badge: "flash" },

  // Sports
  { title: "PowerFlex Adjustable Dumbbell 24kg", description: "Space-saving adjustable dumbbell, 5-24kg in 2.5kg increments.", price: 8990, originalPrice: 12500, discount: 28, rating: 4.7, reviews: 340, sold: 720, stock: 45, brand: "PowerFlex", seller: "FitZone", category: "sports", subcategory: "Fitness", tags: ["Home gym"], specs: { Weight: "5-24kg", Increments: "2.5kg" } },
  { title: "SG Player Edition Cricket Bat", description: "English willow, short handle, ideal weight distribution.", price: 5490, originalPrice: 7200, discount: 24, rating: 4.6, reviews: 210, sold: 480, stock: 32, brand: "SG", seller: "Cricket Store BD", category: "sports", subcategory: "Cricket", tags: ["Willow"], specs: { Willow: "English Grade 3", Weight: "1180g" } },
  { title: "Nitrox FIFA-Approved Football Size 5", description: "Hand-stitched matchball, TPU cover, 3.5mm foam layer.", price: 1490, originalPrice: 1990, discount: 25, rating: 4.7, reviews: 560, sold: 1420, stock: 120, brand: "Nitrox", seller: "SportsMart", category: "sports", subcategory: "Football", tags: ["Matchball"], specs: { Size: "5", Panels: "32" } },
  { title: "TrailRunner MTB 27.5\" 21-Speed", description: "Aluminum frame, hydraulic disc brakes, front suspension.", price: 22990, originalPrice: 28900, discount: 20, rating: 4.6, reviews: 190, sold: 320, stock: 18, brand: "TrailRunner", seller: "Cycle World BD", category: "sports", subcategory: "Cycling", tags: ["MTB"], specs: { Frame: "Aluminum", Gears: "21-speed" }, badge: "new" },
  { title: "ZenFlow Yoga Mat 6mm TPE", description: "Non-slip eco-friendly TPE, includes carry strap.", price: 1290, originalPrice: 1790, discount: 28, rating: 4.7, reviews: 890, sold: 2400, stock: 210, brand: "ZenFlow", seller: "Wellness Store", category: "sports", subcategory: "Yoga", tags: ["Eco"], specs: { Thickness: "6mm", Material: "TPE" } },

  // Toys / Baby
  { title: "BrickWorld 500-piece Creative Set", description: "Compatible with major brick brands — endless building fun.", price: 1890, originalPrice: 2490, discount: 24, rating: 4.7, reviews: 340, sold: 780, stock: 65, brand: "BrickWorld", seller: "Toy Kingdom", category: "toys", subcategory: "Toys", tags: ["Building"], specs: { Pieces: "500", Ages: "5+" } },
  { title: "SoftHug Premium Diapers M (60pcs)", description: "Ultra-soft, 12h absorption, breathable outer layer.", price: 1490, originalPrice: 1890, discount: 21, rating: 4.7, reviews: 2100, sold: 6800, stock: 340, brand: "SoftHug", seller: "Baby Care BD", category: "toys", subcategory: "Diapers", tags: ["Diapers"], specs: { Size: "M (6-11kg)", Count: "60" }, badge: "bestseller" },
  { title: "MamaGlass Baby Feeding Bottle 240ml", description: "Borosilicate glass with silicone sleeve, anti-colic nipple.", price: 690, originalPrice: 890, discount: 22, rating: 4.6, reviews: 780, sold: 1900, stock: 220, brand: "MamaGlass", seller: "Baby Care BD", category: "toys", subcategory: "Feeding", tags: ["Glass"], specs: { Volume: "240ml", BPA: "Free" } },
  { title: "Johnson's Baby Care Gift Set", description: "Shampoo, lotion, oil and powder — everything baby needs.", price: 1290, originalPrice: 1690, discount: 24, rating: 4.7, reviews: 1240, sold: 3400, stock: 180, brand: "Johnson's", seller: "Johnson's Official", category: "toys", subcategory: "Baby Care", tags: ["Gift"], specs: { Items: "4" } },
  { title: "LearnFun ABC Musical Table", description: "Interactive learning table with letters, music and lights.", price: 2490, originalPrice: 3290, discount: 24, rating: 4.6, reviews: 210, sold: 560, stock: 78, brand: "LearnFun", seller: "Toy Kingdom", category: "toys", subcategory: "Learning", tags: ["Musical"], specs: { Ages: "1-3 yr", Batteries: "3× AA" } },

  // Automotive
  { title: "3M Car Wash Shampoo 1L", description: "pH-balanced foaming shampoo, safe on wax and coatings.", price: 890, originalPrice: 1190, discount: 25, rating: 4.6, reviews: 340, sold: 890, stock: 180, brand: "3M", seller: "Auto Care BD", category: "automotive", subcategory: "Car Care", tags: ["Cleaning"], specs: { Volume: "1L" } },
  { title: "Bosch H4 LED Headlight Bulb (Pair)", description: "6500K bright white, plug-and-play, 50000h lifespan.", price: 2490, originalPrice: 3290, discount: 24, rating: 4.7, reviews: 210, sold: 540, stock: 95, brand: "Bosch", seller: "Bosch Automotive", category: "automotive", subcategory: "Accessories", tags: ["LED"], specs: { Type: "H4", Color: "6500K" } },
  { title: "ProRider Full-Face Motorcycle Helmet", description: "DOT-certified ABS shell, anti-fog visor, breathable liner.", price: 3990, originalPrice: 5490, discount: 27, rating: 4.6, reviews: 420, sold: 980, stock: 60, brand: "ProRider", seller: "Bike Gear BD", category: "automotive", subcategory: "Bike Gear", tags: ["Helmet"], specs: { Certification: "DOT", Sizes: "M-XL" }, badge: "trending" },
  { title: "Stanley 46-Piece Tool Kit", description: "Chrome vanadium tools, blow-molded case.", price: 2890, originalPrice: 3890, discount: 26, rating: 4.7, reviews: 340, sold: 780, stock: 45, brand: "Stanley", seller: "Stanley BD", category: "automotive", subcategory: "Tools", tags: ["Tools"], specs: { Pieces: "46" } },
  { title: "MRF ZLX Tubeless Car Tire 175/65 R14", description: "All-season tubeless tire with enhanced grip and low road noise.", price: 6490, originalPrice: 7890, discount: 18, rating: 4.6, reviews: 210, sold: 460, stock: 40, brand: "MRF", seller: "Tire World", category: "automotive", subcategory: "Tires", tags: ["Tubeless"], specs: { Size: "175/65 R14", Warranty: "2 years" } },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const products: Product[] = productData.map((p, i) => {
  const id = String(i + 1).padStart(3, "0");
  const slug = `${slugify(p.title)}-${id}`;
  const seedBase = `prod-${id}`;
  return {
    ...p,
    id,
    slug,
    image: `https://picsum.photos/seed/${seedBase}/800/800`,
    gallery: [1, 2, 3, 4].map((n) => `https://picsum.photos/seed/${seedBase}-g${n}/1000/1000`),
  };
});

export const getProduct = (id: string) => products.find((p) => p.id === id || p.slug === id);
export const getByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const featured = products.filter((p) => p.badge === "trending" || p.badge === "bestseller");
export const flashSale = products.filter((p) => p.badge === "flash" || p.discount >= 28).slice(0, 8);
export const newArrivals = products.filter((p) => p.badge === "new").concat(products.slice(-6)).slice(0, 8);

export const brands = [
  "Aurora", "Nimbus", "SonicWave", "PulseFit", "Aarong", "Radhuni", "Pran", "Nestlé",
  "Bosch", "Stanley", "MRF", "3M", "Nescafé", "Johnson's", "SG",
];

export const heroSlides = [
  { title: "Mega Eid Sale", subtitle: "Up to 70% off on 100k+ products", cta: "Shop the sale", href: "/category/fashion", image: "https://picsum.photos/seed/hero-1/1600/700", tag: "Limited time" },
  { title: "New Tech Arrivals", subtitle: "Latest 5G phones, laptops & wearables", cta: "Explore electronics", href: "/category/electronics", image: "https://picsum.photos/seed/hero-2/1600/700", tag: "Just landed" },
  { title: "Home Makeover Week", subtitle: "Furniture & décor from ৳990", cta: "Refresh your home", href: "/category/home-living", image: "https://picsum.photos/seed/hero-3/1600/700", tag: "Trending" },
];

export const brandLogos = brands.slice(0, 10).map((b) => ({ name: b, image: `https://picsum.photos/seed/brand-${b}/240/120` }));

export const promoBanners = [
  { title: "Free Delivery over ৳999", subtitle: "In Dhaka & Chattogram", image: "https://picsum.photos/seed/promo-1/800/400", href: "/help" },
  { title: "0% EMI up to 12 months", subtitle: "On selected electronics", image: "https://picsum.photos/seed/promo-2/800/400", href: "/category/electronics" },
  { title: "Cashback with bKash", subtitle: "Up to ৳500 back", image: "https://picsum.photos/seed/promo-3/800/400", href: "/checkout" },
];

export const formatBDT = (n: number) => `৳${n.toLocaleString("en-BD")}`;
