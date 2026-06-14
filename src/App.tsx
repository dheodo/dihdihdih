import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Counter } from './components/Counter';
import { 
  Menu, 
  X, 
  Star, 
  Wrench, 
  Users, 
  Recycle, 
  Mail, 
  Check, 
  ArrowRight, 
  Phone, 
  MapPin, 
  Calendar, 
  Send,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Maximize2,
  Instagram
} from 'lucide-react';
import { SERVICES, BELIEFS, TRUSTED_COMPANIES, IMAGES, TESTIMONIALS } from './data';
import { Project, LeadInquiry } from './types';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Contact from './components/Contact';
import ProjectHoverCard from './components/ProjectHoverCard';
import ProjectPage from './components/ProjectPage';
import Reviews from './components/Reviews';
import Breadcrumbs from './components/Breadcrumbs';
import { TextReveal } from './components/TextReveal';
import { useFirebaseProjects, extractImageUrl } from './lib/hooks';
import { Helmet } from 'react-helmet-async';

// Metadata configuration for different pages to optimize search indexing
const METADATA_BY_PAGE: Record<string, { title: string; description: string; keywords: string }> = {
  home: {
    title: "Maintenance Masters | Luxury Interior Curation & Renovation",
    description: "Discover Maintenance Masters, an elite interior design and architectural renovation agency in India. We curate exquisite living spaces blending modern aesthetics with functional luxury.",
    keywords: "luxury interior design Navi Mumbai, turnkey home renovation Navi Mumbai, best interior designers in Navi Mumbai, commercial office interior fitouts Navi Mumbai, sustainable home decor Navi Mumbai, custom modular kitchen Navi Mumbai, expert residential renovation contractors Navi Mumbai, modern villa landscaping Navi Mumbai, Vastu-compliant interior design Navi Mumbai, luxury apartment fit-outs Navi Mumbai, bespoke furniture design Navi Mumbai, elite facility maintenance services Navi Mumbai, civil contractors Navi Mumbai, interior decorators Navi Mumbai, best home interior designers Navi Mumbai, turnkey interior solutions Navi Mumbai, modern apartment renovation Navi Mumbai, residential architects Navi Mumbai"
  },
  about: {
    title: "About Our Craft | Maintenance Masters",
    description: "Learn about the architectural vision, philosophy, and master craftsmen behind Maintenance Masters. Delivering timeless interior transformations since 2012.",
    keywords: "about Maintenance Masters, luxury home renovators, elite interior designer team Navi Mumbai, structural renovation experts Navi Mumbai, sustainable luxury design, bespoke furniture craft architecture, professional home renovation contractors Navi Mumbai"
  },
  services: {
    title: "Premium Services | Luxury Interior Renovations & Space Curation",
    description: "Explore our masterclass design and maintenance services, including full-home bespoke architecture, luxury landscape planning, and structural restorations.",
    keywords: "luxury interior styling services, modular kitchen renovation Navi Mumbai, high-end bathroom interior styling, custom home architecture Navi Mumbai, premium facility maintenance Navi Mumbai, plumbing electrical repairs Navi Mumbai, residential interior services Navi Mumbai, turnkey home office design, custom furniture fabrication Navi Mumbai"
  },
  project: {
    title: "Exquisite Signature Portfolio | Maintenance Masters",
    description: "Browse our hand-curated portfolio of premium architectural highlights, penthouse design loops, and luxury living room transformations across Navi Mumbai and beyond.",
    keywords: "interior design portfolio Navi Mumbai, penthouse styling highlights, luxury living room layout, dining lounge architecture, modern luxury designs, signature architectural highlights, best renovation projects Navi Mumbai, custom residential portfolio Navi Mumbai"
  },
  reviews: {
    title: "Client Testimonials & Praise | Maintenance Masters",
    description: "Read authentic stories, reviews, and high-fidelity praise from institutional and private clientele who experienced our luxury space curation.",
    keywords: "Maintenance Masters reviews, client testimonials interior designers Navi Mumbai, trusted luxury renovation Navi Mumbai, award winning interior design ratings, expert contractor feedback Navi Mumbai, genuine design client service Navi Mumbai"
  },
  contact: {
    title: "Inquire & Collaborate with Our Artisans | Maintenance Masters",
    description: "Reach out to discuss your luxury interior design or structural renovation projects. Get bespoke counsel, expert quotes, and high-fidelity project plans.",
    keywords: "hire interior designer Navi Mumbai, inquire luxury home renovation, contact Maintenance Masters, free consultation interior styling, custom home architecture quotes Navi Mumbai, facility maintenance support Navi Mumbai, renovation enquiry Navi Mumbai, professional interior consultation Navi Mumbai"
  }
};

// Curated high-fidelity highlights for touch carousel
const CAROUSEL_SLIDES = [
  {
    image: IMAGES.imaginationGrid[0],
    title: "The Horizon Penthouse",
    subtitle: "Aesthetic Living Curation",
    description: "Breathtaking high-rise penthouse living space in Navi Mumbai, blending custom teakwood lattices, vibrant contemporary art, and rich plush velvet tones."
  },
  {
    image: IMAGES.imaginationGrid[1],
    title: "Nordic Sunset Room",
    subtitle: "Organic Modernism",
    description: "Abundant ambient light channels paired with refined wood elements and quiet elegance."
  },
  {
    image: IMAGES.imaginationGrid[2],
    title: "Atelier Lounge",
    subtitle: "Tactile Curation",
    description: "Masterful textural design matching concrete finishes with linen drapery loops and steel."
  },
  {
    image: IMAGES.imaginationGrid[3],
    title: "The Culinary Sanctuary",
    subtitle: "Minimalist Kitchen",
    description: "Sleek white flat-panel cabinetry paired with a solid warm-wood island, black granite countertops, and a modern glass-door storage pantry."
  },
  {
    image: IMAGES.imaginationGrid[4],
    title: "Sienna Studio",
    subtitle: "Warm Earth Tones",
    description: "Crafted to embody regional pigments, sustainable clay paneling, and tactile comfort loops."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const scrollSectionVariants = {
  hidden: { opacity: 0, scale: 0.99, y: 30 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// Keep sections clean and performant by avoiding scale resize stutters
const fadeInSectionVariants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

const fadeInItemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    },
  },
};

const fadeUpItemVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 12 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1]
    },
  },
};

export default function App() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollY, scrollYProgress } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [-80, 220]);

  // Mobile navigation drawer toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Focus trap and accessibility for mobile drawer
  useEffect(() => {
    if (!mobileMenuOpen) return;

    // Save the element that had focus before opening the drawer
    const previouslyFocusedElement = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        return;
      }

      if (e.key === 'Tab') {
        const drawer = document.getElementById('mobile-drawer');
        if (!drawer) return;

        const focusableElements = drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Initial focus into the drawer slightly delayed to allow animation to start
    setTimeout(() => {
      const drawer = document.getElementById('mobile-drawer');
      if (drawer) {
        const firstFocusable = drawer.querySelector<HTMLElement>('a[href], button:not([disabled])');
        firstFocusable?.focus();
      }
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus
      previouslyFocusedElement?.focus();
    };
  }, [mobileMenuOpen]);

  // Active footer document modal
  const [activeFooterDoc, setActiveFooterDoc] = useState<string | null>(null);

  // Active page state ('home' | 'about' | 'services' | 'contact' | 'project' | 'reviews')
  const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'services' | 'contact' | 'project' | 'reviews'>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page');
      if (pageParam && ['home', 'about', 'services', 'contact', 'project', 'reviews'].includes(pageParam)) {
        return pageParam as 'home' | 'about' | 'services' | 'contact' | 'project' | 'reviews';
      }
    } catch (e) {
      console.warn("Error reading URL search parameter", e);
    }
    return 'home';
  });

  // Automatically sync currentPage changes to the URL query parameters for robust browser history, sharing, and search indexing
  useEffect(() => {
    try {
      const currentUrl = new URL(window.location.href);
      if (currentPage === 'home') {
        currentUrl.searchParams.delete('page');
      } else {
        currentUrl.searchParams.set('page', currentPage);
      }
      // Only pushState if the parameter value actually changed to prevent duplicating history frames
      const params = new URLSearchParams(window.location.search);
      const activeParam = params.get('page') || 'home';
      if (activeParam !== currentPage) {
        window.history.pushState({}, '', currentUrl.toString());
      }
    } catch (e) {
      console.warn("Error syncing state with URL parameters", e);
    }
  }, [currentPage]);

  // Touch carousel active index for Inspiration section
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [heroCarouselIndex, setHeroCarouselIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroCarouselIndex((prev) => (prev + 1) % IMAGES.imaginationGrid.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % displayCarouselSlides.length);
  };

  const handlePrevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + displayCarouselSlides.length) % displayCarouselSlides.length);
  };

  // Active index for testimonial carousel
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  // Active filter for portfolio grid
  const [activeCategory, setActiveCategory] = useState<'all' | 'residential' | 'commercial' | 'renovation' | 'kitchen&bath' | 'office design'>('all');

  const { projects: firebaseProjects, loading } = useFirebaseProjects();
  
  const carouselProjectsFromFirebase = firebaseProjects.filter(p => p.showInCarousel === true || String(p.showInCarousel) === 'true');
  const displayCarouselSlides = carouselProjectsFromFirebase.length > 0 
    ? carouselProjectsFromFirebase.map(p => ({
        image: extractImageUrl(p.image),
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        project: p
      }))
    : [{
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop", 
        title: "Coming Soon",
        subtitle: "Future Curation",
        description: "We are currently curating new breathtaking spaces. Stay tuned for our upcoming project highlights.",
        project: null
      }];

  useEffect(() => {
    // Reset carousel index if slides length changes and index is out of bounds
    if (carouselIndex >= displayCarouselSlides.length) {
      setCarouselIndex(0);
    }
  }, [displayCarouselSlides.length, carouselIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNextSlide();
    }, 7000);
    return () => clearInterval(timer);
  }, [displayCarouselSlides.length]);

  useEffect(() => {
    console.log("Projects fetched from Firebase:", firebaseProjects);
  }, [firebaseProjects, firebaseProjects.length]);

  // Selected project for the detailed lightbox details panel
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  // Consultation request modal open
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryTargetProject, setInquiryTargetProject] = useState<Project | null>(null);
  const [selectedInquiryService, setSelectedInquiryService] = useState<string>("");
  
  // Lead submission local state variables
  const [leadForm, setLeadForm] = useState<LeadInquiry>({
    email: '',
    name: '',
    phone: '',
    serviceOfInterest: '',
    message: ''
  });
  const [emailError, setEmailError] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Quick setup for hero inline email action matching the placeholder form of the HTML
  const [heroEmail, setHeroEmail] = useState('');

  const handleHeroSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!heroEmail.trim()) return;
    setLeadForm(prev => ({ ...prev, email: heroEmail }));
    setSelectedInquiryService("General Intake Curation");
    setIsInquiryModalOpen(true);
  };

  const handleIntakeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!leadForm.email.trim()) return;

    const emailBody = `Dear maintenance masters

Full Name: ${leadForm.name}
Email Coordinates: ${leadForm.email}
Phone Reference: ${leadForm.phone}
Aesthetic Service / Choice: ${leadForm.serviceOfInterest}

Design Objectives & Context:
${leadForm.message}

Looking forward to your response.

Best Regards,
${leadForm.name || 'valued contact'}`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=maintenancemasters2001@gmail.com&su=${encodeURIComponent("New Service Request - " + (leadForm.serviceOfInterest || "General Inquiry") + " - " + leadForm.name)}&body=${encodeURIComponent(emailBody)}`;
    
    window.open(gmailUrl, '_blank');

    setIsSubmitted(true);
  };

  const handleOpenGeneralInquiry = (serviceTitle?: string) => {
    if (serviceTitle) {
      setLeadForm(prev => ({ ...prev, serviceOfInterest: serviceTitle }));
    }
    setIsInquiryModalOpen(true);
  };

  const handleProjectInquiry = (project: Project) => {
    setLeadForm(prev => ({ 
      ...prev, 
      serviceOfInterest: `Aesthetic styling of "${project.title}" (${project.subtitle})` 
    }));
    setInquiryTargetProject(project);
    setSelectedProject(null); // transition focus to the intake form
    setIsInquiryModalOpen(true);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setInquiryTargetProject(null);
    setLeadForm({
      email: '',
      name: '',
      phone: '',
      serviceOfInterest: '',
      message: ''
    });
    setHeroEmail('');
    setIsInquiryModalOpen(false);
  };

  // Filter projects list for portfolio showcase section
  const projectsToExclude = ['chandi-atelier', 'linen-living-room', 'ikat-alcove', 'alaknanda-suite'];
  const allPortfolioProjects = firebaseProjects; // Using only projects from Firebase
  const featuredDbProjects = allPortfolioProjects.filter(p => p.isFeatured === true || String(p.isFeatured) === 'true');
  const homeProjects = featuredDbProjects.length > 0 ? featuredDbProjects : allPortfolioProjects;

  const renderFooterDocContent = () => {
    switch (activeFooterDoc) {
      case 'style-guide':
        return (
          <div className="space-y-6">
            <div className="border-b border-sage-muted/20 pb-4">
              <span className="font-mono text-xs text-sage-muted tracking-wide uppercase">Interactive Brand Guidelines</span>
              <h3 className="font-serif text-2xl text-forest-deep mt-1 font-bold">Studio Style Guide</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-label-caps text-xs text-sage-muted tracking-widest uppercase mb-2">Aesthetic Palette</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-forest-deep p-3 rounded text-paper-white">
                    <div className="font-semibold text-xs text-paper-white font-serif">Forest Deep</div>
                    <div className="font-mono text-[10px] opacity-60">#122a20</div>
                  </div>
                  <div className="bg-cream-soft p-3 rounded text-forest-deep border border-sage-muted/10">
                    <div className="font-semibold text-xs font-serif">Cream Soft</div>
                    <div className="font-mono text-[10px] opacity-60">#fbfaf7</div>
                  </div>
                  <div className="bg-paper-white p-3 rounded text-forest-deep border border-sage-muted/10">
                    <div className="font-semibold text-xs font-serif">Paper White</div>
                    <div className="font-mono text-[10px] opacity-60">#ffffff</div>
                  </div>
                  <div className="bg-[#5c7a6e] p-3 rounded text-paper-white">
                    <div className="font-semibold text-xs font-serif">Sage Muted</div>
                    <div className="font-mono text-[10px] opacity-60">#5c7a6e</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-label-caps text-xs text-sage-muted tracking-widest uppercase mb-2">Typography scale & pairing</h4>
                <div className="space-y-2 p-3 bg-paper-white rounded border border-sage-muted/15">
                  <div>
                    <span className="font-mono text-[10px] text-sage-muted block mb-0.5">Primary Display Header (Playfair Display)</span>
                    <p className="font-serif text-lg sm:text-xl text-forest-deep tracking-wider font-extrabold uppercase leading-tight">Maintenance Masters</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-sage-muted block mb-0.5">Body copy sans (Inter)</span>
                    <p className="font-sans text-xs sm:text-sm text-on-surface-variant font-light leading-relaxed">We construct interiors that blend spatial flow, high emotions, and custom craftsmanship tailored to your specifications.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-label-caps text-xs text-sage-muted tracking-widest uppercase mb-2">Primary Components</h4>
                <div className="flex flex-wrap gap-2.5 items-center">
                  <span className="bg-forest-deep text-paper-white text-[11px] font-label-caps tracking-widest px-4 py-2 rounded-full font-bold">
                    Primary Interactive Tab
                  </span>
                  <span className="bg-transparent border border-forest-deep/20 text-forest-deep text-[11px] font-label-caps tracking-widest px-4 py-2 rounded-full">
                    Secondary Control Trigger
                  </span>
                  <span className="inline-block p-1 bg-sage-muted/10 rounded-lg text-sage-muted text-xs">
                    <Sparkles className="w-4 h-4 inline mr-1" />
                    Micro-Indicator
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="border-b border-sage-muted/20 pb-4">
              <span className="font-mono text-xs text-sage-muted tracking-wide uppercase">Information Sourcing and Protection</span>
              <h3 className="font-serif text-2xl text-forest-deep mt-1 font-bold">Privacy Policy</h3>
            </div>
            
            <div className="space-y-4 font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed font-light">
              <p>
                At Maintenance Masters, spatial privacy is as important to us as architectural alignment. This policy details how our agency protects digital coordinate inputs, design messages, and placement inquiries shared with our team.
              </p>
              
              <div>
                <h4 className="font-serif font-bold text-forest-deep mb-1 text-sm uppercase tracking-wide text-left">1. Coordinate Collection</h4>
                <p className="text-xs text-left">
                  We collect names, emails, telephone credentials, and design directions solely to process custom estimates and arrange physical atelier audits. No background automation or passive surveillance maps are executed on your terminal.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-forest-deep mb-1 text-sm uppercase tracking-wide text-left">2. Sourcing Confidentiality</h4>
                <p className="text-xs text-left">
                  Aesthetic briefs and material selections gathered during custom interactions remain strict intellectual property of the recipient. We do not distribute client preferences to physical third-party dealers without official signed confirmation.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-forest-deep mb-1 text-sm uppercase tracking-wide text-left">3. Integrity of Client Identity</h4>
                <p className="text-xs text-left">
                  Client review snapshots and design outcomes are only projected onto our digital channels under direct written authority. You retain absolute control to alter, hide, or completely expunge your spatial imagery from our records instantly.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-forest-deep mb-1 text-sm uppercase tracking-wide text-left">4. Zero Server Storage & Cookies</h4>
                <p className="text-xs text-left">
                  Our website is built on a private, minimalist architecture hosted via Vercel. We do not use tracking cookies, analytics scripts, or marketing pixels to monitor your behavior. Furthermore, your form inputs are not saved to a website database; they are routed directly through your email client to our secure Gmail workspace.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-forest-deep mb-1 text-sm uppercase tracking-wide text-left">5. Contact the Atelier</h4>
                <p className="text-xs text-left">
                  For inquiries regarding your spatial data or to request the removal of any project imagery, please contact Maintenance Masters directly via the communication credentials displayed on our website.
                </p>
              </div>
            </div>
          </div>
        );
      case 'portfolio':
        return (
          <div className="space-y-6">
            <div className="border-b border-sage-muted/20 pb-4">
              <span className="font-mono text-xs text-sage-muted tracking-wide uppercase">Curation Layout Systems</span>
              <h3 className="font-serif text-2xl text-forest-deep mt-1 font-bold">Style & Formatting Portfolio</h3>
            </div>
            
            <div className="space-y-4 font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed font-light">
              <p>
                Our structural design manual rules are strict, preventing "noise" and protecting authentic spatial rhythms. Below are the aesthetic boundaries used by our teams when arranging client-side interfaces and real architectural spaces.
              </p>
              
              <div className="p-3.5 bg-cream-soft rounded border border-sage-muted/10 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-forest-deep font-serif">Ratios under Negative Space:</span>
                  <span className="font-mono text-[10px] text-sage-muted font-bold">62% Minimal Balanced Layout</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-forest-deep font-serif">Symmetry Alignment:</span>
                  <span className="font-mono text-[10px] text-sage-muted font-bold">Swiss Core Grid Baseline</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-forest-deep font-serif">Maximum Texture Curation:</span>
                  <span className="font-mono text-[10px] text-sage-muted font-bold">Three Material Types Max</span>
                </div>
              </div>

              <div>
                <h4 className="font-serif font-bold text-forest-deep mb-1 text-sm uppercase tracking-wide text-left">Aesthetic Rules</h4>
                <ul className="list-disc pl-5 text-xs space-y-1 text-left">
                  <li>No simulated progress logs, mock telemetry lines, or fake terminal data should ever clutter the viewport boundaries.</li>
                  <li>Every button and transition must respond organically to the cursor or touch event, utilizing custom easing curves.</li>
                  <li>Colors must maintain deep local Contrast so that spatial details and typography remain accessible to all readers.</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 'terms':
        return (
          <div className="space-y-6">
            <div className="border-b border-sage-muted/20 pb-4">
              <span className="font-mono text-xs text-sage-muted tracking-wide uppercase">Last Updated: June 11, 2026</span>
              <h3 className="font-serif text-2xl text-forest-deep mt-1 font-bold">Terms & Conditions</h3>
            </div>
            
            <div className="space-y-4 font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed font-light">
              <p>
                Welcome to Maintenance Masters (accessible via our .in website). By accessing this website and contacting us for services, you agree to comply with and be bound by the following Terms and Conditions.
              </p>
              
              <div>
                <h4 className="font-serif font-bold text-forest-deep mb-1 text-sm uppercase tracking-wide text-left">1. Services Offered</h4>
                <p className="text-xs text-left">
                  Maintenance Masters provides professional maintenance and repair services. All services requested through our website contact form or email link are subject to availability and scheduling confirmation by our team.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-forest-deep mb-1 text-sm uppercase tracking-wide text-left">2. No Automated Bookings</h4>
                <p className="text-xs text-left">
                  Our website serves as an inquiry platform. Sending an email through our website form does not constitute a binding contract or a guaranteed service booking. A contract for services is only formed once we explicitly confirm the scope of work, date, time, and pricing with you directly via email or phone.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-forest-deep mb-1 text-sm uppercase tracking-wide text-left">3. Pricing and Payments</h4>
                <p className="text-xs text-left">
                  All quotes provided via initial communication are estimates based on the information you provide. Final pricing will be confirmed before work begins. Payments must be made according to the agreed-upon terms at the time of service completion.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-forest-deep mb-1 text-sm uppercase tracking-wide text-left">4. Limitation of Liability</h4>
                <p className="text-xs text-left">
                  Maintenance Masters strives to provide high-quality maintenance services. However, to the maximum extent permitted by applicable law in India, we shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our website or any delay in our services.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-forest-deep mb-1 text-sm uppercase tracking-wide text-left">5. Website Intellectual Property</h4>
                <p className="text-xs text-left">
                  All content on this website, including text, logos, graphics, and code, is the property of Maintenance Masters and is protected by Indian copyright laws. You may not copy, reproduce, or distribute any part of this site without our written permission.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-forest-deep mb-1 text-sm uppercase tracking-wide text-left">6. Governing Law</h4>
                <p className="text-xs text-left">
                  These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with this website or our services shall be subject to the exclusive jurisdiction of the local courts where our business is registered.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-forest-deep mb-1 text-sm uppercase tracking-wide text-left">7. Changes to Terms</h4>
                <p className="text-xs text-left">
                  We reserve the right to modify these terms at any time. Any changes will be posted directly to this page with an updated "Last Updated" date.
                </p>
              </div>
            </div>
          </div>
        );
      case 'core-ethos':
        return (
          <div className="space-y-6">
            <div className="border-b border-sage-muted/20 pb-4">
              <span className="font-mono text-xs text-sage-muted tracking-wide uppercase">Curation Philosophies</span>
              <h3 className="font-serif text-2xl text-forest-deep mt-1 font-bold">Core Ethos & Curation Philosophy</h3>
            </div>
            
            <div className="space-y-4 font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed font-light">
              <p className="italic font-serif text-forest-deep text-center bg-cream-soft p-4 rounded-lg border border-sage-muted/10 text-xs sm:text-sm">
                "We do not decorate a room; we listen to its internal structure, material bounds, and spatial alignment, letting its true essence take shape."
              </p>
              
              <div>
                <h4 className="font-serif font-bold text-forest-deep mb-1 text-sm uppercase tracking-wide text-left">Human Craft Over Digital Hype</h4>
                <p className="text-xs text-left">
                  We strictly reject synthetic standardizations. No generic templates, prefabricated structures, or mass-produced decor elements are allowed inside our bespoke catalog. Each line, surface, and pigment is selected individually by tactile feedback.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-forest-deep mb-1 text-sm uppercase tracking-wide text-left">The Spacing Golden Ratio</h4>
                <p className="text-xs text-left">
                  True luxury resides inside negative space. Correctly positioning a hand-chiseled stone shelf requires substantial room to breathe, providing the eye with moments of visual resting and calm.
                </p>
              </div>

              <div>
                <h4 className="font-serif font-bold text-forest-deep mb-1 text-sm uppercase tracking-wide text-left">Architectural Truth</h4>
                <p className="text-xs text-left">
                  Natural oak remains wood; raw concrete maintains its organic cold patterns. We celebrate irregularities, mineral structures, and biological textures, assembling spaces that reflect genuine material truth rather than simulated surface polishes.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const currentMetadata = METADATA_BY_PAGE[currentPage] || METADATA_BY_PAGE.home;

  return (
    <div id="maintenance-masters-app-root" className="min-h-screen bg-cream-soft text-forest-deep flex flex-col font-sans antialiased selection:bg-sage-muted selection:text-forest-deep scroll-smooth overflow-x-hidden max-w-full">
      <Helmet>
        <title>{currentMetadata.title}</title>
        <meta name="description" content={currentMetadata.description} />
        <meta name="keywords" content={currentMetadata.keywords} />
        <meta property="og:title" content={currentMetadata.title} />
        <meta property="og:description" content={currentMetadata.description} />
        <meta property="og:type" content="website" />
      </Helmet>
      
      {/* Scroll Progress Bar */}
      <motion.div 
        id="scroll-progress-indicator"
        className="hidden md:block fixed top-0 left-0 right-0 h-1 bg-forest-deep z-[100] origin-left"
        style={{ scaleX: scrollYProgress, transformOrigin: "left", willChange: "transform" }}
      />
      
      {/* Dynamic Top Navigation Bar */}
      <motion.nav 
        id="top-navbar" 
        initial={isMobile ? { opacity: 0 } : { y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: isMobile ? 0.3 : 0.6, ease: "easeOut" }}
        style={{ willChange: "transform, opacity" }}
        className="bg-cream-soft/95 md:bg-cream-soft/85 backdrop-blur-none md:backdrop-blur-md border-b border-sage-muted/[0.08] sticky top-0 z-[100] transition-colors duration-300 overflow-x-hidden w-full"
      >
        <div className="flex justify-between items-center w-full px-4 py-4 md:px-16 md:py-6 max-w-7xl mx-auto gap-2">
          
          <div className="flex items-center gap-2">
            {/* Hamburger Mobile Toggle Button */}
            <button 
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-forest-deep hover:text-sage-muted transition-colors cursor-pointer lg:hidden"
              aria-label="Toggle Navigation Drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
            </button>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-serif font-extrabold tracking-widest text-base sm:text-lg md:text-xl lg:text-2xl text-forest-deep block scroll-smooth hover:opacity-90 uppercase whitespace-nowrap"
            >
              Maintenance Masters
            </a>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <button 
              onClick={() => {
                setCurrentPage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group font-label-caps text-label-caps tracking-widest cursor-pointer relative pb-1.5 transition-colors duration-300 ${
                currentPage === 'home' ? 'text-forest-deep font-semibold' : 'text-sage-muted hover:text-forest-deep'
              }`}
            >
              Home
              <span className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-forest-deep transition-transform duration-300 origin-left ${
                currentPage === 'home' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </button>

            <button 
              onClick={() => {
                setCurrentPage('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group font-label-caps text-label-caps tracking-widest cursor-pointer relative pb-1.5 transition-colors duration-300 ${
                currentPage === 'about' ? 'text-forest-deep font-semibold' : 'text-sage-muted hover:text-forest-deep'
              }`}
            >
              About Us
              <span className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-forest-deep transition-transform duration-300 origin-left ${
                currentPage === 'about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </button>

            <button 
              onClick={() => {
                setCurrentPage('services');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group font-label-caps text-label-caps tracking-widest cursor-pointer relative pb-1.5 transition-colors duration-300 ${
                currentPage === 'services' ? 'text-forest-deep font-semibold' : 'text-sage-muted hover:text-forest-deep'
              }`}
            >
              Services
              <span className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-forest-deep transition-transform duration-300 origin-left ${
                currentPage === 'services' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </button>

            <button 
              onClick={() => {
                setCurrentPage('project');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group font-label-caps text-label-caps tracking-widest cursor-pointer relative pb-1.5 transition-colors duration-300 ${
                currentPage === 'project' ? 'text-forest-deep font-semibold' : 'text-sage-muted hover:text-forest-deep'
              }`}
            >
              Projects
              <span className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-forest-deep transition-transform duration-300 origin-left ${
                currentPage === 'project' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </button>

            <button 
              onClick={() => {
                setCurrentPage('reviews');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`group font-label-caps text-label-caps tracking-widest cursor-pointer relative pb-1.5 transition-colors duration-300 ${
                currentPage === 'reviews' ? 'text-forest-deep font-semibold' : 'text-sage-muted hover:text-forest-deep'
              }`}
            >
              Reviews
              <span className={`absolute bottom-0 left-0 w-full h-[1.5px] bg-forest-deep transition-transform duration-300 origin-left ${
                currentPage === 'reviews' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <motion.button 
              id="get-in-touch-button"
              onClick={() => {
                setCurrentPage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="font-label-caps text-[10px] sm:text-xs tracking-wider bg-forest-deep text-paper-white px-3 py-2 sm:px-6 sm:py-3 rounded-full hover:bg-forest-deep/90 cursor-pointer hover:shadow-md whitespace-nowrap"
            >
              Get in Touch
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <Breadcrumbs currentPage={currentPage} onNavigate={setCurrentPage} />

      <AnimatePresence mode="wait">
        {currentPage === 'home' ? (
          <motion.div
            key="home"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -15, transition: { duration: 0.25 } }}
            className="w-full flex flex-col"
          >
          {/* Hero Header Section */}
          <header id="hero-header" className="relative h-[85vh] flex items-end overflow-hidden group">
        <motion.div 
          style={{ y: isMobile ? 0 : heroY, willChange: 'transform' }} 
          className="absolute -top-[120px] -bottom-[120px] left-0 right-0 z-0 h-[calc(100%+240px)] w-full touch-pan-y cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(e, info) => {
            const swipeThreshold = 50;
            if (info.offset.x < -swipeThreshold) {
              setHeroCarouselIndex((prev) => (prev + 1) % IMAGES.imaginationGrid.length);
            } else if (info.offset.x > swipeThreshold) {
              setHeroCarouselIndex((prev) => (prev - 1 + IMAGES.imaginationGrid.length) % IMAGES.imaginationGrid.length);
            }
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img 
                key={heroCarouselIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center scale-[1.01] will-change-transform select-none pointer-events-none" 
                alt="Maintenance Masters design agency signature dark living space"
                src={IMAGES.imaginationGrid[heroCarouselIndex]}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
          <div className="absolute inset-0 hero-gradient"></div>
        </motion.div>

        {/* Hero Carousel Navigation & Pagination */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="absolute z-20 bottom-8 left-0 right-0 flex justify-center items-center gap-4"
        >
          <button
             onClick={() => setHeroCarouselIndex((prev) => (prev - 1 + IMAGES.imaginationGrid.length) % IMAGES.imaginationGrid.length)}
             className="p-2 bg-paper-white/10 backdrop-blur-md rounded-full text-paper-white hover:bg-paper-white/20 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-2">
            {IMAGES.imaginationGrid.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroCarouselIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  heroCarouselIndex === idx ? 'w-10 bg-paper-white' : 'w-6 bg-paper-white/30 hover:bg-paper-white/60'
                }`}
              />
            ))}
          </div>

          <button
             onClick={() => setHeroCarouselIndex((prev) => (prev + 1) % IMAGES.imaginationGrid.length)}
             className="p-2 bg-paper-white/10 backdrop-blur-md rounded-full text-paper-white hover:bg-paper-white/20 transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>

        <div className="relative z-10 w-full px-6 pb-16 md:px-16 md:pb-20 max-w-7xl mx-auto text-paper-white pointer-events-none">
          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.2
                }
              }
            }}
            initial="hidden"
            animate="visible"
            className="space-y-6 pointer-events-auto"
          >
            {/* Real ratings & reviews display indicator */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="flex items-center gap-2 mb-2"
            >
              <div className="flex text-yellow-400 gap-0.5">
                <Star className="w-4 h-4 fill-current text-yellow-400 stroke-none" />
                <Star className="w-4 h-4 fill-current text-yellow-400 stroke-none" />
                <Star className="w-4 h-4 fill-current text-yellow-400 stroke-none" />
                <Star className="w-4 h-4 fill-current text-yellow-400 stroke-none" />
                <Star className="w-4 h-4 fill-current text-yellow-400 stroke-current opacity-70" />
              </div>
              <span className="font-label-caps text-label-caps tracking-widest text-paper-white/80 font-bold">Reviews Rating 4.8 / 5</span>
            </motion.div>

            <motion.div className="overflow-hidden">
              <motion.h1 
                variants={{
                  hidden: { opacity: 0, y: 60 },
                  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
                }}
                className="text-3xl sm:text-4xl md:font-display-lg mb-4 max-w-3xl tracking-wide font-serif antialiased uppercase leading-[1.05] drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] font-bold font-extrabold"
              >
                <TextReveal text="INTERIOR CONTRACTOR" />
              </motion.h1>
            </motion.div>

            <motion.div className="overflow-hidden">
              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 1, 
                      ease: [0.16, 1, 0.3, 1],
                    } 
                  }
                }}
                className="font-body-lg text-body-lg max-w-xl text-paper-white/90 leading-relaxed font-light"
              >
                <TextReveal text="Tasteful artwork lined the walls, infusing the room with a quiet elegance and a warm, lived-in charm. Dedicated to sustainable prestige and modern comfort." />
              </motion.p>
            </motion.div>

          </motion.div>
        </div>
      </header>



      {/* Imagination & Inspiration Section */}
      <motion.section 
        variants={fadeInSectionVariants} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }} 
        id="philosophy" 
        className="py-14 xs:py-16 md:py-24 bg-paper-white"
      >
        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16">
            <motion.div variants={fadeInItemVariants}>
              <span className="font-label-caps text-label-caps text-sage-muted tracking-widest block mb-3">VISUAL HORIZON</span>
              <h2 className="text-3xl sm:text-4xl md:font-headline-md uppercase leading-tight font-serif text-forest-deep font-bold font-extrabold">
                <TextReveal text="THE HOME DESIGN" /><br/><TextReveal text="YOU ALWAYS IMAGINE" />
              </h2>
            </motion.div>
            <motion.p 
              variants={fadeInItemVariants}
              className="font-body-md text-body-md text-on-surface-variant max-w-md lg:ml-auto leading-relaxed"
            >
              The room was accented with tasteful artwork adorning the walls, creating a harmonious blend of elegance, timeless sustainability, and homeliness. Swipe or click to view curated atmospheric spaces.
            </motion.p>
          </div>

          {/* Interactive Touch-Enabled Carousel Container */}
          <motion.div 
            variants={fadeInItemVariants}
            className="relative w-full overflow-hidden"
          >
            {/* Aspect controller frame */}
            <div className="relative min-h-[680px] xs:min-h-[620px] md:h-[640px] w-full overflow-hidden rounded-xl bg-forest-deep/5 shadow-inner group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={carouselIndex}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  style={{ willChange: 'transform, opacity' }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={(e, info) => {
                    const swipeThreshold = 50;
                    if (info.offset.x < -swipeThreshold) {
                      handleNextSlide();
                    } else if (info.offset.x > swipeThreshold) {
                      handlePrevSlide();
                    }
                  }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing flex flex-col md:flex-row h-full w-full"
                >
                  {/* Left Column: Image wrapper */}
                  <div className="relative w-full md:w-3/5 h-[200px] xs:h-[240px] md:h-full overflow-hidden">
                    <img 
                      referrerPolicy="no-referrer"
                      src={displayCarouselSlides[carouselIndex].image || null} 
                      alt={displayCarouselSlides[carouselIndex].title} 
                      className="w-full h-full object-cover object-center select-none pointer-events-none scale-[1.01] will-change-transform"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent via-transparent to-forest-deep/15"></div>
                  </div>

                  {/* Right Column: Descriptions & Interactive Request tools */}
                  <div className="w-full md:w-2/5 bg-forest-deep text-paper-white p-6 xs:p-8 md:p-12 flex flex-col justify-between h-[calc(100%-200px)] xs:h-[calc(100%-240px)] md:h-full">
                    <div className="space-y-4">
                      <h3 className="font-headline-sm text-headline-sm font-serif text-paper-white leading-snug font-bold font-extrabold">
                        {displayCarouselSlides[carouselIndex].title}
                      </h3>

                      <div className="flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-sage-muted"></span>
                        <span className="font-label-caps text-[10px] tracking-widest text-sage-muted uppercase font-bold">
                          {displayCarouselSlides[carouselIndex].subtitle}
                        </span>
                      </div>
                      
                      <div className="max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        <p className="font-body-md text-sm text-paper-white/90 leading-relaxed">
                          {displayCarouselSlides[carouselIndex].description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-paper-white/10 mt-6 sm:mt-0">
                      <button
                        onClick={() => {
                          const slide = displayCarouselSlides[carouselIndex];
                          handleOpenGeneralInquiry(`Inspiration view of "${slide.title}"`);
                        }}
                        className="flex items-center gap-4 group/btn cursor-pointer"
                        aria-label="Know More"
                      >
                        <span className="font-label-caps text-[11px] tracking-[0.25em] text-paper-white uppercase font-extrabold">
                          Know More
                        </span>
                        <div className="w-11 h-11 flex items-center justify-center bg-forest-deep text-paper-white hover:bg-forest-deep/90 transition-all rounded-full shadow-lg group-hover/btn:translate-x-1">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </button>
                      
                      <span className="font-mono text-[10px] tracking-widest text-paper-white/40">
                        {String(carouselIndex + 1).padStart(2, '0')} / {String(displayCarouselSlides.length).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <div className="absolute top-1/2 left-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center">
                <button 
                  onClick={handlePrevSlide}
                  className="p-3 bg-paper-white/15 backdrop-blur-md text-paper-white hover:bg-paper-white hover:text-forest-deep rounded-full transition-all cursor-pointer shadow-md select-none"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
              
              <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center">
                <button 
                  onClick={handleNextSlide}
                  className="p-3 bg-paper-white/15 backdrop-blur-md text-paper-white hover:bg-paper-white hover:text-forest-deep rounded-full transition-all cursor-pointer shadow-md select-none"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pagination Bullet Indicators */}
            <div className="flex justify-center items-center gap-2.5 mt-8">
              {displayCarouselSlides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCarouselIndex(dotIdx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    carouselIndex === dotIdx 
                      ? 'w-8 bg-forest-deep' 
                      : 'w-2 bg-forest-deep/20 hover:bg-forest-deep/45'
                  }`}
                  aria-label={`Slide button ${dotIdx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Projects Grid */}
      <motion.section 
        variants={fadeInSectionVariants} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }} 
        id="projects" 
        className="py-14 xs:py-16 md:py-24 bg-forest-deep text-paper-white"
      >
        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto">
          
          <div className="mb-16">
            <span className="font-label-caps text-label-caps text-sage-muted tracking-widest block mb-3">CURATED PORTFOLIOS</span>
            <motion.h2 
              variants={fadeUpItemVariants}
              className="text-3xl sm:text-4xl md:font-headline-md mb-4 font-serif uppercase tracking-wide font-bold font-extrabold"
            >
              <TextReveal text="Our Featured Projects" />
            </motion.h2>
            <motion.p 
              variants={fadeUpItemVariants}
              className="font-body-md text-body-md opacity-70 max-w-xl leading-relaxed"
            >
              A glimpse into the exquisite spatial layouts we’ve transformed — where creativity, luxury materials, and comfort align dynamically.
            </motion.p>
          </div>

          <motion.div 
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                }
              }
            }}
            initial="hidden"
            animate={homeProjects.length > 0 ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-32"
          >
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[4/3] bg-gray-100 animate-pulse rounded-md" />
                ))
              ) : (
                homeProjects.map((project, index) => (
                  <motion.div 
                    key={project.id}
                    variants={{
                      hidden: { opacity: 0, scale: 0.95, y: 30 },
                      visible: { 
                        opacity: 1, 
                        scale: 1, 
                        y: 0,
                        transition: {
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1]
                        }
                      },
                      exit: {
                        opacity: 0,
                        scale: 0.95,
                        y: 10,
                        transition: { duration: 0.2, ease: "easeIn" }
                      }
                    }}
                    className="w-full h-full transform-gpu"
                  >
                    <ProjectHoverCard 
                      project={project}
                      index={index}
                      layoutId={`project-card-${project.id}`}
                      onClick={() => {
                        setSelectedProject(project);
                        setActiveGalleryIndex(0);
                      }}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
            className="mt-20 flex justify-center"
          >
            <button 
              onClick={() => {
                setCurrentPage('project');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center gap-3 px-8 py-4 bg-paper-white text-forest-deep mix-blend-screen hover:bg-sage-muted rounded-full font-label-caps text-label-caps tracking-widest transition-all cursor-pointer"
            >
              View All Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Numerical Achievements Stats Bar */}
      <section 
        id="statistics-bar" 
        className="py-10 xs:py-12 md:py-16 bg-forest-deep text-paper-white border-t border-paper-white/10"
      >
        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x-0 md:divide-x divide-paper-white/10">
            <div className="p-4 pt-6 sm:pt-4">
              <Counter value={250} suffix="+" className="text-5xl sm:text-6xl md:text-7xl font-serif text-sage-muted font-bold" />
              <p className="font-label-caps text-label-caps tracking-widest opacity-65 mt-2">Satisfied Clients</p>
            </div>
            <div className="p-4 pt-6 sm:pt-4">
              <Counter value={500} suffix="+" className="text-5xl sm:text-6xl md:text-7xl font-serif text-sage-muted font-bold" />
              <p className="font-label-caps text-label-caps tracking-widest opacity-65 mt-2">Project Completed</p>
            </div>
            <div className="p-4 pt-6 sm:pt-4 flex flex-col justify-center items-center">
              <div className="flex items-center justify-center gap-2">
                <Counter value={5} className="text-5xl sm:text-6xl md:text-7xl font-serif text-sage-muted font-bold" />
                <span className="text-5xl sm:text-6xl md:text-7xl font-serif text-sage-muted font-bold">-</span>
                <Counter value={15} className="text-5xl sm:text-6xl md:text-7xl font-serif text-sage-muted font-bold" />
              </div>
              <p className="font-label-caps text-label-caps tracking-widest opacity-65 mt-2 max-w-[150px] leading-tight">Dedicated Workers & Ad Hoc Workers</p>
            </div>
            <div className="p-4 pt-6 sm:pt-4 flex flex-col justify-center items-center">
              <div className="flex items-center justify-center gap-0">
                <Counter value={4} className="text-5xl sm:text-6xl md:text-7xl font-serif text-sage-muted font-bold" />
                <span className="text-5xl sm:text-6xl md:text-7xl font-serif text-sage-muted font-bold">.</span>
                <Counter value={8} className="text-5xl sm:text-6xl md:text-7xl font-serif text-sage-muted font-bold" />
              </div>
              <p className="font-label-caps text-label-caps tracking-widest opacity-65 mt-2">Reviews Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Design Values & Beliefs */}
      <motion.section 
        variants={fadeInSectionVariants} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }} 
        id="beliefs" 
        className="py-14 xs:py-16 md:py-24 bg-paper-white"
      >
        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-xl mx-auto">
            <span className="font-label-caps text-label-caps text-sage-muted tracking-widest block mb-3 font-semibold">CORE ETHOS</span>
            <motion.h2 
              onClick={() => {
                setCurrentPage('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              variants={fadeInItemVariants}
              className="font-headline-md text-headline-md font-serif text-forest-deep mb-4 uppercase inline-block cursor-pointer hover:text-sage-muted transition-colors relative group"
            >
              <TextReveal text="WHAT WE BELIEVE IN" />
              <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-sage-muted/30 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-300"></span>
            </motion.h2>
            <motion.p 
              variants={fadeInItemVariants}
              className="font-body-md text-body-md text-on-surface-variant leading-relaxed"
            >
              We craft interiors that balance absolute comfort, natural material beauty, and timeless architectural purpose—creating spaces that feel effortless.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {BELIEFS.map((belief, index) => {
              // Custom icon selection based on belief
              const renderBeliefIcon = () => {
                switch(belief.iconName) {
                  case 'Wrench': return <Wrench className="w-8 h-8 text-forest-deep" />;
                  case 'Users': return <Users className="w-8 h-8 text-forest-deep" />;
                  case 'Recycle': return <Recycle className="w-8 h-8 text-forest-deep" />;
                  default: return <Sparkles className="w-8 h-8 text-forest-deep" />;
                }
              };

              return (
                <motion.div 
                  onClick={() => {
                    setCurrentPage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  variants={fadeInItemVariants}
                  key={belief.id}
                  className="relative cursor-pointer"
                >
                  <div
                    className="p-10 bg-cream-soft rounded-lg flex flex-col justify-between group transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg hover:scale-[1.01] relative overflow-hidden h-full"
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-sage-muted opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div>
                      <div className="inline-block p-4 bg-paper-white rounded-xl mb-8 group-hover:bg-forest-deep [&>svg]:group-hover:text-paper-white transition-all duration-300">
                        {renderBeliefIcon()}
                      </div>
                      <h3 className="font-headline-sm text-headline-sm font-serif text-forest-deep mb-4 font-bold font-extrabold">{belief.title}</h3>
                      <p className="font-body-md text-on-surface-variant leading-relaxed text-sm opacity-90">{belief.description}</p>
                    </div>
                    <div className="mt-8 flex items-center justify-between text-xs font-label-caps tracking-widest text-sage-muted group-hover:text-forest-deep">
                      <span>Learn More About Us</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Detailed Curation Services offerings section */}
      <motion.section 
        variants={fadeInSectionVariants} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -100px 0px" }} 
        id="services" 
        className="py-14 xs:py-16 md:py-24 bg-cream-soft"
      >
        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto">
          <div className="mb-16 text-center md:text-left">
            <span className="font-label-caps text-label-caps text-sage-muted tracking-widest block mb-3">CURATING MEMORIES</span>
            <motion.h2 
              variants={fadeInItemVariants}
              className="font-headline-md text-headline-md font-serif text-forest-deep uppercase mb-4 leading-tight font-bold font-extrabold"
            >
              <TextReveal text="TRANSFORMING SPACES," /><br/><TextReveal text="ELEVATING EXPERIENCES" />
            </motion.h2>
            <motion.p 
              variants={fadeInItemVariants}
              className="font-body-md text-on-surface-variant max-w-2xl leading-relaxed"
            >
              From original concept floor mappings to finalized physical curation, we construct interiors that blend spatial flow, high emotions, and custom craftsmanship tailored specifically to your lifestyle parameters.
            </motion.p>
          </div>

          <div className="space-y-8">
            {SERVICES.map((service, index) => {
              const flipLayout = index % 2 === 1;

              return (
                <motion.div 
                  key={service.id} 
                  variants={fadeInItemVariants}
                  className="bg-forest-deep rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-md group"
                >
                  {/* Left Side text box */}
                  <div className={`p-6 xs:p-10 md:p-14 text-paper-white flex flex-col justify-center ${flipLayout ? 'order-1 md:order-2' : ''}`}>
                    <span className="font-label-caps text-[10px] tracking-widest text-sage-muted uppercase mb-3">Service Code {index + 1}</span>
                    <h3 className="font-headline-sm text-headline-sm font-serif mb-4 uppercase tracking-wider text-paper-white font-bold font-extrabold">
                      {service.title}
                    </h3>
                    <p className="font-body-md text-paper-white/70 mb-8 leading-relaxed font-light text-sm">
                      {service.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {service.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="bg-paper-white/10 hover:bg-paper-white/15 transition-colors px-4 py-1.5 rounded-full text-[10px] font-label-caps tracking-widest"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div>
                      <button
                        onClick={() => handleOpenGeneralInquiry(service.title)}
                        className="bg-transparent text-paper-white border border-paper-white/20 hover:border-paper-white/80 hover:bg-paper-white/5 transition-all px-8 py-3.5 rounded-full font-label-caps text-[10px] tracking-widest cursor-pointer inline-flex items-center gap-2"
                      >
                        Request Service Rate
                        <Mail className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Image Block */}
                  <div className={`h-64 md:h-full relative overflow-hidden ${flipLayout ? 'order-2 md:order-1' : ''}`}>
                    <img 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-106" 
                      alt={service.title} 
                      src={service.image}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-forest-deep/10"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Decorative Brand Showcase Panel */}
      <motion.section 
        variants={fadeInSectionVariants} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, amount: 0.2 }} 
        id="portfolio-quote" 
        className="py-14 xs:py-16 md:py-24 bg-paper-white text-center"
      >
        <div className="px-4 xs:px-6 md:px-16 max-w-4xl mx-auto">
          <motion.span variants={fadeUpItemVariants} className="font-label-caps text-label-caps text-sage-muted tracking-widest block mb-4">AESTHETIC QUALITY STATEMENT</motion.span>
          <motion.h2 
            variants={fadeUpItemVariants}
            className="font-headline-md text-headline-md md:text-headline-md tracking-normal font-serif text-forest-deep uppercase leading-snug mb-8 font-bold font-extrabold"
          >
            <TextReveal text="TAKE A LOOK AT OUR PORTFOLIO TO GET AN BEST IDEA OF THE QUALITY" />
          </motion.h2>
          <motion.p 
            variants={fadeUpItemVariants}
            className="font-body-md text-body-md text-on-surface-variant leading-relaxed max-w-2xl mx-auto mb-10"
          >
            With an emphasis on harmonizing high-caliber functionality and customized artisan aesthetics, our master design catalog captures bespoke luxury expressions across high-profile estates worldwide.
          </motion.p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => {
                setCurrentPage('project');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-forest-deep text-paper-white rounded-full font-label-caps text-label-caps tracking-widest hover:bg-forest-deep/95 transition-all cursor-pointer"
            >
              Browse Works
            </button>
            <button 
              onClick={() => {
                setCurrentPage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-cream-soft hover:bg-cream-soft/80 text-forest-deep rounded-full font-label-caps text-label-caps tracking-widest transition-all cursor-pointer"
            >
              Book Consult
            </button>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Social Proof Carousel */}
      <motion.section 
        variants={fadeInSectionVariants} 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        id="client-testimonials" 
        className="py-14 xs:py-16 md:py-24 bg-cream-soft border-t border-sage-muted/10 overflow-hidden"
      >
        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left side: Heading and navigation controls */}
            <motion.div variants={fadeUpItemVariants} className="lg:col-span-4 space-y-6">
              <span className="font-label-caps text-label-caps text-sage-muted tracking-widest block font-bold">CLIENT STORIES</span>
              <h2 className="font-headline-md text-headline-md md:text-4xl font-serif uppercase tracking-tight text-forest-deep font-bold">
                <TextReveal text="Voices of" /> <br/>
                <span className="text-sage-muted italic font-normal"><TextReveal text="Atmospheric" /></span> <TextReveal text="Trust" />
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed max-w-sm">
                Authentic spatial experiences narrated by high-profile homeowners, artists, and commercial visionaries who trusted our raw sustainable framework.
              </p>
              
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentPage('reviews');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-forest-deep text-[#FFFFFF] rounded-full font-label-caps text-[11px] tracking-widest hover:bg-forest-deep/90 transition-all cursor-pointer inline-flex items-center gap-2 group shadow-sm border-none font-semibold uppercase"
                >
                  Explore All Reviews
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </div>
              
              {/* Manual Nav controls + pagination dots */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevTestimonial}
                    className="p-3 rounded-full border border-forest-deep/15 text-forest-deep hover:bg-forest-deep hover:text-paper-white transition-all duration-300 cursor-pointer"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextTestimonial}
                    className="p-3 rounded-full border border-forest-deep/15 text-forest-deep hover:bg-forest-deep hover:text-paper-white transition-all duration-300 cursor-pointer"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Pagination Dots Indicator */}
                <div className="flex gap-2.5">
                  {TESTIMONIALS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTestimonialIndex(i)}
                      className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                        testimonialIndex === i ? 'w-8 bg-forest-deep' : 'w-2.5 bg-forest-deep/15'
                      }`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right side: Interactive sliding Card */}
            <motion.div variants={fadeUpItemVariants} className="lg:col-span-8 relative flex flex-col justify-center">
              {/* Backside quote visual watermark */}
              <span className="absolute -top-10 -left-6 text-[12rem] font-serif leading-none select-none text-forest-deep/5 pointer-events-none font-bold">
                “
              </span>

              <div className="w-full relative min-h-[340px] xs:min-h-[290px] md:min-h-[220px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={testimonialIndex}
                    initial={{ opacity: 0, x: 30, scale: 0.99 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -30, scale: 0.99 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    style={{ willChange: 'transform, opacity' }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onDragEnd={(e, info) => {
                      const swipeThreshold = 40;
                      if (info.offset.x < -swipeThreshold) {
                        handleNextTestimonial();
                      } else if (info.offset.x > swipeThreshold) {
                        handlePrevTestimonial();
                      }
                    }}
                    className="bg-paper-white p-8 md:p-12 rounded-xl shadow-xs border border-sage-muted/10 relative overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y select-none w-full"
                  >
                    {/* Top rating stars row */}
                    <div className="flex gap-1 mb-6 text-sage-muted select-none pointer-events-none">
                      {[...Array(TESTIMONIALS[testimonialIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current stroke-none" />
                      ))}
                    </div>

                    {/* The Quote itself */}
                    <blockquote className="font-serif text-lg md:text-xl text-forest-deep italic leading-relaxed mb-8 select-none pointer-events-none">
                      “{TESTIMONIALS[testimonialIndex].quote}”
                    </blockquote>

                    {/* Metadata & Project alignment */}
                    <div className="pt-6 border-t border-sage-muted/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none pointer-events-none">
                      {/* Author only */}
                      <div>
                        <cite className="font-headline-sm text-base font-bold text-forest-deep not-italic block">
                          {TESTIMONIALS[testimonialIndex].author}
                        </cite>
                        <span className="text-xs font-label-caps text-sage-muted uppercase tracking-wider block mt-0.5">
                          {TESTIMONIALS[testimonialIndex].role}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Mobile Interaction Help and Controls (Interactive on Touch / Mobile) */}
              <div className="mt-6 flex flex-col items-center gap-2 lg:hidden">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrevTestimonial}
                    className="p-2.5 rounded-full bg-forest-deep/5 text-forest-deep hover:bg-forest-deep hover:text-paper-white transition-all active:scale-95 cursor-pointer"
                    aria-label="Previous testimonial mobile"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {/* Pagination Dots Indicator */}
                  <div className="flex gap-1.5">
                    {TESTIMONIALS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setTestimonialIndex(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          testimonialIndex === i ? 'w-5 bg-forest-deep' : 'w-1.5 bg-forest-deep/20'
                        }`}
                        aria-label={`Go to testimonial ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNextTestimonial}
                    className="p-2.5 rounded-full bg-forest-deep/5 text-forest-deep hover:bg-forest-deep hover:text-paper-white transition-all active:scale-95 cursor-pointer"
                    aria-label="Next testimonial mobile"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <span className="font-mono text-[9px] tracking-widest text-sage-muted/70 uppercase">
                  ← Swipe card to browse stories →
                </span>
              </div>
            </motion.div>

          </div>
        </div>
      </motion.section>
          </motion.div>
        ) : currentPage === 'about' ? (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <AboutUs onOpenInquiry={handleOpenGeneralInquiry} />
          </motion.div>
        ) : currentPage === 'services' ? (
          <motion.div
            key="services"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Services onOpenInquiry={handleOpenGeneralInquiry} />
          </motion.div>
        ) : currentPage === 'project' ? (
          <motion.div
            key="project"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ProjectPage 
              onProjectSelect={handleProjectInquiry} 
              onNavigateToContact={() => setCurrentPage('contact')} 
              projects={allPortfolioProjects}
              loading={loading}
            />
          </motion.div>
        ) : currentPage === 'reviews' ? (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Reviews onOpenInquiry={handleOpenGeneralInquiry} />
          </motion.div>
        ) : (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Contact onOpenInquiry={handleOpenGeneralInquiry} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Design with full metadata, main links */}
      <footer id="main-footer" className="bg-forest-deep text-paper-white pt-20 pb-12 mt-auto">
        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-paper-white/10 pb-16">
            <div className="md:col-span-2 space-y-6">
              <h2 className="font-headline-md text-headline-md font-serif text-paper-white tracking-widest font-bold">
                Maintenance Masters
              </h2>
              <p className="font-body-md text-sm text-paper-white/60 max-w-sm leading-relaxed">
                Discover the future of Interior curation and atmospheric spaces with Maintenance Masters. Effortlessly design, structure, and perfect your living experience. Read about our{' '}
                <button 
                  onClick={() => setActiveFooterDoc('core-ethos')}
                  className="underline text-sage-muted hover:text-paper-white transition-colors cursor-pointer font-medium p-0 bg-transparent inline border-none"
                >
                  Core Ethos & Curation Guidelines
                </button>.
              </p>
              
              <div className="flex gap-4 pt-2">
                <a 
                  href="https://www.google.com/maps/place/Maintenance+Masters/@19.1252454,72.9950353,17z/data=!4m8!3m7!1s0x3be7c137bfd12955:0xa000337d6f2ca530!8m2!3d19.1252454!4d72.9950353!9m1!1b1!16s%2Fg%2F11hz6tmhgq?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border border-paper-white/20 rounded-full hover:bg-paper-white hover:text-forest-deep hover:border-paper-white transition-all"
                  aria-label="Google Maps Location"
                >
                  <MapPin className="w-4 h-4" />
                </a>
                <a 
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=maintenancemasters2001@gmail.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border border-paper-white/20 rounded-full hover:bg-paper-white hover:text-forest-deep hover:border-paper-white transition-all"
                  aria-label="Email Maintenance Masters Support"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a 
                  href="https://www.instagram.com/main_tenancemasters" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center border border-paper-white/20 rounded-full hover:bg-paper-white hover:text-forest-deep hover:border-paper-white transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-label-caps text-label-caps mb-6 text-sage-muted tracking-widest uppercase">Main Pages</h4>
              <ul className="space-y-3 font-body-md text-sm text-paper-white/80">
                <li>
                  <button 
                    className="hover:text-sage-muted transition-colors cursor-pointer text-left text-sm text-paper-white/80 block w-full bg-transparent"
                    onClick={() => {
                      setCurrentPage('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Home Showcase
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-sage-muted transition-colors cursor-pointer text-left text-sm text-paper-white/80 block w-full bg-transparent"
                    onClick={() => {
                      setCurrentPage('about');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    About the Studio
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-sage-muted transition-colors cursor-pointer text-left text-sm text-paper-white/80 block w-full bg-transparent"
                    onClick={() => {
                      setCurrentPage('services');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Our Curation Services
                  </button>
                </li>
                <li>
                  <a 
                    className="hover:text-sage-muted transition-colors cursor-pointer block" 
                    href="#projects"
                    onClick={(e) => {
                      if (currentPage !== 'home') {
                        e.preventDefault();
                        setCurrentPage('home');
                        setTimeout(() => {
                          const el = document.getElementById('projects');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }, 50);
                      }
                    }}
                  >
                    Design Projects
                  </a>
                </li>
                <li>
                  <button 
                    className="hover:text-sage-muted transition-colors cursor-pointer text-left text-sm text-paper-white/80 block w-full bg-transparent"
                    onClick={() => {
                      setCurrentPage('reviews');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Client Reviews
                  </button>
                </li>
                <li>
                  <button 
                    className="hover:text-sage-muted transition-colors cursor-pointer text-left text-sm text-paper-white/80 block w-full bg-transparent"
                    onClick={() => {
                      setCurrentPage('contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Contact & Ateliers
                  </button>
                </li>
                <li>
                  <a 
                    className="hover:text-sage-muted transition-colors cursor-pointer block" 
                    href="#beliefs"
                    onClick={(e) => {
                      if (currentPage !== 'home') {
                        e.preventDefault();
                        setCurrentPage('home');
                        setTimeout(() => {
                          const el = document.getElementById('beliefs');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }, 50);
                      }
                    }}
                  >
                    Inner Beliefs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-label-caps text-label-caps mb-6 text-sage-muted tracking-widest uppercase">Company Details</h4>
              <p className="font-body-md text-xs text-paper-white/60 leading-relaxed max-w-xs mb-4">
                Main HQ: Flat No-02, Nath Sadan, Near Hanuman Mandir, Ghansoli Goan, Ghansoli, Navi Mumbai
              </p>
              <ul className="space-y-3 font-body-md text-sm text-paper-white/80">
                <li>
                  <button 
                    onClick={() => {
                      setCurrentPage('contact');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="hover:text-sage-muted transition-colors cursor-pointer text-left w-full bg-transparent p-0 block border-none"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <a 
                    href="https://www.instagram.com/main_tenancemasters" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sage-muted transition-colors cursor-pointer block"
                  >
                    Follow on Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-paper-white/40 font-label-caps text-[10px] tracking-widest">
            <p>© {new Date().getFullYear()} Maintenance Masters Interior Design Agency. All rights reserved.</p>
            <div className="flex gap-6 flex-wrap justify-center md:justify-end">
              <button 
                onClick={() => setActiveFooterDoc('privacy')}
                className="hover:text-paper-white transition-colors cursor-pointer bg-transparent p-0 font-label-caps text-[10px] tracking-widest uppercase border-none"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => setActiveFooterDoc('terms')}
                className="hover:text-paper-white transition-colors cursor-pointer bg-transparent p-0 font-label-caps text-[10px] tracking-widest uppercase border-none"
              >
                Terms & Conditions
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* ANCHOR: Full-Screen / Sidebar Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-forest-deep/94 z-[99] flex justify-end cursor-pointer"
          >
            <motion.div 
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              drag="x"
              dragConstraints={{ left: 0 }}
              dragElastic={{ left: 0.05, right: 0.8 }}
              onDragEnd={(_, info) => {
                // If dragged more than 80px to the right, or flicked fast to the right
                if (info.offset.x > 80 || info.velocity.x > 200) {
                  setMobileMenuOpen(false);
                }
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-cream-soft w-full max-w-sm h-full p-8 pt-24 shadow-2xl flex flex-col justify-between cursor-default touch-pan-y select-none transform-gpu"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <nav className="flex flex-col gap-6">
                  <button 
                    onClick={() => {
                      setCurrentPage('home');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="font-headline-sm font-serif text-forest-deep hover:text-forest-deep/70 transition-colors text-2xl text-left cursor-pointer"
                  >
                    Home Showcase
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentPage('about');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="font-headline-sm font-serif text-forest-deep hover:text-forest-deep/70 transition-colors text-2xl text-left cursor-pointer"
                  >
                    About Us
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentPage('services');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="font-headline-sm font-serif text-forest-deep hover:text-forest-deep/70 transition-colors text-2xl text-left cursor-pointer"
                  >
                    Services Directory
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentPage('project');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="font-headline-sm font-serif text-forest-deep hover:text-forest-deep/70 transition-colors text-2xl cursor-pointer text-left"
                  >
                    Browse Projects
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentPage('reviews');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="font-headline-sm font-serif text-forest-deep hover:text-forest-deep/70 transition-colors text-2xl cursor-pointer text-left"
                  >
                    Reviews & Audits
                  </button>
                </nav>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCurrentPage('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full text-center bg-forest-deep text-paper-white py-4 rounded-full font-label-caps text-label-caps tracking-widest hover:opacity-90 active:scale-95"
                >
                  Book Instant Consult
                </button>
                <p className="text-center font-label-caps text-[9px] text-forest-deep/80 tracking-widest text-[9px]">
                  © MAINTENANCE MASTERS PORTFOLIO SYSTEM
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ANCHOR: Selected Project detailed lightbox view */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-forest-deep/96 z-[100] flex items-start sm:items-center justify-center p-3 md:p-12 overflow-y-auto py-6 sm:py-12"
          >
            <motion.div 
              initial={{ scale: 0.98, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 10, opacity: 0 }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.22 }}
              className="bg-cream-soft rounded-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-2xl relative my-auto max-h-[90vh] md:h-[500px] transform-gpu"
            >
              {/* Close Button UI */}
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-3 right-3 z-20 bg-paper-white/70 backdrop-blur-md text-forest-deep hover:bg-forest-deep hover:text-white p-2.5 rounded-full transition-all cursor-pointer shadow-sm"
                aria-label="Close Project Details"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-40 xs:h-48 sm:h-64 md:h-full w-full md:w-1/2 relative shrink-0 group">
                <img 
                  referrerPolicy="no-referrer"
                  src={
                    activeGalleryIndex === 0 
                      ? extractImageUrl(selectedProject.image) 
                      : (selectedProject.galleryImages?.[activeGalleryIndex - 1] 
                          ? extractImageUrl(selectedProject.galleryImages[activeGalleryIndex - 1]) 
                          : extractImageUrl(selectedProject.image))
                  } 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover transition-opacity duration-300"
                  loading="lazy"
                />
                {/* Fullscreen Expand Button Desktop */}
                <button
                  onClick={() => setFullscreenImage(
                    activeGalleryIndex === 0 
                      ? extractImageUrl(selectedProject.image) 
                      : (selectedProject.galleryImages?.[activeGalleryIndex - 1] 
                          ? extractImageUrl(selectedProject.galleryImages[activeGalleryIndex - 1]) 
                          : extractImageUrl(selectedProject.image))
                  )}
                  className="absolute bottom-4 right-4 z-20 bg-forest-deep/60 backdrop-blur-md text-paper-white hover:bg-forest-deep hover:text-white p-2.5 rounded-full transition-all cursor-pointer opacity-0 group-hover:opacity-100 hidden md:block border border-paper-white/20"
                  aria-label="View Fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                {/* Fullscreen Expand Button Mobile */}
                <button
                  onClick={() => setFullscreenImage(
                    activeGalleryIndex === 0 
                      ? extractImageUrl(selectedProject.image) 
                      : (selectedProject.galleryImages?.[activeGalleryIndex - 1] 
                          ? extractImageUrl(selectedProject.galleryImages[activeGalleryIndex - 1]) 
                          : extractImageUrl(selectedProject.image))
                  )}
                  className="absolute bottom-3 right-3 z-20 bg-forest-deep/40 backdrop-blur-md text-paper-white active:bg-forest-deep p-2 rounded-full transition-all cursor-pointer md:hidden shadow-sm border border-paper-white/20"
                  aria-label="View Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 md:p-10 flex flex-col justify-between w-full md:w-1/2 overflow-y-auto flex-1 min-h-0">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 text-sage-muted font-label-caps text-[10px] tracking-widest">
                    <span>{selectedProject.subtitle}</span>
                    <span>•</span>
                    <span>{selectedProject.category}</span>
                  </div>
                  
                  <h3 className="font-serif text-xl md:text-headline-md text-forest-deep leading-tight mb-3 md:mb-4 font-bold">
                    {selectedProject.title}
                  </h3>

                  <p className="font-body-md text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-4 md:mb-6">
                    {selectedProject.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-sage-muted/20">
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
                      <MapPin className="w-4 h-4 text-sage-muted" />
                      <span>{selectedProject.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
                      <Calendar className="w-4 h-4 text-sage-muted" />
                      <span>Completed in {selectedProject.year}</span>
                    </div>
                  </div>

                  {selectedProject.galleryImages && selectedProject.galleryImages.length > 0 && (
                    <div className="mt-6 space-y-3 pt-3 border-t border-sage-muted/20">
                      <p className="text-[10px] font-label-caps text-sage-muted tracking-widest uppercase">Gallery View</p>
                      <div className="flex flex-wrap gap-2">
                        {/* Main Image Thumbnail */}
                        <button
                          onClick={() => setActiveGalleryIndex(0)}
                          className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${activeGalleryIndex === 0 ? 'border-forest-deep shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        >
                          <img 
                            referrerPolicy="no-referrer"
                            src={extractImageUrl(selectedProject.image)} 
                            alt={`${selectedProject.title} Main thumbnail`} 
                            className="w-full h-full object-cover"
                          />
                        </button>
                        {/* Remaining Gallery Thumbnails */}
                        {selectedProject.galleryImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveGalleryIndex(idx + 1)}
                            className={`relative h-12 w-12 sm:h-14 sm:w-14 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${activeGalleryIndex === idx + 1 ? 'border-forest-deep shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                          >
                            <img 
                              referrerPolicy="no-referrer"
                              src={extractImageUrl(img)} 
                              alt={`${selectedProject.title} gallery ${idx + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-6 md:pt-6 space-y-2 md:space-y-3 mt-auto">
                  <button
                    onClick={() => handleProjectInquiry(selectedProject)}
                    className="w-full bg-forest-deep text-paper-white py-3 sm:py-4 rounded-full font-label-caps text-[11px] sm:text-label-caps tracking-widest hover:bg-forest-deep/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    BOOK CONSULTATION
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="w-full bg-transparent hover:bg-forest-deep/5 text-forest-deep py-2.5 sm:py-3 rounded-full font-label-caps text-[11px] sm:text-label-caps tracking-widest border border-forest-deep/10 transition-all cursor-pointer"
                  >
                    Back to Catalog
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ANCHOR: Fullscreen Image View */}
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

      {/* ANCHOR: Universal Premium sliding Consultation Intake Form modal */}
      <AnimatePresence>
        {isInquiryModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-forest-deep/96 z-[101] flex items-start sm:items-center justify-center p-3 overflow-y-auto py-6 sm:py-12"
          >
            <motion.div 
              initial={{ scale: 0.98, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 10, opacity: 0 }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.22 }}
              className="bg-cream-soft rounded-xl shadow-2xl p-5 sm:p-8 max-w-lg w-full relative my-auto max-h-[92vh] sm:max-h-none overflow-y-auto transform-gpu"
            >
              <button 
                onClick={handleResetForm}
                className="absolute top-4 right-4 z-20 bg-forest-deep/10 text-forest-deep hover:bg-forest-deep hover:text-white p-3 rounded-full transition-all cursor-pointer"
                aria-label="Close form"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div 
                    key="intake-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="text-center md:text-left pr-8 sm:pr-0">
                      <div className="inline-block p-1.5 bg-sage-muted/10 rounded-lg mb-1 text-sage-muted">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif text-lg sm:text-headline-sm text-forest-deep font-bold">
                        Bespoke Design Placement
                      </h3>
                      <p className="text-xs sm:text-sm text-on-surface-variant font-light mt-0.5 leading-snug">
                        Please provide project details below to trigger a custom design analysis and scheduling check.
                      </p>
                    </div>

                    {inquiryTargetProject && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="flex items-center gap-4 bg-paper-white border border-sage-muted/20 p-3 rounded-xl shadow-sm mb-2"
                      >
                        <motion.img 
                          layoutId={`project-image-${inquiryTargetProject.id}-modal`}
                          src={inquiryTargetProject.image}
                          alt={inquiryTargetProject.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                        />
                        <div>
                          <p className="text-[10px] font-label-caps tracking-widest text-sage-muted uppercase mb-0.5">Inquiring About</p>
                          <h4 className="font-serif text-sm sm:text-base text-forest-deep leading-tight font-bold">{inquiryTargetProject.title}</h4>
                          <p className="text-xs text-on-surface-variant mt-0.5 truncate">{inquiryTargetProject.location}</p>
                        </div>
                      </motion.div>
                    )}

                    <form onSubmit={handleIntakeSubmit} className="space-y-3.5">
                      {/* Name fields */}
                      <div>
                        <label className="block text-[10px] font-label-caps tracking-widest text-on-surface-variant mb-1">Your Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={leadForm.name}
                          onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g. Ananya Sharma"
                          className="w-full bg-paper-white border border-sage-muted/30 p-2.5 sm:p-3.5 rounded-md focus:outline-none focus:border-forest-deep transition-colors text-xs sm:text-sm"
                        />
                      </div>

                      {/* Contact fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-label-caps tracking-widest text-on-surface-variant mb-1">Email Coordinates</label>
                          <input 
                            type="email" 
                            required
                            value={leadForm.email}
                            onChange={(e) => {
                              const value = e.target.value;
                              setLeadForm(prev => ({ ...prev, email: value }));
                              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                              if (value && !emailRegex.test(value)) {
                                setEmailError('Please enter a valid email address.');
                              } else {
                                setEmailError('');
                              }
                            }}
                            placeholder="e.g. name@domain.com"
                            className={`w-full bg-paper-white border ${emailError ? 'border-red-400' : 'border-sage-muted/30'} p-2.5 sm:p-3.5 rounded-md focus:outline-none focus:border-forest-deep transition-colors text-xs sm:text-sm`}
                          />
                          {emailError && <p className="text-red-500 text-[10px] mt-1">{emailError}</p>}
                        </div>
                        <div>
                          <label className="block text-[10px] font-label-caps tracking-widest text-on-surface-variant mb-1">Phone Reference</label>
                          <input 
                            type="text"
                            value={leadForm.phone}
                            onChange={(e) => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="e.g. +1 555-0199"
                            className="w-full bg-paper-white border border-sage-muted/30 p-2.5 sm:p-3.5 rounded-md focus:outline-none focus:border-forest-deep transition-colors text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      {/* Service select drop indicator */}
                      <div>
                        <label className="block text-[10px] font-label-caps tracking-widest text-on-surface-variant mb-1">Aesthetic Service / Project Choice</label>
                        <input 
                          type="text"
                          value={leadForm.serviceOfInterest}
                          onChange={(e) => setLeadForm(prev => ({ ...prev, serviceOfInterest: e.target.value }))}
                          placeholder="e.g. General Luxury Residential layout"
                          className="w-full bg-paper-white border border-sage-muted/30 p-2.5 sm:p-3.5 rounded-md focus:outline-none focus:border-forest-deep transition-colors text-xs sm:text-sm"
                        />
                      </div>

                      {/* Personal preferences text field */}
                      <div>
                        <label className="block text-[10px] font-label-caps tracking-widest text-on-surface-variant mb-1">Design Objectives & Context</label>
                        <textarea 
                          rows={2}
                          value={leadForm.message}
                          onChange={(e) => setLeadForm(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="What architectural atmospheres, dimensions, or textures do you lean toward?"
                          className="w-full bg-paper-white border border-sage-muted/30 p-2.5 sm:p-3 rounded-md focus:outline-none focus:border-forest-deep transition-colors text-xs sm:text-sm resize-none"
                        />
                      </div>

                      <div className="pt-2">
                        <button 
                          type="submit"
                          className="w-full bg-forest-deep text-paper-white py-3 sm:py-4 rounded-full font-label-caps text-[11px] sm:text-label-caps tracking-widest hover:bg-forest-deep/95 active:scale-97 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          Send Placement Request
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="success-form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="text-center py-6 sm:py-10 space-y-4 sm:space-y-6"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-forest-deep text-paper-white flex items-center justify-center rounded-full mx-auto shadow-lg"
                    >
                      <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2]" />
                    </motion.div>

                    <div className="space-y-1 sm:space-y-2">
                      <motion.h3 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="font-serif text-base sm:text-headline-sm text-forest-deep uppercase font-bold"
                      >
                        PLACEMENT INITIALIZED
                      </motion.h3>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-sm mx-auto"
                      >
                        Thank you, <span className="font-bold">{leadForm.name || 'valued contact'}</span>. Maintenance Masters's principal design planner has received your brief sent from <span className="font-medium text-forest-deep">{leadForm.email}</span>.
                      </motion.p>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-[10px] sm:text-xs text-sage-muted tracking-wide mt-1.5"
                      >
                        We will draft a bespoke layout schedule and connect back within 24 business hours.
                      </motion.p>
                    </div>

                    {inquiryTargetProject && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                        className="max-w-xs mx-auto bg-paper-white border border-sage-muted/15 rounded-2xl p-2 flex items-center gap-4 text-left shadow-sm"
                      >
                        <motion.img 
                          layoutId={`project-image-${inquiryTargetProject.id}-modal`}
                          src={inquiryTargetProject.image}
                          alt={inquiryTargetProject.title}
                          className="w-16 h-16 object-cover rounded-xl shadow-sm"
                        />
                        <div className="flex-1 pr-2">
                          <p className="text-[9px] font-label-caps text-sage-muted uppercase tracking-widest mb-0.5">Focus Project</p>
                          <h4 className="font-serif text-sm font-bold text-forest-deep leading-tight truncate">{inquiryTargetProject.title}</h4>
                        </div>
                      </motion.div>
                    )}

                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="pt-4 sm:pt-6 flex flex-col sm:flex-row justify-center gap-3"
                    >
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=maintenancemasters2001@gmail.com&su=${encodeURIComponent("New Service Request - " + (leadForm.serviceOfInterest || "General Inquiry") + " - " + leadForm.name)}&body=${encodeURIComponent(
`Dear maintenance masters

Full Name: ${leadForm.name}
Email Coordinates: ${leadForm.email}
Phone Reference: ${leadForm.phone}
Aesthetic Service / Choice: ${leadForm.serviceOfInterest}

Design Objectives & Context:
${leadForm.message}

Looking forward to your response.

Best Regards,
${leadForm.name || 'valued contact'}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 sm:px-8 sm:py-3 bg-forest-deep hover:bg-forest-deep/90 text-paper-white font-label-caps text-[11px] sm:text-label-caps tracking-widest uppercase rounded-full transition-all cursor-pointer font-bold flex items-center justify-center gap-1.5"
                      >
                        <span>Open Gmail Compose</span>
                        <Mail className="w-4 h-4 text-paper-white" />
                      </a>
                      <button 
                        onClick={handleResetForm}
                        className="px-6 py-2.5 sm:px-8 sm:py-3 border border-forest-deep hover:bg-forest-deep/5 text-forest-deep font-label-caps text-[11px] sm:text-label-caps tracking-widest uppercase rounded-full transition-all cursor-pointer font-bold"
                      >
                        Return to Catalog
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Documents Modal */}
      <AnimatePresence>
        {activeFooterDoc && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-forest-deep/96 z-[102] flex items-start sm:items-center justify-center p-3 overflow-y-auto py-6 sm:py-12"
          >
            <motion.div 
              initial={{ scale: 0.98, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 10, opacity: 0 }}
              transition={{ type: "tween", ease: "easeOut", duration: 0.22 }}
              className="bg-cream-soft rounded-xl shadow-2xl p-6 sm:p-8 max-w-lg w-full relative my-auto max-h-[90vh] sm:max-h-none overflow-y-auto transform-gpu"
            >
              <button 
                onClick={() => setActiveFooterDoc(null)}
                className="absolute top-4 right-4 z-20 bg-forest-deep/10 text-forest-deep hover:bg-forest-deep hover:text-white p-3 rounded-full transition-all cursor-pointer shadow-sm border-none"
                aria-label="Close document"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pr-6 sm:pr-0">
                {renderFooterDocContent()}
              </div>

              <div className="pt-6 border-t border-sage-muted/20 mt-6 flex justify-end">
                <button 
                  onClick={() => setActiveFooterDoc(null)}
                  className="bg-forest-deep text-paper-white px-6 py-2.5 rounded-full font-label-caps text-[11px] tracking-widest hover:opacity-90 transition-all cursor-pointer border-none"
                >
                  Dismiss Document
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
