export interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  subcategories: string[];
  order: number;
  isActive: boolean;
  featured: boolean;
}

export interface SpecificationItem {
  group?: string;
  key: string;
  value: string;
}

export interface ProductData {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  barcode?: string;
  brand: string;
  category: string; // slug
  subcategory?: string;
  shortDescription: string;
  description: string;
  images: string[];
  mrp: number;
  sellingPrice: number;
  purchasePrice: number;
  discountPercentage: number;
  gstPercentage: number;
  stock: number;
  lowStockThreshold: number;
  weight?: string;
  dimensions?: string;
  warranty: string;
  specifications: SpecificationItem[];
  highlights: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  isTrending?: boolean;
  isActive: boolean;
  rating: number;
  numReviews: number;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export const INITIAL_CATEGORIES: CategoryData[] = [
  {
    _id: "cat_1",
    name: "Laptops",
    slug: "laptops",
    description: "High-performance gaming, business, and creator laptops from top global brands.",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
    iconName: "Laptop",
    subcategories: ["Gaming Laptops", "Thin & Light Laptops", "Creator Laptops", "Business Laptops"],
    order: 1,
    isActive: true,
    featured: true,
  },
  {
    _id: "cat_2",
    name: "Desktop Computers",
    slug: "desktop-computers",
    description: "Ready-to-use branded desktops and all-in-one PCs for work and enterprise.",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=80",
    iconName: "Monitor",
    subcategories: ["All-in-One PCs", "Workstation Desktops", "Tower PCs", "Mini PCs"],
    order: 2,
    isActive: true,
    featured: true,
  },
  {
    _id: "cat_3",
    name: "Gaming PCs",
    slug: "gaming-pcs",
    description: "Custom pre-built RGB gaming battlestations engineered for maximum FPS.",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
    iconName: "Gamepad2",
    subcategories: ["4K Ultimate Gaming Rigs", "Esports 1080p Rigs", "Custom Watercooled Rigs"],
    order: 3,
    isActive: true,
    featured: true,
  },
  {
    _id: "cat_4",
    name: "Computer Monitors",
    slug: "computer-monitors",
    description: "OLED, IPS, high-refresh rate 144Hz-240Hz gaming and professional 4K monitors.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
    iconName: "Tv",
    subcategories: ["Gaming Monitors", "Curved Monitors", "4K HDR Monitors", "Office Displays"],
    order: 4,
    isActive: true,
    featured: true,
  },
  {
    _id: "cat_5",
    name: "Processors (CPU)",
    slug: "processors-cpu",
    description: "Latest Intel Core 14th Gen and AMD Ryzen 7000/9000 Series processors.",
    image: "https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&w=600&q=80",
    iconName: "Cpu",
    subcategories: ["Intel Core i5/i7/i9", "AMD Ryzen 5/7/9", "Threadripper"],
    order: 5,
    isActive: true,
    featured: true,
  },
  {
    _id: "cat_6",
    name: "Motherboards",
    slug: "motherboards",
    description: "High-tier ATX and ITX motherboards for Intel LGA1700 and AMD AM5 sockets.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
    iconName: "CircuitBoard",
    subcategories: ["Intel Z790/B760", "AMD X670/B650", "Mini-ITX Motherboards"],
    order: 6,
    isActive: true,
    featured: true,
  },
  {
    _id: "cat_7",
    name: "RAM",
    slug: "ram",
    description: "High-speed DDR4 and DDR5 RGB memory kits for blazing desktop multitasking.",
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80",
    iconName: "MemoryStick",
    subcategories: ["DDR5 Desktop RAM", "DDR4 Desktop RAM", "SO-DIMM Laptop RAM"],
    order: 7,
    isActive: true,
    featured: true,
  },
  {
    _id: "cat_8",
    name: "Graphics Cards (GPU)",
    slug: "graphics-cards-gpu",
    description: "NVIDIA GeForce RTX 40 & AMD Radeon RX series graphics accelerators.",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80",
    iconName: "Layers",
    subcategories: ["NVIDIA RTX 40 Series", "AMD Radeon RX 7000", "Workstation GPUs"],
    order: 8,
    isActive: true,
    featured: true,
  },
  {
    _id: "cat_9",
    name: "SSD and HDD",
    slug: "ssd-and-hdd",
    description: "Gen4 & Gen5 PCIe M.2 NVMe solid state drives and enterprise hard disks.",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80",
    iconName: "HardDrive",
    subcategories: ["M.2 NVMe PCIe 4.0/5.0", "2.5-inch SATA SSD", "Internal 3.5\" HDD", "External SSD"],
    order: 9,
    isActive: true,
    featured: true,
  },
  {
    _id: "cat_10",
    name: "Cabinets",
    slug: "cabinets",
    description: "Panoramic tempered glass PC cases with high airflow and addressable RGB.",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
    iconName: "Box",
    subcategories: ["Mid Tower", "Full Tower", "Mini ITX Cases"],
    order: 10,
    isActive: true,
    featured: true,
  },
  {
    _id: "cat_11",
    name: "Power Supply (SMPS)",
    slug: "power-supply-smps",
    description: "80 Plus Gold, Platinum & ATX 3.0 certified modular power supplies.",
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80",
    iconName: "Zap",
    subcategories: ["ATX 3.0 850W-1200W", "Fully Modular 650W-750W", "Standard Bronze PSU"],
    order: 11,
    isActive: true,
    featured: false,
  },
  {
    _id: "cat_12",
    name: "CPU Coolers",
    slug: "cpu-coolers",
    description: "Liquid AIO 240mm/360mm coolers and dual-tower silent air coolers.",
    image: "https://images.unsplash.com/photo-1587202372574-63338569c067?auto=format&fit=crop&w=600&q=80",
    iconName: "Fan",
    subcategories: ["Liquid AIO Coolers", "Air Coolers", "Case Fans"],
    order: 12,
    isActive: true,
    featured: false,
  },
  {
    _id: "cat_13",
    name: "Keyboards",
    slug: "keyboards",
    description: "Mechanical hot-swappable gaming keyboards with customizable RGB lighting.",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    iconName: "Keyboard",
    subcategories: ["Mechanical Keyboards", "Wireless Keyboards", "Ergonomic Keyboards"],
    order: 13,
    isActive: true,
    featured: true,
  },
  {
    _id: "cat_14",
    name: "Mouse",
    slug: "mouse",
    description: "Ultra-lightweight wireless esports mice with high DPI optical sensors.",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
    iconName: "Mouse",
    subcategories: ["Gaming Mouse", "Wireless Ergonomic Mouse", "Mousepads & Mats"],
    order: 14,
    isActive: true,
    featured: false,
  },
  {
    _id: "cat_15",
    name: "Headphones",
    slug: "headphones",
    description: "Immersive 7.1 spatial audio gaming headsets and noise-cancelling headphones.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    iconName: "Headphones",
    subcategories: ["Gaming Headsets", "Wireless ANC Headphones", "Studio Monitors"],
    order: 15,
    isActive: true,
    featured: false,
  },
  {
    _id: "cat_16",
    name: "Speakers",
    slug: "speakers",
    description: "Desktop stereo soundbars, 2.1 subwoofers, and Bluetooth audio systems.",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
    iconName: "Speaker",
    subcategories: ["Desktop 2.1 Speakers", "Gaming Soundbars", "Studio Monitors"],
    order: 16,
    isActive: true,
    featured: false,
  },
  {
    _id: "cat_17",
    name: "Printers",
    slug: "printers",
    description: "All-in-one ink tank, laser, and color multifunction printers for home & office.",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80",
    iconName: "Printer",
    subcategories: ["Ink Tank Wireless Printers", "Laser Printers", "Multifunction Color Printers"],
    order: 17,
    isActive: true,
    featured: false,
  },
  {
    _id: "cat_18",
    name: "Scanners",
    slug: "scanners",
    description: "High-speed document scanners and flatbed photo digitizers.",
    image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=600&q=80",
    iconName: "FileCheck",
    subcategories: ["Flatbed Scanners", "Sheetfed Document Scanners"],
    order: 18,
    isActive: true,
    featured: false,
  },
  {
    _id: "cat_19",
    name: "Networking Devices",
    slug: "networking-devices",
    description: "Gigabit Ethernet switches, PoE injectors, network adapters and patch panels.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    iconName: "Network",
    subcategories: ["Gigabit Switches", "Wi-Fi PCIe Cards", "USB Wi-Fi Dongles"],
    order: 19,
    isActive: true,
    featured: false,
  },
  {
    _id: "cat_20",
    name: "Routers",
    slug: "routers",
    description: "Tri-band Wi-Fi 6 & 6E mesh routers for uninterrupted gigabit connectivity.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80",
    iconName: "Wifi",
    subcategories: ["Wi-Fi 6 Routers", "Mesh Wi-Fi Systems", "Gaming Routers"],
    order: 20,
    isActive: true,
    featured: false,
  },
  {
    _id: "cat_21",
    name: "UPS and Inverters",
    slug: "ups-and-inverters",
    description: "Line-interactive backup UPS systems safeguarding your costly PC components.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    iconName: "BatteryCharging",
    subcategories: ["1000VA-1500VA Gaming UPS", "600VA Desktop UPS"],
    order: 21,
    isActive: true,
    featured: false,
  },
  {
    _id: "cat_22",
    name: "Webcams",
    slug: "webcams",
    description: "4K & 1080p 60FPS streaming webcams with AI auto-focus and stereo mics.",
    image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80",
    iconName: "Video",
    subcategories: ["4K Streaming Webcams", "1080p Business Webcams"],
    order: 22,
    isActive: true,
    featured: false,
  },
  {
    _id: "cat_23",
    name: "Cables and Connectors",
    slug: "cables-and-connectors",
    description: "HDMI 2.1 8K, DisplayPort 1.4, Thunderbolt 4, CAT6 LAN cables & USB-C hubs.",
    image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=600&q=80",
    iconName: "Cable",
    subcategories: ["HDMI 2.1 & DisplayPort", "USB-C Hubs & Docks", "CAT6/7 Cables"],
    order: 23,
    isActive: true,
    featured: false,
  },
  {
    _id: "cat_24",
    name: "Computer Accessories",
    slug: "computer-accessories",
    description: "Laptop stands, RGB light bars, thermal paste, cable sleeves, and cleaning kits.",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
    iconName: "Sliders",
    subcategories: ["Laptop Stands", "Thermal Paste", "Monitor Arms", "RGB Lightbars"],
    order: 24,
    isActive: true,
    featured: false,
  },
  {
    _id: "cat_25",
    name: "Software and Licenses",
    slug: "software-and-licenses",
    description: "100% genuine Windows 11 licenses, Microsoft Office 2024, and Antivirus suites.",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=600&q=80",
    iconName: "ShieldCheck",
    subcategories: ["Operating Systems", "Office & Productivity", "Antivirus & Internet Security"],
    order: 25,
    isActive: true,
    featured: false,
  },
];

export const INITIAL_PRODUCTS: ProductData[] = [];

export const INITIAL_COUPONS = [
  {
    _id: "coup_1",
    code: "WELCOMEHC",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 1000,
    maxDiscountAmount: 500,
    startDate: new Date("2024-01-01"),
    expiryDate: new Date("2027-12-31"),
    usageLimit: 1000,
    usedCount: 0,
    perCustomerLimit: 1,
    isActive: true,
    description: "Welcome discount: 10% off up to ₹500 on orders above ₹1,000!"
  },
  {
    _id: "coup_2",
    code: "HCSAVE100",
    discountType: "fixed",
    discountValue: 100,
    minOrderAmount: 1000,
    maxDiscountAmount: 100,
    startDate: new Date("2024-01-01"),
    expiryDate: new Date("2027-12-31"),
    usageLimit: 500,
    usedCount: 0,
    perCustomerLimit: 2,
    isActive: true,
    description: "Flat ₹100 discount on computer accessories & parts above ₹1,000!"
  }
];

export const INITIAL_BANNERS = [
  {
    _id: "ban_1",
    title: "Your Trusted IT Partner in Dohrighat",
    subtitle: "Computer & laptop repair, custom desktop builds, and quality accessories at fair prices.",
    badge: "SALES & SERVICE • DOHRIGHAT",
    image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1600&q=80",
    buttonText: "Browse Products",
    link: "/products",
    order: 1,
    isActive: true,
  },
  {
    _id: "ban_2",
    title: "Computer & Laptop Repair Services",
    subtitle: "Hardware troubleshooting, screen/hinge repair, and fresh Windows installation starting at ₹200.",
    badge: "FAST & RELIABLE REPAIR",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1600&q=80",
    buttonText: "Inquire on WhatsApp",
    link: "https://wa.me/919935908565?text=Hi%20Hindustan%20Computer,%20I%20need%20repair%20service%20for%20my%20computer/laptop",
    order: 2,
    isActive: true,
  },
  {
    _id: "ban_3",
    title: "Keyboards, Mice, Inks & Accessories",
    subtitle: "Printer inks, 88A/12A toners, Dell & Lapcare keyboards, wireless mice, SSDs, and cables.",
    badge: "GENUINE PARTS & CONSUMABLES",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1600&q=80",
    buttonText: "Shop Accessories",
    link: "/products",
    order: 3,
    isActive: true,
  }
];

export const INITIAL_ORDERS: any[] = [];

export const INITIAL_SETTINGS = {
  storeName: "Hindustan Computer",
  tagline: "Your Trusted IT Partner – Sales, Service & Accessories",
  phone: "+91 99359 08565",
  whatsapp: "+919935908565",
  email: "contact@hindustancomputer.com",
  salesEmail: "contact@hindustancomputer.com",
  gstin: "",
  panNumber: "",
  address: "Dohrighat Road, Near Bus Stand",
  city: "Dohrighat",
  state: "Uttar Pradesh",
  pincode: "275303",
  shippingCharge: 99,
  freeShippingThreshold: 1999,
  razorpayKeyId: "",
  razorpayKeySecret: "",
  enableCod: true,
  socialLinks: {
    facebook: "",
    instagram: "",
    youtube: "",
    twitter: "",
    discord: ""
  },
  announcement: "📞 Genuine parts, expert repair & accessories | WhatsApp us: +91 99359 08565 | Dohrighat, UP"
};
