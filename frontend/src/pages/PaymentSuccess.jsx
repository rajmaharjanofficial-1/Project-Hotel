import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const PaymentSuccess = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(search);

      const pidx = params.get("pidx");
      const status = params.get("status");
      const bookingId = params.get("bookingId");

      if (!pidx || status !== "Completed") {
        toast.error("Payment not completed");
        navigate("/my-bookings", { replace: true });
        return;
      }

      try {
        const { data } = await axios.post("/api/payment/khalti/verify", {
          pidx,
          bookingId,
        });

        if (data.success) {
          toast.success("Payment successful 🎉");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Payment verification failed");
      } finally {
        navigate("/my-bookings", { replace: true });
      }
    };

    verifyPayment();
  }, [search, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-gray-600">
        Verifying your payment, please wait…
      </p>
    </div>
  );
};

export default PaymentSuccess;
