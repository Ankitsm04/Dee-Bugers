"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentPage = () => {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount") || 0;
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (amount > 0) {
      fetch("http://localhost:8001/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      })
        .then((response) => response.json())
        .then((data) => {
          setOrder(data.order);
        })
        .catch((error) => {
          console.error("Payment Error:", error);
        });
    }
  }, [amount]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Failed to load Razorpay SDK. Please refresh and try again.");
      return;
    }

    const options = {
      key: "rzp_test_FuEYwdIYr3IYz5", // Replace with your Razorpay Key ID
      amount: order.amount, // Amount in paise
      currency: "INR",
      name: "Your Company",
      description: "Test Payment",
      order_id: order.id,
      handler: function (response) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "John Doe",
        email: "johndoe@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Payment Page</h1>
      {order ? (
        <>
          <p>Order Created: {order.id}</p>
          <button
            className="bg-green-500 text-white px-4 py-2 mt-4"
            onClick={handlePayment}
          >
            Pay Now
          </button>
        </>
      ) : (
        <p>Creating Order...</p>
      )}
    </div>
  );
};

export default PaymentPage;
