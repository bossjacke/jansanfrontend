import React from "react";
import { motion } from "framer-motion";

const flipVariants = {
  initial: {
    rotateY: -90,
    opacity: 0,
    transformOrigin: "left center",
  },
  animate: {
    rotateY: 0,
    opacity: 1,
    transformOrigin: "left center",
  },
  exit: {
    rotateY: 90,
    opacity: 0,
    transformOrigin: "right center",
  },
};

export default function PageFlip({ children }) {
  return (
    <motion.div
      variants={flipVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="page-flip"
    >
      {children}
    </motion.div>
  );
}
