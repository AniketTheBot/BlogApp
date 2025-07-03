import { forwardRef, useId } from "react";

function Input({ label, type = "text", className = "", ...props }, ref) {
  const id = useId();
  return (
    <div className="w-full mb-4">
      {label && (
        <label
          className="inline-block mb-1 pl-1 text-sm font-medium text-gray-700"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-300 w-full ${className}`}
        id={id}
        ref={ref}
        {...props}
      />
    </div>
  );
}

export default forwardRef(Input);
