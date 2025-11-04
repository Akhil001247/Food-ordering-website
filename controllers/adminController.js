// controllers/adminController.js
const Order = require("../models/Order");
const User = require("../models/User");
const Food = require("../models/Food");

const getAdminStats = async (req, res) => {
  try {
    // Total sales & orders
    const orders = await Order.find({});
    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Total users
    const totalUsers = await User.countDocuments();

    // Revenue by day (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);

    const revenueByDay = await Order.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          revenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    // Map to weekdays
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const revenueData = Array(7)
      .fill(0)
      .map((_, i) => {
        const today = new Date();
        const date = new Date();
        date.setDate(today.getDate() - (6 - i));
        const dow = date.getDay();
        const found = revenueByDay.find((r) => r._id === dow + 1);
        return {
          day: days[dow],
          revenue: found ? found.revenue : 0,
        };
      });

    // Top foods by orders
    const topFoods = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.food",
          orders: { $sum: "$items.qty" },
        },
      },
      { $sort: { orders: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "foods",
          localField: "_id",
          foreignField: "_id",
          as: "food",
        },
      },
      { $unwind: "$food" },
      {
        $project: {
          name: "$food.name",
          orders: 1,
        },
      },
    ]);

    res.json({
      totalSales,
      totalOrders,
      totalUsers,
      revenueByDay: revenueData,
      topFoods,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAdminStats };
