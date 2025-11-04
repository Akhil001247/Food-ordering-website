const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const couponRoutes = require("./routes/couponRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const adminRoutes = require("./routes/adminRoutes");
const path = require("path");
const searchRoutes = require("./routes/searchRoutes");


dotenv.config();
connectDB();

const app = express();


app.use(cors({
  origin: ["https://food-ordering-website-frontend-cmu1.vercel.app/", "https://food-ordering-website-frontend-tawny.vercel.app","https://food-ordering-website-frontend-sy8w.vercel.app/"],
  credentials: true
}));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/search", searchRoutes);



app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
