import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { IMAGES } from '../data';
import { extractImageUrl } from '../lib/hooks';
import { X, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, ChevronDown, Maximize2 } from 'lucide-react';

interface ProjectPageProps {
  onProjectSelect: (project: Project) => void;
  onNavigateToContact?: () => void;
  projects: Project[];
  loading: boolean;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1518005020251-095c1bb275ee?q=80&w=2000&auto=format&fit=crop";

const ProjectCardItem = ({ 
  project, 
  onClick, 
  itemVariants, 
  imageVariants 
}: { 
  project: Project; 
  onClick: () => void; 
  itemVariants: any; 
  imageVariants: any;
  key?: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <motion.div 
      onClick={onClick}
      className="cursor-pointer group p-4 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-stone-200/50 hover:bg-cream-soft/30"
      variants={itemVariants}
    >
      <motion.div variants={imageVariants} className="relative overflow-hidden rounded-lg mb-4 bg-forest-deep/10 aspect-[4/3] sm:aspect-square w-full">
        {!isLoaded && (
          <div className="absolute inset-0 bg-stone-900/10 animate-pulse flex items-center justify-center">
            <div className="w-5 h-5 rounded-full border-2 border-sage-muted/20 border-t-sage-muted animate-spin" />
          </div>
        )}
        <img 
          referrerPolicy="no-referrer"
          src={extractImageUrl(project.image) || PLACEHOLDER_IMAGE} 
          alt={project.title} 
          className={`w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
            isLoaded ? 'blur-0 opacity-100' : 'blur-xl opacity-40 scale-105'
          }`}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            setIsLoaded(true);
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-forest-deep/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-6 text-center">
          <p className="font-label-caps text-sm tracking-widest uppercase mb-1 font-bold">{project.location}</p>
          <p className="font-serif text-lg font-bold">{project.year}</p>
        </div>
      </motion.div>
      <h3 className="font-headline-sm text-headline-sm font-serif text-forest-deep font-bold transition-all duration-300 group-hover:tracking-[0.05em] mb-1">{project.title}</h3>
      <p className="text-sage-muted text-lg font-serif mb-1 font-bold">{project.subtitle}</p>
    </motion.div>
  );
};

import { ProjectSkeleton } from './ProjectSkeleton';

export default function ProjectPage({ onProjectSelect, onNavigateToContact, projects, loading }: ProjectPageProps) {
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const categories = ['all', 'residential', 'commercial', 'renovation', 'kitchen&bath', 'office design', 'plumber', 'furniture maker', 'painting', 'roofing services', 'electrician'];

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    setIsCategoryOpen(false);
  };

  // Safe guard in case filteredProjects is empty or current index is out of bounds
  const currentProjectPool = filteredProjects.length > 0 ? filteredProjects : projects;
  
  const expandedIndex = expandedProject ? currentProjectPool.findIndex(p => p.id === expandedProject.id) : 0;
  // Fallback to 0 if not found in current pool
  const currentIndex = expandedIndex >= 0 ? expandedIndex : 0;
  
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (currentIndex + 1) % currentProjectPool.length;
    setExpandedProject(currentProjectPool[nextIndex]);
    setActiveImage(null);
  };
  
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex = (currentIndex - 1 + currentProjectPool.length) % currentProjectPool.length;
    setExpandedProject(currentProjectPool[prevIndex]);
    setActiveImage(null);
  };

  const handleClose = () => {
    setExpandedProject(null);
    setActiveImage(null);
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "tween",
        ease: "easeOut",
        duration: 0.25
      }
    },
    exit: {
      opacity: 0,
      y: 8,
      transition: { duration: 0.15, ease: "easeIn" }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: {
        type: "tween",
        ease: "easeOut",
        duration: 0.25
      }
    },
  };

  const galleryList = expandedProject
    ? (expandedProject.galleryImages || []).filter((img): img is string => typeof img === 'string' && img.trim() !== '')
    : [];

  const currentMainImage = expandedProject ? (extractImageUrl(activeImage || expandedProject.image) || PLACEHOLDER_IMAGE) : PLACEHOLDER_IMAGE;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-14 xs:py-16 md:py-24 bg-paper-white"
    >
      <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <h1 className="text-2xl sm:text-4xl md:font-display-lg font-serif uppercase tracking-tight text-forest-deep mb-0 font-bold font-extrabold">
            Our Projects
          </h1>
          
          <div className="relative">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="px-6 py-3 bg-cream-soft border border-sage-muted/20 rounded-full flex items-center gap-4 text-xs font-label-caps tracking-[0.2em] uppercase text-forest-deep transition-all hover:bg-forest-deep/5 active:scale-95 group min-w-[200px] justify-between"
              aria-expanded={isCategoryOpen}
            >
              <span className="flex items-center gap-2">
                <span className="text-sage-muted/60">Category:</span>
                <span className="font-extrabold">{activeCategory}</span>
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isCategoryOpen && (
                <>
                  {/* Backdrop for closing */}
                  <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute right-0 top-full mt-3 w-64 bg-paper-white border border-sage-muted/15 rounded-2xl shadow-2xl overflow-hidden z-50 py-2 origin-top-right"
                  >
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={`w-full px-6 py-4 flex items-center justify-between text-left transition-colors hover:bg-cream-soft group/item ${
                          activeCategory === cat ? 'bg-forest-deep text-paper-white' : 'text-forest-deep'
                        }`}
                      >
                        <span className="font-label-caps text-xs tracking-widest uppercase truncate font-bold">{cat}</span>
                        {activeCategory === cat && (
                          <div className="w-1.5 h-1.5 rounded-full bg-paper-white animate-pulse" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <motion.div 
          id="project-page-root"
          key={activeCategory}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <ProjectSkeleton key={i} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCardItem
                  key={project.id}
                  project={project}
                  itemVariants={item}
                  imageVariants={imageVariants}
                  onClick={() => {
                    setExpandedProject(project);
                    setActiveImage(null);
                  }}
                />
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {expandedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-forest-deep/96"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.98, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 10, opacity: 0 }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.22 }}
              className="bg-cream-soft rounded-2xl w-full max-w-4xl max-h-[94vh] overflow-hidden flex flex-col relative transform-gpu"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                  onClick={handlePrev}
                  className="absolute left-4 top-1/3 -translate-y-1/2 p-3 bg-paper-white/80 rounded-full hover:bg-paper-white transition-colors z-10 text-forest-deep shadow-md"
                  aria-label="Previous Project"
              >
                  <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                  onClick={handleNext}
                  className="absolute right-4 top-1/3 -translate-y-1/2 p-3 bg-paper-white/80 rounded-full hover:bg-paper-white transition-colors z-10 text-forest-deep shadow-md"
                  aria-label="Next Project"
              >
                  <ChevronRight className="w-6 h-6" />
              </button>
              
              <div className="p-4 xs:p-6 md:p-8 overflow-y-auto">
                <button 
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 bg-paper-white rounded-full hover:bg-forest-deep/10 transition-colors z-10"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-forest-deep" />
                </button>
                
                <h2 className="font-headline-md text-headline-sm md:text-headline-md font-serif text-forest-deep font-bold mb-4 pr-10">{expandedProject.title}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                    <div className="relative overflow-hidden rounded-lg aspect-[4/3] w-full h-auto bg-stone-100/50 shadow-sm border border-sage-muted/10 group">
                        <AnimatePresence mode="wait">
                          <motion.img 
                            key={currentMainImage}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            src={currentMainImage} 
                            alt={expandedProject.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                            onError={(e: any) => {
                              e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2670&auto=format&fit=crop';
                            }}
                          />
                        </AnimatePresence>

                        {/* Reset to Main Button */}
                        <AnimatePresence>
                          {activeImage && (
                            <motion.button
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              onClick={() => setActiveImage(null)}
                              className="absolute bottom-4 right-4 px-4 py-2 bg-paper-white/90 backdrop-blur-md text-forest-deep rounded-full text-[10px] font-label-caps tracking-widest font-bold shadow-lg hover:bg-paper-white transition-all flex items-center gap-2 z-20 group/reset border border-forest-deep/10 uppercase"
                            >
                              <RotateCcw className="w-3 h-3 transition-transform group-hover/reset:-rotate-45" />
                              Display Image
                            </motion.button>
                          )}
                        </AnimatePresence>

                        {/* Fullscreen Expand Button Desktop */}
                        <button
                          onClick={() => setFullscreenImage(currentMainImage)}
                          className="absolute bottom-4 right-4 z-20 bg-forest-deep/60 backdrop-blur-md text-paper-white hover:bg-forest-deep hover:text-white p-2.5 rounded-full transition-all cursor-pointer opacity-0 group-hover:opacity-100 hidden md:block border border-paper-white/20"
                          aria-label="View Fullscreen"
                        >
                          <Maximize2 className="w-5 h-5" />
                        </button>
                        {/* Fullscreen Expand Button Mobile */}
                        <button
                          onClick={() => setFullscreenImage(currentMainImage)}
                          className="absolute bottom-3 right-3 z-20 bg-forest-deep/40 backdrop-blur-md text-paper-white active:bg-forest-deep p-2 rounded-full transition-all cursor-pointer md:hidden shadow-sm border border-paper-white/20"
                          aria-label="View Fullscreen"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="space-y-4 flex flex-col justify-between">
                        <div>
                          <p className="font-serif text-xl text-sage-muted mb-1 font-bold">{expandedProject.subtitle}</p>
                          <div className="max-h-none overflow-visible md:max-h-56 md:overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
                            <p className="text-forest-deep/80 leading-relaxed text-sm md:text-base">
                              {expandedProject.description}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 pt-4 border-t border-sage-muted/15 font-mono text-xs text-forest-deep">
                            <p className="flex items-center gap-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-forest-deep opacity-60"></span>
                                <strong>Location:</strong> {expandedProject.location}
                            </p>
                            <p className="flex items-center gap-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-forest-deep opacity-60"></span>
                                <strong>Year Completed:</strong> {expandedProject.year}
                            </p>
                        </div>
                    </div>
                </div>

                {galleryList.length > 0 && (
                    <div className="mt-6 border-t border-sage-muted/15 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-headline-sm text-sm md:text-base font-serif text-forest-deep font-bold font-extrabold">Project Showcase Gallery</h3>
                            <span className="text-[10px] text-sage-muted tracking-widest uppercase font-label-caps bg-sage-muted/10 px-2 py-0.5 rounded">
                                Scroll & Click Thumbnail to Preview
                            </span>
                        </div>
                        
                        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-forest-deep/20 scrollbar-track-transparent group/gallery">
                            {galleryList.map((img, idx) => {
                                const isActive = currentMainImage === (extractImageUrl(img) || PLACEHOLDER_IMAGE);
                                return (
                                    <div 
                                        key={idx} 
                                        onClick={() => setActiveImage(img)}
                                        className={`relative group h-28 w-40 xs:h-36 xs:w-52 md:h-44 md:w-64 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer snap-start transition-all duration-300 focus:outline-none ${
                                            isActive 
                                                ? 'ring-2 ring-forest-deep ring-offset-2 scale-[0.97] shadow-md' 
                                                : 'border border-sage-muted/10 hover:scale-[1.03] hover:shadow-xl group-hover/gallery:opacity-60 hover:!opacity-100'
                                        }`}
                                    >
                                        <img 
                                            src={extractImageUrl(img) || PLACEHOLDER_IMAGE} 
                                            alt={`${expandedProject.title} gallery thumbnail ${idx}`} 
                                            className={`h-full w-full object-cover transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-105'}`}
                                            referrerPolicy="no-referrer"
                                            loading="lazy"
                                            decoding="async"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                                            }}
                                        />
                                        <div className={`absolute inset-0 bg-forest-deep/20 transition-opacity duration-300 ${isActive ? 'opacity-10' : 'opacity-0 group-hover:opacity-40'}`}></div>
                                        <span className="absolute bottom-2 left-2 bg-paper-white/90 backdrop-blur-sm text-[8px] text-forest-deep font-label-caps px-2 py-0.5 rounded tracking-wider shadow-sm uppercase">
                                            {idx === 0 ? 'Cover Space' : `Perspective ${idx}`}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button 
                       onClick={() => {
                           onProjectSelect(expandedProject);
                           handleClose();
                       }}
                       className="flex-1 py-4 bg-forest-deep text-paper-white rounded-full font-label-caps text-xs tracking-widest hover:bg-forest-deep/90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md uppercase"
                    >
                       DISCUSS THIS PROJECT
                       <ArrowRight className="w-4 h-4" />
                    </button>
                    {onNavigateToContact && (
                      <button 
                         onClick={() => {
                             onNavigateToContact();
                             handleClose();
                         }}
                         className="flex-1 py-4 bg-cream-soft text-forest-deep border border-forest-deep/20 rounded-full font-label-caps text-xs tracking-widest hover:bg-forest-deep hover:text-paper-white hover:border-forest-deep transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md uppercase"
                      >
                         Go to Contact Page
                         <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-950/95 z-[200] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setFullscreenImage(null)}
          >
            <button 
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[210] bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all cursor-pointer backdrop-blur-md"
              aria-label="Close Fullscreen"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full h-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={fullscreenImage} 
                alt="Fullscreen view" 
                className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
