import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_BANNERS,
  INITIAL_ORDERS,
  INITIAL_SETTINGS,
  ProductData,
  CategoryData,
} from './initialData';

// Local storage path for local file persistence
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'hindustan_db.json');

interface LocalDatabase {
  users: any[];
  products: ProductData[];
  categories: CategoryData[];
  orders: any[];
  coupons: any[];
  banners: any[];
  reviews: any[];
  inventoryLogs: any[];
  settings: any;
}

// In-memory cache backed by JSON file
let memoryDb: LocalDatabase | null = null;

function ensureDataFile(): LocalDatabase {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(raw);
      return memoryDb!;
    }
  } catch (err) {
    console.warn('Error reading db file, seeding fresh:', err);
  }

  // Initial seed
  const defaultPasswordHash = bcrypt.hashSync('Admin@12345', 10);
  const customerPasswordHash = bcrypt.hashSync('Customer@123', 10);

  const initialUsers = [
    {
      _id: 'usr_superadmin',
      name: 'Super Administrator',
      email: 'admin@hindustancomputer.com',
      password: defaultPasswordHash,
      phone: '+91 99359 08565',
      role: 'superadmin',
      isActive: true,
      addresses: [],
      wishlist: [],
      totalSpent: 0,
      totalOrders: 0,
      createdAt: new Date(),
    },
    {
      _id: 'usr_prod_mgr',
      name: 'Rajesh Kumar (Product Manager)',
      email: 'products@hindustancomputer.com',
      password: defaultPasswordHash,
      phone: '+91 98765 43211',
      role: 'product_manager',
      isActive: true,
      addresses: [],
      wishlist: [],
      totalSpent: 0,
      totalOrders: 0,
      createdAt: new Date(),
    },
    {
      _id: 'usr_order_mgr',
      name: 'Ananya Sen (Order Manager)',
      email: 'orders@hindustancomputer.com',
      password: defaultPasswordHash,
      phone: '+91 98765 43212',
      role: 'order_manager',
      isActive: true,
      addresses: [],
      wishlist: [],
      totalSpent: 0,
      totalOrders: 0,
      createdAt: new Date(),
    },
    {
      _id: 'usr_customer_demo',
      name: 'Vikramaditya Sharma',
      email: 'customer@gmail.com',
      password: customerPasswordHash,
      phone: '+91 98112 34567',
      role: 'customer',
      isActive: true,
      addresses: [
        {
          fullName: 'Vikramaditya Sharma',
          phone: '+91 98112 34567',
          addressLine1: 'Tower B, Flat 904, Cyber Heights Apartments',
          addressLine2: 'Sector 62',
          landmark: 'Near Metro Station',
          city: 'Noida',
          state: 'Uttar Pradesh',
          pinCode: '201309',
          isDefault: true,
        },
      ],
      wishlist: [],
      totalSpent: 0,
      totalOrders: 0,
      createdAt: new Date(),
    },
  ];

  const initialInventoryLogs = INITIAL_PRODUCTS.map((p) => ({
    _id: 'inv_' + Math.random().toString(36).substring(2, 9),
    productId: p._id,
    productName: p.name,
    sku: p.sku,
    changeType: 'STOCK_IN',
    quantityChanged: p.stock,
    previousStock: 0,
    newStock: p.stock,
    reason: 'Initial Warehouse Inward Consignment',
    supplierName: 'Official Authorized National Distributor',
    performedBy: 'Super Administrator',
    createdAt: new Date(),
  }));

  const initialReviews: any[] = [];

  memoryDb = {
    users: initialUsers,
    products: INITIAL_PRODUCTS,
    categories: INITIAL_CATEGORIES,
    orders: INITIAL_ORDERS,
    coupons: INITIAL_COUPONS,
    banners: INITIAL_BANNERS,
    reviews: initialReviews,
    inventoryLogs: initialInventoryLogs,
    settings: INITIAL_SETTINGS,
  };

  persistDatabase();
  return memoryDb;
}

function persistDatabase() {
  if (!memoryDb) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write database file:', err);
  }
}

export const Storage = {
  // PRODUCTS
  async getProducts(params?: {
    category?: string;
    brand?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
    featured?: boolean;
    bestseller?: boolean;
    newArrival?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  }) {
    const db = ensureDataFile();
    let items = [...db.products];

    if (params?.category && params.category !== 'all') {
      items = items.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
    }

    if (params?.brand && params.brand !== 'all') {
      items = items.filter((p) => p.brand.toLowerCase() === params.brand!.toLowerCase());
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (params?.minPrice !== undefined) {
      items = items.filter((p) => p.sellingPrice >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      items = items.filter((p) => p.sellingPrice <= params.maxPrice!);
    }

    if (params?.inStockOnly) {
      items = items.filter((p) => p.stock > 0);
    }

    if (params?.featured) {
      items = items.filter((p) => p.isFeatured);
    }

    if (params?.bestseller) {
      items = items.filter((p) => p.isBestseller);
    }

    if (params?.newArrival) {
      items = items.filter((p) => p.isNewArrival);
    }

    // Sorting
    switch (params?.sort) {
      case 'price-asc':
        items.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;
      case 'price-desc':
        items.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        items.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      case 'newest':
      default:
        // default natural or id
        break;
    }

    const total = items.length;
    const page = params?.page || 1;
    const limit = params?.limit || 24;
    const startIndex = (page - 1) * limit;
    const paginated = items.slice(startIndex, startIndex + limit);

    return {
      products: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async getProductById(id: string) {
    const db = ensureDataFile();
    return db.products.find((p) => p._id === id || p.slug === id) || null;
  },

  async getProductBySlug(slug: string) {
    const db = ensureDataFile();
    return db.products.find((p) => p.slug === slug || p._id === slug) || null;
  },

  async createProduct(data: any) {
    const db = ensureDataFile();
    const newId = 'prod_' + Date.now();
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    const sku = data.sku || 'HC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const discount =
      data.mrp && data.sellingPrice
        ? Math.round(((data.mrp - data.sellingPrice) / data.mrp) * 100)
        : 0;

    const newProduct: ProductData = {
      _id: newId,
      name: data.name,
      slug,
      sku,
      barcode: data.barcode || '',
      brand: data.brand || 'Hindustan Computer',
      category: data.category || 'computer-accessories',
      subcategory: data.subcategory || '',
      shortDescription: data.shortDescription || data.name,
      description: data.description || data.name,
      images: data.images && data.images.length > 0 ? data.images : [
        'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
      ],
      mrp: Number(data.mrp) || Number(data.sellingPrice) || 999,
      sellingPrice: Number(data.sellingPrice) || 999,
      purchasePrice: Number(data.purchasePrice) || 0,
      discountPercentage: discount > 0 ? discount : 0,
      gstPercentage: Number(data.gstPercentage) || 18,
      stock: Number(data.stock) || 0,
      lowStockThreshold: Number(data.lowStockThreshold) || 5,
      weight: data.weight || '',
      dimensions: data.dimensions || '',
      warranty: data.warranty || '1 Year Manufacturer Warranty',
      specifications: data.specifications || [],
      highlights: data.highlights || [],
      isFeatured: !!data.isFeatured,
      isBestseller: !!data.isBestseller,
      isNewArrival: !!data.isNewArrival,
      isTrending: !!data.isTrending,
      isActive: data.isActive !== undefined ? !!data.isActive : true,
      rating: 5.0,
      numReviews: 0,
      tags: data.tags || [],
      seoTitle: data.seoTitle || '',
      seoDescription: data.seoDescription || '',
    };

    db.products.unshift(newProduct);

    // Record initial inventory log
    db.inventoryLogs.unshift({
      _id: 'inv_' + Date.now(),
      productId: newId,
      productName: newProduct.name,
      sku: newProduct.sku,
      changeType: 'STOCK_IN',
      quantityChanged: newProduct.stock,
      previousStock: 0,
      newStock: newProduct.stock,
      reason: 'Product Creation Stock Inward',
      supplierName: 'Direct Inward Entry',
      performedBy: 'Admin',
      createdAt: new Date(),
    });

    persistDatabase();
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<ProductData>) {
    const db = ensureDataFile();
    const index = db.products.findIndex((p) => p._id === id);
    if (index === -1) return null;

    const current = db.products[index];
    const oldStock = current.stock;

    if (updates.mrp && updates.sellingPrice) {
      updates.discountPercentage = Math.round(
        ((updates.mrp - updates.sellingPrice) / updates.mrp) * 100
      );
    }

    const updated = { ...current, ...updates };
    db.products[index] = updated;

    // Log stock change if updated directly
    if (updates.stock !== undefined && updates.stock !== oldStock) {
      const diff = updates.stock - oldStock;
      db.inventoryLogs.unshift({
        _id: 'inv_' + Date.now(),
        productId: current._id,
        productName: current.name,
        sku: current.sku,
        changeType: diff > 0 ? 'STOCK_IN' : 'MANUAL_ADJUST',
        quantityChanged: diff,
        previousStock: oldStock,
        newStock: updates.stock,
        reason: 'Manual Product Stock Edit in Admin Panel',
        performedBy: 'Admin',
        createdAt: new Date(),
      });
    }

    persistDatabase();
    return updated;
  },

  async deleteProduct(id: string) {
    const db = ensureDataFile();
    const index = db.products.findIndex((p) => p._id === id);
    if (index === -1) return false;
    db.products.splice(index, 1);
    persistDatabase();
    return true;
  },

  // CATEGORIES
  async getCategories() {
    const db = ensureDataFile();
    return db.categories.sort((a, b) => a.order - b.order);
  },

  async getCategoryBySlug(slug: string) {
    const db = ensureDataFile();
    return db.categories.find((c) => c.slug === slug || c._id === slug) || null;
  },

  async createCategory(data: any) {
    const db = ensureDataFile();
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    const newCat: CategoryData = {
      _id: 'cat_' + Date.now(),
      name: data.name,
      slug,
      description: data.description || '',
      image: data.image || 'https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&w=600&q=80',
      iconName: data.iconName || 'Cpu',
      subcategories: data.subcategories || [],
      order: Number(data.order) || db.categories.length + 1,
      isActive: data.isActive !== undefined ? !!data.isActive : true,
      featured: !!data.featured,
    };
    db.categories.push(newCat);
    persistDatabase();
    return newCat;
  },

  async updateCategory(id: string, updates: Partial<CategoryData>) {
    const db = ensureDataFile();
    const index = db.categories.findIndex((c) => c._id === id);
    if (index === -1) return null;
    db.categories[index] = { ...db.categories[index], ...updates };
    persistDatabase();
    return db.categories[index];
  },

  async deleteCategory(id: string) {
    const db = ensureDataFile();
    const cat = db.categories.find((c) => c._id === id);
    if (!cat) return { success: false, message: 'Category not found' };

    // Safeguard: Check if products exist in category
    const hasProducts = db.products.some((p) => p.category.toLowerCase() === cat.slug.toLowerCase());
    if (hasProducts) {
      return {
        success: false,
        message: 'Cannot delete category containing active products. Reassign or delete products first.',
      };
    }

    db.categories = db.categories.filter((c) => c._id !== id);
    persistDatabase();
    return { success: true };
  },

  // ORDERS
  async getOrders(params?: { status?: string; search?: string }) {
    const db = ensureDataFile();
    let list = [...db.orders];

    if (params?.status && params.status !== 'all') {
      list = list.filter((o) => o.status.toLowerCase() === params.status!.toLowerCase());
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.toLowerCase().includes(q) ||
          o.customer.email.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getOrderById(id: string) {
    const db = ensureDataFile();
    return (
      db.orders.find((o) => o._id === id || o.orderNumber === id) || null
    );
  },

  async trackOrder(orderNumber: string, phone: string) {
    const db = ensureDataFile();
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const order = db.orders.find((o) => {
      const oNumMatch = o.orderNumber.toLowerCase() === orderNumber.toLowerCase().trim();
      const oPhone = o.customer.phone.replace(/[^0-9]/g, '').slice(-10);
      return oNumMatch && oPhone === cleanPhone;
    });
    return order || null;
  },

  async createOrder(orderData: any) {
    const db = ensureDataFile();

    // Verify stock availability
    for (const item of orderData.items) {
      const product = db.products.find((p) => p._id === item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.name}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}. Available: ${product.stock}`);
      }
    }

    const orderId = 'ord_' + Date.now();
    const orderNumber = 'HC-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);

    const initialHistory = [
      {
        status: 'Order Placed',
        timestamp: new Date(),
        note: `Order placed online via ${orderData.payment?.method || 'Online'}`,
        updatedBy: 'System',
      },
    ];

    if (orderData.payment?.status === 'paid') {
      initialHistory.push({
        status: 'Payment Confirmed',
        timestamp: new Date(),
        note: `Payment verified via ${orderData.payment.method} - Transaction ID: ${orderData.payment.transactionId || orderData.payment.razorpayPaymentId}`,
        updatedBy: 'Razorpay Gateway',
      });
    }

    const newOrder = {
      _id: orderId,
      orderNumber,
      customer: orderData.customer,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress || orderData.shippingAddress,
      items: orderData.items,
      financials: orderData.financials,
      payment: {
        method: orderData.payment?.method || 'Razorpay',
        transactionId: orderData.payment?.transactionId || '',
        razorpayOrderId: orderData.payment?.razorpayOrderId || '',
        razorpayPaymentId: orderData.payment?.razorpayPaymentId || '',
        status: orderData.payment?.status || (orderData.payment?.method === 'Cash on Delivery' ? 'pending' : 'paid'),
        paidAt: orderData.payment?.status === 'paid' ? new Date() : undefined,
      },
      status: orderData.payment?.status === 'paid' ? 'Payment Confirmed' : 'Order Placed',
      tracking: {
        courier: '',
        trackingNumber: '',
        trackingUrl: '',
      },
      statusHistory: initialHistory,
      internalNotes: orderData.internalNotes || '',
      createdAt: new Date(),
    };

    // Atomically reduce stock
    for (const item of orderData.items) {
      const pIndex = db.products.findIndex((p) => p._id === item.productId);
      if (pIndex !== -1) {
        const prod = db.products[pIndex];
        const oldStock = prod.stock;
        prod.stock -= item.quantity;

        db.inventoryLogs.unshift({
          _id: 'inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          productId: prod._id,
          productName: prod.name,
          sku: prod.sku,
          changeType: 'ORDER_DEDUCT',
          quantityChanged: -item.quantity,
          previousStock: oldStock,
          newStock: prod.stock,
          reason: `Stock deducted for Order #${orderNumber}`,
          referenceId: orderNumber,
          performedBy: 'Automated Checkout Engine',
          createdAt: new Date(),
        });
      }
    }

    // Update customer spend stats if matching user
    if (orderData.customer?.email) {
      const user = db.users.find((u) => u.email.toLowerCase() === orderData.customer.email.toLowerCase());
      if (user) {
        user.totalSpent = (user.totalSpent || 0) + (orderData.financials?.total || 0);
        user.totalOrders = (user.totalOrders || 0) + 1;
      }
    }

    db.orders.unshift(newOrder);
    persistDatabase();
    return newOrder;
  },

  async updateOrderStatus(
    orderId: string,
    newStatus: string,
    note?: string,
    tracking?: { courier?: string; trackingNumber?: string; trackingUrl?: string },
    updatedBy: string = 'Admin'
  ) {
    const db = ensureDataFile();
    const order = db.orders.find((o) => o._id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    const previousStatus = order.status;
    order.status = newStatus;

    if (tracking) {
      order.tracking = { ...order.tracking, ...tracking };
      if (newStatus === 'Shipped' && !order.tracking.shippedAt) {
        order.tracking.shippedAt = new Date();
      }
      if (newStatus === 'Delivered' && !order.tracking.deliveredAt) {
        order.tracking.deliveredAt = new Date();
      }
    }

    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date(),
      note: note || `Status updated from ${previousStatus} to ${newStatus}`,
      updatedBy,
    });

    // If order was cancelled or refunded, restore inventory atomically
    if ((newStatus === 'Cancelled' || newStatus === 'Returned') && previousStatus !== 'Cancelled' && previousStatus !== 'Returned') {
      for (const item of order.items) {
        const prod = db.products.find((p) => p._id === item.productId);
        if (prod) {
          const oldStock = prod.stock;
          prod.stock += item.quantity;

          db.inventoryLogs.unshift({
            _id: 'inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            productId: prod._id,
            productName: prod.name,
            sku: prod.sku,
            changeType: 'ORDER_RESTORE',
            quantityChanged: item.quantity,
            previousStock: oldStock,
            newStock: prod.stock,
            reason: `Restored stock from ${newStatus} Order #${order.orderNumber}`,
            referenceId: order.orderNumber,
            performedBy: updatedBy,
            createdAt: new Date(),
          });
        }
      }
    }

    persistDatabase();
    return order;
  },

  // INVENTORY
  async adjustInventory(
    productId: string,
    quantityChanged: number,
    changeType: 'STOCK_IN' | 'STOCK_OUT' | 'DAMAGE_WRITE_OFF' | 'MANUAL_ADJUST',
    reason: string,
    performedBy: string = 'Admin',
    supplierName?: string
  ) {
    const db = ensureDataFile();
    const prod = db.products.find((p) => p._id === productId);
    if (!prod) throw new Error('Product not found');

    const previousStock = prod.stock;
    const newStock = Math.max(0, previousStock + quantityChanged);
    prod.stock = newStock;

    const logEntry = {
      _id: 'inv_' + Date.now(),
      productId: prod._id,
      productName: prod.name,
      sku: prod.sku,
      changeType,
      quantityChanged,
      previousStock,
      newStock,
      reason,
      supplierName: supplierName || '',
      performedBy,
      createdAt: new Date(),
    };

    db.inventoryLogs.unshift(logEntry);
    persistDatabase();
    return { product: prod, log: logEntry };
  },

  async getInventoryLogs(productId?: string) {
    const db = ensureDataFile();
    if (productId) {
      return db.inventoryLogs.filter((l) => l.productId === productId);
    }
    return db.inventoryLogs;
  },

  // COUPONS
  async getCoupons() {
    const db = ensureDataFile();
    return db.coupons;
  },

  async validateCoupon(code: string, subtotal: number) {
    const db = ensureDataFile();
    const cleanCode = code.toUpperCase().trim();
    const coupon = db.coupons.find((c) => c.code === cleanCode && c.isActive);

    if (!coupon) {
      return { valid: false, message: 'Invalid or inactive coupon code.' };
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return { valid: false, message: 'This coupon has expired.' };
    }

    if (subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        message: `Minimum order amount of ₹${coupon.minOrderAmount.toLocaleString('en-IN')} required for this coupon.`,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
        discount = coupon.maxDiscountAmount;
      }
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, subtotal);

    return {
      valid: true,
      coupon,
      discountAmount: Math.round(discount),
      message: `Coupon ${coupon.code} applied! Saved ₹${Math.round(discount).toLocaleString('en-IN')}`,
    };
  },

  async createCoupon(data: any) {
    const db = ensureDataFile();
    const newCoupon = {
      _id: 'coup_' + Date.now(),
      code: data.code.toUpperCase().trim(),
      discountType: data.discountType || 'percentage',
      discountValue: Number(data.discountValue) || 10,
      minOrderAmount: Number(data.minOrderAmount) || 0,
      maxDiscountAmount: Number(data.maxDiscountAmount) || 0,
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : new Date(Date.now() + 30 * 86400000),
      usageLimit: Number(data.usageLimit) || 100,
      usedCount: 0,
      perCustomerLimit: Number(data.perCustomerLimit) || 1,
      isActive: data.isActive !== undefined ? !!data.isActive : true,
      description: data.description || '',
    };
    db.coupons.push(newCoupon);
    persistDatabase();
    return newCoupon;
  },

  async deleteCoupon(id: string) {
    const db = ensureDataFile();
    db.coupons = db.coupons.filter((c) => c._id !== id);
    persistDatabase();
    return true;
  },

  // USERS
  async getUserByEmail(email: string) {
    const db = ensureDataFile();
    return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  },

  async getUserById(id: string) {
    const db = ensureDataFile();
    return db.users.find((u) => u._id === id) || null;
  },

  async createUser(data: any) {
    const db = ensureDataFile();
    const existing = db.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase().trim());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = {
      _id: 'usr_' + Date.now(),
      name: data.name,
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      phone: data.phone || '',
      role: data.role || 'customer',
      isActive: true,
      addresses: data.addresses || [],
      wishlist: [],
      totalSpent: 0,
      totalOrders: 0,
      createdAt: new Date(),
    };

    db.users.push(newUser);
    persistDatabase();
    return newUser;
  },

  async getStaff() {
    const db = ensureDataFile();
    return db.users
      .filter((u) => u.role !== 'customer')
      .map(({ password, ...rest }) => rest);
  },

  async getCustomers() {
    const db = ensureDataFile();
    return db.users
      .filter((u) => u.role === 'customer')
      .map(({ password, ...rest }) => rest);
  },

  async toggleUserStatus(userId: string) {
    const db = ensureDataFile();
    const user = db.users.find((u) => u._id === userId);
    if (!user) return null;
    user.isActive = !user.isActive;
    persistDatabase();
    return user;
  },

  // BANNERS
  async getBanners() {
    const db = ensureDataFile();
    return db.banners.sort((a, b) => a.order - b.order);
  },

  async createBanner(data: any) {
    const db = ensureDataFile();
    const newBanner = {
      _id: 'ban_' + Date.now(),
      title: data.title,
      subtitle: data.subtitle || '',
      badge: data.badge || '',
      image: data.image,
      buttonText: data.buttonText || 'Shop Now',
      link: data.link || '/products',
      order: Number(data.order) || db.banners.length + 1,
      isActive: data.isActive !== undefined ? !!data.isActive : true,
    };
    db.banners.push(newBanner);
    persistDatabase();
    return newBanner;
  },

  async deleteBanner(id: string) {
    const db = ensureDataFile();
    db.banners = db.banners.filter((b) => b._id !== id);
    persistDatabase();
    return true;
  },

  // REVIEWS
  async getReviews(productId?: string) {
    const db = ensureDataFile();
    let list = [...db.reviews];
    if (productId) {
      list = list.filter((r) => r.productId === productId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createReview(data: any) {
    const db = ensureDataFile();
    const newReview = {
      _id: 'rev_' + Date.now(),
      productId: data.productId,
      userId: data.userId || '',
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      rating: Number(data.rating) || 5,
      title: data.title,
      comment: data.comment,
      isVerifiedPurchase: true,
      status: 'approved',
      adminReply: '',
      createdAt: new Date(),
    };
    db.reviews.unshift(newReview);

    // Update product rating and reviews count
    const prod = db.products.find((p) => p._id === data.productId);
    if (prod) {
      const prodReviews = db.reviews.filter((r) => r.productId === data.productId);
      const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
      prod.rating = Number(avg.toFixed(1));
      prod.numReviews = prodReviews.length;
    }

    persistDatabase();
    return newReview;
  },

  async updateReviewStatus(id: string, status: 'approved' | 'rejected', adminReply?: string) {
    const db = ensureDataFile();
    const review = db.reviews.find((r) => r._id === id);
    if (!review) return null;
    review.status = status;
    if (adminReply !== undefined) {
      review.adminReply = adminReply;
    }
    persistDatabase();
    return review;
  },

  // SETTINGS
  async getSettings() {
    const db = ensureDataFile();
    return db.settings;
  },

  async updateSettings(updates: any) {
    const db = ensureDataFile();
    db.settings = { ...db.settings, ...updates };
    persistDatabase();
    return db.settings;
  },

  // DASHBOARD ANALYTICS & STATS
  async getDashboardStats() {
    const db = ensureDataFile();
    const orders = db.orders;
    const products = db.products;
    const customers = db.users.filter((u) => u.role === 'customer');

    const totalRevenue = orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + (o.financials?.total || 0), 0);

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayOrders = orders.filter((o) => new Date(o.createdAt) >= startOfToday && o.status !== 'Cancelled');
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.financials?.total || 0), 0);

    const monthOrders = orders.filter((o) => new Date(o.createdAt) >= startOfMonth && o.status !== 'Cancelled');
    const monthlyRevenue = monthOrders.reduce((sum, o) => sum + (o.financials?.total || 0), 0);

    const pendingOrdersCount = orders.filter((o) => ['Order Placed', 'Payment Confirmed', 'Processing'].includes(o.status)).length;
    const completedOrdersCount = orders.filter((o) => o.status === 'Delivered').length;
    const cancelledOrdersCount = orders.filter((o) => o.status === 'Cancelled' || o.status === 'Returned').length;

    const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold);
    const outOfStockProducts = products.filter((p) => p.stock === 0);

    // Sales by category
    const categorySalesMap: Record<string, { count: number; revenue: number }> = {};
    orders
      .filter((o) => o.status !== 'Cancelled')
      .forEach((order) => {
        order.items?.forEach((item: any) => {
          const prod = products.find((p) => p._id === item.productId);
          const cat = prod?.category || 'general';
          if (!categorySalesMap[cat]) {
            categorySalesMap[cat] = { count: 0, revenue: 0 };
          }
          categorySalesMap[cat].count += item.quantity;
          categorySalesMap[cat].revenue += item.total || item.price * item.quantity;
        });
      });

    // Recent 7 days sales breakdown for chart
    const dailyChartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

      const dayMatches = orders.filter((o) => {
        const oDate = new Date(o.createdAt);
        return oDate >= dayStart && oDate <= dayEnd && o.status !== 'Cancelled';
      });

      const dayRev = dayMatches.reduce((sum, o) => sum + (o.financials?.total || 0), 0);
      dailyChartData.push({
        date: dayStr,
        revenue: dayRev,
        orders: dayMatches.length,
      });
    }

    return {
      kpi: {
        totalRevenue,
        todayRevenue,
        monthlyRevenue,
        totalOrders: orders.length,
        pendingOrders: pendingOrdersCount,
        completedOrders: completedOrdersCount,
        cancelledOrders: cancelledOrdersCount,
        totalCustomers: customers.length,
        totalProducts: products.length,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
      },
      lowStockProducts,
      outOfStockProducts,
      recentOrders: orders.slice(0, 7),
      dailyChartData,
      categorySales: Object.entries(categorySalesMap).map(([category, val]) => ({
        category,
        ...val,
      })),
    };
  },
};
