import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";

const HARDCODED_TEAM = [
  { name: "Rajesh Sharma", role: "Founder & Managing Director", bio: "25+ years of pioneering experience in tool room operations and precision mould engineering.", initial: "R" },
  { name: "Amit Kumar", role: "Head of Design & CAD/CAM", bio: "Specialist in multi-cavity mould design, flow simulation, and CNC tool path optimization.", initial: "A" },
  { name: "Priya Singh", role: "Quality Assurance Lead", bio: "CMM metrology expert ensuring every component meets ISO 9001 and customer-specific quality standards.", initial: "P" },
];

export default function TeamPage() {
  const [, navigate] = useLocation();
  const { data: siteContent } = trpc.site.getContent.useQuery();
  const teamList: any[] = siteContent?.team ?? [];
  const allMembers: any[] = teamList.length > 0 ? teamList : HARDCODED_TEAM;

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
          <span className="text-sm font-semibold uppercase tracking-widest text-foreground">Our Team</span>
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
              OUR TEAM
            </h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-xl">
              The experienced engineers and specialists driving precision excellence at OM TECHNO TOOLS.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="container py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allMembers.map((member: any, idx: number) => (
            <motion.div
              key={member.id ?? member.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.07, ease: "easeOut" }}
              className="bg-card border border-border rounded-sm p-6 flex flex-col items-center text-center group hover:border-primary transition-colors duration-300"
            >
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-border group-hover:border-primary transition-colors duration-300 mb-4"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-border group-hover:border-primary transition-colors duration-300 mb-4 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {(member.name?.charAt(0) ?? member.initial ?? "?").toUpperCase()}
                  </span>
                </div>
              )}
              <h2 className="font-bold text-foreground text-base mt-1">{member.name}</h2>
              <p className="text-primary text-xs font-semibold uppercase tracking-wider mt-1 mb-3">{member.role}</p>
              {member.bio && (
                <p className="text-muted-foreground text-xs leading-relaxed">{member.bio}</p>
              )}
              {(member.linkedin || member.twitter || member.github) && (
                <div className="flex gap-3 mt-4">
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-xs font-medium">
                      LinkedIn
                    </a>
                  )}
                  {member.twitter && (
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-xs font-medium">
                      Twitter
                    </a>
                  )}
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors text-xs font-medium">
                      GitHub
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
