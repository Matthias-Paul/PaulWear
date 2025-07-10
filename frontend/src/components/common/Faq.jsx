import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const faqs = [
  {
    question: "How do I create an account?",
    answer: "Simply navigate to the Register Page by clicking on the Sign Up button in the navigation bar and follow the prompts. Once registered, you’ll be able to make purchases, and track your orders."
  },
  {
    question: "How do I pay for products?",
    answer: "We securely process payments using Paystack. Once you place an order, the payment is processed, and the vendor is notified to prepare and deliver your item."
  },
  {
    question: "Is it safe to buy from vendors on this platform?",
    answer: "Yes, we screen vendors before they can start selling. While we don't use a full escrow system, we monitor transactions closely to help ensure a safe buying experience for our customers."
  },
  {
    question: "When will my order be delivered?",
    answer: "Delivery times vary by vendor and location. After your order is confirmed, the vendor will process and ship it. You can track your order from your account under the 'Orders' section."
  },
  {
    question: "What happens if I don't receive my order?",
    answer: "If your order hasn’t arrived or if there’s a problem, please report it from your account. We’ll work with the vendor to resolve the issue and ensure you get a fair outcome."
  },
  {
    question: "How do I contact a vendor?",
    answer: "You can view and contact vendors by visiting their store page. Their contact information or chat option will be available there."
  },
  {
    question: "What is escrow and how does this platform protect me?",
    answer: "While we don’t use a traditional escrow system, we simulate a similar process by holding vendors accountable and providing support if issues arise. We encourage you to confirm your order delivery to help us maintain quality service."
  }
];


const Faq = () => {

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
     <div className="max-w-4xl mx-auto  pt-3 pb-20">
      <h2 className=" text-xl sm:text-3xl font-bold text-center mb-6 sm:mb-10">Frequently Asked Questions</h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = activeIndex === index;

          return (
            <div
              key={index}
              className="border border-gray-300 rounded-lg overflow-hidden shadow-sm transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full text-left cursor-pointer px-4 py-3 flex justify-between items-center text-gray-800 font-medium focus:outline-none hover:bg-gray-50 transition`}
              >
                <span>{faq.question}</span>
                <span>
                  {isOpen ? (
                    <FiChevronUp className="h-5 w-5 text-gray-600" />
                  ) : (
                    <FiChevronDown className="h-5 w-5 text-gray-600" />
                  )}
                </span>
              </button>

              <div
                className={`px-4 text-[14px] sm:text-[16px] text-gray-700 transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-40 py-3 opacity-100" : "max-h-0 opacity-0 py-0"
                } overflow-hidden`}
              >
                {faq.answer}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Faq;