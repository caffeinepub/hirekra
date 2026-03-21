import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  Briefcase,
  Building2,
  CheckCircle,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  Settings,
  Shield,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// --- Scroll animation hook ---
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// --- Navbar ---
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Presence", href: "#presence" },
    { label: "Expertise", href: "#expertise" },
    { label: "Leadership", href: "#leadership" },
    { label: "Contact", href: "#contact" },
  ];

  const scrollTo = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-nav" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            data-ocid="nav.link"
            onClick={() => scrollTo("#home")}
            className="flex items-center gap-2 font-bold text-xl"
          >
            <img
              src="/assets/uploads/IMG_0928-1.jpeg"
              alt="HireKra Logo"
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-navy">
              Hire<span className="text-brand-blue">Kra</span>
            </span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <button
                type="button"
                key={l.href}
                data-ocid="nav.link"
                onClick={() => scrollTo(l.href)}
                className="text-sm font-medium text-foreground hover:text-brand-blue transition-colors"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Button
              data-ocid="nav.primary_button"
              onClick={() => scrollTo("#contact")}
              className="bg-navy hover:bg-navy-light text-white rounded-full px-5 text-sm font-semibold"
            >
              Partner With Us
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            data-ocid="nav.toggle"
            className="md:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-border shadow-nav">
          <div className="px-4 py-4 flex flex-col gap-2">
            {links.map((l) => (
              <button
                type="button"
                key={l.href}
                data-ocid="nav.link"
                onClick={() => scrollTo(l.href)}
                className="text-sm font-medium text-foreground hover:text-brand-blue py-2 text-left transition-colors"
              >
                {l.label}
              </button>
            ))}
            <Button
              data-ocid="nav.primary_button"
              onClick={() => scrollTo("#contact")}
              className="bg-navy hover:bg-navy-light text-white rounded-full mt-2"
            >
              Partner With Us
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

// --- Hero ---
function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0A2E45 0%, #0B3D5C 40%, #1E4D7A 70%, #1E6FA8 100%)",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Decorative blobs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full opacity-10 bg-brand-blue blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full opacity-10 bg-white blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pt-20">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
          Building Teams That
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(90deg, #60C3F5, #A8D8FF)",
            }}
          >
            Drive Growth
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-medium">
          Your trusted recruitment partner across India &amp; the Middle East —
          connecting top talent with ambitious organizations.
        </p>

        {/* Highlight badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { icon: <Zap size={14} />, label: "Fast Hiring Turnaround" },
            { icon: <Users size={14} />, label: "Strong Talent Network" },
            { icon: <Globe size={14} />, label: "Pan-India & Middle East" },
          ].map((b) => (
            <span
              key={b.label}
              className="flex items-center gap-2 bg-white/15 border border-white/25 text-white text-sm font-medium rounded-full px-4 py-2"
            >
              {b.icon}
              {b.label}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            data-ocid="hero.primary_button"
            onClick={() =>
              document
                .querySelector("#contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-white text-navy hover:bg-white/90 rounded-full px-8 py-6 text-base font-bold shadow-lg"
          >
            Partner With Us
          </Button>
          <Button
            data-ocid="hero.secondary_button"
            variant="outline"
            onClick={() =>
              document
                .querySelector("#contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-transparent border-2 border-white text-white hover:bg-white/15 rounded-full px-8 py-6 text-base font-semibold"
          >
            Get in Touch
          </Button>
        </div>

        {/* Scroll hint */}
        <div className="mt-16 flex flex-col items-center gap-2 text-white/40 text-xs">
          <div className="w-px h-10 bg-white/20" />
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}

// --- About ---
function About() {
  const ref = useFadeIn();
  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="section-fade-in">
          <SectionHeader
            badge="Who We Are"
            title="About HireKra"
            subtitle="A fast-growing recruitment partner redefining talent acquisition across India and the Middle East."
          />

          <div className="max-w-3xl mx-auto text-center mb-14">
            <p className="text-muted-foreground leading-relaxed text-base">
              HireKra was founded with a singular mission — to bridge the gap
              between exceptional talent and forward-looking organizations. We
              bring speed, precision, and deep industry knowledge to every
              hiring engagement, enabling businesses to scale with confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
                  <Target size={22} className="text-navy" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    Our Mission
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    To deliver quality talent with speed and precision —
                    enabling businesses to build high-performing teams that
                    drive sustainable growth.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 shadow-card">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0">
                  <Star size={22} className="text-brand-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-2">
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    To become a trusted global hiring partner — renowned for
                    integrity, innovation, and the ability to match the right
                    talent with the right opportunity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {[
              { value: "2", label: "Regions Covered" },
              { value: "5+", label: "Industries" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-navy text-white rounded-2xl p-6 text-center"
              >
                <div className="text-3xl font-extrabold mb-1">{s.value}</div>
                <div className="text-white/70 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Presence ---
function Presence() {
  const ref = useFadeIn();
  return (
    <section id="presence" className="py-20 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="section-fade-in">
          <SectionHeader
            badge="Our Reach"
            title="Our Presence"
            subtitle="Extensive hiring capabilities spanning two of the world's fastest-growing talent markets."
          />

          <div className="grid md:grid-cols-2 gap-6">
            {/* India card */}
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div
                className="h-2"
                style={{
                  background:
                    "linear-gradient(90deg, #FF9933, #FFFFFF, #138808)",
                }}
              />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="text-4xl">🇮🇳</div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">India</h3>
                    <p className="text-muted-foreground text-sm">
                      Pan-India Hiring Capabilities
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  Headquartered in Mumbai (Innov8 Parinee Crescenzo, Bandra
                  East) with deep-rooted networks across all major metros and
                  tier-2 cities. We source talent from every corner of the
                  country.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Mumbai",
                    "Delhi NCR",
                    "Bangalore",
                    "Hyderabad",
                    "Chennai",
                    "Pune",
                    "Kolkata",
                    "Ahmedabad",
                  ].map((city) => (
                    <span
                      key={city}
                      className="flex items-center gap-1 bg-muted text-foreground text-xs font-medium rounded-full px-3 py-1"
                    >
                      <MapPin size={10} />
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle East card */}
            <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
              <div
                className="h-2"
                style={{
                  background:
                    "linear-gradient(90deg, #009736, #FFFFFF, #CE1126)",
                }}
              />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="text-4xl">🌍</div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      Middle East
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      UAE, KSA, Qatar & Beyond
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  Expanding presence in the Middle East, connecting Indian
                  talent with opportunities in the region's fastest-growing
                  economies.
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Dubai",
                    "Abu Dhabi",
                    "Riyadh",
                    "Jeddah",
                    "Doha",
                    "Manama",
                    "Kuwait City",
                    "Muscat",
                  ].map((city) => (
                    <span
                      key={city}
                      className="flex items-center gap-1 bg-muted text-foreground text-xs font-medium rounded-full px-3 py-1"
                    >
                      <MapPin size={10} />
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Expertise ---
function Expertise() {
  const ref = useFadeIn();

  const services = [
    {
      icon: <Users size={24} />,
      title: "Non-IT & Bulk Hiring",
      desc: "High-volume recruitment solutions for operations, sales, logistics, and manufacturing roles at scale.",
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Startup Hiring",
      desc: "Specialized talent acquisition for high-growth startups — from early hires to scaling product and engineering teams.",
    },
    {
      icon: <Award size={24} />,
      title: "Leadership Hiring",
      desc: "Executive search and C-suite placement with rigorous assessment for VP, Director, and CXO roles.",
    },
    {
      icon: <Settings size={24} />,
      title: "Contract Staffing",
      desc: "Flexible workforce solutions — short-term project hiring, contract-to-hire, and staff augmentation.",
    },
  ];

  const industries = [
    { icon: <Building2 size={16} />, label: "Technology" },
    { icon: <Building2 size={16} />, label: "BFSI" },
    { icon: <Shield size={16} />, label: "Healthcare" },
    { icon: <Briefcase size={16} />, label: "E-commerce" },
    { icon: <TrendingUp size={16} />, label: "Startups" },
  ];

  return (
    <section id="expertise" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="section-fade-in">
          <SectionHeader
            badge="What We Do"
            title="Our Expertise"
            subtitle="Comprehensive recruitment solutions tailored to your industry, scale, and hiring objectives."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5 mb-12">
            {services.map((s) => (
              <div
                key={s.title}
                className="group bg-card border border-border rounded-2xl p-7 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-navy/10 group-hover:bg-navy group-hover:text-white flex items-center justify-center text-navy mb-5 transition-all duration-300">
                  {s.icon}
                </div>
                <h3 className="font-bold text-base text-foreground mb-2">
                  {s.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Industries */}
          <div className="bg-navy rounded-2xl p-8">
            <p className="text-white/70 text-sm font-medium text-center mb-5 uppercase tracking-wider">
              Industries We Serve
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {industries.map((ind) => (
                <span
                  key={ind.label}
                  className="flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold rounded-full px-5 py-2"
                >
                  {ind.icon}
                  {ind.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Leadership ---
function Leadership() {
  const ref = useFadeIn();

  const leaders = [
    {
      name: "Kratika",
      role: "Founder & CEO",
      img: "/assets/uploads/IMG_0932-1.jpeg",
      linkedin: "https://www.linkedin.com/in/kratikahaldwani",
      bio: "Visionary behind HireKra with deep expertise in talent acquisition and business growth. Kratika founded HireKra with a mission to transform how companies build their teams — combining intuition, data, and a human-first approach to recruitment.",
    },
    {
      name: "Vansh Gupta",
      role: "Co-Founder & Head of Operations",
      img: "/assets/uploads/IMG_0023-2.jpeg",
      linkedin: "https://www.linkedin.com/in/vansh-gupta-647686166",
      bio: "Driving operations, client partnerships, and scaling. Vansh is focused on building strong hiring pipelines and execution excellence — ensuring every client engagement delivers measurable outcomes and long-term hiring success.",
    },
  ];

  return (
    <section id="leadership" className="py-20 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="section-fade-in">
          <SectionHeader
            badge="Our Team"
            title="Leadership"
            subtitle="The passionate minds driving HireKra's mission to transform talent acquisition."
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {leaders.map((l, i) => (
              <div
                data-ocid={`leadership.card.${i + 1}`}
                key={l.name}
                className="bg-card border border-border rounded-2xl shadow-card overflow-hidden"
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={l.img}
                    alt={`${l.name} - ${l.role}`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">
                        {l.name}
                      </h3>
                      <span className="text-brand-blue text-sm font-semibold">
                        {l.role}
                      </span>
                    </div>
                    <a
                      href={l.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${l.name} on LinkedIn`}
                      className="w-10 h-10 rounded-xl bg-[#0077B5]/10 hover:bg-[#0077B5] flex items-center justify-center text-[#0077B5] hover:text-white transition-all duration-200"
                    >
                      <Linkedin size={18} />
                    </a>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {l.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Why Choose ---
function WhyChoose() {
  const ref = useFadeIn();

  const reasons = [
    {
      icon: <Zap size={22} />,
      title: "Quick Turnaround Time",
      desc: "We understand that time-to-hire is critical. Our streamlined process ensures fast, efficient placements without compromising quality.",
    },
    {
      icon: <CheckCircle size={22} />,
      title: "Quality Candidate Screening",
      desc: "Multi-stage screening and assessment for every candidate. Only the most qualified profiles reach your desk.",
    },
    {
      icon: <MessageSquare size={22} />,
      title: "Transparent Communication",
      desc: "Regular updates, honest feedback, and open dialogue throughout the entire hiring lifecycle.",
    },
    {
      icon: <TrendingUp size={22} />,
      title: "Cost-Effective Solutions",
      desc: "Competitive pricing models designed to deliver maximum ROI — whether you're a startup or an enterprise.",
    },
    {
      icon: <Settings size={22} />,
      title: "Customized Hiring Strategies",
      desc: "No one-size-fits-all. We tailor our approach to your unique culture, requirements, and hiring goals.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="section-fade-in">
          <SectionHeader
            badge="Why HireKra"
            title="Why Choose HireKra?"
            subtitle="We go beyond filling positions — we build partnerships that fuel long-term organizational success."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reasons.map((r, i) => (
              <div
                key={r.title}
                className={`flex gap-4 bg-card border border-border rounded-2xl p-7 shadow-card ${
                  i === 4 ? "sm:col-span-2 lg:col-span-1 lg:col-start-2" : ""
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 mt-0.5">
                  {r.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground mb-1.5">
                    {r.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {r.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Contact ---
function Contact() {
  const ref = useFadeIn();
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    hiringNeeds: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    toast.success("Message sent! We'll be in touch within 24 hours.");
    setForm({ name: "", email: "", company: "", hiringNeeds: "" });
  };

  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div ref={ref} className="section-fade-in">
          <SectionHeader
            badge="Get in Touch"
            title="Contact Us"
            subtitle="Ready to build your dream team? Let's start a conversation."
          />

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Form */}
            <div className="bg-card border border-border rounded-2xl shadow-card p-8">
              <h3 className="font-bold text-lg text-foreground mb-6">
                Send Us a Message
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-foreground mb-1.5 block"
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    data-ocid="contact.input"
                    placeholder="Your full name"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="rounded-xl border-border focus:ring-brand-blue"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-foreground mb-1.5 block"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    data-ocid="contact.input"
                    type="email"
                    placeholder="you@company.com"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className="rounded-xl border-border"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="company"
                    className="text-sm font-semibold text-foreground mb-1.5 block"
                  >
                    Company
                  </Label>
                  <Input
                    id="company"
                    data-ocid="contact.input"
                    placeholder="Your company name"
                    value={form.company}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, company: e.target.value }))
                    }
                    className="rounded-xl border-border"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="hiringNeeds"
                    className="text-sm font-semibold text-foreground mb-1.5 block"
                  >
                    Hiring Needs *
                  </Label>
                  <Textarea
                    id="hiringNeeds"
                    data-ocid="contact.textarea"
                    placeholder="Tell us about your hiring requirements, roles, and timeline..."
                    required
                    rows={4}
                    value={form.hiringNeeds}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, hiringNeeds: e.target.value }))
                    }
                    className="rounded-xl border-border resize-none"
                  />
                </div>
                <Button
                  data-ocid="contact.submit_button"
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-navy hover:bg-navy-light text-white rounded-full py-6 text-base font-bold"
                >
                  {submitting ? "Sending..." : "Let's Build Your Team"}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-6">
              <div className="bg-navy rounded-2xl p-8 text-white">
                <h3 className="font-bold text-lg mb-6">Reach Us Directly</h3>
                <div className="space-y-5">
                  <a
                    href="mailto:info@hirekra.com"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Email</p>
                      <p className="font-semibold">info@hirekra.com</p>
                    </div>
                  </a>
                  <a
                    href="tel:+918587079103"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Phone</p>
                      <p className="font-semibold">+91 85870 79103</p>
                    </div>
                  </a>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs">Headquarters</p>
                      <p className="font-semibold text-sm leading-snug">
                        Innov8 Parinee Crescenzo, 17th FL
                        <br />
                        Bandra East, Mumbai 400051
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <a
                data-ocid="contact.link"
                href="https://www.linkedin.com/company/hirekra"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#0077B5] hover:bg-[#005e8f] text-white rounded-2xl p-6 font-bold text-base transition-colors"
              >
                <Linkedin size={22} />
                Connect on LinkedIn
              </a>

              <div className="bg-card border border-border rounded-2xl p-7 shadow-card">
                <h4 className="font-bold text-sm text-foreground mb-3">
                  Response Time
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  We typically respond within{" "}
                  <strong className="text-navy">24 hours</strong>. For urgent
                  hiring needs, please mention it in your message and we'll
                  prioritize your request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Footer ---
function Footer() {
  const year = new Date().getFullYear();
  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer
      className="bg-navy-dark text-white pt-16 pb-8"
      style={{ backgroundColor: "#0A2E45" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/assets/uploads/IMG_0928-1.jpeg"
                alt="HireKra Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-xl font-bold">
                Hire<span className="text-brand-blue">Kra</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Your trusted recruitment partner across India & the Middle East.
              Building teams that drive growth.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-white/80 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                ["Home", "#home"],
                ["About Us", "#about"],
                ["Our Presence", "#presence"],
                ["Expertise", "#expertise"],
                ["Leadership", "#leadership"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <button
                    type="button"
                    data-ocid="footer.link"
                    onClick={() => scrollTo(href)}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-white/80 mb-4">
              Services
            </h4>
            <ul className="space-y-2">
              {[
                "Non-IT & Bulk Hiring",
                "Startup Hiring",
                "Leadership Hiring",
                "Contract Staffing",
              ].map((s) => (
                <li key={s} className="text-white/60 text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © {year} HireKra. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/70 transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// --- Section Header ---
function SectionHeader({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center mb-12">
      <Badge
        variant="outline"
        className="mb-4 border-brand-blue/30 text-brand-blue bg-brand-blue/5 font-semibold px-4 py-1 rounded-full"
      >
        {badge}
      </Badge>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
        {title}
      </h2>
      <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

// --- App ---
export default function App() {
  return (
    <>
      <Toaster position="top-center" richColors />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Presence />
        <Expertise />
        <Leadership />
        <WhyChoose />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
