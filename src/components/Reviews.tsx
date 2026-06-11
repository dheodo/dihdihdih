import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface ReviewsProps {
  onOpenInquiry: (serviceName?: string) => void;
}

export default function Reviews({ onOpenInquiry }: ReviewsProps) {
  useEffect(() => {
    // Dynamically script-inject the SociableKit google-reviews widget
    if (!document.querySelector('script[src="https://widgets.sociablekit.com/google-reviews/widget.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://widgets.sociablekit.com/google-reviews/widget.js';
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
      className="py-24 bg-paper-white"
    >
      <div className="px-6 md:px-16 max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="font-label-caps text-xs tracking-widest text-sage-muted block uppercase mb-3 font-bold">Client Narratives</span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif uppercase tracking-tight text-forest-deep mb-4 font-bold font-extrabold">
            Atmospheric Reviews & Audits
          </h1>
          <p className="text-forest-deep/70 max-w-2xl leading-relaxed text-sm md:text-base">
            Read honest reflections and structural spatial assessments shared by the homeowners, showroom curators, and commercial developers who partner with Maintenance Masters.
          </p>
        </div>

        {/* Dynamic SociableKit Google Reviews Widget Container */}
        <div className="bg-cream-soft/30 rounded-3xl p-4 md:p-8 border border-sage-muted/10 min-h-[500px] flex flex-col justify-start">
          <div className="sk-ww-google-reviews" data-embed-id="25684655"></div>
        </div>
      </div>
    </motion.div>
  );
}
