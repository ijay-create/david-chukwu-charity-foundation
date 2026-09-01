import { motion } from "framer-motion";

const Reveal = ({
  children,
  className = "",
  delay = 0,
  duration = 0.7,
  distance = 50
}) => {
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: distance
      }}
      whileInView={{
        opacity: 1,
        y: 0
      }}
      viewport={{
        once: false,
        amount: 0.15
      }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;