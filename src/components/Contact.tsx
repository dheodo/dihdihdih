import { useState, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Trash2,
  MapPin,
  MessageCircle,
  Instagram
} from 'lucide-react';

interface ContactProps {
  onOpenInquiry?: (initialService?: string) => void;
}

export default function Contact({ onOpenInquiry }: ContactProps) {
  // Main form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    spaceType: 'residential',
    materialPrefer: 'curated',
    budgetRange: '50k-200k',
    message: '',
    timeline: '3-6months'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Required';
    if (!formData.email.trim()) {
      newErrors.email = 'Required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Required';
    if (!formData.message.trim()) newErrors.message = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDeleteDraft = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      spaceType: 'residential',
      materialPrefer: 'minimal-modern',
      budgetRange: '50k-200k',
      message: '',
      timeline: '3-6months'
    });
    setErrors({});
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSpaceTypeSelect = (type: string) => {
    setFormData(prev => ({
      ...prev,
      spaceType: type
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    const { name, phone, timeline, spaceType, materialPrefer, budgetRange, message } = formData;
    
    const body = `Dear maintenance masters
Full Name: ${name}
Phone Number: ${phone}
Project Timeline: ${timeline === 'immediate' ? 'Immediate Startup (1 - 2 weeks)' : timeline === '3-6months' ? 'Standard Framing (3 - 6 months)' : timeline === '6-12months' ? 'Future Groundwork (6 - 12 months)' : 'Flexible / Planning Period'}
Aesthetic Target / Preferred Interior Style: ${spaceType === 'residential' ? 'Residential' : spaceType === 'commercial' ? 'Commercial' : spaceType === 'renovation' ? 'Renovation' : spaceType === 'kitchen&bath' ? 'Kitchen & Bath' : 'Office Design'}
Preferred Materials & Finishes: ${materialPrefer === 'raw' ? 'Essential Raw (Stone, linen veneers)' : materialPrefer === 'curated' ? 'Curated Artisan (Custom-cut oak, slate mats)' : 'Bespoke Prestige (Museum carvings, imported marble)'}
Level of Expectation / Desired Outcome: ${materialPrefer === 'raw' ? 'Essential Raw' : materialPrefer === 'curated' ? 'Curated Artisan' : 'Bespoke Prestige'}
Budget Range: ${budgetRange === '50k-200k' ? '₹50,000 - ₹2,00,000' : budgetRange === '200k-500k' ? '₹2,00,000 - ₹5,00,000' : budgetRange === '500k-1000k' ? '₹5,00,000 - ₹10,00,000' : '₹10,00,000+'}
Creative Direction / Design Inspiration:
${message}


Looking forward to your response.

Best Regards,
maintenance master`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=maintenancemasters2001@gmail.com&su=${encodeURIComponent("New Intake Request - " + name)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');

    // Simulate short loading to feel like real submission prepare
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  return (
    <div id="contact-page-root" className="bg-cream-soft text-forest-deep flex-1">
      
      {/* Editorial Page Header */}
      <section className="py-14 xs:py-16 md:py-24 bg-cream-soft border-b border-sage-muted/10 relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-paper-white/10 to-transparent pointer-events-none"></div>
        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl space-y-6">
            <span className="font-label-caps text-label-caps text-sage-muted tracking-widest block">SECURE COORDINATES</span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-forest-deep uppercase font-serif tracking-tight leading-[1.1]"
            >
              Get in Touch
            </motion.h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed font-light">
              We seek visionary clients who find beauty in raw stones, tactile timbers, biophilic light patterns, and custom-designed silence. Reach our design team or request an immediate spatial sighting.
            </p>
          </div>
        </div>
      </section>

      {/* Main Form & Direct Channels Workspace */}
      <section className="py-14 xs:py-16 md:py-24 bg-paper-white relative">
        <div className="px-4 xs:px-6 md:px-16 max-w-7xl mx-auto">
          
          <AnimatePresence mode="wait">
            {!submitSuccess ? (
              <motion.div 
                key="contact-form-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-16"
              >
                
                {/* Left side: Classy custom client intake form */}
                <div className="lg:col-span-7 space-y-10">
                  <div>
                    <h2 className="font-serif text-3xl font-bold uppercase tracking-tight text-forest-deep mb-2">
                      Estates Intake Form
                    </h2>
                    <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                      Complete this intake catalog to draft your space's initial lighting plans, layout complexities, and material preferences.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Basic specs field row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="font-label-caps text-[11px] text-sage-muted block tracking-widest uppercase font-bold">
                          Full Name *
                        </label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Genevieve Dubois"
                          className={`w-full bg-cream-soft/40 border ${errors.name ? 'border-red-500' : 'border-sage-muted/20'} rounded-lg p-4 font-body-md text-sm text-forest-deep placeholder:text-forest-deep/30 focus:outline-none focus:border-forest-deep transition-all`}
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-caps text-[11px] text-sage-muted block tracking-widest uppercase font-bold">
                          Email Coordinate *
                        </label>
                        <input 
                          type="email" 
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="genevieve@atrium.com"
                          className={`w-full bg-cream-soft/40 border ${errors.email ? 'border-red-500' : 'border-sage-muted/20'} rounded-lg p-4 font-body-md text-sm text-forest-deep placeholder:text-forest-deep/30 focus:outline-none focus:border-forest-deep transition-all`}
                        />
                         {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="font-label-caps text-[11px] text-sage-muted block tracking-widest uppercase font-bold">
                          Phone / Secure Line
                        </label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 019-3829"
                          className={`w-full bg-cream-soft/40 border ${errors.phone ? 'border-red-500' : 'border-sage-muted/20'} rounded-lg p-4 font-body-md text-sm text-forest-deep placeholder:text-forest-deep/30 focus:outline-none focus:border-forest-deep transition-all`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-caps text-[11px] text-sage-muted block tracking-widest uppercase font-bold">
                          Project Timeline
                        </label>
                        <select 
                          name="timeline"
                          value={formData.timeline}
                          onChange={handleInputChange}
                          className="w-full bg-cream-soft/40 border border-sage-muted/20 rounded-lg p-4 font-body-md text-sm text-forest-deep focus:outline-none focus:border-forest-deep transition-all appearance-none cursor-pointer"
                        >
                          <option value="immediate">Immediate Startup (1 - 2 weeks)</option>
                          <option value="3-6months">Standard Framing (3 - 6 months)</option>
                          <option value="6-12months">Future Groundwork (6 - 12 months)</option>
                          <option value="flexible">Flexible / Planning Period</option>
                        </select>
                      </div>
                    </div>

                    {/* Interactive Space Select dropdown */}
                    <div className="space-y-2">
                      <label className="font-label-caps text-[11px] text-sage-muted block tracking-widest uppercase font-bold">
                        Aesthetic Target Space
                      </label>
                      <select 
                        name="spaceType"
                        value={formData.spaceType}
                        onChange={handleInputChange}
                        className="w-full bg-cream-soft/40 border border-sage-muted/20 rounded-lg p-4 font-body-md text-sm text-forest-deep focus:outline-none focus:border-forest-deep transition-all appearance-none cursor-pointer"
                      >
                        <option value="residential">Residential — Luxury villa sanctuary</option>
                        <option value="commercial">Commercial — Symmetric workspace</option>
                        <option value="renovation">Renovation — Tactile historical retro</option>
                        <option value="kitchen&bath">Kitchen & Bath — Bespoke culinary systems</option>
                        <option value="office design">Office Design — Executive spatial workspaces</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="font-label-caps text-[11px] text-sage-muted block tracking-widest uppercase font-bold">
                          Material Level Expectation
                        </label>
                        <select 
                          name="materialPrefer"
                          value={formData.materialPrefer}
                          onChange={handleInputChange}
                          className="w-full bg-cream-soft/40 border border-sage-muted/20 rounded-lg p-4 font-body-md text-sm text-forest-deep focus:outline-none focus:border-forest-deep transition-all appearance-none cursor-pointer"
                        >
                          <option value="raw">Essential Raw (Stone, linen veneers)</option>
                          <option value="curated">Curated Artisan (Custom-cut oak, slate mats)</option>
                          <option value="prestige">Bespoke Prestige (Museum carvings, imported marble)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="font-label-caps text-[11px] text-sage-muted block tracking-widest uppercase font-bold">
                          Budget Range Coordinate
                        </label>
                        <select 
                          name="budgetRange"
                          value={formData.budgetRange}
                          onChange={handleInputChange}
                          className="w-full bg-cream-soft/40 border border-sage-muted/20 rounded-lg p-4 font-body-md text-sm text-forest-deep focus:outline-none focus:border-forest-deep transition-all appearance-none cursor-pointer"
                        >
                          <option value="50k-200k">Premier Curation (₹50,000 - ₹2,00,000)</option>
                          <option value="200k-500k">Prestige Custom (₹2,00,000 - ₹5,00,000)</option>
                          <option value="500k-1000k">Bespoke Structural (₹5,00,000 - ₹10,00,000)</option>
                          <option value="1000k+">Bespoke Architectural Villa (₹10,00,000+)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="font-label-caps text-[11px] text-sage-muted block tracking-widest uppercase font-bold">
                        Spatial Story & Special Directives
                      </label>
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Elaborate on your space's native light layout, historic timber attributes, family coordinates, or specific functional desires..."
                        className={`w-full bg-cream-soft/40 border ${errors.message ? 'border-red-500' : 'border-sage-muted/20'} rounded-lg p-4 font-body-md text-sm text-forest-deep placeholder:text-forest-deep/30 focus:outline-none focus:border-forest-deep transition-all resize-y`}
                      />
                      {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-2/3 py-4.5 bg-forest-deep hover:bg-forest-deep/90 text-paper-white font-label-caps text-label-caps tracking-widest uppercase rounded-full transition-all duration-300 font-semibold cursor-pointer select-none flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-paper-white border-t-transparent rounded-full animate-spin"></div>
                            <span>ALIGNING COORDINATES...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>SEND SECURE INTAKE REQUEST</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteDraft}
                        className="w-full sm:w-1/3 py-4.5 bg-transparent border border-forest-deep text-forest-deep font-label-caps text-label-caps tracking-widest uppercase rounded-full transition-all duration-300 font-semibold cursor-pointer select-none flex items-center justify-center gap-2 hover:bg-forest-deep/5"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Draft</span>
                      </button>
                    </div>

                  </form>
                </div>

                {/* Right side: Studio Addresses & Custom Locator Panel */}
                <div className="lg:col-span-5 space-y-12">
                  
                  {/* Immediate Contact Columns */}
                  <div className="space-y-6">
                    <h3 className="font-serif text-2xl font-bold uppercase tracking-tight text-forest-deep">
                      Direct Pathways
                    </h3>
                    
                    <div className="space-y-4">
                      
                      <div className="flex gap-4 p-4 xs:p-5 bg-cream-soft/30 rounded-xl border border-sage-muted/10">
                        <div className="w-10 h-10 rounded-lg bg-forest-deep flex items-center justify-center shrink-0">
                          <Instagram className="w-5 h-5 text-paper-white" />
                        </div>
                        <div>
                          <span className="font-label-caps text-[10px] text-sage-muted block tracking-wider uppercase">FOLLOW OUR CRAFT</span>
                          <a 
                            href="https://www.instagram.com/main_tenancemasters" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-serif text-sm font-bold text-forest-deep hover:text-sage-muted transition-colors"
                          >
                            @main_tenancemasters
                          </a>
                        </div>
                      </div>

                       <div className="flex gap-4 p-4 xs:p-5 bg-cream-soft/30 rounded-xl border border-sage-muted/10">
                        <div className="w-10 h-10 rounded-lg bg-forest-deep flex items-center justify-center shrink-0">
                          <Mail className="w-5 h-5 text-paper-white" />
                        </div>
                        <div>
                          <span className="font-label-caps text-[10px] text-sage-muted block tracking-wider uppercase">SECURE EMAIL DESK</span>
                          <a 
                            href="https://mail.google.com/mail/?view=cm&fs=1&to=maintenancemasters2001@gmail.com" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-serif text-sm font-bold text-forest-deep hover:text-sage-muted transition-colors"
                          >
                            maintenancemasters2001@gmail.com
                          </a>
                          <span className="text-[10px] text-on-surface-variant block mt-0.5">Response secured in 24 hours.</span>
                        </div>
                      </div>

                      <div className="flex gap-4 p-4 xs:p-5 bg-cream-soft/30 rounded-xl border border-sage-muted/10">
                        <div className="w-10 h-10 rounded-lg bg-forest-deep flex items-center justify-center shrink-0">
                          <Phone className="w-5 h-5 text-paper-white" />
                        </div>
                        <div>
                          <span className="font-label-caps text-[10px] text-sage-muted block tracking-wider uppercase">PRIVATE ATELIER PHONE</span>
                          <span className="font-serif text-sm font-bold text-forest-deep block">
                            +91 77189 01809
                          </span>
                          <span className="text-[10px] text-on-surface-variant block mt-0.5">Mon - Fri: 09:00 - 18:00 IST.</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 p-4 xs:p-5 bg-cream-soft/40 rounded-xl border border-emerald-600/10 hover:border-emerald-600/30 transition-all duration-300 items-start sm:items-center justify-between group">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
                            <MessageCircle className="w-5 h-5 text-paper-white" />
                          </div>
                          <div>
                            <span className="font-label-caps text-[10px] text-emerald-700 block tracking-wider uppercase font-bold">WHATSAPP DIRECT ROUTE</span>
                            <span className="font-serif text-sm font-bold text-forest-deep block">
                              +91 77189 01809
                            </span>
                            <span className="text-[10px] text-on-surface-variant block mt-0.5">Tap to load secure WhatsApp chat.</span>
                          </div>
                        </div>
                        <a 
                          href="https://wa.me/917718901809?text=Hello%20Maintenance%20Masters!%20I'd%20love%20to%20discuss%20an%20interior%20design%20and%20curation%20sighting%20with%20your%20team."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-paper-white font-label-caps text-[11px] tracking-widest uppercase rounded-full transition-all cursor-pointer font-bold flex items-center justify-center gap-1.5 shadow-sm group-hover:scale-[1.02]"
                        >
                          <span>Chat Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <div className="flex gap-4 p-4 xs:p-5 bg-cream-soft/30 rounded-xl border border-sage-muted/10">
                        <div className="w-10 h-10 rounded-lg bg-forest-deep flex items-center justify-center shrink-0">
                          <Clock className="w-5 h-5 text-paper-white" />
                        </div>
                        <div>
                          <span className="font-label-caps text-[10px] text-sage-muted block tracking-wider uppercase">CURATION CONSULTING HOURS</span>
                          <span className="font-serif text-sm font-bold text-forest-deep block">
                            By Sighting Appointment Only
                          </span>
                          <span className="text-[10px] text-on-surface-variant block mt-0.5">We host structured site sessions across Navi Mumbai.</span>
                        </div>
                      </div>

                      <div className="flex gap-4 p-4 xs:p-5 bg-cream-soft/30 rounded-xl border border-sage-muted/10">
                        <div className="w-10 h-10 rounded-lg bg-forest-deep flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5 text-paper-white" />
                        </div>
                        <div>
                          <span className="font-label-caps text-[10px] text-sage-muted block tracking-wider uppercase">STUDIO COORDINATE ADDRESS</span>
                          <span className="font-serif text-sm font-bold text-forest-deep block leading-snug">
                            Flat No-02, Nath Sadan, Near Hanuman Mandir, Ghansoli Goan, Ghansoli, Navi Mumbai
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </motion.div>
            ) : (
              /* High-fidelity Success screen markup */
              <motion.div 
                key="contact-form-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center py-16 px-6 bg-cream-soft/40 border border-sage-muted/15 rounded-2xl relative overflow-hidden space-y-8 shadow-xs"
              >
                <div className="absolute top-0 left-0 w-24 h-24 bg-forest-deep/5 rounded-br-full pointer-events-none"></div>
                
                <div className="w-16 h-16 bg-forest-deep text-paper-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-3">
                  <span className="font-label-caps text-label-caps text-sage-muted tracking-widest block font-bold">ATMOSPHERIC LINK ESTABLISHED</span>
                  <h3 className="font-serif text-3xl font-bold uppercase tracking-tight text-forest-deep">
                    Intake Draft Secured
                  </h3>
                  <p className="font-body-md text-base text-on-surface-variant leading-relaxed max-w-md mx-auto">
                    Our principal design team has logged your spatial parameters. We are analyzing the solar alignments and raw material specifications of your target profile.
                  </p>
                </div>

                <div className="bg-paper-white border border-sage-muted/10 rounded-xl p-6 max-w-sm mx-auto text-left space-y-3">
                  <span className="text-[10px] font-label-caps text-sage-muted block uppercase tracking-wider font-bold">REGISTRATION RECEIPT</span>
                  <div className="font-body-md text-xs space-y-1.5 text-forest-deep/80">
                    <p className="flex justify-between border-b border-sage-muted/5 pb-1"><span className="text-sage-muted">Client Profile:</span> <span>{formData.name}</span></p>
                    <p className="flex justify-between border-b border-sage-muted/5 pb-1"><span className="text-sage-muted">Intake Coordinate:</span> <span>{formData.email}</span></p>
                    <p className="flex justify-between border-b border-sage-muted/5 pb-1"><span className="text-sage-muted">Space Concept:</span> <span className="uppercase font-semibold">{formData.spaceType}</span></p>
                    <p className="flex justify-between"><span className="text-sage-muted">Budget Catalog:</span> <span>{formData.budgetRange}</span></p>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=maintenancemasters2001@gmail.com&su=${encodeURIComponent("New Intake Request - " + formData.name)}&body=${encodeURIComponent(
`Dear maintenance masters
Full Name: ${formData.name}
Phone Number: ${formData.phone}
Project Timeline: ${formData.timeline === 'immediate' ? 'Immediate Startup (1 - 2 weeks)' : formData.timeline === '3-6months' ? 'Standard Framing (3 - 6 months)' : formData.timeline === '6-12months' ? 'Future Groundwork (6 - 12 months)' : 'Flexible / Planning Period'}
Aesthetic Target / Preferred Interior Style: ${formData.spaceType === 'residential' ? 'Residential' : formData.spaceType === 'commercial' ? 'Commercial' : formData.spaceType === 'renovation' ? 'Renovation' : formData.spaceType === 'kitchen&bath' ? 'Kitchen & Bath' : 'Office Design'}
Preferred Materials & Finishes: ${formData.materialPrefer === 'raw' ? 'Essential Raw (Stone, linen veneers)' : formData.materialPrefer === 'curated' ? 'Curated Artisan (Custom-cut oak, slate mats)' : 'Bespoke Prestige (Museum carvings, imported marble)'}
Level of Expectation / Desired Outcome: ${formData.materialPrefer === 'raw' ? 'Essential Raw' : formData.materialPrefer === 'curated' ? 'Curated Artisan' : 'Bespoke Prestige'}
Budget Range: ${formData.budgetRange === '50k-200k' ? '₹50,000 - ₹2,00,000' : formData.budgetRange === '200k-500k' ? '₹2,00,000 - ₹5,00,000' : formData.budgetRange === '500k-1000k' ? '₹5,00,000 - ₹10,00,000' : '₹10,00,000+'}
Creative Direction / Design Inspiration:
${formData.message}


Looking forward to your response.

Best Regards,
maintenance master`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3.5 bg-forest-deep hover:bg-forest-deep/90 text-paper-white font-label-caps text-label-caps tracking-widest uppercase rounded-full transition-all cursor-pointer font-bold shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Open Gmail Compose</span>
                    <Mail className="w-4 h-4 text-paper-white" />
                  </a>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="px-8 py-3.5 border border-forest-deep hover:bg-forest-deep/5 text-forest-deep font-label-caps text-label-caps tracking-widest uppercase rounded-full transition-all cursor-pointer font-bold flex items-center justify-center gap-1.5"
                  >
                    <span>Submit another layout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

    </div>
  );
}
