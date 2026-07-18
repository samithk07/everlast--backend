const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");

const productRoutes = require("./routes/productRoutes");

const authRoutes = require("./Routes/user/authRoutes");

const app = express();

connectDB();

app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});