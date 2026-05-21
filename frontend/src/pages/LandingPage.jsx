import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  BookOpen,
  FileText,
  LayoutDashboard,
  Shield,
  Globe,
  Menu,
  X,
  ChevronRight,
  BookMarked,
  AlertCircle,
} from "lucide-react";

const API_BASE = "http://localhost:5000";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Team", href: "#team" },
];

const FEATURES = [
  { icon: Search, title: "Smart Search", desc: "Find any book by title, author, or keyword instantly" },
  { icon: BookOpen, title: "Digital Books", desc: "Curated collection across all major subjects" },
  { icon: FileText, title: "PDF Access", desc: "Download or read in-browser with one click" },
  { icon: LayoutDashboard, title: "Admin Dashboard", desc: "Full control over inventory, users, and reports" },
  { icon: Shield, title: "Secure Auth", desc: "Role-based login for students and administrators" },
  { icon: Globe, title: "Access Anywhere", desc: "Fully responsive, works on any device" },
];

const STEPS = [
  { number: "01", title: "Register / Login", desc: "Create your account in seconds" },
  { number: "02", title: "Search for Books", desc: "Browse by title, author, or subject" },
  { number: "03", title: "Read or Download", desc: "Open in-browser or save as PDF" },
  { number: "04", title: "Learn Anywhere", desc: "Access your library on any device" },
];

const TEAM = [
  { name: "Jnanesh", initials: "JN" },
  { name: "Murali", initials: "MU" },
  { name: "Niveditha", initials: "NI" },
  { name: "Nethra", initials: "NE" },
];

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

function Skeleton({ className }) {
  return (
    <div className={`animate-pulse bg-gray-700/50 rounded ${className || ""}`} />
  );
}

function SkeletonCard() {
  return (
    <div className="p-6 rounded-2xl bg-navy-700/40 border border-gray-600/20 space-y-4">
      <Skeleton className="w-11 h-11 rounded-xl" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

function CountUp({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (value === undefined || value === null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const from = 0;
          const startTime = performance.now();
          const step = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setCount(Math.floor(from + (value - from) * progress));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-900/80 backdrop-blur-xl shadow-lg shadow-black/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-violet flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <BookMarked className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-white tracking-tight">
              Libraria
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="/get-started"
              className="px-5 py-2 text-sm font-semibold text-gray-300 border border-gray-600 rounded-full hover:border-accent hover:text-white transition-all duration-200"
            >
              Explore Library
            </a>
            <a
              href="/admin-login"
              className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-accent to-violet rounded-full hover:shadow-lg hover:shadow-accent/30 transition-all duration-200"
            >
              Admin Portal
            </a>
          </div>

          <button
            className="md:hidden text-gray-300 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-navy-800/95 backdrop-blur-xl border-t border-gray-700/50">
          <div className="px-6 py-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <hr className="border-gray-700/50" />
            <a
              href="/get-started"
              onClick={() => setMobileOpen(false)}
              className="block text-center px-5 py-2 text-sm font-semibold text-gray-300 border border-gray-600 rounded-full"
            >
              Explore Library
            </a>
            <a
              href="/admin-login"
              onClick={() => setMobileOpen(false)}
              className="block text-center px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-accent to-violet rounded-full"
            >
              Admin Portal
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />

      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(99,102,241,0.15) 0%, transparent 50%)"
      }} />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-orb" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-violet/10 blur-3xl animate-orb-delayed" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-xs font-semibold mb-6 animate-fade-1">
            <span className="w-2 h-2 rounded-full bg-accent animate-glow inline-block" />
            A Digital Solution for Modern Libraries
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight mb-6 animate-fade-1">
            Read. Learn.{" "}
            <span className="bg-gradient-to-r from-accent-light to-violet-light bg-clip-text text-transparent">
              Access Anywhere.
            </span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-xl mb-8 animate-fade-2">
            Your college's entire library &mdash; always at your fingertips.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-3">
            <a
              href="/get-started"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-accent to-violet rounded-full hover:shadow-xl hover:shadow-accent/30 transition-all duration-300"
            >
              Browse Library
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="/admin-login"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-gray-300 border border-gray-600 rounded-full hover:border-accent hover:text-white transition-all duration-300"
            >
              Admin Portal
            </a>
          </div>
        </div>

        <div className="hidden lg:flex justify-center items-center">
          <div className="relative w-80 h-96 animate-float">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-violet/20 rounded-3xl blur-xl" />
            <div className="relative w-full h-full bg-navy-700/50 backdrop-blur-sm rounded-3xl border border-gray-600/30 flex flex-col items-center justify-center p-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-violet flex items-center justify-center mb-6 shadow-lg shadow-accent/20">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div className="text-center">
                <p className="text-white font-display font-semibold text-lg mb-1">
                  Resource Catalog
                </p>
                <p className="text-gray-400 text-sm">Browse thousands of titles</p>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-white font-bold text-sm">New</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-2xl bg-navy-700/50 backdrop-blur-sm border border-gray-600/30 flex items-center justify-center">
              <FileText className="w-8 h-8 text-accent-light" />
            </div>
            <div className="absolute -top-8 -left-8 w-16 h-16 rounded-full bg-accent/20 blur-md animate-orb" />
            <div className="absolute -bottom-10 right-10 w-12 h-12 rounded-full bg-violet/20 blur-md animate-orb-delayed" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-900 to-transparent" />
    </section>
  );
}

function StatsBar() {
  const { data: stats, loading, error } = useFetch(`${API_BASE}/api/stats`);

  const ITEMS = [
    { key: "totalBooks", label: "Books" },
    { key: "totalUsers", label: "Users" },
    { key: "totalCategories", label: "Categories" },
    { key: "totalDownloads", label: "Downloads" },
  ];

  return (
    <section className="relative z-10 -mt-20 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-navy-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/30 shadow-xl shadow-black/20">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-700/30">
          {ITEMS.map((item) => (
            <div key={item.key} className="py-8 px-4 text-center">
              {loading ? (
                <Skeleton className="h-9 w-20 mx-auto mb-2" />
              ) : error ? (
                <>
                  <p className="font-display text-3xl sm:text-4xl font-bold text-gray-500 mb-1">
                    &mdash;
                  </p>
                  <p className="text-[10px] text-gray-500">Could not load</p>
                </>
              ) : (
                <>
                  <p className="font-display text-3xl sm:text-4xl font-bold text-white mb-1">
                    {stats[item.key] !== undefined ? (
                      <CountUp value={stats[item.key]} />
                    ) : (
                      "0"
                    )}
                  </p>
                  <p className="text-sm text-gray-400">{item.label}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedBooks() {
  const { data: books, loading, error } = useFetch(`${API_BASE}/api/books/featured`);

  return (
    <section id="featured" className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Featured Collection
          </h2>
          <p className="text-gray-400 text-lg">Recently added titles</p>
        </div>

        {error && (
          <div className="flex items-center justify-center gap-2 text-gray-400 py-12">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p>Could not load books. Please try again later.</p>
          </div>
        )}

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && !error && books && books.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No books available yet.</p>
          </div>
        )}

        {!loading && !error && books && books.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="group p-6 rounded-2xl bg-navy-700/40 backdrop-blur-sm border border-gray-600/20 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5"
              >
                <div className="w-full h-36 rounded-xl bg-gradient-to-br from-accent/20 to-violet/20 flex items-center justify-center mb-4">
                  <BookOpen className="w-10 h-10 text-accent-light/60" />
                </div>
                <span className="inline-block px-3 py-1 text-xs font-medium text-accent-light bg-accent/10 rounded-full mb-3">
                  {book.category || "General"}
                </span>
                <h3 className="font-display text-lg font-semibold text-white mb-1 line-clamp-1">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{book.author}</p>
                <a
                  href={book.pdfUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-accent-light hover:text-white transition-colors duration-200"
                >
                  Read Now <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, desc, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 100);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className={`group p-6 rounded-2xl bg-navy-700/40 backdrop-blur-sm border border-gray-600/20 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionProperty: "all", transitionDuration: "500ms" }}
    >
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/20 to-violet/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-5 h-5 text-accent-light" />
      </div>
      <h3 className="font-display text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything a modern library needs
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Built for students, by developers who care about quality
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-6 lg:px-8 bg-navy-800/40">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Up and reading in 4 steps
          </h2>
          <p className="text-gray-400 text-lg">Getting started is simple</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-accent via-violet to-accent" />

          {STEPS.map((step) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 w-16 h-16 rounded-full bg-navy-700 border-2 border-accent/50 flex items-center justify-center mb-5 shadow-lg shadow-accent/10">
                <span className="font-display text-lg font-bold text-accent-light">{step.number}</span>
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="md:hidden space-y-6 mt-8">
          {STEPS.map((step) => (
            <div key={step.number} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-navy-700 border-2 border-accent/50 flex items-center justify-center">
                <span className="font-display font-bold text-accent-light">{step.number}</span>
              </div>
              <div className="pt-2">
                <h3 className="font-display font-semibold text-white">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const { data: categories, loading, error } = useFetch(`${API_BASE}/api/categories`);

  return (
    <section id="categories" className="py-24 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Browse by Category
          </h2>
          <p className="text-gray-400 text-lg">Find what you need, fast</p>
        </div>

        {loading && (
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-28 rounded-full" />
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p>Could not load categories.</p>
          </div>
        )}

        {!loading && !error && categories && categories.length === 0 && (
          <p className="text-center text-gray-500">No categories found.</p>
        )}

        {!loading && !error && categories && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <a
                key={cat.name}
                href={`/library?category=${encodeURIComponent(cat.name)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-navy-700/50 border border-gray-600/30 text-sm text-gray-300 hover:border-accent/50 hover:text-white hover:bg-accent/10 transition-all duration-200 group"
              >
                {cat.name}
                <span className="text-xs text-gray-500 group-hover:text-accent-light transition-colors">
                  {cat.bookCount}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TeamSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="team" className="py-24 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Built by</h2>
          <p className="text-gray-400 text-lg">A team of passionate developers</p>
        </div>

        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member, i) => (
            <div
              key={member.name}
              className={`p-6 rounded-2xl bg-navy-700/40 backdrop-blur-sm border border-gray-600/20 text-center transition-all duration-500 hover:-translate-y-1 hover:border-accent/40 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${i * 100}ms`, transitionProperty: "all" }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-violet flex items-center justify-center mx-auto mb-4">
                <span className="font-display text-lg font-bold text-white">{member.initials}</span>
              </div>
              <h3 className="font-display text-lg font-semibold text-white">{member.name}</h3>
              <p className="text-sm text-gray-400 mt-1">Developer</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-700/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div>
            <a href="#" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-violet flex items-center justify-center">
                <BookMarked className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-white">Libraria</span>
            </a>
            <p className="text-sm text-gray-400 max-w-xs">
              Modernizing traditional libraries with digital solutions.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Links</p>
            <div className="space-y-2">
              <a href="#features" className="block text-sm text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#team" className="block text-sm text-gray-400 hover:text-white transition-colors">Team</a>
              <a href="https://github.com/Jnanesh321/E-Library-Management" target="_blank" rel="noopener noreferrer" className="block text-sm text-gray-400 hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-gray-400">
              &copy; 2025 Libraria. Built with{" "}
              <span className="text-red-400">&hearts;</span> for learning.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-900 font-body">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <FeaturedBooks />
      <FeaturesSection />
      <HowItWorksSection />
      <CategoriesSection />
      <TeamSection />
      <Footer />
    </div>
  );
}
