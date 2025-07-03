import { forwardRef, useId } from "react";

function Select(
  { options = [], label, className = "", value, onChange, ...props },
  ref
) {
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
      <select
        id={id}
        ref={ref}
        value={value}
        onChange={onChange}
        className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-300 w-full ${className}`}
        {...props}
      >
        {props.placeholder && <option value="" disabled>{props.placeholder}</option>}
        {options.map((option) => (
            <option
            key={typeof option === 'string' ? option: option.value}
            value={typeof option === 'string' ? option: option.value}
            >
                {typeof option === 'string' ? option : option.label || option.value}
            </option>
        ))}
      </select>
    </div>
  );
}

export default forwardRef(Select);
