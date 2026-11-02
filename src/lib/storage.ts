import { connectToDatabase } from './db';
import Product from './models/Product';
import Category from './models/Category';
import Order from './models/Order';
import User from './models/User';
import Coupon from './models/Coupon';
import Banner from './models/Banner';
import Review from './models/Review';
import InventoryLog from './models/InventoryLog';
import Setting from './models/Setting';
import bcrypt from 'bcryptjs';
import mongoose, { Schema, Model, Document } from 'mongoose';
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

// ─── RepairInquiry model (defined inline) ────────────────────────────────────

interface IRepairInquiry extends Document<string> {
  _id: string;
  deviceType: string;
  problem: string;
  details: string;
  customerName: string;
  phone: string;
  status: string;
  createdAt: Date;
}

const RepairInquirySchema = new Schema<IRepairInquiry>(
  {
    _id: { type: String, default: () => 'rep_' + Date.now() },
    deviceType: { type: String, required: true },
    problem: { type: String, required: true },
    details: { type: String, default: '' },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, default: 'pending' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const RepairInquiry: Model<IRepairInquiry> =
  mongoose.models.RepairInquiry || mongoose.model<IRepairInquiry>('RepairInquiry', RepairInquirySchema);

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function db(): Promise<void> {
  await connectToDatabase();
}

let seeded = false;

async function ensureSeeded(): Promise<void> {
  await db();
  if (seeded) return;

  const existingSetting = await Setting.findOne().lean();
  if (!existingSetting) {
    // Seed admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@hindustancomputer.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '9935908565';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      _id: 'usr_superadmin',
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'superadmin',
      isActive: true,
    });

    // Seed categories
    if (INITIAL_CATEGORIES.length > 0) {
      await Category.insertMany(INITIAL_CATEGORIES);
    }

    // Seed banners
    if (INITIAL_BANNERS.length > 0) {
      await Banner.insertMany(INITIAL_BANNERS);
    }

    // Seed coupons
    if (INITIAL_COUPONS.length > 0) {
      await Coupon.insertMany(INITIAL_COUPONS);
    }

    // Seed settings
    await Setting.create(INITIAL_SETTINGS);

    console.log('>>> [DB] Database seeded with initial data');
  }

  seeded = true;
}

// ─── Slug helper ──────────────────────────────────────────────────────────────

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ─── Storage ──────────────────────────────────────────────────────────────────

export const Storage = {
  // ────────── Products ──────────

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
    await ensureSeeded();
    const {
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      inStockOnly,
      featured,
      bestseller,
      newArrival,
      sort,
      page = 1,
      limit = 12,
    } = params || {};

    const filter: any = {};

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.sellingPrice = {};
      if (minPrice !== undefined) filter.sellingPrice.$gte = minPrice;
      if (maxPrice !== undefined) filter.sellingPrice.$lte = maxPrice;
    }
    if (inStockOnly) filter.stock = { $gt: 0 };
    if (featured) filter.isFeatured = true;
    if (bestseller) filter.isBestseller = true;
    if (newArrival) filter.isNewArrival = true;

    let sortObj: any = { createdAt: -1 };
    switch (sort) {
      case 'price-asc':
        sortObj = { sellingPrice: 1 };
        break;
      case 'price-desc':
        sortObj = { sellingPrice: -1 };
        break;
      case 'rating':
        sortObj = { rating: -1 };
        break;
      case 'discount':
        sortObj = { discountPercentage: -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getProductById(id: string) {
    await ensureSeeded();
    const product = await Product.findOne({
      $or: [{ _id: id }, { slug: id }],
    }).lean();
    return product || null;
  },

  async getProductBySlug(slug: string) {
    await ensureSeeded();
    const product = await Product.findOne({
      $or: [{ slug }, { _id: slug }],
    }).lean();
    return product || null;
  },

  async createProduct(data: any) {
    await ensureSeeded();
    if (!data._id) {
      data._id = 'prod_' + Date.now();
    }
    if (!data.slug) {
      data.slug = generateSlug(data.name);
    }
    if (!data.sku) {
      data.sku = 'HC-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    if (data.mrp && data.sellingPrice) {
      data.discountPercentage = Math.round(((data.mrp - data.sellingPrice) / data.mrp) * 100);
    }
    if (!data.images || data.images.length === 0) {
      data.images = ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80'];
    }

    const product = await Product.create(data);

    // Create initial inventory log
    await InventoryLog.create({
      productId: product._id.toString(),
      productName: product.name,
      sku: product.sku,
      changeType: 'STOCK_IN',
      quantityChanged: product.stock || 0,
      previousStock: 0,
      newStock: product.stock || 0,
      reason: 'Initial stock on product creation',
      performedBy: 'Admin',
    });

    return product.toObject();
  },

  async updateProduct(id: string, updates: any) {
    await ensureSeeded();
    const product = await Product.findById(id);
    if (!product) return null;

    const previousStock = product.stock;

    // Recalculate discount if mrp and sellingPrice are present
    if (updates.mrp !== undefined && updates.sellingPrice !== undefined) {
      updates.discountPercentage = Math.round(((updates.mrp - updates.sellingPrice) / updates.mrp) * 100);
    } else if (updates.mrp !== undefined) {
      updates.discountPercentage = Math.round(((updates.mrp - product.sellingPrice) / updates.mrp) * 100);
    } else if (updates.sellingPrice !== undefined) {
      updates.discountPercentage = Math.round(((product.mrp - updates.sellingPrice) / product.mrp) * 100);
    }

    Object.assign(product, updates);
    await product.save();

    // Create inventory log if stock changed
    if (updates.stock !== undefined && updates.stock !== previousStock) {
      await InventoryLog.create({
        productId: product._id.toString(),
        productName: product.name,
        sku: product.sku,
        changeType: 'MANUAL_ADJUST',
        quantityChanged: updates.stock - previousStock,
        previousStock,
        newStock: updates.stock,
        reason: 'Stock updated via product edit',
        performedBy: 'Admin',
      });
    }

    return product.toObject();
  },

  async deleteProduct(id: string) {
    await ensureSeeded();
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  },

  // ────────── Categories ──────────

  async getCategories() {
    await ensureSeeded();
    return Category.find().sort({ order: 1 }).lean();
  },

  async getCategoryBySlug(slug: string) {
    await ensureSeeded();
    const category = await Category.findOne({
      $or: [{ slug }, { _id: slug }],
    }).lean();
    return category || null;
  },

  async createCategory(data: any) {
    await ensureSeeded();
    if (!data._id) {
      data._id = 'cat_' + Date.now();
    }
    if (!data.slug) {
      data.slug = generateSlug(data.name);
    }
    const category = await Category.create(data);
    return category.toObject();
  },

  async updateCategory(id: string, updates: any) {
    await ensureSeeded();
    const updated = await Category.findByIdAndUpdate(id, updates, { new: true }).lean();
    return updated || null;
  },

  async deleteCategory(id: string) {
    await ensureSeeded();
    const cat = await Category.findById(id).lean();
    if (!cat) return { success: false, message: 'Category not found' };

    // Check if any products reference this category
    const productCount = await Product.countDocuments({
      category: { $regex: new RegExp(`^${cat.slug}$`, 'i') },
    });

    if (productCount > 0) {
      return {
        success: false,
        message: `Cannot delete category "${cat.name}" because ${productCount} product(s) are assigned to it.`,
      };
    }

    await Category.findByIdAndDelete(id);
    return { success: true };
  },

  // ────────── Orders ──────────

  async getOrders(params?: { status?: string; search?: string }) {
    await ensureSeeded();
    const filter: any = {};
    if (params?.status) filter.status = params.status;
    if (params?.search) {
      filter.$or = [
        { orderNumber: { $regex: params.search, $options: 'i' } },
        { 'customer.name': { $regex: params.search, $options: 'i' } },
        { 'customer.phone': { $regex: params.search, $options: 'i' } },
        { 'customer.email': { $regex: params.search, $options: 'i' } },
      ];
    }
    return Order.find(filter).sort({ createdAt: -1 }).lean();
  },

  async getOrderById(id: string) {
    await ensureSeeded();
    const order = await Order.findOne({
      $or: [
        ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : []),
        { orderNumber: id },
      ],
    }).lean();
    return order || null;
  },

  async trackOrder(orderNumber: string, phone: string) {
    await ensureSeeded();
    // Get last 10 digits of phone
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const order = await Order.findOne({
      orderNumber: { $regex: new RegExp(`^${orderNumber}$`, 'i') },
    }).lean();

    if (!order) return null;

    const customerPhone = (order.customer?.phone || '').replace(/\D/g, '').slice(-10);
    if (customerPhone !== cleanPhone) return null;

    return order;
  },

  async createOrder(orderData: any) {
    await ensureSeeded();

    // Verify stock for each item
    for (const item of orderData.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`);
      }
    }

    // Generate order number
    const now = new Date();
    const year = now.getFullYear();
    const orderCount = await Order.countDocuments();
    const orderNumber = `HC-${year}-${String(orderCount + 1).padStart(4, '0')}`;

    // Build status history
    const statusHistory = [
      {
        status: orderData.status || 'Order Placed',
        timestamp: new Date(),
        note: 'Order created',
        updatedBy: 'System',
      },
    ];

    const order = await Order.create({
      _id: orderData._id || 'ord_' + Date.now(),
      ...orderData,
      orderNumber,
      status: orderData.status || 'Order Placed',
      statusHistory,
    });

    // Reduce stock and create inventory logs
    for (const item of orderData.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const previousStock = product.stock;
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();

        await InventoryLog.create({
          productId: product._id.toString(),
          productName: product.name,
          sku: product.sku,
          changeType: 'ORDER_DEDUCT',
          quantityChanged: -item.quantity,
          previousStock,
          newStock: product.stock,
          reason: `Order ${orderNumber}`,
          referenceId: order._id.toString(),
          performedBy: 'System',
        });
      }
    }

    // Update user stats if email matches
    if (orderData.customer?.email) {
      await User.findOneAndUpdate(
        { email: orderData.customer.email.toLowerCase() },
        {
          $inc: {
            totalSpent: orderData.financials?.total || 0,
            totalOrders: 1,
          },
        }
      );
    }

    return order.toObject();
  },

  async updateOrderStatus(
    orderId: string,
    newStatus: string,
    note?: string,
    tracking?: { courier?: string; trackingNumber?: string; trackingUrl?: string },
    updatedBy: string = 'Admin'
  ) {
    await ensureSeeded();
    const order = await Order.findById(orderId);
    if (!order) return null;

    const previousStatus = order.status;
    order.status = newStatus as any;

    // Push to status history
    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date(),
      note: note || '',
      updatedBy,
    });

    // Update tracking fields
    if (tracking) {
      if (tracking.courier) order.tracking.courier = tracking.courier;
      if (tracking.trackingNumber) order.tracking.trackingNumber = tracking.trackingNumber;
      if (tracking.trackingUrl) order.tracking.trackingUrl = tracking.trackingUrl;
    }

    if (newStatus === 'Shipped') {
      order.tracking.shippedAt = new Date();
    }
    if (newStatus === 'Delivered') {
      order.tracking.deliveredAt = new Date();
      order.payment.status = 'paid';
      order.payment.paidAt = order.payment.paidAt || new Date();
    }

    // Restore stock if cancelled or returned
    if ((newStatus === 'Cancelled' || newStatus === 'Returned') && previousStatus !== 'Cancelled' && previousStatus !== 'Returned') {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          const previousStock = product.stock;
          product.stock += item.quantity;
          await product.save();

          await InventoryLog.create({
            productId: product._id.toString(),
            productName: product.name,
            sku: product.sku,
            changeType: 'ORDER_RESTORE',
            quantityChanged: item.quantity,
            previousStock,
            newStock: product.stock,
            reason: `Order ${order.orderNumber} ${newStatus.toLowerCase()}`,
            referenceId: order._id.toString(),
            performedBy: updatedBy,
          });
        }
      }
    }

    await order.save();
    return order.toObject();
  },

  // ────────── Inventory ──────────

  async adjustInventory(
    productId: string,
    quantityChanged: number,
    changeType: string,
    reason: string,
    performedBy: string = 'Admin',
    supplierName?: string
  ) {
    await ensureSeeded();
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    const previousStock = product.stock;
    product.stock = Math.max(0, previousStock + quantityChanged);
    await product.save();

    const log = await InventoryLog.create({
      productId: product._id.toString(),
      productName: product.name,
      sku: product.sku,
      changeType,
      quantityChanged,
      previousStock,
      newStock: product.stock,
      reason,
      supplierName: supplierName || '',
      performedBy,
    });

    return { product: product.toObject(), log: log.toObject() };
  },

  async getInventoryLogs(productId?: string) {
    await ensureSeeded();
    const filter: any = {};
    if (productId) filter.productId = productId;
    return InventoryLog.find(filter).sort({ createdAt: -1 }).lean();
  },

  // ────────── Coupons ──────────

  async getCoupons() {
    await ensureSeeded();
    return Coupon.find().lean();
  },

  async validateCoupon(code: string, subtotal: number) {
    await ensureSeeded();
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    }).lean();

    if (!coupon) {
      return { valid: false, message: 'Invalid coupon code' };
    }

    // Check expiry
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { valid: false, message: 'Coupon has expired' };
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return {
        valid: false,
        message: `Minimum order amount is ₹${coupon.minOrderAmount}`,
      };
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
    } else {
      discountAmount = coupon.discountValue;
    }

    // Cap at maxDiscountAmount
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }

    return {
      valid: true,
      coupon,
      discountAmount,
      message: `Coupon applied! You save ₹${discountAmount}`,
    };
  },

  async createCoupon(data: any) {
    await ensureSeeded();
    if (!data._id) {
      data._id = 'coup_' + Date.now();
    }
    const coupon = await Coupon.create(data);
    return coupon.toObject();
  },

  async deleteCoupon(id: string) {
    await ensureSeeded();
    const result = await Coupon.findByIdAndDelete(id);
    return !!result;
  },

  // ────────── Users ──────────

  async getUserByEmail(email: string) {
    await ensureSeeded();
    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    return user || null;
  },

  async getUserById(id: string) {
    await ensureSeeded();
    const user = await User.findById(id).lean();
    return user || null;
  },

  async createUser(data: any) {
    await ensureSeeded();
    const existing = await User.findOne({ email: data.email.toLowerCase() }).lean();
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await User.create({
      _id: data._id || 'usr_' + Date.now(),
      ...data,
      email: data.email.toLowerCase(),
      password: hashedPassword,
    });

    return user.toObject();
  },

  async getStaff() {
    await ensureSeeded();
    return User.find({ role: { $ne: 'customer' } })
      .select('-password')
      .lean();
  },

  async getCustomers() {
    await ensureSeeded();
    return User.find({ role: 'customer' })
      .select('-password')
      .lean();
  },

  async toggleUserStatus(userId: string) {
    await ensureSeeded();
    const user = await User.findById(userId);
    if (!user) return null;
    user.isActive = !user.isActive;
    await user.save();
    return user.toObject();
  },

  // ────────── Banners ──────────

  async getBanners() {
    await ensureSeeded();
    return Banner.find().sort({ order: 1 }).lean();
  },

  async createBanner(data: any) {
    await ensureSeeded();
    if (!data._id) {
      data._id = 'ban_' + Date.now();
    }
    const banner = await Banner.create(data);
    return banner.toObject();
  },

  async deleteBanner(id: string) {
    await ensureSeeded();
    const result = await Banner.findByIdAndDelete(id);
    return !!result;
  },

  // ────────── Reviews ──────────

  async getReviews(productId?: string) {
    await ensureSeeded();
    const filter: any = {};
    if (productId) filter.productId = productId;
    return Review.find(filter).sort({ createdAt: -1 }).lean();
  },

  async createReview(data: any) {
    await ensureSeeded();
    const review = await Review.create(data);

    // Recalculate product's average rating and numReviews
    const agg = await Review.aggregate([
      { $match: { productId: data.productId } },
      {
        $group: {
          _id: '$productId',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    if (agg.length > 0) {
      await Product.findByIdAndUpdate(data.productId, {
        rating: Math.round(agg[0].avgRating * 10) / 10,
        numReviews: agg[0].count,
      });
    }

    return review.toObject();
  },

  async updateReviewStatus(id: string, status: string, adminReply?: string) {
    await ensureSeeded();
    const review = await Review.findById(id);
    if (!review) return null;

    review.status = status as any;
    if (adminReply !== undefined) {
      review.adminReply = adminReply;
    }
    await review.save();
    return review.toObject();
  },

  // ────────── Settings ──────────

  async getSettings() {
    await ensureSeeded();
    let settings: any = await Setting.findOne().lean();
    if (!settings) {
      settings = (await Setting.create(INITIAL_SETTINGS)).toObject();
    }
    return settings;
  },

  async updateSettings(updates: any) {
    await ensureSeeded();
    const settings = await Setting.findOneAndUpdate({}, updates, {
      new: true,
      upsert: true,
    }).lean();
    return settings;
  },

  // ────────── Repair Inquiries ──────────

  async createRepairInquiry(inquiry: any) {
    await ensureSeeded();
    if (!inquiry._id) {
      inquiry._id = 'rep_' + Date.now();
    }
    const doc = await RepairInquiry.create(inquiry);
    return doc.toObject();
  },

  async getRepairInquiries() {
    await ensureSeeded();
    return RepairInquiry.find().sort({ createdAt: -1 }).lean();
  },

  // ────────── Dashboard ──────────

  async getDashboardStats() {
    await ensureSeeded();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // KPI aggregations
    const [
      totalRevenueAgg,
      todayRevenueAgg,
      monthlyRevenueAgg,
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalCustomers,
      totalProducts,
      lowStockCount,
      outOfStockCount,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $nin: ['Cancelled', 'Returned'] } } },
        { $group: { _id: null, total: { $sum: '$financials.total' } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: todayStart }, status: { $nin: ['Cancelled', 'Returned'] } } },
        { $group: { _id: null, total: { $sum: '$financials.total' } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: monthStart }, status: { $nin: ['Cancelled', 'Returned'] } } },
        { $group: { _id: null, total: { $sum: '$financials.total' } } },
      ]),
      Order.countDocuments(),
      Order.countDocuments({ status: { $in: ['Order Placed', 'Payment Confirmed', 'Processing'] } }),
      Order.countDocuments({ status: 'Delivered' }),
      Order.countDocuments({ status: 'Cancelled' }),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments(),
      Product.countDocuments({ $expr: { $and: [{ $gt: ['$stock', 0] }, { $lte: ['$stock', '$lowStockThreshold'] }] } }),
      Product.countDocuments({ stock: 0 }),
    ]);

    // Low stock & out of stock products
    const [lowStockProducts, outOfStockProducts] = await Promise.all([
      Product.find({ $expr: { $and: [{ $gt: ['$stock', 0] }, { $lte: ['$stock', '$lowStockThreshold'] }] } })
        .select('name sku stock lowStockThreshold images')
        .limit(10)
        .lean(),
      Product.find({ stock: 0 })
        .select('name sku stock images')
        .limit(10)
        .lean(),
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(7)
      .lean();

    // Daily chart data (last 7 days)
    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const dailyAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $nin: ['Cancelled', 'Returned'] } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          revenue: { $sum: '$financials.total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Build full 7-day chart data
    const dailyChartData: { date: string; revenue: number; orders: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayStart);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const found = dailyAgg.find((a: any) => a._id === dateStr);
      dailyChartData.push({
        date: dateStr,
        revenue: found ? found.revenue : 0,
        orders: found ? found.orders : 0,
      });
    }

    // Category sales
    const categorySales = await Order.aggregate([
      { $match: { status: { $nin: ['Cancelled', 'Returned'] } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          let: { pid: '$items.productId' },
          pipeline: [
            { $match: { $expr: { $eq: [{ $toString: '$_id' }, '$$pid'] } } },
            { $project: { category: 1 } },
          ],
          as: 'productInfo',
        },
      },
      { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ['$productInfo.category', 'Unknown'] },
          totalSales: { $sum: '$items.total' },
          totalQuantity: { $sum: '$items.quantity' },
        },
      },
      { $sort: { totalSales: -1 } },
    ]);

    return {
      kpi: {
        totalRevenue: totalRevenueAgg[0]?.total || 0,
        todayRevenue: todayRevenueAgg[0]?.total || 0,
        monthlyRevenue: monthlyRevenueAgg[0]?.total || 0,
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalCustomers,
        totalProducts,
        lowStockCount,
        outOfStockCount,
      },
      lowStockProducts,
      outOfStockProducts,
      recentOrders,
      dailyChartData,
      categorySales,
    };
  },
};
