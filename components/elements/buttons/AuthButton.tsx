import React from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

interface AuthButtonProps {
  id?: string;
  btnText?: string;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  bgColor?: string;
  textColor?: string;
  textSize?: string;
  disabled?: boolean;
  maxWidth?: string;
  hasIcon?: boolean;
  icon?: React.ReactNode;
  border?: string;
  disabledStyle?: string;
  width?: string;
  borderRadius?: string;
  padding?: string;
  handleClick?: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  id,
  btnText = "Sign up with Google",
  type = "button",
  loading = false,
  bgColor = "bg-black",
  textColor = "text-white",
  textSize = "text-sm",
  disabled = false,
  maxWidth = "w-full mx-auto",
  hasIcon = false,
  icon,
  border = "",
  disabledStyle = "disabled:bg-brandGray10x disabled:text-white cursor-progress",
  width = "w-full",
  borderRadius = "rounded-10",
  padding = "py-2.5 px-6",
  handleClick,
}) => {
  return (
    <motion.button
      id={id}
      disabled={disabled || loading}
      type={type}
      onClick={handleClick}
      className={`
        ${bgColor} ${border} ${disabled ? disabledStyle : ""} ${maxWidth}
        ${textSize} font-medium ${textColor} ${padding} ${width} ${borderRadius}
        flex items-center justify-center gap-2
      `}
      whileHover={{ scale: 1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {loading && <Loader className="w-4 h-4 animate-spin" />}
      {hasIcon && !loading && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {icon || <GoogleIcon />}
        </motion.div>
      )}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {btnText}
      </motion.span>
    </motion.button>
  );
};

const GoogleIcon: React.FC = () => (
  <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_3204_2048)">
      <path
        d="M23.594 9.91355L13.8046 9.91309C13.3724 9.91309 13.022 10.2634 13.022 10.6957V13.823C13.022 14.2552 13.3724 14.6056 13.8046 14.6056H19.3174C18.7137 16.1722 17.587 17.4842 16.1496 18.3178L18.5002 22.387C22.2709 20.2062 24.5002 16.3799 24.5002 12.0965C24.5002 11.4866 24.4553 11.0506 24.3653 10.5597C24.297 10.1867 23.9732 9.91355 23.594 9.91355Z"
        fill="#167EE6"
      />
      <path
        d="M12.4998 19.3043C9.80193 19.3043 7.44675 17.8303 6.18182 15.649L2.11279 17.9944C4.1835 21.5832 8.06259 24 12.4998 24C14.6765 24 16.7304 23.4139 18.4998 22.3925V22.387L16.1491 18.3177C15.0739 18.9414 13.8297 19.3043 12.4998 19.3043Z"
        fill="#12B347"
      />
      <path
        d="M18.5 22.3925V22.387L16.1494 18.3177C15.0741 18.9413 13.83 19.3043 12.5 19.3043V24C14.6767 24 16.7308 23.4139 18.5 22.3925Z"
        fill="#0F993E"
      />
      <path
        d="M5.19566 12C5.19566 10.6702 5.55856 9.42613 6.18205 8.35096L2.11302 6.00562C1.08603 7.76938 0.5 9.81772 0.5 12C0.5 14.1823 1.08603 16.2307 2.11302 17.9945L6.18205 15.6491C5.55856 14.5739 5.19566 13.3298 5.19566 12Z"
        fill="#FFD500"
      />
      <path
        d="M12.4998 4.69566C14.259 4.69566 15.875 5.32078 17.1372 6.36061C17.4486 6.61711 17.9012 6.59859 18.1864 6.31336L20.4022 4.09758C20.7258 3.77395 20.7028 3.24422 20.3571 2.94431C18.2423 1.10967 15.4907 0 12.4998 0C8.06259 0 4.1835 2.41673 2.11279 6.00558L6.18182 8.35092C7.44675 6.16969 9.80193 4.69566 12.4998 4.69566Z"
        fill="#FF4B26"
      />
      <path
        d="M17.1374 6.36061C17.4488 6.61711 17.9015 6.59859 18.1866 6.31336L20.4024 4.09758C20.726 3.77395 20.7029 3.24422 20.3573 2.94431C18.2425 1.10963 15.491 0 12.5 0V4.69566C14.2592 4.69566 15.8752 5.32078 17.1374 6.36061Z"
        fill="#D93F21"
      />
    </g>
    <defs>
      <clipPath id="clip0_3204_2048">
        <rect width="24" height="24" fill="white" transform="translate(0.5)" />
      </clipPath>
    </defs>
  </svg>
);

export default AuthButton;
