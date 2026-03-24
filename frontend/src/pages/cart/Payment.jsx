import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, resetOrderCreated } from "../../redux/slices/orderSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import CheckoutSteps from "../../components/cart/CheckoutSteps";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

// ✅ YOUR UPI ID — change this to your actual UPI ID
const YOUR_UPI_ID = "7895973409@ptyes";
const YOUR_UPI_NAME = "Smart-Retech Store";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { items, shippingInfo } = useSelector((state) => state.cart);
  const { loading, orderCreated } = useSelector((state) => state.order);

  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' | 'upi'
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [upiStep, setUpiStep] = useState("select"); // 'select' | 'scan' | 'confirm'
  const [utrNumber, setUtrNumber] = useState("");
  const [utrError, setUtrError] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
      return;
    }
    if (!shippingInfo.address) {
      navigate("/shipping");
      return;
    }
  }, [items, shippingInfo, navigate]);

  useEffect(() => {
    if (orderCreated) {
      dispatch(resetOrderCreated());
      dispatch(clearCart());
      navigate("/orders/success");
    }
  }, [orderCreated, navigate, dispatch]);

  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  if (!orderInfo) {
    navigate("/cart");
    return null;
  }

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } = orderInfo;

  // Build UPI deep link for QR code (using Google Charts API for QR)
  const upiLink = `upi://pay?pa=${YOUR_UPI_ID}&pn=${encodeURIComponent(YOUR_UPI_NAME)}&am=${totalPrice}&cu=INR&tn=${encodeURIComponent("Smart-Retech Order Payment")}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`;

  // Validate UTR number
  const validateUTR = (value) => {
    if (!value.trim()) return "Please enter UTR / Transaction ID";
    if (value.trim().length < 8)
      return "UTR number must be at least 8 characters";
    return "";
  };

  // Place Order
  const placeOrder = async (method, utr = null) => {
    try {
      setPaymentLoading(true);

      const paymentInfo =
        method === "cod"
          ? {
              id: "COD_" + Date.now(),
              status: "pending",
              method: "COD",
            }
          : {
              id: utr.trim(),
              status: "pending_verification",
              method: "UPI",
              utrNumber: utr.trim(),
            };

      const order = {
        shippingInfo,
        orderItems: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          product: item.product,
        })),
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      };

      await dispatch(createOrder(order)).unwrap();

      if (method === "cod") {
        toast.success("✅ Order placed! Pay on delivery.");
      } else {
        toast.success("✅ Order placed! Payment will be verified shortly.");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to place order. Try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  // Handle COD
  const handleCOD = () => {
    placeOrder("cod");
  };

  // Handle UPI — go to scan step
  const handleUPINext = () => {
    if (paymentMethod === "upi") {
      setUpiStep("scan");
    }
  };

  // Handle UPI confirmation after payment
  const handleUPIConfirm = () => {
    const error = validateUTR(utrNumber);
    if (error) {
      setUtrError(error);
      return;
    }
    setUtrError("");
    placeOrder("upi", utrNumber);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom max-w-2xl">
        <CheckoutSteps currentStep={3} />

        <div className="bg-white rounded-lg shadow-md p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment</h2>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Items</span>
                <span>₹{itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>₹{taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shippingPrice.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* ─── UPI SCAN STEP ─── */}
          {upiStep === "scan" && (
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <h3 className="font-bold text-blue-900 text-lg mb-1">
                  Scan & Pay ₹{totalPrice.toFixed(2)}
                </h3>
                <p className="text-blue-700 text-sm mb-4">
                  Scan the QR code below using any UPI app (PhonePe, GPay,
                  Paytm, etc.)
                </p>

                {/* QR Code */}
                <div className="flex justify-center mb-4">
                  <img
                    src={qrUrl}
                    alt="UPI QR Code"
                    className="rounded-lg border-4 border-white shadow-lg"
                    width={200}
                    height={200}
                  />
                </div>

                {/* UPI ID */}
                <div className="bg-white rounded-lg p-3 mb-4 border border-blue-200">
                  <p className="text-xs text-gray-500 mb-1">UPI ID</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-bold text-gray-900 text-lg">
                      {YOUR_UPI_ID}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(YOUR_UPI_ID);
                        toast.success("UPI ID copied!");
                      }}
                      className="text-xs text-blue-600 border border-blue-300 rounded px-2 py-1 hover:bg-blue-50"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <p className="text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2 text-xs">
                  ⚠️ After payment, click "I Have Paid" to enter your UTR number
                  for confirmation.
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={() => setUpiStep("select")}
                  variant="outline"
                  className="flex-1"
                >
                  ← Back
                </Button>
                <Button
                  onClick={() => setUpiStep("confirm")}
                  variant="primary"
                  className="flex-1"
                >
                  ✅ I Have Paid
                </Button>
              </div>
            </div>
          )}

          {/* ─── UTR CONFIRMATION STEP ─── */}
          {upiStep === "confirm" && (
            <div className="mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-green-900 text-lg mb-2">
                  ✅ Confirm Your Payment
                </h3>
                <p className="text-green-700 text-sm mb-4">
                  Enter your UTR / Transaction ID from your UPI app to confirm
                  payment of <strong>₹{totalPrice.toFixed(2)}</strong>
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    UTR / Transaction ID *
                  </label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => {
                      setUtrNumber(e.target.value);
                      if (utrError) setUtrError(validateUTR(e.target.value));
                    }}
                    placeholder="e.g. 123456789012 or T2503231234"
                    className={`w-full border rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      utrError ? "border-red-400 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  {utrError && (
                    <p className="text-red-600 text-xs mt-1">⚠️ {utrError}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">
                    Find UTR in your UPI app → Transaction History → Details
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-yellow-800">
                  📋 Your order will be placed immediately. Our team will verify
                  the payment within 2–4 hours. You'll receive a confirmation
                  email once verified.
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={() => setUpiStep("scan")}
                  variant="outline"
                  className="flex-1"
                >
                  ← Back
                </Button>
                <Button
                  onClick={handleUPIConfirm}
                  disabled={paymentLoading || loading}
                  variant="primary"
                  className="flex-1"
                >
                  {paymentLoading || loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="spinner w-5 h-5"></div>
                      Placing Order...
                    </span>
                  ) : (
                    "Confirm & Place Order"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* ─── PAYMENT METHOD SELECTION ─── */}
          {upiStep === "select" && (
            <>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Select Payment Method
                </h3>
                <div className="space-y-3">
                  {/* COD Option */}
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="cod"
                        name="payment"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="accent-blue-600"
                      />
                      <label htmlFor="cod" className="flex-1 cursor-pointer">
                        <span className="font-medium text-gray-900">
                          🚚 Cash on Delivery (COD)
                        </span>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Pay with cash when your order is delivered
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* UPI Option */}
                  <div
                    onClick={() => setPaymentMethod("upi")}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === "upi"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        id="upi"
                        name="payment"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                        className="accent-blue-600"
                      />
                      <label htmlFor="upi" className="flex-1 cursor-pointer">
                        <span className="font-medium text-gray-900">
                          📱 UPI Payment (QR Code)
                        </span>
                        <p className="text-sm text-gray-500 mt-0.5">
                          Pay via PhonePe, Google Pay, Paytm or any UPI app
                        </p>
                      </label>
                    </div>

                    {/* Show UPI apps icons when selected */}
                    {paymentMethod === "upi" && (
                      <div className="flex gap-2 mt-3 ml-8">
                        {["PhonePe", "GPay", "Paytm", "BHIM"].map((app) => (
                          <span
                            key={app}
                            className="text-xs bg-white border border-gray-200 rounded px-2 py-1 text-gray-600"
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {paymentMethod === "cod" ? (
                  <Button
                    onClick={handleCOD}
                    disabled={paymentLoading || loading}
                    variant="primary"
                    className="w-full"
                  >
                    {paymentLoading || loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="spinner w-5 h-5"></div>
                        Placing Order...
                      </span>
                    ) : (
                      "🚚 Place Order (Cash on Delivery)"
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleUPINext}
                    variant="primary"
                    className="w-full"
                  >
                    📱 Proceed to Pay ₹{totalPrice.toFixed(2)} via UPI
                  </Button>
                )}

                <Button
                  onClick={() => navigate("/order/confirm")}
                  variant="outline"
                  className="w-full"
                >
                  ← Back to Confirm Order
                </Button>
              </div>
            </>
          )}

          {/* Security Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              🔒 Your order information is secure and encrypted. Smart-Retech
              guarantees safe transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
