function Button({
  children,
  type = "button",
  bgColor = "",
  textColor = "text-white",
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-lg ${bgColor} ${textColor} hover:opacity-90 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
