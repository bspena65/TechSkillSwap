import React from "react";
import { Link } from "react-router-dom";

type ButtonProps = {
  label: string;
  to?: string;
  variant?: "primary" | "secondary" | "social";
  icon?: React.ReactNode;
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  label,
  to="/",
  variant = "primary",
  icon,
  className = "",
}) => {
  let baseStyle =
    "px-4 py-2 rounded-[6px] px-[46px] font-bold h-[60px] max-w-[240px] flex items-center justify-center";

  switch (variant) {
    case "primary":
      baseStyle += " bg-transparent border border-white text-white hover:bg-zinc-700";
      break;
    case "secondary":
      baseStyle += " bg-gray-300 text-gray-900 hover:bg-zinc-400";
      break;
    case "social":
      baseStyle += " bg-gray-800 text-white hover:bg-zinc-900";
      break;
    default:
      baseStyle += " bg-blue-600 text-white hover:bg-zinc-700";
  }

  return (
    <Link to={to} className={`${baseStyle} ${className}`}>
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Link>
  );
};

export default Button;
