import React from 'react';
import { motion } from 'motion/react';

export interface CardItem {
  id: string | number;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface AnimatedCardGridProps {
  items: CardItem[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', damping: 20, stiffness: 100 }
  }
};

export const AnimatedCardGrid: React.FC<AnimatedCardGridProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          whileHover={{ scale: 1.05 }}
          className="relative p-6 bg-paper-white dark:bg-forest-deep rounded-2xl shadow-sm border border-transparent hover:border-sage-muted/50 hover:shadow-[0_0_20px_rgba(156,175,136,0.3)] transition-all duration-300 ease-out flex flex-col justify-between"
        >
          <div>
            {item.icon && (
              <div className="mb-4 text-forest-deep dark:text-sage-muted">
                {item.icon}
              </div>
            )}
            <h3 className="text-xl font-serif font-bold text-forest-deep dark:text-paper-white mb-2">
              {item.title}
            </h3>
            <p className="text-on-surface-variant dark:text-paper-white/80 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedCardGrid;
