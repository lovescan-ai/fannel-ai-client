interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseClasses =
    "px-4 py-2 rounded-lg font-medium transition-colors duration-200 ease-in-out";
  const variantClasses = {
    default: "bg-blue-500 text-white hover:bg-blue-600",
    outline:
      "border border-brandBlue4x text-brandBlue4x hover:bg-brandBlue4x/10",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
