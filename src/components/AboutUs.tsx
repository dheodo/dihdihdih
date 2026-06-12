import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Users, 
  Shield, 
  Award, 
  Eye, 
  Heart, 
  Compass, 
  Sparkles, 
  Building,
  Target,
  CornerDownRight
} from 'lucide-react';
import { IMAGES } from '../data';

interface AboutUsProps {
  onOpenInquiry: (service?: string) => void;
}

export default function AboutUs({ onOpenInquiry }: AboutUsProps) {
  // Local state for interactive FAQ accordions
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const FOCUS_AREAS = [
    {
      icon: <Building className="w-6 h-6 text-paper-white" />,
      title: "Functionality First",
      tagline: "Purpose-Built Layouts",
      description: "We orchestrate physical floor layouts with extreme kinetic precision. Pathways remain intuitive, dimensions allow effortless breathing room, and storage blends invisibly within the custom millwork walls."
    },
    {
      icon: <Heart className="w-6 h-6 text-paper-white" />,
      title: "True Wellbeing",
      tagline: "Biophilic Frameworks",
      description: "Integrating deep mental rest into homes. Every material is calibrated for its touch-sensory qualities, natural air circulation layers, dynamic solar exposure angles, and organic sound absorption constants."
    },
    {
      icon: <Users className="w-6 h-6 text-paper-white" />,
      title: "Artisan Community",
      tagline: "Supporting Heritage Workshops",
      description: "By sourcing structural timbers and custom slate tables from generational local ateliers, we support authentic human preservation and bring raw custom pieces into modern client contexts."
    },
    {
      icon: <Compass className="w-6 h-6 text-paper-white" />,
      title: "Dynamic Inspiration",
      tagline: "Elevating the Ground State",
      description: "A room is never passive. Our design choices seek to spur daily wonder and creative focus through dramatic high-ceiling play, framed panoramic nature views, and exquisite artwork coordinates."
    }
  ];

  const OUR_PROCESS = [
    {
      step: "01",
      title: "Discovery & Blueprint",
      description: "We begin with a deep spatial intake, auditing lifestyle rhythms and structural restrictions. We then map conceptual layouts, presenting full-sensory visual storyboards that capture your unique vision."
    },
    {
      step: "02",
      title: "Material Curation",
      description: "Partnering with historic regional workshops, we meticulously source raw bespoke materials—from ancient cedar beams to custom limestone—ensuring structural integrity and artisan authenticity."
    },
    {
      step: "03",
      title: "Execution & Polish",
      description: "Our experts orchestrate the physical build, harmonizing raw concrete, custom woodwork, and biophilic elements into a finished space that is mathematically precise and deeply atmospheric."
    }
  ];

  const FAQS = [
    {
      question: "How does the initial curation and consultation process work?",
      answer: "We begin with a detailed physical or spatial intake consultation, reviewing your lifestyle rhythms, structural restrictions, and preferred material sensations. From there, we map conceptual layouts and craft full-sensory visual storyboards detailing timber grains, limestone specimens, and custom lighting paths."
    },
    {
      question: "How do you look after long-term care and material maintenance?",
      answer: "As our name implies, long-term maintenance is integral to our curation philosophy. We select premium, low-maintenance raw materials—such as seasoned teak, honed slate, and Treated limestone—that naturally age gracefully. Additionally, we provide comprehensive seasonal care protocols and maintenance assessments to ensure your spatial coordinates remain pristine for generations."
    },
    {
      question: "Why are you rated among the best interior designers in Navi Mumbai?",
      answer: "We are recognized among the best interior designers in Navi Mumbai because of our unparalleled commitment to craftsmanship and bespoke space curation. We combine local cultural sensibilities with high-end global design practices, ensuring each home we curate feels deeply unique."
    },
    {
      question: "Do you offer premium facility maintenance or civil contractors services in Navi Mumbai?",
      answer: "Yes, we are full-service civil contractors in Navi Mumbai. We provide elite, long-term premium facility maintenance Navi Mumbai programs, including bespoke plumbing, structural repairs, electrical upgrades, and routine premium masonry upkeep to keep custom estates functioning flawlessly."
    },
    {
      question: "Do you offer turn-key project management?",
      answer: "Yes. From the initial tectonic blueprint to the final placement of bespoke textiles, we manage all vendor logistics, artisan coordination, and on-site assembly to ensure a frictionless transition into your new environment."
    },
    {
      question: "How do you approach material selection and customized furniture creation?",
      answer: "Every custom walnut counter, slate hearth, and boucle sofa is hand-selected and crafted inside our network of local historic workshops. This guarantees that dimensions align precisely with your room parameters and ensures each piece remains a physical masterpiece with genuine human soul."
    }
  ];

  return (
    <div id="about-us-page-root" className="bg-cream-soft text-forest-deep">
      
      {/* Editorial Page Hero Section */}
      <section className="py-14 xs:py-16 md:py-24 bg-cream-soft border-b border-sage-muted/10 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-10 right-20 w-96 h-96 rounded-full bg-sage-muted filter blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-forest-deep filter blur-3xl"></div>
        </div>

        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Header */}
            <div className="lg:col-span-7 space-y-8">
              <span className="font-label-caps text-label-caps text-sage-muted tracking-widest block">CURATED LIVING COLLECTIVE</span>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-forest-deep uppercase font-serif tracking-tight leading-[1.1] font-bold font-extrabold"
              >
                Redefining <br/>
                <span className="text-sage-muted italic font-normal">Modern</span> Living
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed font-light"
              >
                Every space is a blank canvas — a chance to shape deep emotion. As a premier <strong>luxury interior design Navi Mumbai</strong> agency, we curate bespoke homes, offering <strong>premium home renovation Navi Mumbai</strong> services and <strong>elite home renovation contractors</strong> who balance silent architectural gravity with warm, tactile modernism.
              </motion.p>
              
              <div className="flex gap-4 items-center pt-2">
                <div className="flex items-center gap-1.5 bg-paper-white/60 backdrop-blur-xs px-4 py-2 rounded-full border border-sage-muted/20">
                  <Star className="w-4 h-4 fill-current text-forest-deep stroke-none" />
                  <span className="text-xs font-label-caps tracking-wider text-forest-deep">Premium Webflow Standard</span>
                </div>
                <div className="flex items-center gap-1.5 bg-paper-white/60 backdrop-blur-xs px-4 py-2 rounded-full border border-sage-muted/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-deep animate-pulse"></span>
                  <span className="text-xs font-label-caps tracking-wider text-forest-deep">Livable Elegance</span>
                </div>
              </div>
            </div>

            {/* Right Ambient Card / Visual Detail */}
            <div className="lg:col-span-5 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
                className="relative aspect-[4/5] rounded-xl overflow-hidden shadow-xl group border-4 border-paper-white"
              >
                <img 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  alt="Maintenance Masters minimal sustainable space arrangement" 
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2664&auto=format&fit=crop"
                  loading="lazy"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-forest-deep/40 to-transparent"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section - High Contrast Deep Theme */}
      <section className="py-12 xs:py-14 md:py-20 bg-forest-deep text-paper-white">
        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="space-y-2 border-r border-paper-white/10 last:border-none"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-sage-muted tracking-tight">98%</h2>
              <p className="font-label-caps text-[10px] md:text-xs tracking-wider text-paper-white/60">CLIENT RECOMMENDATION</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="space-y-2 border-r border-paper-white/10 last:border-none"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-sage-muted tracking-tight">150+</h2>
              <p className="font-label-caps text-[10px] md:text-xs tracking-wider text-paper-white/60">SPATIAL TRANSFORMATIONS</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="space-y-2 border-r border-paper-white/10 last:border-none"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-sage-muted tracking-tight">42+</h2>
              <p className="font-label-caps text-[10px] md:text-xs tracking-wider text-paper-white/60">DESIGN PARTNERSHIPS</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="space-y-2 last:border-none"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-sage-muted tracking-tight">15</h2>
              <p className="font-label-caps text-[10px] md:text-xs tracking-wider text-paper-white/60">YEARS OF SERVICE LEGACY</p>
            </motion.div>

          </div>
        </div>
      </section>


      {/* Our Focus Section - Visual Cards of values */}
      <section className="py-14 xs:py-16 md:py-24 bg-cream-soft relative">
        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16"
          >
            <div className="lg:col-span-6">
              <span className="font-label-caps text-label-caps text-sage-muted tracking-widest block mb-3">OUR CORE VALUES</span>
              <h2 className="font-headline-md text-headline-md md:text-4xl font-serif uppercase leading-tight text-forest-deep font-bold">
                The Difference Is <br/>
                <span className="text-sage-muted italic font-normal">in the Details</span>
              </h2>
            </div>
            <div className="lg:col-span-6">
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                We approach spatial layout from multiple focal disciplines, ensuring that physical properties enhance daily lifestyles, encourage calm flow, and celebrate custom artistic integrity.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FOCUS_AREAS.map((item, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -6, boxShadow: "0 10px 25px rgba(0,0,0,0.04)" }}
                key={item.title}
                className="bg-paper-white p-6 xs:p-8 md:p-10 rounded-xl border border-sage-muted/15 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-12 h-12 bg-cream-soft rounded-bl-full group-hover:scale-150 transition-transform duration-300"></div>
                
                <div className="space-y-6">
                   <div className="w-12 h-12 bg-forest-deep rounded-xl flex items-center justify-center shadow-md">
                    {item.icon}
                  </div>
                  <div>
                    <span className="font-label-caps text-[10px] text-sage-muted uppercase tracking-wider block mb-1">Curation Phase</span>
                    <h3 className="font-headline-sm text-headline-sm font-serif text-forest-deep leading-tight group-hover:text-sage-muted transition-colors font-bold font-extrabold">{item.title}</h3>
                  </div>
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-6 border-t border-sage-muted/10 mt-6 flex justify-between items-center text-xs font-label-caps text-sage-muted">
                  <span>{item.tagline}</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Our Team Members & Artisans */}
      <section className="py-14 xs:py-16 md:py-24 bg-paper-white">
        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-2xl mx-auto mb-20 space-y-4"
          >
            <span className="font-label-caps text-label-caps text-sage-muted tracking-widest block">METHODOLOGY</span>
            <h2 className="font-headline-md text-headline-md md:text-4xl font-serif uppercase text-forest-deep font-bold">
              Our Process
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              We approach every space with a meticulous, phased methodology, ensuring the seamless translation of bold architectural concepts into tactile physical reality.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {OUR_PROCESS.map((phase, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                key={phase.step}
                className="group border border-sage-muted/15 rounded-xl p-6 xs:p-8 bg-paper-white relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-2"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-cream-soft rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="relative z-10">
                  <span className="font-mono text-4xl text-forest-deep/10 font-bold mb-6 block group-hover:text-sage-muted/20 transition-colors">{phase.step}</span>
                  <h3 className="font-headline-sm text-xl font-serif text-forest-deep leading-tight mb-4 font-bold font-extrabold">{phase.title}</h3>
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{phase.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Collapsible FAQ Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="py-14 xs:py-16 md:py-24 bg-cream-soft border-t border-b border-sage-muted/10"
      >
        <div className="px-4 xs:px-6 md:px-16 max-w-4xl mx-auto">
          
          <div className="text-center mb-16 space-y-4">
            <span className="font-label-caps text-label-caps text-sage-muted tracking-widest block">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="font-headline-md text-headline-md md:text-4xl font-serif uppercase text-forest-deep font-bold">
              Have Questions?
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed max-w-xl mx-auto">
              Learn more about how we curate high-profile spaces, structural boundaries, architectural alignments, and timber selections.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className="bg-paper-white rounded-lg border border-sage-muted/15 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-6 flex justify-between items-center gap-4 cursor-pointer hover:bg-cream-soft/10 transition-colors"
                  >
                    <span className="font-serif text-lg font-semibold text-forest-deep pr-4">
                      {faq.question}
                    </span>
                    <span className={`p-2 rounded-full transition-colors ${
                      isOpen ? 'bg-forest-deep text-paper-white' : 'bg-cream-soft text-forest-deep'
                    }`}>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="p-6 pt-0 border-t border-sage-muted/5 font-body-md text-sm text-on-surface-variant leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <button
              onClick={() => onOpenInquiry("Detailed Studio & Brand FAQ Inquiry")}
              className="px-8 py-4 bg-forest-deep text-paper-white rounded-full font-label-caps text-xs tracking-widest uppercase hover:bg-forest-deep/90 transition-all cursor-pointer shadow-md inline-flex items-center gap-3 group"
            >
              <span>Have more questions?</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

        </div>
      </motion.section>

      {/* Lead Proxy Banner / Bottom trigger */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="py-14 xs:py-16 md:py-24 bg-forest-deep text-paper-white text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover" 
            src={IMAGES.imaginationGrid[1]} 
            alt="Scenic atmospheric space overlay" 
            loading="lazy"
          />
          <div className="absolute inset-0 bg-forest-deep/90"></div>
        </div>

        <div className="px-4 xs:px-6 md:px-16 max-w-3xl mx-auto relative z-10 space-y-8">
          <span className="font-label-caps text-label-caps text-sage-muted tracking-widest block">WORK WITH THE STUDIO</span>
          <h2 className="text-3xl sm:text-4xl md:font-headline-md uppercase font-serif tracking-tight font-bold">
            Ready to Begin Curating <br/> Your Signature Space?
          </h2>
          <p className="font-body-md text-paper-white/70 leading-relaxed max-w-xl mx-auto">
            Book an instant physical intake brief or virtual layout coordinate planning session with our principal design team.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => onOpenInquiry("General Curation Brief - About Guild Intake")}
              className="px-10 py-4 bg-paper-white text-forest-deep rounded-full font-label-caps text-label-caps tracking-widest hover:bg-cream-soft transition-all cursor-pointer shadow-md"
            >
              Consult Studio
            </button>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
