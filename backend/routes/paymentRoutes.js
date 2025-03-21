const express = require("express");
const Razorpay = require("razorpay");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

const razorpay = new Razorpay({
  key_id: 'rzp_test_veyLmEci8r0VBl',
  key_secret: 'JKgy4Mom7UciACn0FNx4yUkB',
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // Convert INR to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

module.exports = router;
