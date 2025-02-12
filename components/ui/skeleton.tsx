import React from "react";
import { motion } from "framer-motion";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "20px",
  borderRadius = "4px",
}) => {
  return (
    <motion.div
      style={{
        width,
        height,
        borderRadius,
        background:
          "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
        backgroundSize: "200% 100%",
      }}
      animate={{
        backgroundPosition: ["100% 0%", "-100% 0%"],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

export default Skeleton;
