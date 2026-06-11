import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { ArrowRight } from 'lucide-react';
import { extractImageUrl } from '../lib/hooks';

interface ProjectHoverCardProps {
  project: Project;
  onClick: () => void;
  index?: number;
  layoutId?: string;
}

// Lazy-initialized, shared premium AudioContext for haptic tones
let sharedAudioCtx: AudioContext | null = null;

const playHapticHover = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContextClass();
    }

    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }

    const ctx = sharedAudioCtx;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Pure, warm tone starting at 100Hz and gliding down quickly to 65Hz for a premium haptic thud feeling
    osc.type = 'sine';
    const startFreq = 105;
    const endFreq = 65;
    const duration = 0.08;

    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);

    // Fade-out envelope minimizes popping and keeps volume highly discrete and high-end
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.008); 
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Elegant fallback for browsers with strict policy blocks
  }
};

export const ProjectHoverCard: React.FC<ProjectHoverCardProps> = React.memo(({ project, onClick, index = 0, layoutId }) => {
  const [isExpandedMobile, setIsExpandedMobile] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, {
      rootMargin: '120px', // start loading when 120px from entering viewport
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleMouseEnter = () => {
    playHapticHover();
  };

  const handleMouseLeave = () => {
    setIsExpandedMobile(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) {
      if (!isExpandedMobile) {
        setIsExpandedMobile(true);
        e.stopPropagation();
        return;
      }
    }
    onClick();
  };

  return (
    <div 
      className={`group relative ${project.marginClass || ''}`}
    >
      <motion.div
        layoutId={layoutId}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ willChange: 'transform, opacity' }}
        className="relative overflow-hidden rounded-2xl cursor-pointer w-full h-full select-none transform transition-[transform,opacity,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(20,20,20,0.4)]"
      >
        <div 
          ref={containerRef}
          className="relative overflow-hidden rounded-2xl aspect-[4/5] sm:aspect-square md:aspect-[4/3] lg:aspect-square w-full bg-forest-deep/40 ring-1 ring-white/0 group-hover:ring-sage-muted/40"
        >
          {/* Subtle elegant skeleton and pulse placeholder while image is loading */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-stone-900/40 animate-pulse flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-sage-muted/20 border-t-sage-muted animate-spin" />
            </div>
          )}

          {isInView && (
            <img 
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover brightness-[0.88] transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
                isLoaded ? 'blur-0 scale-100 opacity-100' : 'blur-2xl scale-105 opacity-40'
              }`} 
              alt={project.title} 
              src={extractImageUrl(project.image) || "https://images.unsplash.com/photo-1518005020251-095c1bb275ee?q=80&w=2000&auto=format&fit=crop"}
              onLoad={() => setIsLoaded(true)}
              onError={(e) => {
                console.error("Image loading failed for URL:", project.image);
                setIsLoaded(true);
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518005020251-095c1bb275ee?q=80&w=2000&auto=format&fit=crop';
              }}
              style={{ willChange: 'transform, filter, opacity' }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/20 to-transparent opacity-65 group-hover:opacity-85 transition-opacity duration-300"></div>
          
          <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-sage-muted"></span>
                <span className="font-label-caps text-sm uppercase tracking-widest text-sage-muted">
                  {project.category} · {project.subtitle}
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-serif text-paper-white leading-tight truncate font-bold">
                {project.title}
              </h3>
              
              <div
                style={{
                  height: isExpandedMobile ? 'auto' : 0,
                  opacity: isExpandedMobile ? 1 : 0,
                  marginTop: isExpandedMobile ? 12 : 0,
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="overflow-hidden md:hidden"
              >
                <p className="font-body-md text-sm text-paper-white/80 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
                <div className="mt-4 flex items-center text-xs font-label-caps text-sage-muted uppercase tracking-widest gap-1.5 font-bold">
                  Tap again to view full project
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
            
            <div 
              className="bg-paper-white/15 backdrop-blur-md p-3 rounded-full text-paper-white group-hover:bg-sage-muted group-hover:text-forest-deep group-hover:scale-105 group-hover:translate-x-0 opacity-0 translate-x-3 group-hover:opacity-100 transition-[transform,opacity,background-color,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hidden md:block shrink-0"
              style={{ willChange: 'transform, opacity' }}
            >
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}, (prevProps, nextProps) => {
  return prevProps.project.id === nextProps.project.id &&
         prevProps.index === nextProps.index &&
         prevProps.layoutId === nextProps.layoutId;
});

export default ProjectHoverCard;
