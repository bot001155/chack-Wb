require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
app.use(bodyParser.json());

/* =========================
   TEMP ORDER STORAGE
========================= */
const orders = {};

/* =========================
   RECEIVE ORDER FROM WEBSITE
========================= */
app.post("/order", (req, res) => {
  const { orderId, data } = req.body;

  if (!orderId || !data) {
    return res.status(400).send("Invalid order");
  }

  orders[orderId] = data;

  console.log("New order received:", orderId);
  res.sendStatus(200);
});

/* =========================
   TELEGRAM BOT WEBHOOK
========================= */
app.post("/telegram", async (req, res) => {
  const message = req.body.message?.text;

  if (!message || !message.startsWith("/done")) {
    return res.sendStatus(200);
  }

  const orderId = message.split(" ")[1];
  const order = orders[orderId];

  if (!order) {
    console.log("Order not found:", orderId);
    return res.sendStatus(200);
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
      }
    });

    await transporter.sendMail({
      from: "Delta Market <no-reply@deltamarket.com>",
      to: order.email,
      subject: `Order Confirmed - ${orderId}`,
      html: `
        <h2>✅ Order Confirmed</h2>
        <p><b>Order ID:</b> ${orderId}</p>
        <p><b>Name:</b> ${order.name}</p>
        <p><b>Product:</b> ${order.product}</p>
        <p><b>Payment:</b> ${order.payment}</p>
        <p><b>Platform:</b> ${order.platform}</p>
        <p><b>Date:</b> ${order.dateTime}</p>
        <br>
        <p>Thank you for shopping with <b>Delta Market</b> 💜</p>
      `
    });

    console.log("Receipt email sent for", orderId);
  } catch (err) {
    console.error("Email failed:", err);
  }

  res.sendStatus(200);
});

/* =========================
   START SERVER
========================= */
app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
