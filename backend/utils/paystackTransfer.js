import dotenv from "dotenv";

dotenv.config();



export const transferToVendor = async ({ amount, recipient, reason }) => {
    try {
      const response = await fetch("https://api.paystack.co/transfer", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          source: "balance",
          amount: amount * 100, // convert to kobo
          recipient,
          reason
        })
      });
  
      const data = await response.json();
  
      if (!response.ok || data.status !== true) {
        console.error("Paystack API error:", data);
        return {
          status: "failed",
          reference: null,
          message: data.message || "Transfer failed"
        };
      }
  
      return {
        status: "success",
        reference: data.data.reference,
        message: "Transfer completed"
      };
  
    } catch (err) {
      console.error("Paystack transfer error:", err);
      return {
        status: "failed",
        reference: null,
        message: err.message || "Transfer failed"
      };
    }
  };
  