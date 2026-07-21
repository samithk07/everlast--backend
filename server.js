const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./Routes/user/authRoutes");
const cookiesParser=require("cookie-parser")
const userRoutes = require("./Routes/user/userRoutes");



const app = express();

connectDB();

app.use(express.json());
app.use(cookiesParser())

// Routes
app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});