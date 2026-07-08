import { Card } from '@/components/ui/card';
import { Users, Target, Award, Lightbulb } from 'lucide-react';

export function AboutSection() {
  const values = [
    {
      icon: Target,
      title: 'Precision',
      description: 'Accuracy in every detail of our manufacturing process',
    },
    {
      icon: Award,
      title: 'Quality',
      description: 'Highest standards maintained across all operations',
    },
    {
      icon: Users,
      title: 'Commitment',
      description: 'Customer-first approach in every project',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Continuous improvement and technological advancement',
    },
  ];

  const teamStrengths = [
    {
      title: 'Design & Engineering Team',
      description: 'Expert in advanced CAD/CAM, mould design, and simulation',
      experience: '15+ years combined',
    },
    {
      title: 'Quality Control Team',
      description: 'Committed to accuracy with advanced inspection tools',
      experience: '12+ years combined',
    },
    {
      title: 'Manufacturing Team',
      description: 'Skilled in precision machining, tool making, and VMC operations',
      experience: '18+ years combined',
    },
    {
      title: 'Production Team',
      description: 'Efficient plastic injection moulding mass production',
      experience: '10+ years combined',
    },
  ];

  return (
    <section className="section-container">
      <div className="max-w-6xl mx-auto w-full">
        {/* Vision Statement */}
        <div className="text-center mb-20 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">About OM TECHNO TOOLS</h2>
          <Card className="bg-card border border-border rounded-sm shadow-sm p-12 max-w-3xl mx-auto">
            <p className="text-lg text-foreground/80 leading-relaxed mb-6">
              To be a trusted leader in precision moulds and engineering solutions, delivering excellence through innovation, quality, and customer commitment.
            </p>
            <p className="text-base text-muted-foreground">
              Since 2011, OMTT has been at the forefront of precision engineering, serving industry leaders with cutting-edge manufacturing solutions. Our commitment to excellence and innovation has made us a trusted partner for businesses worldwide.
            </p>
          </Card>
        </div>

        {/* Core Values */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12">Our Core Values</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <Card key={idx} className="bg-card border border-border rounded-sm shadow-sm p-6 hover:shadow-lg transition-all duration-300">
                  <Icon className="w-8 h-8 text-accent mb-4" />
                  <h4 className="text-lg font-semibold mb-2">{value.title}</h4>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Team Strength */}
        <div>
          <h3 className="text-3xl font-bold text-center mb-12">Our Team Strength</h3>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Combined 25+ years of experience from skilled engineering professionals
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {teamStrengths.map((team, idx) => (
              <Card key={idx} className="bg-card border border-border rounded-sm shadow-sm p-8 hover:shadow-lg transition-all duration-300">
                <h4 className="text-xl font-bold mb-3">{team.title}</h4>
                <p className="text-muted-foreground mb-4">{team.description}</p>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-accent">{team.experience}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
