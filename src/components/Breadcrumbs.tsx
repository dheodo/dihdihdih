import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'motion/react';

interface BreadcrumbsProps {
  currentPage: 'home' | 'about' | 'services' | 'contact' | 'project' | 'reviews';
  onNavigate: (page: 'home' | 'about' | 'services' | 'contact' | 'project' | 'reviews') => void;
}

export default function Breadcrumbs({ currentPage, onNavigate }: BreadcrumbsProps) {
  if (currentPage === 'home') return null;

  const getPageLabel = () => {
    switch (currentPage) {
      case 'about':
        return 'About the Studio';
      case 'services':
        return 'Curation Services';
      case 'contact':
        return 'Contact Ateliers';
      case 'project':
        return 'Our Projects';
      case 'reviews':
        return 'Atmospheric Reviews';
      default:
        return '';
    }
  };

  return (
    <div className="bg-cream-soft/40 border-b border-sage-muted/[0.06]">
      <motion.nav 
        id="site-breadcrumbs"
        initial={{ opacity: 0, x: -10, boxShadow: 'none' }}
        animate={{ opacity: 1, x: 0, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.02 }}
        className="px-6 md:px-16 py-4 max-w-7xl mx-auto w-full" 
        aria-label="Breadcrumb"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex items-center space-x-2.5 text-xs font-label-caps tracking-widest text-sage-muted"
        >
          <button
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-1.5 text-sage-muted hover:text-forest-deep transition-colors duration-300 cursor-pointer focus:outline-none focus:ring-1 focus:ring-forest-deep/20 rounded-sm px-1 py-0.5"
            title="Navigate to Home"
          >
            <Home className="w-3.5 h-3.5 text-sage-muted/70 group-hover:text-forest-deep transition-colors duration-300" />
            <span className="font-medium relative pb-0.5">
              Home
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-forest-deep transition-transform duration-300 scale-x-0 group-hover:scale-x-100 origin-left" />
            </span>
          </button>
          
          <ChevronRight className="w-3 h-3 text-sage-muted/30 stroke-[2.5] mx-2" />
          
          <span className="text-forest-deep font-bold text-[11px] tracking-widest px-1 drop-shadow-sm transition-all duration-300 ease-in-out">
            {getPageLabel()}
          </span>
        </motion.div>
      </motion.nav>
    </div>
  );
}
