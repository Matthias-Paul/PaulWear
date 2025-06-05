import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const faqs = [
  {
    question: "How do I create an account?",
    answer: "Simply navigate to the Register Page by clicking on the sign up button on the nav bar and follow the instructions. Once registered, you'll be able to browse stores, make purchases, and track your orders."
  },
  {
    question: "How do I pay for products?",
    answer: "Payments are securely processed through our platform using Paystack. Your money is held in escrow until you confirm that you've received your order in good condition."
  },
  {
    question: "Is it safe to buy from vendors on this platform?",
    answer: "Absolutely! We verify all vendors before they are approved to sell. Payments are also held in escrow until you confirm receipt of your order, ensuring a safe buying experience."
  },
  {
    question: "When will my order be delivered?",
    answer: "Delivery times vary depending on the vendor and location. Once your order is confirmed, the vendor will process and deliver it. You can track your order under the 'Orders' section of your account."
  },
  {
    question: "What happens if I don't receive my order?",
    answer: "If you don't receive your order or it arrives damaged, please report the issue through your account. Our support team will step in to resolve the matter and ensure a fair outcome."
  },
  {
    question: "How do I contact a vendor?",
    answer: "Visit the vendor's store page view their contact information on their store page."
  },
  {
    question: "What is escrow and how does it protect me?",
    answer: "Escrow ensures your money is safe. When you pay for an order, your payment is held securely and only released to the vendor when you confirm that you've received your order."
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