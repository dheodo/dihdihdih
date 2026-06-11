import { motion } from 'motion/react';

interface TextRevealProps {
  text: string;
  className?: string;
}

const textRevealVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function TextReveal({ text, className = "" }: TextRevealProps) {
  return (
    <motion.span
      variants={textRevealVariants}
      className={`inline-block ${className}`}
    >
      {text}
    </motion.span>
  );
}
