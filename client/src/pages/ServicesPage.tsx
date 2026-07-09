import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

// Animation Variants
const slideFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const HARDCODED_SERVICES = [
  {
    id: 1,
    title: "PLASTIC INJECTION MOULDS",
    shortDescription: "Precision tolerance: ±0.01mm, Advanced cooling systems for cycle time optimization, Multi-cavity designs for high-volume production",
    longDescription: "High-precision moulds engineered for mass production of plastic components with exceptional surface finish and dimensional accuracy.",
    imageUrl: "/images/plastic.png",
  },
  {
    id: 2,
    title: "RUBBER MOULDS",
    shortDescription: "Precision hydraulic system for consistent compression, Advanced heating systems for optimal curing, Heavy-duty construction for long-term reliability",
    longDescription: "Specialized rubber mould manufacturing for seals, gaskets, and elastomer components for demanding sealing applications.",
    imageUrl: "/images/rubber.png",
  },
  {
    id: 3,
    title: "JIGS & FIXTURES",
    shortDescription: "Modular design for quick-change capability, High-precision locating repeatability ±0.005mm, Quick-change systems for flexibility",
    longDescription: "Precision-engineered jigs and fixtures for assembly, testing, and inspection with accuracy and repeatability.",
    imageUrl: "/images/jigs.png",
  }
];

export default function ServicesPage() {
  const [, navigate] = useLocation();
  const { data: siteContent } = trpc.site.getContent.useQuery();
  const servicesList: any[] = siteContent?.services ?? [];
  const allServices: any[] = servicesList.length > 0 ? servicesList : HARDCODED_SERVICES;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container flex items-center gap-4 h-16">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="h-5 w-px bg-border" />
          <span className="text-sm font-semibold uppercase tracking-widest text-foreground">Our Services</span>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-border bg-card py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 border-b-4 border-primary inline-block pb-2">
              CORE CAPABILITIES
            </h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-xl">
              Delivering industrial-grade tooling and components with uncompromising accuracy across all our specialized services.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services List */}
      <div className="container py-24">
        <div className="grid gap-12">
          {allServices.map((service: any, index: number) => (
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
                    {service.shortDescription.split(', ').map((desc: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary"></div>
                        <span>{desc}</span>
                      </div>
                    ))}
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
          ))}
        </div>
      </div>
    </div>
  );
}
