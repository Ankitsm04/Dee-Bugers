"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Payment = () => {
  const searchParams = useSearchParams(); 
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Extract the amount from query parameter
  const amount = searchParams.get("amount");

  useEffect(() => {
    if (amount && amount > 0) {
      createOrder(amount);
    }
  }, [amount]);

  const createOrder = async (amt) => {
    try {
      const response = await fetch("http://localhost:8001/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: amt }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create order");
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!order) return;

    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    const options = {
      key: "rzp_test_veyLmEci8r0VBl",   // Test Razorpay key
      amount: order.amount,              // Amount in paise
      currency: "INR",
      name: "Your Company",
      description: "Test Payment",
      order_id: order.id,
      handler: function (response) {
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
        router.push("/");  // Redirect to home or success page
      },
      prefill: {
        name: "John Doe",
        email: "johndoe@example.com",
        contact: "9876543210",
      },
      theme: {
        color: "#0a81ab",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Test Payment</h1>

        {amount ? (
          <>
            <p className="text-lg mb-4">Amount: ₹{amount}</p>
            <button
              onClick={handlePayment}
              disabled={!order}
              className="w-full mt-4 px-4 py-3 rounded-md text-white font-bold bg-green-500 hover:bg-green-600 transition"
            >
              {isProcessing ? "Processing..." : `Pay ₹${amount}`}
            </button>
          </>
        ) : (
          <p className="text-red-500 text-lg">No amount specified.</p>
        )}
      </div>
    </div>
  );
};

export default Payment;
