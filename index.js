require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware đọc JSON trong request body
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Đã kết nối thành công tới MongoDB (container: nammongodb)'))
  .catch((err) => console.error('❌ Lỗi kết nối MongoDB:', err.message));
// Route kiểm tra sức khỏe của API (Healthcheck endpoint)
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  if (dbStatus === 'connected') {
    return res.status(200).json({ status: 'UP', database: dbStatus });
  }
  return res.status(503).json({ status: 'DOWN', database: dbStatus });
});
// ==================== CÁC ĐƯỜNG DẪN RESTFUL API (CRUD) ====================

// 1. CREATE: Tạo sản phẩm mới
app.post('/api/products', async (req, res) => {
  try {
    const { pid, pname, price, quantity } = req.body;
    const newProduct = new Product({ pid, pname, price, quantity });
    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, data: savedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 2. READ ALL: Lấy danh sách tất cả sản phẩm
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. READ ONE: Lấy thông tin 1 sản phẩm theo pid
app.get('/api/products/:pid', async (req, res) => {
  try {
    const product = await Product.findOne({ pid: req.params.pid });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. UPDATE: Cập nhật sản phẩm theo pid
app.put('/api/products/:pid', async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm để cập nhật' });
    }
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 5. DELETE: Xóa sản phẩm theo pid
app.delete('/api/products/:pid', async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ pid: req.params.pid });
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm để xóa' });
    }
    res.status(200).json({ success: true, message: 'Đã xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// Endpoint kiểm tra sức khỏe cho Docker Healthcheck
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  if (dbStatus === 'connected') {
    return res.status(200).json({ status: 'UP', database: dbStatus });
  }
  return res.status(503).json({ status: 'DOWN', database: dbStatus });
});
// Khởi chạy Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
