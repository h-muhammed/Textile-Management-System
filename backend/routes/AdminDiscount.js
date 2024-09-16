const express = require("express");
const router = express.Router();
const Order = require("../models/Order1");
const Product = require("../models/Products");

// Fetch data for the dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(todayStart.getDate() - 1);

    const yesterdayEnd = new Date(todayEnd);
    yesterdayEnd.setDate(todayEnd.getDate() - 1);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(todayStart.getDate() + 1);

    // Sales for today
    const salesToday = await Order.find({
      createdAt: { $gte: todayStart, $lt: tomorrowStart },
    });

    const salesYesterday = await Order.find({
      createdAt: { $gte: yesterdayStart, $lt: yesterdayEnd },
    });

    // Sales per hour
    let hourlySales = new Array(24).fill(0);
    salesToday.forEach((sale) => {
      sale.items.forEach((item) => {
        const saleHour = new Date(sale.createdAt).getHours();
        hourlySales[saleHour] += item.quantity;
      });
    });

    // Determine most and least sales hours from yesterday
    let hourlySalesYesterday = new Array(24).fill(0);
    salesYesterday.forEach((sale) => {
      sale.items.forEach((item) => {
        const saleHour = new Date(sale.createdAt).getHours();
        hourlySalesYesterday[saleHour] += item.quantity;
      });
    });

    const salesPerHourYesterday = hourlySalesYesterday
      .map((count, hour) => ({
        hour,
        count,
      }))
      .filter((sale) => sale.count > 0);
    salesPerHourYesterday.sort((a, b) => b.count - a.count);
    const mostSalesHourYesterday = salesPerHourYesterday[0]
      ? salesPerHourYesterday[0].hour
      : null;
    const leastSalesHourYesterday = salesPerHourYesterday[
      salesPerHourYesterday.length - 1
    ]
      ? salesPerHourYesterday[salesPerHourYesterday.length - 1].hour
      : null;

    // Determine most and least sold items from yesterday
    const itemSalesYesterday = {};
    salesYesterday.forEach((sale) => {
      sale.items.forEach((item) => {
        const productId = item.productId;
        if (!itemSalesYesterday[productId]) {
          itemSalesYesterday[productId] = {
            sold_count: 0,
            productName: item.productName,
          };
        }
        itemSalesYesterday[productId].productName = item.productName;
        itemSalesYesterday[productId].sold_count += item.quantity; // Aggregate sold quantities
      });
    });

    const sortedItems = Object.entries(itemSalesYesterday).sort(
      (a, b) => b[1].sold_count - a[1].sold_count
    );
    const mostSoldItemsy = sortedItems.slice(0, 2).map(([productId, data]) => ({
      item_id: productId,
      item_name: data.productName,
      soldCount: data.sold_count,
      discount_precentage: 5,
    }));
    const leastSoldItemsy =
      sortedItems.length >= 5
        ? sortedItems.slice(-3).map(([productId, data]) => ({
            item_id: productId,
            item_name: data.productName,
            soldCount: data.sold_count,
            discount_precentage: 10,
          }))
        : [];

    // Prepare item sales data for today with most and least sold items today
    const itemSales = {};
    salesToday.forEach((sale) => {
      sale.items.forEach((item) => {
        const itemId = item.productId;
        if (!itemSales[itemId])
          itemSales[itemId] = { sold_count: 0, productName: item.productName };
        itemSales[itemId].productName = item.productName;
        itemSales[itemId].sold_count += item.quantity;
      });
    });

    const itemSalesData = Object.entries(itemSales).map(([itemId, data]) => ({
      item_id: itemId,
      item_name: data.productName,
      soldCount: data.sold_count,
    }));

    const sortedItems2 = Object.entries(itemSales).sort(
      (a, b) => b[1].sold_count - a[1].sold_count
    );
    const mostSoldItems = sortedItems2.slice(0, 2).map(([itemId, data]) => ({
      item_id: itemId,
      item_name: data.productName,
      soldCount: data.sold_count,
    }));
    const leastSoldItems =
      sortedItems2.length >= 5
        ? sortedItems2.slice(-3).map(([itemId, data]) => ({
            item_id: itemId,
            item_name: data.productName,
            soldCount: data.sold_count,
          }))
        : [];

    const discountedItems = [...mostSoldItemsy, ...leastSoldItemsy];

    // Most/Least sales hours today
    const salesPerHour = hourlySales
      .map((count, hour) => ({ hour, count }))
      .filter((sale) => sale.count > 0);
    salesPerHour.sort((a, b) => b.count - a.count);
    const mostSalesHour = salesPerHour[0] ? salesPerHour[0].hour : null;
    const leastSalesHour = salesPerHour[salesPerHour.length - 1]
      ? salesPerHour[salesPerHour.length - 1].hour
      : null;

    const discountedHours = [mostSalesHourYesterday, leastSalesHourYesterday];

    res.status(200).json({
      hourlySales,
      discountedItems,
      discountedHours,
      mostSalesHour,
      leastSalesHour,
      mostSoldItems,
      leastSoldItems,
      itemSales: itemSalesData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
