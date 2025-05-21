"use client";
import { motion } from "framer-motion";

const FadeIn = ({ className, children }) => {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
      transition={{ delay: 0.2, type: "linear", duration: 0.3 }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
