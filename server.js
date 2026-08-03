const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

// User Routes
const productRoutes = require("./routes/user/productRoutes");
const authRoutes = require("./routes/user/authRoutes");
const userRoutes = require("./routes/user/userRoutes");
const cartRoutes = require("./routes/user/cartRoutes");
const orderRoutes = require("./routes/user/orderRoutes");
const paymentRoutes = require("./routes/user/paymentRoutes");
const serviceRoutes = require("./routes/user/serviceRoutes");
const adminProductRoute=require("./routes/admin/adminProductRoutes");

//Admin Route
const adminDashboardRoutes = require("./routes/admin/adminDashboardRoutes");
const adminProductRoutes = require("./routes/admin/adminProductRoutes");
const adminOrderRoutes = require("./routes/admin/adminOrderRoutes");
const adminUserRoutes = require("./routes/admin/adminUserRoutes");
const adminServiceRoutes = require("./routes/admin/adminServiceRoutes");
const adminAnalyticsRoutes = require("./routes/admin/adminAnalyticsRoutes");
const admin = require("./config/firebaseAdmin");





const app = express();
const PORT = process.env.PORT || 5000;


// Parse JSON
app.use(express.json());

// Parse Cookies
app.use(cookieParser());

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
  })
);

// =============API Routes=================

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/admin/product",adminProductRoute)

//=========admin Routes==========
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/services", adminServiceRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);

// ==============================
// Test Route


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Everlast Backend Running Successfully ",
  });
});



const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(` Server Running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server Start Error:", err.message);
    process.exit(1);
  }
};

startServer();