import { useEffect } from "react";

const Toast = ({ visible, message = "Added to cart successfully", onHide }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        if (onHide) onHide();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  return (
    <div
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 bg-primary-container text-white px-6 py-3 rounded-full font-label-sm text-label-sm shadow-xl transition-all duration-300 pointer-events-none z-[60] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
