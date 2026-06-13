import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Sliders, 
  Layers, 
  Grid, 
  FileText, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  IndianRupee,
  Compass, 
  Home, 
  Briefcase, 
  Leaf, 
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { IMAGES } from '../data';
import MaterialCompareChart from './MaterialCompareChart';

interface ServicesProps {
  onOpenInquiry: (service?: string) => void;
}

export default function Services({ onOpenInquiry }: ServicesProps) {
  // Service estimator state
  const [spaceType, setSpaceType] = useState<'residential' | 'commercial' | 'renovation'>('residential');
  const [materialTier, setMaterialTier] = useState<'raw' | 'curated' | 'prestige'>('curated');
  const [squareFootage, setSquareFootage] = useState<number>(1800);

  // Design process active stage
  const [activeStage, setActiveStage] = useState<number>(0);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const DESIGN_STAGES = [
    {
      num: "01",
      name: "DISCOVERY & INTAKE",
      time: "1 - 2 Weeks",
      bgUrl: IMAGES.imaginationGrid[0],
      tagline: "Uncovering Spatial Truths",
      summary: "First, we analyze your native space's light coords and architectural layout. You physicalize your lifestyle rhythms and material sensations.",
      deliverables: [
        "Dynamic solar exposure mapping",
        "Spatial layout questionnaire analysis",
        "Raw physical boundaries assessment",
        "Initial curation budget outline"
      ]
    },
    {
      num: "02",
      name: "CONCEPT DESIGN",
      time: "3 - 4 Weeks",
      bgUrl: IMAGES.imaginationGrid[1],
      tagline: "Atmospheric Mood & Intent",
      summary: "We formulate highly tactile storyboards pairing organic materials—such as raw concrete block, textured timber panels, and high-pile linens.",
      deliverables: [
        "Inspirational moodboards",
        "3D volume wireframes & flow layouts",
        "Sample tactile raw material box",
        "Preliminary lighting design direction"
      ]
    },
    {
      num: "03",
      name: "DESIGN DEVELOPMENT",
      time: "4 - 6 Weeks",
      bgUrl: IMAGES.imaginationGrid[2],
      tagline: "Precision Engineering details",
      summary: "Architectural drawings and custom millwork designs are executed to the physical millimeter. Every socket, hidden drawer, and stone slab is specified.",
      deliverables: [
        "Complete structural AutoCAD drawings",
        "Bespoke millwork construction details",
        "Finishes and lighting schematics",
        "Procurement list & artisan scheduling"
      ]
    },
    {
      num: "04",
      name: "CURATION & HANDOVER",
      time: "Varies by Scope",
      bgUrl: IMAGES.imaginationGrid[3],
      tagline: "The Full Materialization",
      summary: "Our artisan circle constructs custom furnishings. We direct on-site placements and fine-tune down to lighting brightness adjustments.",
      deliverables: [
        "Artisan and builder on-site quality check",
        "Bespoke fittings assembly and design",
        "Artwork coordinates coordination",
        "Sensory final walkthrough handover"
      ]
    }
  ];

  const SERVICE_PACKAGES = [
    {
      icon: <Home className="w-6 h-6 text-paper-white" />,
      title: "Full Residential Sanctuary",
      description: "Complete spatial transformation of luxury villas, townhouses, or high-profile penthouses. Designed with natural material beauty for deep rest.",
      features: [
        "Whole-home layout & biophilic integrations",
        "Custom kitchen, closet & master millwork",
        "Custom fireplace & stone hearth creation",
        "Comprehensive lighting & window treatment plans"
      ],
      avgDuration: "3 - 6 Months",
      bestFor: "Estate homeowners wanting bespoke perfection"
    },
    {
      icon: <Briefcase className="w-6 h-6 text-paper-white" />,
      title: "Atmospheric Commercial",
      description: "Creating highly engaging, emotion-driven workspaces, wellness spas, and boutique flagship showrooms that breathe brand identity.",
      features: [
        "Optimized client flow and spatial dynamics",
        "Custom reception surfaces & sensory bars",
        "Acoustic and air-filtration system grids",
        "Durable, sustainable commercial grade timbers"
      ],
      avgDuration: "4 - 8 Months",
      bestFor: "Visionary retail directors and designers"
    },
    {
      icon: <Leaf className="w-6 h-6 text-paper-white" />,
      title: "Biophilic Retrofits & Curations",
      description: "Focused restoration and styling of existing layouts to introduce biophilic patterns, indoor-garden integrations, and clean air channels.",
      features: [
        "Intelligent plant-wall moisture loops",
        "Passive temperature & solar play consults",
        "Locally sourced custom textile coordination",
        "Low-VOC material & clay plaster overlays"
      ],
      avgDuration: "4 - 8 Weeks",
      bestFor: "Client looking to refresh existing spaces sustainably"
    }
  ];

  const SERVICE_FAQS = [
    {
      question: "How do your service fees scale for custom projects?",
      answer: "We offer a structured hybrid billing model depending on project complexity. For custom design phases (stages 1 to 3), we apply flat curation fees. For manufacturing bespoke pieces, architectural execution, and on-site oversight, we charge direct percentage placement premiums. Fully transparent budgets are finalized during Discovery."
    },
    {
      question: "Do you undertake luxury kitchen and bathroom renovation services in Navi Mumbai?",
      answer: "Absolutely. We are highly rated for luxury modular kitchen renovations and customized bathroom layout curation in Navi Mumbai. We integrate water-sensing fixtures, custom marble or quartz countertops, premium seamless cabinetry, and smart hidden organization solutions."
    },
    {
      question: "What scope of home curation or villa design services do you offer?",
      answer: "We handle full-home premium residential interior design, custom villa architecture, hospitality suite styling, and complete commercial space renovations. Our master decorators and structural architects coordinate everything from AutoCAD plans to final bespoke furniture handovers."
    },
    {
      question: "Do you offer integrated lighting and sensory automation?",
      answer: "Yes. We believe lighting is the primary architect of mood. We curate intelligent lighting grids that transition throughout the solar day, paired with acoustic treatments and thermal calibrations to create a multi-sensory environment that promotes biological well-being."
    },
    {
      question: "What is your spatial philosophy on workspace design?",
      answer: "We strongly believe that environments directly dictate biological stress levels. We dismantle sterile open-office patterns, replacing them with warm, custom partitions, acoustic wall slats, framed view boxes, and organic communal social islands."
    },
    {
      question: "What is the typical lead time for bespoke furniture curation?",
      answer: "Custom artisan pieces typically require 8 to 12 weeks for hand-production, depending on material rarity. We coordinate these timelines tightly with the site's architectural schedule to ensure that bespoke fittings arrive exactly when the environment is ready for installation."
    }
  ];

  const calculateEstimate = () => {
    let baseRate = 1600;
    if (spaceType === 'commercial') baseRate = 1900;
    if (spaceType === 'renovation') baseRate = 1000;

    let tierMultiplier = 1.0;
    if (materialTier === 'raw') tierMultiplier = 0.65;
    if (materialTier === 'prestige') tierMultiplier = 1.55;

    const estimatedCost = Math.round(squareFootage * baseRate * tierMultiplier);
    const estimatedHours = Math.round((squareFootage * 0.08) * tierMultiplier + 25);
    const sourcingBlocks = Math.round(5 + (squareFootage / 500) * (materialTier === 'prestige' ? 1.6 : 1.0));

    return {
      hours: estimatedHours,
      costLower: Math.round(estimatedCost * 0.95),
      costUpper: Math.round(estimatedCost * 1.15),
      blocks: sourcingBlocks,
      timeline: squareFootage < 1100 ? "6 - 10 Weeks" : squareFootage < 2600 ? "10 - 15 Weeks" : "16 - 22 Weeks"
    };
  };

  const estimate = calculateEstimate();

  const SERVICE_DESCRIPTIONS: Record<string, string> = {
    "Interior Designer": "Tailored spatial planning, conceptual mood boards, and aesthetic refinement for luxury living.",
    "Plumber": "Expert installations, leak detection, fixture repairs, and comprehensive system optimizations.",
    "Painting": "High-precision interior and exterior painting services utilizing premium, long-lasting color palettes.",
    "Electrician": "Certified wiring upgrades, smart lighting integration, electrical safety diagnostics, and panel repairs.",
    "Furniture Maker": "Handcrafted, bespoke furniture tailored to exact space dimensions and material preferences.",
    "Bathroom Renovator": "Revitalizing hygiene spaces with modern fixture integration and premium tile work.",
    "Kitchen Renovator": "Optimizing culinary hubs with custom cabinetry, ergonomic layout enhancements, and durable material installation.",
    "Roofing Services": "Structural maintenance and restorative repairs to ensure long-term protection from environmental damage.",
    "House Cleaning Services": "Meticulous, professional sanitization and organization for pristine, maintenance-free living."
  };

  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div id="services-page-root" className="bg-cream-soft text-forest-deep">
      
      <AnimatePresence>
        {selectedService && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-deep/80 backdrop-blur-sm"
            onClick={() => setSelectedService(null)}
          >
            <motion.div 
              initial={{ scale: 0.95 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.95 }}
              className="bg-paper-white p-8 rounded-2xl max-w-sm w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-2xl font-bold text-forest-deep mb-4">{selectedService}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {SERVICE_DESCRIPTIONS[selectedService] || "Professional maintenance and design assistance."}
              </p>
              <button 
                onClick={() => setSelectedService(null)} 
                className="mt-8 w-full py-3 border border-forest-deep/20 rounded-full font-label-caps text-xs tracking-widest uppercase hover:bg-forest-deep hover:text-paper-white transition-colors"
                type="button"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editorial Services Page Hero */}
      <section className="py-14 xs:py-16 md:py-24 bg-cream-soft border-b border-sage-muted/10 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-20 left-20 w-80 h-80 rounded-full bg-sage-muted filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-forest-deep filter blur-3xl"></div>
        </div>

        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-8">
            <span className="font-label-caps text-label-caps text-sage-muted tracking-widest block">TAILORED SOLUTIONS</span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="text-2xl sm:text-4xl md:font-display-lg text-forest-deep uppercase font-serif tracking-tight leading-[1.1] font-bold font-extrabold"
            >
              Curation Grounded <br/>
              <span className="text-sage-muted italic font-normal">in Story & Function</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed font-light"
            >
              From raw initial sketches to bespoke timber styling, we deliver premium spaces custom-tailored to the rhythm of human lifestyles, with a deep respect for biophilic elegance and modern craftsmanship.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Core Offerings Grid */}
      <section className="py-14 xs:py-16 md:py-24 bg-paper-white relative">
        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-2xl mx-auto mb-20 space-y-4"
          >
            <span className="font-label-caps text-label-caps text-sage-muted tracking-widest block">OUR SPECIALTIES</span>
            <h2 className="font-headline-md text-headline-md md:text-4xl font-serif uppercase text-forest-deep font-bold">
              Where Intentional Spaces Form
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Explore how we translate raw requirements into pristine, sustainable environments using local craftsmanship and custom spatial engineering.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {SERVICE_PACKAGES.map((pkg, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={pkg.title}
                className="bg-cream-soft/30 p-5 xs:p-6 sm:p-8 rounded-xl border border-sage-muted/15 flex flex-col justify-between group hover:bg-cream-soft/50 transition-all duration-300 shadow-xxs"
              >
                <div className="space-y-6">
                  <div className="w-12 h-12 bg-forest-deep rounded-xl flex items-center justify-center shadow-sm">
                    {pkg.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-forest-deep leading-tight uppercase tracking-tight">
                      {pkg.title}
                    </h3>
                    <p className="text-xs font-label-caps text-sage-muted tracking-widest uppercase mt-1">
                      EST. TIME: {pkg.avgDuration}
                    </p>
                  </div>
                  
                  <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                    {pkg.description}
                  </p>

                  <ul className="space-y-3 pt-4 border-t border-sage-muted/10">
                    {pkg.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm font-body-md text-forest-deep/80">
                        <CheckCircle2 className="w-4 h-4 text-forest-deep mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-sage-muted/10 space-y-4">
                  <div className="text-xs text-on-surface-variant">
                    <span className="font-bold text-forest-deep block">Best For:</span>
                    <span className="font-light italic">{pkg.bestFor}</span>
                  </div>
                  <button
                    onClick={() => onOpenInquiry(`Curation Interest: ${pkg.title}`)}
                    className="w-full py-3 bg-forest-deep hover:bg-forest-deep/90 text-paper-white rounded-full font-label-caps text-[10px] tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Request Package Brief</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Our Extended Services */}
      <section className="py-14 xs:py-16 md:py-24 bg-sage-muted/5 relative overflow-hidden">
        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-4"
          >
            <span className="font-label-caps text-label-caps text-forest-deep/60 tracking-widest block">EXTENDED CAPABILITIES</span>
            <h2 className="font-headline-md text-headline-md md:text-4xl font-serif uppercase text-forest-deep font-bold">
              Our Service Scope
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              We provide comprehensive residential and commercial maintenance and renovation solutions.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {[
              "Interior Designer",
              "Plumber",
              "Painting",
              "Electrician",
              "Furniture Maker",
              "Bathroom Renovator",
              "Kitchen Renovator",
              "Roofing Services",
              "House Cleaning Services"
            ].map((service) => (
              <motion.div
                key={service}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ 
                  scale: 1.05, 
                  borderColor: "rgba(10, 35, 25, 0.3)",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
                }}
                className="bg-paper-white/80 backdrop-blur-md px-8 py-4 rounded-full border border-forest-deep/10 shadow-sm text-center font-serif text-sm font-semibold tracking-wide text-forest-deep cursor-pointer transition-all duration-300 transform"
                onClick={() => setSelectedService(service)}
              >
                {service}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Interactive Project Estimator Tool (Full Visual Widget) */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.3 }}
        className="py-14 xs:py-16 md:py-24 bg-forest-deep text-paper-white relative overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-paper-white/5 to-transparent pointer-events-none"></div>

        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="font-label-caps text-label-caps text-sage-muted tracking-widest block text-cream-soft">INTERACTIVE DESIGN ESTIMATOR</span>
            <h2 className="font-headline-md text-headline-md md:text-4xl font-serif uppercase tracking-tight font-bold">
              Curate Your Estimate
            </h2>
            <p className="font-body-md text-sm text-paper-white/70 leading-relaxed max-w-lg mx-auto">
              Select your parameters below to generate an immediate, custom-modeled project scope assessment for design hours, timeline blocks, and raw timbers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-cream-soft/5 backdrop-blur-xs p-5 xs:p-8 md:p-12 rounded-xl border border-paper-white/10">
            
            {/* Form controls (Left Column) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Space Selection type */}
              <div className="space-y-3">
                <label className="font-label-caps text-[11px] text-sage-muted block tracking-widest uppercase">
                  01. Select Space Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'residential', label: 'Residential', desc: 'Modular Homes & Villas' },
                    { id: 'commercial', label: 'Commercial', desc: 'Boutique Retail & Workspace' },
                    { id: 'renovation', label: 'Renovation', desc: 'Room Revamp & Carpentry' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSpaceType(t.id as any);
                        // Sensible defaults for Indian layouts upon trigger
                        if (t.id === 'residential') setSquareFootage(1600);
                        if (t.id === 'commercial') setSquareFootage(1800);
                        if (t.id === 'renovation') setSquareFootage(450);
                      }}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        spaceType === t.id 
                          ? 'bg-paper-white text-forest-deep border-paper-white shadow-md' 
                          : 'bg-transparent border-paper-white/10 text-paper-white hover:border-paper-white/30'
                      }`}
                    >
                      <span className="text-sm font-serif font-bold block">{t.label}</span>
                      <span className="text-[10px] opacity-65 block">{t.desc}</span>
                    </button>
                  ))}
                </div>

                {/* Quick Presets based on standard Indian architectural layouts */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono tracking-wider opacity-60 uppercase block mb-1.5">
                    Quick Layout Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {spaceType === 'residential' && [
                      { label: '1 BHK', sqft: 650 },
                      { label: '2 BHK', sqft: 1050 },
                      { label: '3 BHK', sqft: 1600 },
                      { label: '4 BHK / Penthouse', sqft: 2600 },
                      { label: 'Luxury Villa', sqft: 4500 }
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => setSquareFootage(preset.sqft)}
                        className={`px-3 py-1.5 rounded text-[10.5px] font-mono border transition-all ${
                          squareFootage === preset.sqft
                            ? 'bg-paper-white text-forest-deep border-paper-white font-bold'
                            : 'bg-transparent border-paper-white/10 text-paper-white hover:border-paper-white/30'
                        }`}
                      >
                        {preset.label} ({preset.sqft} sq.ft)
                      </button>
                    ))}

                    {spaceType === 'commercial' && [
                      { label: 'Boutique Store/Cafe', sqft: 800 },
                      { label: 'Medium Corporate Office', sqft: 2000 },
                      { label: 'Atrium Retail Showroom', sqft: 3500 },
                      { label: 'Bespoke Headquarters', sqft: 6000 }
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => setSquareFootage(preset.sqft)}
                        className={`px-3 py-1.5 rounded text-[10.5px] font-mono border transition-all ${
                          squareFootage === preset.sqft
                            ? 'bg-paper-white text-forest-deep border-paper-white font-bold'
                            : 'bg-transparent border-paper-white/10 text-paper-white hover:border-paper-white/30'
                        }`}
                      >
                        {preset.label} ({preset.sqft} sq.ft)
                      </button>
                    ))}

                    {spaceType === 'renovation' && [
                      { label: 'Bedroom Wardrobe/Atelier', sqft: 350 },
                      { label: 'Modular Kitchen Revamp', sqft: 500 },
                      { label: 'Living Room Makeover', sqft: 800 },
                      { label: 'Whole Flat Restore', sqft: 1500 }
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => setSquareFootage(preset.sqft)}
                        className={`px-3 py-1.5 rounded text-[10.5px] font-mono border transition-all ${
                          squareFootage === preset.sqft
                            ? 'bg-paper-white text-forest-deep border-paper-white font-bold'
                            : 'bg-transparent border-paper-white/10 text-paper-white hover:border-paper-white/30'
                        }`}
                      >
                        {preset.label} ({preset.sqft} sq.ft)
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Square footage range selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-label-caps tracking-widest text-sage-muted">
                  <span>02. Fine-Tune Footprint</span>
                  <span className="text-paper-white font-mono font-bold text-sm">
                    {squareFootage.toLocaleString('en-IN')} SQ. FT.
                  </span>
                </div>
                <input 
                  type="range"
                  min="300"
                  max="8000"
                  step="50"
                  value={squareFootage}
                  onChange={(e) => setSquareFootage(parseInt(e.target.value))}
                  className="w-full accent-cream-soft h-1 bg-paper-white/20 rounded-lg cursor-pointer animate-pulse"
                />
                <div className="flex justify-between text-[10px] font-mono opacity-50">
                  <span>Min: 300 Sq. Ft. (Compact Atelier)</span>
                  <span>Max: 8,000 Sq. Ft. (Grand Estate)</span>
                </div>
              </div>

              {/* Material and curation tiers */}
              <div className="space-y-3">
                <label className="font-label-caps text-[11px] text-sage-muted block tracking-widest uppercase">
                  03. Sourcing & Contractor BOQ Quality
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'raw', label: 'Standard Premium', cost: '₹' },
                    { id: 'curated', label: 'Artisan Curated', cost: '₹₹' },
                    { id: 'prestige', label: 'Bespoke Luxury', cost: '₹₹₹' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMaterialTier(m.id as any)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        materialTier === m.id 
                          ? 'bg-paper-white text-forest-deep border-paper-white shadow-md' 
                          : 'bg-transparent border-paper-white/10 text-paper-white hover:border-paper-white/30'
                      }`}
                    >
                      <span className="text-xs font-bold block font-serif uppercase tracking-tight">{m.label}</span>
                      <span className="text-[10px] opacity-65 mt-0.5 block flex justify-between">
                        <span>Spec Level</span>
                        <span className="font-bold font-mono">{m.cost}</span>
                      </span>
                    </button>
                  ))}
                </div>

                {/* Live Specification Details Card for Indian Builders */}
                <div className="p-4 rounded-lg bg-paper-white/5 border border-paper-white/10 text-xs text-paper-white/80 space-y-1.5 font-sans leading-relaxed">
                  {materialTier === 'raw' && (
                    <>
                      <strong className="text-sage-muted font-mono uppercase text-[10px] tracking-wider block">Standard Premium Sourcing Spec (IS:303 BWR Commercial Ply)</strong>
                      <p>Highpressure acrylic laminates, Asian Paints Tractor/Acolite wash, full plasterboard false ceilings with Philips LED cobs, premium Hettich softclose hardware.</p>
                    </>
                  )}
                  {materialTier === 'curated' && (
                    <>
                      <strong className="text-sage-muted font-mono uppercase text-[10px] tracking-wider block">Artisan Curated Sourcing Spec (IS:710 Marine Waterproof Ply)</strong>
                      <p>Custom natural oak/teakwood veneers, flawless designer PU matte polishing, magnetic profile tracking light networks, Asian Paints Royale finish, microcement surface coats.</p>
                    </>
                  )}
                  {materialTier === 'prestige' && (
                    <>
                      <strong className="text-sage-muted font-mono uppercase text-[10px] tracking-wider block">Bespoke Luxury Sourcing Spec (BWP Heavy Timber Frame & Real Stone)</strong>
                      <p>Grand Solid Burma Teak millwork, authentic imported Italian Statvario/Michelangelo marble floor details, Hafele motorized softtouch assemblies, handcrafted clay/lime-wash textures.</p>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* Simulated Live Results widget (Right Column) */}
            <div className="lg:col-span-5 bg-paper-white text-forest-deep p-5 xs:p-8 rounded-xl flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cream-soft/60 rounded-bl-full pointer-events-none"></div>
              
              <div className="space-y-6">
                <div className="border-b border-sage-muted/15 pb-4">
                  <span className="text-[10px] font-label-caps tracking-widest text-sage-muted block mb-1">CURATED SCOPE</span>
                  <h3 className="font-serif text-2xl font-bold uppercase tracking-tight">Est. Project Brief</h3>
                </div>

                <div className="space-y-4">
                  <MaterialCompareChart 
                    spaceType={spaceType}
                    squareFootage={squareFootage}
                    activeTier={materialTier}
                    onTierSelect={setMaterialTier}
                  />

                  {/* Sourcing Timeline */}
                  <div className="pt-4 border-t border-sage-muted/10">
                    <span className="text-[10px] text-sage-muted block uppercase tracking-widest mb-1 font-label-caps">Estimated Handover Timeline</span>
                    <p className="font-serif font-bold text-lg text-forest-deep uppercase">
                      {estimate.timeline}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 space-y-3">
                <button
                  onClick={() => onOpenInquiry(`Curated Estimate Assessment Request - ${spaceType.toUpperCase()} - ${squareFootage} SQFT - Sourcing: ${materialTier.toUpperCase()}`)}
                  className="w-full py-4 bg-forest-deep hover:bg-forest-deep/90 text-paper-white rounded-full font-label-caps text-label-caps font-semibold tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Secure Project Block</span>
                </button>
                <p className="text-[9px] text-center text-on-surface-variant font-light leading-relaxed">
                  *This estimate provides standard Maintenance Masters regional pricing templates. Custom architectural features may define different specifications.
                </p>
              </div>

            </div>

          </div>

        </div>
      </motion.section>

      {/* Interactive Phase Grid / Progress Pathway */}
      <section className="py-14 xs:py-16 md:py-24 bg-paper-white relative">
        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3 }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-4"
          >
            <span className="font-label-caps text-label-caps text-sage-muted tracking-widest block">THE PROCESS TIMELINE</span>
            <h2 className="font-headline-md text-headline-md md:text-4xl font-serif uppercase text-forest-deep font-bold">
              From Original Paper to Physical Curation
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              We guide you smoothly through a modular 4-part execution model, providing maximum transparency and detailed aesthetic sign-offs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left selector col */}
            <div className="lg:col-span-5 space-y-3">
              {DESIGN_STAGES.map((stage, idx) => (
                <button
                  key={stage.num}
                  onClick={() => setActiveStage(idx)}
                  className={`w-full text-left p-6 rounded-xl transition-all border ${
                    activeStage === idx 
                      ? 'bg-cream-soft text-forest-deep border-forest-deep/30 shadow-xs' 
                      : 'bg-transparent border-sage-muted/15 hover:border-sage-muted/30 text-forest-deep'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-mono text-xs tracking-widest ${activeStage === idx ? 'text-forest-deep font-bold' : 'text-sage-muted'}`}>
                      PHASE {stage.num}
                    </span>
                    <span className="text-xs font-mono text-sage-muted">{stage.time}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold uppercase tracking-tight mt-1">
                    {stage.name}
                  </h3>
                </button>
              ))}
            </div>

            {/* Right details visual box */}
            <div className="lg:col-span-7 bg-cream-soft p-5 xs:p-8 md:p-12 rounded-xl relative overflow-hidden border border-sage-muted/15 min-h-[440px] flex flex-col justify-between">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-forest-deep text-paper-white px-4.5 py-1.5 rounded-full text-xs font-mono">
                      STAGE {DESIGN_STAGES[activeStage].num}
                    </span>
                    <span className="text-xs font-label-caps text-sage-muted tracking-wider uppercase font-semibold">
                      {DESIGN_STAGES[activeStage].tagline}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold uppercase tracking-wide text-forest-deep">
                    {DESIGN_STAGES[activeStage].name}
                  </h3>

                  <p className="font-body-md text-base text-on-surface-variant leading-relaxed">
                    {DESIGN_STAGES[activeStage].summary}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-sage-muted/20">
                    <span className="text-xs font-label-caps text-sage-muted tracking-wide block uppercase font-bold">
                      Key Deliverables & Milestones:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {DESIGN_STAGES[activeStage].deliverables.map((deliv, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-forest-deep">
                          <CheckCircle2 className="w-4 h-4 text-forest-deep mt-0.5" />
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dynamic decorative backdrop background panel */}
              <div className="mt-8 pt-6 border-t border-sage-muted/10 flex justify-between items-center text-xs font-label-caps text-sage-muted">
                <span>PHASE DURATION: {DESIGN_STAGES[activeStage].time}</span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Services Specific Collapsible FAQ Accordions */}
      <section className="py-14 xs:py-16 md:py-24 bg-cream-soft border-t border-b border-sage-muted/10">
        <div className="px-4 xs:px-6 md:px-16 max-w-4xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3 }}
            className="text-center mb-16 space-y-4"
          >
            <span className="font-label-caps text-label-caps text-sage-muted tracking-widest block">BILLING & TRANSPARENCY</span>
            <h2 className="font-headline-md text-headline-md md:text-4xl font-serif uppercase text-forest-deep font-bold">
              Services FAQ
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed max-w-xl mx-auto">
              Got pre-consultation inquiries? Learn how spatial alignments are coordinated, material schedules are handled, and how we estimate budgets.
            </p>
          </motion.div>

          <div className="space-y-4">
            {SERVICE_FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index} 
                  className="bg-paper-white rounded-lg border border-sage-muted/15 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-6 flex justify-between items-center gap-4 cursor-pointer hover:bg-cream-soft/10 transition-colors focus:outline-none"
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
              onClick={() => onOpenInquiry("Detailed Service & Process Inquiry")}
              className="px-8 py-4 bg-forest-deep text-paper-white rounded-full font-label-caps text-xs tracking-widest uppercase hover:bg-forest-deep/90 transition-all cursor-pointer shadow-md inline-flex items-center gap-3 group"
            >
              <span>Have more questions?</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>

        </div>
      </section>

      {/* Call to Curation Banner */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="py-14 xs:py-16 md:py-24 bg-forest-deep text-paper-white text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0 opacity-15">
          <img 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover" 
            src={IMAGES.imaginationGrid[2]} 
            alt="Scenic atmospheric space background" 
            loading="lazy"
          />
          <div className="absolute inset-0 bg-forest-deep/90"></div>
        </div>

        <div className="px-4 xs:px-6 md:px-16 max-w-3xl mx-auto relative z-10 space-y-8">
          <span className="font-label-caps text-label-caps text-cream-soft/80 tracking-widest block font-bold">ESTABLISH CURATION COORDS</span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl uppercase font-serif tracking-tight leading-[1.1] font-bold">
            Schedule Your Spatial <br/> Curation Sighting
          </h2>
          <p className="font-body-md text-paper-white/70 leading-relaxed max-w-xl mx-auto">
            Book a dedicated consultation coordinate to align dimensions, materials, and artisan schedules.
          </p>
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => onOpenInquiry("General Design Consultation Coordinate Meeting")}
              className="px-10 py-4 bg-paper-white text-forest-deep rounded-full font-label-caps text-label-caps tracking-widest hover:bg-cream-soft transition-all cursor-pointer shadow-md"
            >
              Request Custom Estimate
            </button>
          </div>
        </div>
      </motion.section>

    </div>
  );
}
