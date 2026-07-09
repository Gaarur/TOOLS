import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { BlogCarousel } from "@/components/BlogCarousel";
import { Menu, X, Loader2, Send, Star, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";

// --- Animation Variants ---
const EASE_SMOOTH = [0.25, 0.46, 0.45, 0.94] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_SMOOTH, delay },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  }),
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_SMOOTH } },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE_SMOOTH } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_SMOOTH } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author?: string | null;
  createdAt?: Date | string | null;
  image?: string | null;
  coverImage?: string | null;
}

const AnimatedCounter = ({ target, label }: { target: number; label: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="flex flex-col border-l-4 border-primary pl-4 py-1">
      <div className="text-3xl font-bold text-foreground">{count}+</div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </div>
  );
};

export default function Home() {
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { theme, toggleTheme } = useTheme();
  
  // Header scroll state
  const [showLogo, setShowLogo] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide logo when scrolled down past 50px, only show at the very top
      if (currentScrollY > 50) {
        setShowLogo(false);
      } else {
        setShowLogo(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic CMS content
  const { data: siteContent } = trpc.site.getContent.useQuery();
  const { data: blogPosts = [] } = trpc.blog.list.useQuery() ?? { data: [] };

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setContactForm({ name: "", email: "", phone: "", subject: "", message: "" });
    },
    onError: (err: any) => toast.error(err.message || "Failed to send message"),
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    contactMutation.mutate(contactForm);
  };

  // Extract CMS data with fallbacks
  const hero = siteContent?.hero;
  const about = siteContent?.about;
  const settings = siteContent?.settings;
  const servicesList = siteContent?.services ?? [];
  const teamList = siteContent?.team ?? [];
  const testimonialsList = siteContent?.testimonials ?? [];
  const faqsList = siteContent?.faqs ?? [];
  const galleryList = siteContent?.gallery ?? [];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header Container */}
      <header className="fixed top-2 left-0 right-0 z-50 px-6 md:px-12 pointer-events-none flex items-center justify-between">
        
        {/* Left: Static Logo */}
        <div
          className={`pointer-events-auto cursor-pointer transition-all duration-500 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none'}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <img
            src="/images/logo.svg"
            alt="OMTT Logo"
            className="h-36 md:h-40 w-auto drop-shadow-md"
            style={{ filter: "brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.4))" }}
          />
        </div>

        {/* Center: Navigation Capsule (Desktop only) */}
        <nav className="pointer-events-auto hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center border border-white/20 dark:border-white/10 rounded-full bg-background/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-500 hover:bg-background/80 px-8 h-14">
          <div className="flex items-center gap-8 font-semibold text-xs tracking-[0.2em] text-foreground">
            <button onClick={() => scrollToSection("services")} className="relative hover:text-primary transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
              SERVICES
            </button>
            <button onClick={() => scrollToSection("capabilities")} className="relative hover:text-primary transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
              CAPABILITIES
            </button>
            <button onClick={() => scrollToSection("about")} className="relative hover:text-primary transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
              ABOUT
            </button>
            <button onClick={() => scrollToSection("blog")} className="relative hover:text-primary transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
              BLOG
            </button>
            <button onClick={() => scrollToSection("contact")} className="relative hover:text-primary transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
              CONTACT
            </button>
          </div>
        </nav>

        {/* Right: Actions */}
        <div className="pointer-events-auto flex items-center gap-2 md:gap-4 bg-background/40 backdrop-blur-md rounded-full px-2 py-1 border border-white/10">
          {/* Theme Toggle */}
          <button
            onClick={() => toggleTheme?.()}
            className="p-2 rounded-full hover:bg-muted/50 text-foreground transition-all duration-300 hover:scale-110 active:scale-95"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-full hover:bg-muted/50 transition-colors text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-40 bg-background border-b border-border md:hidden px-4 py-4 shadow-lg">
          <div className="flex flex-col gap-4 font-semibold">
            <button onClick={() => scrollToSection("services")} className="text-left py-2 border-b border-border/50 hover:text-primary">
              SERVICES
            </button>
            <button onClick={() => scrollToSection("capabilities")} className="text-left py-2 border-b border-border/50 hover:text-primary">
              CAPABILITIES
            </button>
            <button onClick={() => scrollToSection("about")} className="text-left py-2 border-b border-border/50 hover:text-primary">
              ABOUT
            </button>
            <button onClick={() => scrollToSection("blog")} className="text-left py-2 border-b border-border/50 hover:text-primary">
              BLOG
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-left py-2 hover:text-primary">
              CONTACT
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pb-0 space-y-0">
        
        {/* Hero Section */}
        {(hero?.visible !== 0) && (
          <div className="relative min-h-[80vh] md:min-h-screen flex items-center border-b border-border overflow-hidden">
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="absolute inset-0 z-0"
            >
              <div className="absolute inset-0 bg-black/60 z-10" />
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                src="/images/hero.png"
                alt="Precision CNC Machining"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col justify-center">
              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.15}
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white leading-[1.1] max-w-4xl"
              >
                {hero?.heading || "Engineered for Precision. Built for Performance."}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.3}
                className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed border-l-2 border-primary pl-4"
              >
                {hero?.subheading || "A precision engineering partner delivering excellence in plastic injection moulds, rubber moulds, and precision fixtures for demanding industrial applications."}
              </motion.p>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0.45}
                className="flex flex-wrap gap-4"
              >
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm font-semibold tracking-wide border border-primary px-8"
                  onClick={() => {
                    const url = hero?.primaryBtnUrl;
                    if (url?.startsWith("#")) scrollToSection(url.slice(1));
                    else if (url) window.location.href = url;
                  }}
                >
                  {hero?.primaryBtnText || "GET STARTED"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-sm font-semibold tracking-wide border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm px-8"
                  onClick={() => {
                    const url = hero?.secondaryBtnUrl;
                    if (url?.startsWith("#")) scrollToSection(url.slice(1));
                    else if (url) window.location.href = url;
                  }}
                >
                  {hero?.secondaryBtnText || "VIEW DETAILS"}
                </Button>
              </motion.div>
            </div>
          </div>
        )}

        {/* Stats Strip */}
        <div className="bg-secondary border-b border-border py-12">
          <div className="container">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50"
            >
              <motion.div variants={staggerItem}><AnimatedCounter target={13} label="Years of Excellence" /></motion.div>
              <motion.div variants={staggerItem}><AnimatedCounter target={500} label="Clients Served" /></motion.div>
              <motion.div variants={staggerItem}><AnimatedCounter target={1000} label="Projects Completed" /></motion.div>
              <motion.div variants={staggerItem}><AnimatedCounter target={100} label="Global Partners" /></motion.div>
            </motion.div>
          </div>
        </div>

        {/* What We Do / Services Section */}
        <div id="services" className="container py-24 space-y-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={0}
            className="max-w-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 border-b-4 border-primary inline-block pb-2">CORE CAPABILITIES</h2>
            <p className="text-muted-foreground text-lg">Delivering industrial-grade tooling and components with uncompromising accuracy.</p>
          </motion.div>

          <div className="grid gap-12">
            {servicesList.length > 0 ? (
              servicesList.map((service: any, index: number) => (
                <motion.div
                  key={service.id}
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  className="grid md:grid-cols-2 gap-8 items-center bg-card border border-border p-8 rounded-sm"
                >
                  <motion.div
                    variants={index % 2 === 0 ? slideFromLeft : slideFromRight}
                    className={index % 2 === 0 ? "order-2 md:order-1" : ""}
                  >
                    <div className="text-primary font-bold text-sm tracking-widest uppercase mb-2">
                      SERVICE {String(index + 1).padStart(2, "0")}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">{service.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.longDescription || service.shortDescription}
                    </p>
                    {service.shortDescription && (
                      <div className="grid gap-3 text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary"></div>
                          <span>{service.shortDescription}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                  <motion.div
                    variants={index % 2 === 0 ? slideFromRight : slideFromLeft}
                    className={`${index % 2 === 0 ? "order-1 md:order-2" : ""} h-64 md:h-80 relative bg-muted rounded-sm overflow-hidden border border-border`}
                  >
                    {service.imageUrl ? (
                      <img src={service.imageUrl} alt={service.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-medium">
                        {service.title}
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              ))
            ) : (
              /* Fallback hardcoded services when no CMS data yet */
              <>
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="grid md:grid-cols-2 gap-8 items-center bg-card border border-border p-8 rounded-sm">
                  <motion.div variants={slideFromLeft} className="order-2 md:order-1">
                    <div className="text-primary font-bold text-sm tracking-widest uppercase mb-2">SERVICE 01</div>
                    <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">PLASTIC INJECTION MOULDS</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">High-precision moulds engineered for mass production of plastic components with exceptional surface finish and dimensional accuracy.</p>
                    <div className="grid gap-3 text-sm font-medium">
                      <div className="flex items-center gap-3"><div className="w-2 h-2 bg-primary"></div><span>Precision tolerance: ±0.01mm</span></div>
                      <div className="flex items-center gap-3"><div className="w-2 h-2 bg-primary"></div><span>Advanced cooling systems for cycle time optimization</span></div>
                      <div className="flex items-center gap-3"><div className="w-2 h-2 bg-primary"></div><span>Multi-cavity designs for high-volume production</span></div>
                    </div>
                  </motion.div>
                  <motion.div variants={slideFromRight} className="order-1 md:order-2 h-64 md:h-80 relative bg-muted rounded-sm overflow-hidden border border-border">
                    <img src="/images/plastic.png" alt="Plastic Injection Moulding" className="w-full h-full object-cover" />
                  </motion.div>
                </motion.div>
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="grid md:grid-cols-2 gap-8 items-center bg-card border border-border p-8 rounded-sm">
                  <motion.div variants={slideFromLeft} className="h-64 md:h-80 relative bg-muted rounded-sm overflow-hidden border border-border">
                    <img src="/images/rubber.png" alt="Rubber Moulding Equipment" className="w-full h-full object-cover" />
                  </motion.div>
                  <motion.div variants={slideFromRight}>
                    <div className="text-primary font-bold text-sm tracking-widest uppercase mb-2">SERVICE 02</div>
                    <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">RUBBER MOULDS</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">Specialized rubber mould manufacturing for seals, gaskets, and elastomer components for demanding sealing applications.</p>
                    <div className="grid gap-3 text-sm font-medium">
                      <div className="flex items-center gap-3"><div className="w-2 h-2 bg-primary"></div><span>Precision hydraulic system for consistent compression</span></div>
                      <div className="flex items-center gap-3"><div className="w-2 h-2 bg-primary"></div><span>Advanced heating systems for optimal curing</span></div>
                      <div className="flex items-center gap-3"><div className="w-2 h-2 bg-primary"></div><span>Heavy-duty construction for long-term reliability</span></div>
                    </div>
                  </motion.div>
                </motion.div>
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="grid md:grid-cols-2 gap-8 items-center bg-card border border-border p-8 rounded-sm">
                  <motion.div variants={slideFromLeft} className="order-2 md:order-1">
                    <div className="text-primary font-bold text-sm tracking-widest uppercase mb-2">SERVICE 03</div>
                    <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">JIGS & FIXTURES</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">Precision-engineered jigs and fixtures for assembly, testing, and inspection with accuracy and repeatability.</p>
                    <div className="grid gap-3 text-sm font-medium">
                      <div className="flex items-center gap-3"><div className="w-2 h-2 bg-primary"></div><span>Modular design for quick-change capability</span></div>
                      <div className="flex items-center gap-3"><div className="w-2 h-2 bg-primary"></div><span>High-precision locating repeatability ±0.005mm</span></div>
                      <div className="flex items-center gap-3"><div className="w-2 h-2 bg-primary"></div><span>Quick-change systems for flexibility</span></div>
                    </div>
                  </motion.div>
                  <motion.div variants={slideFromRight} className="order-1 md:order-2 h-64 md:h-80 relative bg-muted rounded-sm overflow-hidden border border-border">
                    <img src="/images/jigs.png" alt="Precision Fixturing" className="w-full h-full object-cover" />
                  </motion.div>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Capabilities & Machinery Section */}
        <div id="capabilities" className="bg-card border-y border-border py-24">
          <div className="container space-y-12">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={0}
              className="max-w-2xl"
            >
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 border-b-4 border-primary inline-block pb-2">TECHNICAL SPECIFICATIONS</h2>
              <p className="text-muted-foreground text-lg">Our shop floor is equipped with state-of-the-art machinery capable of meeting rigorous industrial standards.</p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={0.1}
              className="bg-background border border-border rounded-sm overflow-x-auto shadow-sm"
            >
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary text-secondary-foreground font-bold uppercase text-xs tracking-wider">
                  <tr>
                    <th className="py-4 px-6 border-b border-border">Machine Type</th>
                    <th className="py-4 px-6 border-b border-border">Specifications & Function</th>
                    <th className="py-4 px-6 border-b border-border">Capacity / Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6 font-semibold whitespace-nowrap">VMC (Vertical Machining Center)</td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-foreground">CNC Multi-Axis Milling</div>
                      <div className="text-muted-foreground">High-speed milling head for complex geometries</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-mono bg-muted inline-block px-2 py-1 rounded-sm border border-border mb-1">500mm travel</div>
                      <div className="text-muted-foreground">±0.005mm repeatability</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6 font-semibold whitespace-nowrap">EDM (Electrical Discharge Machining)</td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-foreground">Wire & Sinker EDM</div>
                      <div className="text-muted-foreground">Hardened steel processing, sharp internal corners</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-mono bg-muted inline-block px-2 py-1 rounded-sm border border-border mb-1">Sub-micron finish</div>
                      <div className="text-muted-foreground">High accuracy erosion</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6 font-semibold whitespace-nowrap">Injection Molding Machines</td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-foreground">Hydraulic & All-Electric presses</div>
                      <div className="text-muted-foreground">Automated part removal and inspection</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-mono bg-muted inline-block px-2 py-1 rounded-sm border border-border mb-1">50 - 300 Ton capacity</div>
                      <div className="text-muted-foreground">High-volume runs</div>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-6 font-semibold whitespace-nowrap">Tool Room Grinding</td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-foreground">Surface & Cylindrical Grinders</div>
                      <div className="text-muted-foreground">Precision final dimensioning</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-mono bg-muted inline-block px-2 py-1 rounded-sm border border-border mb-1">ISO 9001 Certified</div>
                      <div className="text-muted-foreground">Micro-inch tolerances</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </motion.div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="container py-24">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <motion.div
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-8 border-b-4 border-primary inline-block pb-2">
                {about?.title || "COMPANY PROFILE"}
              </h2>
              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-2">{about?.subtitle || "Over 25 Years of Engineering Excellence"}</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {about?.description || "Founded in 1971, OM TECH TOOLS has built a legacy of uncompromising quality in precision manufacturing. Our facility integrates decades of machining expertise with modern automated systems."}
                  </p>
                </div>
                {about?.mission && (
                  <div className="border-l-4 border-primary pl-4 bg-muted/30 py-2">
                    <h4 className="font-bold text-foreground uppercase text-sm tracking-wider mb-1">Mission</h4>
                    <p className="text-muted-foreground text-sm">{about.mission}</p>
                  </div>
                )}
                {about?.vision && (
                  <div className="border-l-4 border-primary pl-4 bg-muted/30 py-2">
                    <h4 className="font-bold text-foreground uppercase text-sm tracking-wider mb-1">Vision</h4>
                    <p className="text-muted-foreground text-sm">{about.vision}</p>
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div
              variants={slideFromRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="bg-secondary p-8 border border-border rounded-sm"
            >
              <h3 className="text-xl font-bold uppercase tracking-tight mb-6">CERTIFICATIONS & STANDARDS</h3>
              <div className="grid gap-4">
                <div className="flex items-center gap-4 bg-background border border-border p-4 rounded-sm">
                  <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center font-bold font-mono">ISO</div>
                  <div>
                    <div className="font-bold">ISO 9001:2015</div>
                    <div className="text-xs text-muted-foreground">Quality Management System</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-background border border-border p-4 rounded-sm">
                  <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center font-bold font-mono">QA</div>
                  <div>
                    <div className="font-bold">Rigorous Inspection</div>
                    <div className="text-xs text-muted-foreground">CMM-verified tolerances</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Team Members Section */}
        <div id="team" className="container py-24">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={0}
            className="max-w-2xl mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 border-b-4 border-primary inline-block pb-2">OUR TEAM</h2>
            <p className="text-muted-foreground text-lg">The experienced engineers and specialists driving precision excellence.</p>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {teamList.length > 0 ? (
              teamList.map((member: any) => (
                <motion.div
                  key={member.id}
                  variants={staggerItem}
                  className="bg-card border border-border rounded-sm p-6 flex flex-col items-center text-center group hover:border-primary transition-colors duration-300"
                >
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name} className="w-20 h-20 rounded-full object-cover border-2 border-border group-hover:border-primary transition-colors duration-300 mb-4" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-border group-hover:border-primary transition-colors duration-300 mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{member.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                  )}
                  <h3 className="font-bold text-foreground text-base">{member.name}</h3>
                  <p className="text-primary text-xs font-semibold uppercase tracking-wider mt-1 mb-3">{member.role}</p>
                  {member.bio && <p className="text-muted-foreground text-xs leading-relaxed">{member.bio}</p>}
                  {(member.linkedin || member.twitter || member.github) && (
                    <div className="flex gap-3 mt-4">
                      {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-xs font-medium">LinkedIn</a>}
                      {member.twitter && <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-xs font-medium">Twitter</a>}
                      {member.github && <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-xs font-medium">GitHub</a>}
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              /* Fallback hardcoded team when no CMS data */
              <>
                {[
                  { name: "Rajesh Sharma", role: "Founder & Managing Director", bio: "25+ years of pioneering experience in tool room operations and precision mould engineering.", initial: "R" },
                  { name: "Amit Kumar", role: "Head of Design & CAD/CAM", bio: "Specialist in multi-cavity mould design, flow simulation, and CNC tool path optimization.", initial: "A" },
                  { name: "Priya Singh", role: "Quality Assurance Lead", bio: "CMM metrology expert ensuring every component meets ISO 9001 and customer-specific quality standards.", initial: "P" },
                ].map((member) => (
                  <motion.div
                    key={member.name}
                    variants={staggerItem}
                    className="bg-card border border-border rounded-sm p-6 flex flex-col items-center text-center group hover:border-primary transition-colors duration-300"
                  >
                    <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-border group-hover:border-primary transition-colors duration-300 mb-4 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{member.initial}</span>
                    </div>
                    <h3 className="font-bold text-foreground text-base">{member.name}</h3>
                    <p className="text-primary text-xs font-semibold uppercase tracking-wider mt-1 mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">{member.bio}</p>
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        </div>

        {/* Gallery Section */}
        {galleryList.length > 0 && (
          <div className="bg-muted border-y border-border py-24">
            <div className="container">
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                custom={0}
                className="text-3xl font-black uppercase tracking-tight mb-8 border-b-4 border-primary inline-block pb-2"
              >FACILITY GALLERY</motion.h2>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                {galleryList.map((img: any, idx: number) => (
                  <motion.div key={img.id} variants={scaleIn} className="relative aspect-square bg-background border border-border group overflow-hidden">
                    <img
                      src={img.imageUrl}
                      alt={img.caption || "Factory Floor"}
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                    />
                    {img.caption && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/80 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-xs text-white font-medium text-center">{img.caption}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        )}

        {/* Blog Carousel Section */}
        {blogPosts.length > 0 && (
          <div id="blog" className="container py-24">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={0}
              className="flex justify-between items-end mb-8 border-b border-border pb-4"
            >
              <h2 className="text-3xl font-black uppercase tracking-tight border-b-4 border-primary inline-block pb-2 -mb-[18px]">LATEST UPDATES</h2>
              <a href="#" className="text-sm font-bold text-primary hover:underline">VIEW ALL</a>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={0.15}
              className="bg-card border border-border p-8 rounded-sm shadow-sm"
            >
              <BlogCarousel posts={blogPosts} onSelectPost={(post) => setSelectedBlogPost(post)} />
            </motion.div>
          </div>
        )}

        {/* Contact Section */}
        <div id="contact" className="bg-secondary border-t border-border">
          <div className="container py-24">
            <div className="grid md:grid-cols-2 gap-16">
              <motion.div
                variants={slideFromLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
              >
                <h2 className="text-3xl font-black uppercase tracking-tight mb-4 border-b-4 border-primary inline-block pb-2">CONTACT DIRECTORY</h2>
                <p className="text-muted-foreground mb-8">Reach out to our engineering team for consultations, quotes, and technical inquiries.</p>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 rounded-sm">
                      <span className="font-bold text-sm">📍</span>
                    </div>
                    <div>
                      <div className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-1">Facility Address</div>
                      <div className="font-semibold">{settings?.address || "Plot No. 393 & 394, Udyog Kendra 2, Ecotech 3, Greater Noida, 201306"}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 rounded-sm">
                      <span className="font-bold text-sm">📞</span>
                    </div>
                    <div>
                      <div className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-1">Direct Line</div>
                      <div className="font-semibold">{settings?.phone1 || "+91 9289304917"}</div>
                      {settings?.phone2 && <div className="text-muted-foreground">{settings.phone2}</div>}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 rounded-sm">
                      <span className="font-bold text-sm">✉️</span>
                    </div>
                    <div>
                      <div className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-1">Email Inquiry</div>
                      <div className="font-semibold">{settings?.email1 || "om.techtools1971@gmail.com"}</div>
                      {settings?.email2 && <div className="font-semibold">{settings.email2}</div>}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={slideFromRight}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="bg-background border border-border p-8 rounded-sm shadow-sm"
              >
                <h3 className="text-xl font-bold uppercase tracking-tight mb-6">REQUEST A QUOTE</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Name / Company"
                      value={contactForm.name}
                      onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                      className="bg-muted border-border rounded-sm focus-visible:ring-primary"
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={contactForm.email}
                      onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                      className="bg-muted border-border rounded-sm focus-visible:ring-primary"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Phone (Optional)"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))}
                      className="bg-muted border-border rounded-sm focus-visible:ring-primary"
                    />
                    <Input
                      placeholder="Subject / Part Type"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm((p) => ({ ...p, subject: e.target.value }))}
                      className="bg-muted border-border rounded-sm focus-visible:ring-primary"
                      required
                    />
                  </div>
                  <Textarea
                    placeholder="Project Details & Specifications..."
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                    className="bg-muted border-border rounded-sm focus-visible:ring-primary resize-none"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm font-bold tracking-widest uppercase"
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        SUBMITTING...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        SEND INQUIRY
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container flex flex-col items-center gap-4 text-center">
          <img
            src="/images/logo-tagline.png"
            alt="OM Techno Tools"
            className="h-16 w-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
          <p className="text-xs text-muted-foreground font-medium">{settings?.copyrightText || "© 2026 OM TECHNO TOOLS. All rights reserved."}</p>
        </div>
      </footer>

      {/* Blog Modal */}
      {selectedBlogPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-background rounded-sm max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl">
            <div className="p-8 md:p-12">
              <button
                onClick={() => setSelectedBlogPost(null)}
                className="float-right text-3xl leading-none text-muted-foreground hover:text-foreground transition"
              >
                &times;
              </button>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tight">{selectedBlogPost.title}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-4 border-b border-border">
                <span className="font-bold text-foreground">AUTHOR: {selectedBlogPost.author || 'OMTT ENGINEERING'}</span>
                <span>•</span>
                <span>{selectedBlogPost.createdAt ? new Date(selectedBlogPost.createdAt).toLocaleDateString() : 'RECENT'}</span>
              </div>
              {(selectedBlogPost.image || selectedBlogPost.coverImage) && (
                <img src={selectedBlogPost.coverImage || selectedBlogPost.image || ''} alt={selectedBlogPost.title} className="w-full bg-muted border border-border mb-8 max-h-[400px] object-cover" />
              )}
              <div className="prose dark:prose-invert max-w-none text-foreground leading-relaxed">
                {selectedBlogPost.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
