import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreateInspectionRequest } from '@workspace/api-client-react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardCheck,
  Construction,
  Droplets,
  Hammer,
  Home as HomeIcon,
  Layers3,
  Mail,
  MapPin,
  Menu,
  Phone,
  Quote,
  Ruler,
  Send,
  ShieldCheck,
  Timer,
  Waves,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type IconType = typeof Droplets;

const services: {
  number: string;
  icon: IconType;
  title: string;
  summary: string;
  detail: string;
  tags: string[];
}[] = [
  {
    number: '01',
    icon: HomeIcon,
    title: 'Terraces & roofs',
    summary: 'Keep the monsoon outside and your top floor comfortable all year.',
    detail: 'We diagnose ponding, cracks and failed joints before building a flexible waterproofing system that moves with your roof, not against it.',
    tags: ['Leak tracing', 'PU coatings', 'Slope correction'],
  },
  {
    number: '02',
    icon: Waves,
    title: 'Bathrooms & wet areas',
    summary: 'Invisible protection behind every tile, fixture and finish.',
    detail: 'A careful membrane, corner detailing and controlled testing prevents seepage from travelling into the room next door or the floor below.',
    tags: ['Sunken slab', 'Tile joints', '24-hour flood test'],
  },
  {
    number: '03',
    icon: Building2,
    title: 'Basements',
    summary: 'Dry foundations for storage, parking and the rooms that sit below grade.',
    detail: 'From negative-side repairs to external tanking, we manage hydrostatic pressure with systems selected for your soil, structure and access.',
    tags: ['Injection grouting', 'Retaining walls', 'Dewatering plans'],
  },
  {
    number: '04',
    icon: Layers3,
    title: 'External walls',
    summary: 'Stop damp patches before they become a renovation project.',
    detail: 'We seal the building envelope with breathable coatings and precise crack repairs, preserving the finish while removing the source of moisture.',
    tags: ['Crack stitching', 'Facade coatings', 'Damp mapping'],
  },
  {
    number: '05',
    icon: Construction,
    title: 'New construction',
    summary: 'Waterproofing specified early, so it never becomes an afterthought.',
    detail: 'We work alongside builders and project managers from slab to handover with method statements, site checks and documentation your team can rely on.',
    tags: ['BOQ support', 'Site coordination', 'Warranty files'],
  },
];

const faqs = [
  {
    question: 'How do you find the source of a leak?',
    answer:
      'We begin with a site inspection, moisture mapping and a conversation about when the issue appears. Water rarely enters where the stain shows, so we trace movement across slopes, joints and service penetrations before recommending a repair.',
  },
  {
    question: 'Can you waterproof a finished building without breaking everything?',
    answer:
      'Often, yes. We first assess whether the existing layers can be retained. Many terrace, wall and basement repairs can be completed with targeted preparation, injection or overlay systems rather than a full demolition.',
  },
  {
    question: 'What is included in an inspection?',
    answer:
      'We review the affected areas, access, drainage, previous repairs and visible construction details. You receive a clear diagnosis, recommended system and scope of work — not a vague promise or a one-size-fits-all quote.',
  },
  {
    question: 'Do you work with builders and property managers?',
    answer:
      'Yes. We support new construction teams, housing societies, commercial property managers and homeowners. Our process is designed to stay tidy, documented and coordinated with the people already responsible for the site.',
  },
  {
    question: 'How long does waterproofing last?',
    answer:
      'Service life depends on the substrate, exposure, drainage and maintenance. The right system, installed on a properly prepared surface, performs for many years. We explain the care plan and warranty terms before work begins.',
  },
];

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Logo() {
  return (
    <a href="#top" className="flex items-center gap-3" data-testid="link-home">
      <span className="relative grid size-10 place-items-center rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]">
        <Droplets size={20} strokeWidth={2.4} />
        <span className="absolute -right-1 -top-1 size-2 rounded-full bg-[hsl(var(--primary))]" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-[1.02rem] font-bold tracking-[-.04em]">Lakshita</span>
        <span className="mt-1 block font-mono-custom text-[.55rem] uppercase tracking-[.18em] opacity-65">Enterprises</span>
      </span>
    </a>
  );
}

function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="group relative py-2 text-[.72rem] font-bold uppercase tracking-[.14em] text-[hsl(var(--foreground)/.68)] transition-colors hover:text-[hsl(var(--foreground))]"
      data-testid={`link-nav-${href.replace('#', '')}`}
    >
      {children}
      <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[hsl(var(--accent))] transition-transform duration-300 group-hover:scale-x-100" />
    </a>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeService, setActiveService] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createInspectionRequest = useCreateInspectionRequest();

  useEffect(() => {
    document.title = 'Lakshita Enterprises | Waterproofing built to last';
    const description =
      'Lakshita Enterprises protects homes, buildings and new construction from leaks, seepage and damp with considered waterproofing systems.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', description);
    const setProperty = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    setProperty('og:title', 'Lakshita Enterprises | Waterproofing built to last');
    setProperty('og:description', description);
    setProperty('og:type', 'website');
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSubmitError(null);

    createInspectionRequest.mutate(
      {
        data: {
          name: String(formData.get('name') ?? '').trim(),
          phone: String(formData.get('phone') ?? '').trim(),
          service: String(formData.get('service') ?? '').trim(),
          message: String(formData.get('message') ?? '').trim(),
        },
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          form.reset();
        },
        onError: () => {
          setSubmitError(
            'We couldn’t send your request right now. Please try again or call us directly.',
          );
        },
      },
    );
  };

  return (
    <div id="top" className="noise min-h-[100dvh] overflow-hidden bg-[hsl(var(--background))]">
      <header className="absolute inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-5 md:px-9 md:py-7">
          <Logo />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#approach">Our approach</NavLink>
            <NavLink href="#proof">Why Lakshita</NavLink>
            <NavLink href="#faqs">FAQs</NavLink>
          </nav>
          <a
            href="#contact"
            className="hidden items-center gap-2 rounded-full bg-[hsl(var(--foreground))] px-5 py-3 text-[.7rem] font-bold uppercase tracking-[.14em] text-[hsl(var(--background))] transition-all hover:-translate-y-0.5 hover:bg-[hsl(var(--primary))] sm:flex"
            data-testid="link-header-inspection"
          >
            Book an inspection <ArrowUpRight size={15} />
          </a>
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-11 place-items-center rounded-full border border-[hsl(var(--foreground)/.18)] lg:hidden"
            data-testid="button-mobile-menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen && (
          <div className="mx-4 rounded-2xl border border-[hsl(var(--foreground)/.1)] bg-[hsl(var(--card)/.96)] p-5 shadow-xl backdrop-blur lg:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {['services', 'approach', 'proof', 'faqs', 'contact'].map((item) => (
                <a
                  href={`#${item}`}
                  key={item}
                  onClick={closeMenu}
                  className="rounded-xl px-3 py-3 text-sm font-bold uppercase tracking-[.12em] text-[hsl(var(--foreground)/.78)] hover:bg-[hsl(var(--muted))]"
                  data-testid={`link-mobile-${item}`}
                >
                  {item === 'faqs' ? 'FAQs' : item.replace('-', ' ')}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main>
        <section className="relative isolate min-h-[780px] overflow-hidden bg-[hsl(var(--sidebar))] text-[hsl(var(--background))] md:min-h-[870px]">
          <div className="absolute inset-0 bg-[linear-gradient(110deg,hsl(var(--sidebar))_16%,hsl(192_34%_13%/.65)_60%,hsl(192_34%_13%/.15)),url('/terrace-detail.jpg')] bg-cover bg-center" />
          <div className="hero-grid absolute inset-0 opacity-40" />
          <div className="absolute -right-48 top-44 size-[520px] rounded-full border border-[hsl(var(--accent)/.25)] md:size-[720px]" />
          <div className="absolute -right-24 top-68 size-[360px] rounded-full border border-[hsl(var(--accent)/.14)] md:size-[520px]" />
          <div className="relative mx-auto flex min-h-[780px] max-w-[1320px] items-end px-5 pb-16 pt-32 md:min-h-[870px] md:px-9 md:pb-24">
            <div className="max-w-4xl">
              <div className="reveal mb-8 flex items-center gap-3 font-mono-custom text-[.63rem] uppercase tracking-[.22em] text-[hsl(var(--accent))]">
                <span className="h-px w-10 bg-[hsl(var(--accent))]" />
                Water held out. Confidence held in.
              </div>
              <h1 className="reveal reveal-delay-1 text-balance font-display text-[clamp(3.65rem,9vw,8.9rem)] font-medium leading-[.88] tracking-[-.08em]">
                Built dry.
                <br />
                Built <span className="text-[hsl(var(--accent))]">to last.</span>
              </h1>
              <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <p className="reveal reveal-delay-2 max-w-md text-base leading-7 text-[hsl(var(--background)/.72)] md:text-lg">
                  Waterproofing for homes, buildings and new construction — diagnosed properly, installed carefully, and made to disappear behind a better finish.
                </p>
                <a
                  href="#contact"
                  className="reveal reveal-delay-3 group flex w-fit items-center gap-3 rounded-full bg-[hsl(var(--accent))] px-6 py-4 text-sm font-bold text-[hsl(var(--foreground))] transition-transform hover:-translate-y-1"
                  data-testid="link-hero-inspection"
                >
                  Tell us what’s leaking <ArrowDownRight className="transition-transform group-hover:translate-x-1 group-hover:translate-y-1" size={18} />
                </a>
              </div>
            </div>
            <div className="absolute bottom-8 right-5 hidden items-center gap-4 md:flex md:right-9">
              <span className="font-mono-custom text-[.6rem] uppercase tracking-[.18em] text-[hsl(var(--background)/.48)]">Scroll to explore</span>
              <span className="grid size-10 place-items-center rounded-full border border-[hsl(var(--background)/.28)]"><ArrowDownRight size={16} /></span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-2 w-1/3 bg-[hsl(var(--accent))]" />
        </section>

        <section id="proof" className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="mx-auto grid max-w-[1320px] md:grid-cols-[1.1fr_2fr]">
            <div className="border-b border-[hsl(var(--border))] p-7 md:border-b-0 md:border-r md:p-12">
              <p className="font-mono-custom text-[.65rem] uppercase tracking-[.18em] text-[hsl(var(--primary))]">A quieter kind of expertise</p>
              <p className="mt-6 max-w-xs font-display text-2xl font-medium leading-tight tracking-[-.04em] text-[hsl(var(--foreground)/.86)]">
                The best waterproofing is the problem you never have to think about again.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                ['12+', 'years on site'],
                ['1,800+', 'spaces protected'],
                ['5 yr', 'system warranty'],
                ['48 hr', 'inspection response'],
              ].map(([value, label], index) => (
                <div className="border-b border-[hsl(var(--border))] p-7 last:border-0 md:border-b-0 md:border-r md:p-10 md:last:border-r-0" key={label}>
                  <p className="font-display text-3xl font-semibold tracking-[-.06em] text-[hsl(var(--primary))] md:text-4xl" data-testid={`text-proof-value-${index}`}>{value}</p>
                  <p className="mt-3 max-w-[90px] text-[.68rem] font-bold uppercase leading-4 tracking-[.13em] text-[hsl(var(--muted-foreground))]">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="bg-[hsl(var(--background))] px-5 py-24 md:px-9 md:py-36">
          <div className="mx-auto max-w-[1320px]">
            <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <p className="font-mono-custom text-[.65rem] uppercase tracking-[.18em] text-[hsl(var(--primary))]">01 / What we protect</p>
                <h2 className="mt-5 max-w-2xl font-display text-5xl font-medium leading-[.95] tracking-[-.07em] md:text-7xl">
                  Every surface has a story.
                  <br />
                  <span className="text-[hsl(var(--muted-foreground))]">We find the weak point.</span>
                </h2>
              </div>
              <p className="max-w-xs text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                No blanket solutions. We match the system to the surface, the weather, the building and the way people use it.
              </p>
            </div>
            <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr]">
              <div className="flex flex-col gap-2">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <button
                      type="button"
                      className={`group flex items-center justify-between rounded-2xl border p-5 text-left transition-all duration-300 ${activeService === index ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[hsl(var(--primary)/.5)]'}`}
                      onClick={() => setActiveService(index)}
                      key={service.title}
                      data-testid={`button-service-${index}`}
                    >
                      <span className="flex items-center gap-4">
                        <span className={`grid size-11 place-items-center rounded-xl ${activeService === index ? 'bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]' : 'bg-[hsl(var(--muted))] text-[hsl(var(--primary))]'}`}><Icon size={20} /></span>
                        <span>
                          <span className="block font-display text-lg font-semibold tracking-[-.03em]">{service.title}</span>
                          <span className={`mt-1 block text-xs ${activeService === index ? 'text-[hsl(var(--primary-foreground)/.7)]' : 'text-[hsl(var(--muted-foreground))]'}`}>{service.summary}</span>
                        </span>
                      </span>
                      <ArrowUpRight size={18} className="shrink-0 opacity-55 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>
                  );
                })}
              </div>
              <div className="relative min-h-[430px] overflow-hidden rounded-3xl bg-[hsl(var(--sidebar))] p-7 text-[hsl(var(--background))] md:p-11">
                <div className="absolute -right-20 -top-20 size-72 rounded-full border border-[hsl(var(--accent)/.3)]" />
                <div className="absolute bottom-0 right-0 h-2/3 w-1/2 opacity-20" style={{ backgroundImage: 'linear-gradient(135deg, transparent 45%, hsl(27 88% 57% / .6) 46%, transparent 47%), linear-gradient(45deg, transparent 45%, hsl(27 88% 57% / .45) 46%, transparent 47%)', backgroundSize: '38px 38px' }} />
                <div className="relative flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="font-mono-custom text-[.65rem] uppercase tracking-[.18em] text-[hsl(var(--accent))]">{services[activeService].number} / Surface system</span>
                    <ShieldCheck className="text-[hsl(var(--accent))]" size={28} strokeWidth={1.4} />
                  </div>
                  <div>
                    <h3 className="max-w-lg font-display text-4xl font-medium leading-[.98] tracking-[-.06em] md:text-6xl">{services[activeService].title}</h3>
                    <p className="mt-6 max-w-md text-sm leading-6 text-[hsl(var(--background)/.65)]">{services[activeService].detail}</p>
                    <div className="mt-8 flex flex-wrap gap-2">
                      {services[activeService].tags.map((tag) => <span className="rounded-full border border-[hsl(var(--background)/.18)] px-3 py-2 font-mono-custom text-[.58rem] uppercase tracking-[.12em] text-[hsl(var(--background)/.7)]" key={tag}>{tag}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="approach" className="relative overflow-hidden bg-[hsl(var(--secondary))] px-5 py-24 md:px-9 md:py-36">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-[hsl(var(--primary)/.04)]" />
          <div className="relative mx-auto max-w-[1320px]">
            <div className="grid gap-14 lg:grid-cols-[.85fr_1.5fr]">
              <div>
                <p className="font-mono-custom text-[.65rem] uppercase tracking-[.18em] text-[hsl(var(--primary))]">02 / How we work</p>
                <h2 className="mt-5 max-w-md font-display text-5xl font-medium leading-[.94] tracking-[-.07em] md:text-7xl">Good work starts before the first coat.</h2>
                <p className="mt-7 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">A dry building is the result of clear thinking, good preparation and people who take the small details seriously.</p>
              </div>
              <div className="grid gap-0">
                {[
                  [ClipboardCheck, '01', 'Inspect & understand', 'We listen, trace moisture and read the existing construction before we recommend a system.'],
                  [Ruler, '02', 'Prepare & detail', 'The lasting part is underneath: clean surfaces, repaired cracks, correct falls and careful edge work.'],
                  [Hammer, '03', 'Install & test', 'Our crew applies the system with a clean hand, controlled curing and testing you can see for yourself.'],
                  [BadgeCheck, '04', 'Handover & stand behind it', 'You receive a clear scope, care notes and warranty terms — with a real team to call if you need us.'],
                ].map(([Icon, number, title, body]) => {
                  const StepIcon = Icon as IconType;
                  return (
                    <div className="group grid grid-cols-[48px_1fr] gap-5 border-t border-[hsl(var(--foreground)/.16)] py-7 md:grid-cols-[70px_1fr_1fr] md:gap-8" key={number as string}>
                      <span className="font-mono-custom text-xs text-[hsl(var(--primary))]">{number as string}</span>
                      <div className="flex items-center gap-4">
                        <StepIcon size={20} className="text-[hsl(var(--primary))] transition-transform group-hover:-translate-y-1" strokeWidth={1.6} />
                        <h3 className="font-display text-xl font-semibold tracking-[-.04em]">{title as string}</h3>
                      </div>
                      <p className="col-start-2 mt-2 text-sm leading-6 text-[hsl(var(--muted-foreground))] md:col-start-auto md:mt-0">{body as string}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-[hsl(var(--sidebar))] px-5 py-24 text-[hsl(var(--background))] md:px-9 md:py-32">
          <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
            <div>
              <p className="font-mono-custom text-[.65rem] uppercase tracking-[.18em] text-[hsl(var(--accent))]">03 / The Lakshita standard</p>
              <h2 className="mt-6 max-w-3xl font-display text-5xl font-medium leading-[.92] tracking-[-.08em] md:text-8xl">Protection should feel like <span className="text-[hsl(var(--accent))]">peace of mind.</span></h2>
            </div>
            <div className="grid gap-7 border-l border-[hsl(var(--background)/.2)] pl-7 md:grid-cols-2 md:gap-9">
              <div><Timer size={23} className="text-[hsl(var(--accent))]" /><h3 className="mt-5 font-display text-xl font-semibold">We respect your time</h3><p className="mt-3 text-sm leading-6 text-[hsl(var(--background)/.58)]">Tidy planning, clear arrival windows and a site that is treated like it belongs to you.</p></div>
              <div><ShieldCheck size={23} className="text-[hsl(var(--accent))]" /><h3 className="mt-5 font-display text-xl font-semibold">We document the details</h3><p className="mt-3 text-sm leading-6 text-[hsl(var(--background)/.58)]">Every recommendation is explained in plain language and recorded for the next person who needs it.</p></div>
            </div>
          </div>
        </section>

        <section id="faqs" className="bg-[hsl(var(--card))] px-5 py-24 md:px-9 md:py-36">
          <div className="mx-auto grid max-w-[1120px] gap-14 md:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="font-mono-custom text-[.65rem] uppercase tracking-[.18em] text-[hsl(var(--primary))]">04 / Clear answers</p>
              <h2 className="mt-5 font-display text-5xl font-medium leading-[.95] tracking-[-.07em] md:text-7xl">Before you decide.</h2>
              <p className="mt-7 max-w-xs text-sm leading-6 text-[hsl(var(--muted-foreground))]">A little context makes a big decision feel simpler. If your question is not here, ask us directly.</p>
              <a href="#contact" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[hsl(var(--primary))] hover:underline" data-testid="link-faq-contact">Ask a question <ArrowUpRight size={16} /></a>
            </div>
            <div className="border-t border-[hsl(var(--border))]">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div className="border-b border-[hsl(var(--border))]" key={faq.question}>
                    <button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} className="flex w-full items-center justify-between gap-5 py-6 text-left" aria-expanded={isOpen} data-testid={`button-faq-${index}`}>
                      <span className="font-display text-lg font-semibold tracking-[-.03em] md:text-xl">{faq.question}</span>
                      <span className={`grid size-8 shrink-0 place-items-center rounded-full border border-[hsl(var(--border))] transition-transform ${isOpen ? 'rotate-180 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : ''}`}><ChevronDown size={16} /></span>
                    </button>
                    {isOpen && <p className="max-w-2xl pb-6 pr-12 text-sm leading-7 text-[hsl(var(--muted-foreground))] reveal" data-testid={`text-faq-answer-${index}`}>{faq.answer}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[hsl(var(--background))] px-5 py-24 md:px-9 md:py-36">
          <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[.85fr_1.15fr]">
            <div>
              <p className="font-mono-custom text-[.65rem] uppercase tracking-[.18em] text-[hsl(var(--primary))]">05 / Start here</p>
              <h2 className="mt-5 max-w-lg font-display text-5xl font-medium leading-[.92] tracking-[-.07em] md:text-7xl">Tell us where water is getting in.</h2>
              <p className="mt-7 max-w-md text-sm leading-6 text-[hsl(var(--muted-foreground))]">Share a few details and our team will get back to you within 48 hours to arrange a considered site inspection.</p>
              <div className="mt-12 space-y-5">
                <a href="tel:+919876543210" className="flex items-center gap-4 text-sm font-semibold hover:text-[hsl(var(--primary))]" data-testid="link-contact-phone"><span className="grid size-10 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><Phone size={17} /></span>+91 98765 43210</a>
                <a href="mailto:hello@lakshitaenterprises.in" className="flex items-center gap-4 text-sm font-semibold hover:text-[hsl(var(--primary))]" data-testid="link-contact-email"><span className="grid size-10 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><Mail size={17} /></span>hello@lakshitaenterprises.in</a>
                <div className="flex items-center gap-4 text-sm font-semibold"><span className="grid size-10 place-items-center rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--primary))]"><MapPin size={17} /></span>Pune · Mumbai · Nashik</div>
              </div>
            </div>
            <div className="rounded-3xl bg-[hsl(var(--secondary))] p-6 md:p-10">
              {submitted ? (
                <div className="flex min-h-[480px] flex-col items-start justify-center">
                  <span className="grid size-14 place-items-center rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--foreground))]"><Check size={26} /></span>
                  <p className="mt-7 font-mono-custom text-[.65rem] uppercase tracking-[.18em] text-[hsl(var(--primary))]">Request received</p>
                  <h3 className="mt-4 max-w-md font-display text-4xl font-medium leading-none tracking-[-.06em]">We’ll be in touch soon.</h3>
                  <p className="mt-5 max-w-sm text-sm leading-6 text-[hsl(var(--muted-foreground))]">Thank you for trusting us with the first step. A Lakshita specialist will call to understand the site and schedule your inspection.</p>
                  <button type="button" onClick={() => setSubmitted(false)} className="mt-8 text-sm font-bold text-[hsl(var(--primary))] underline underline-offset-4" data-testid="button-new-request">Send another request</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" data-testid="form-inspection">
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="block"><span className="mb-2 block font-mono-custom text-[.6rem] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">Your name</span><input required name="name" placeholder="Aarav Mehta" className="w-full border-b border-[hsl(var(--foreground)/.22)] bg-transparent py-3 text-sm outline-none placeholder:text-[hsl(var(--muted-foreground)/.7)] focus:border-[hsl(var(--primary))]" data-testid="input-name" /></label>
                    <label className="block"><span className="mb-2 block font-mono-custom text-[.6rem] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">Phone number</span><input required type="tel" name="phone" placeholder="+91 98..." className="w-full border-b border-[hsl(var(--foreground)/.22)] bg-transparent py-3 text-sm outline-none placeholder:text-[hsl(var(--muted-foreground)/.7)] focus:border-[hsl(var(--primary))]" data-testid="input-phone" /></label>
                  </div>
                  <label className="block"><span className="mb-2 block font-mono-custom text-[.6rem] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">I need help with</span><select required name="service" defaultValue="" className="w-full border-b border-[hsl(var(--foreground)/.22)] bg-transparent py-3 text-sm outline-none focus:border-[hsl(var(--primary))]" data-testid="select-service"><option value="" disabled>Select an area</option><option>Terrace or roof</option><option>Bathroom or wet area</option><option>Basement</option><option>External wall</option><option>New construction</option><option>Not sure yet</option></select></label>
                  <label className="block"><span className="mb-2 block font-mono-custom text-[.6rem] uppercase tracking-[.15em] text-[hsl(var(--muted-foreground))]">A little about the issue</span><textarea required name="message" rows={3} placeholder="When did you first notice it?" className="w-full resize-none border-b border-[hsl(var(--foreground)/.22)] bg-transparent py-3 text-sm outline-none placeholder:text-[hsl(var(--muted-foreground)/.7)] focus:border-[hsl(var(--primary))]" data-testid="textarea-message" /></label>
                  {submitError && <p role="alert" className="text-sm font-semibold text-red-700">{submitError}</p>}
                  <div className="flex flex-col justify-between gap-5 pt-3 sm:flex-row sm:items-center"><p className="flex items-center gap-2 text-[.68rem] leading-5 text-[hsl(var(--muted-foreground))]"><CalendarDays size={15} className="text-[hsl(var(--primary))]" /> No obligation. Just a useful first conversation.</p><button type="submit" disabled={createInspectionRequest.isPending} className="group inline-flex items-center justify-center gap-3 rounded-full bg-[hsl(var(--primary))] px-6 py-4 text-sm font-bold text-[hsl(var(--primary-foreground))] transition-transform hover:-translate-y-1 disabled:cursor-wait disabled:opacity-60" data-testid="button-submit-inspection">{createInspectionRequest.isPending ? 'Sending request…' : 'Request inspection'} <Send size={16} className="transition-transform group-hover:translate-x-1" /></button></div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[hsl(var(--sidebar))] px-5 py-10 text-[hsl(var(--background))] md:px-9">
        <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-8 md:flex-row md:items-end">
          <div><Logo /><p className="mt-5 max-w-xs text-xs leading-5 text-[hsl(var(--background)/.48)]">Practical expertise for buildings that deserve to stay dry.</p></div>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 font-mono-custom text-[.6rem] uppercase tracking-[.15em] text-[hsl(var(--background)/.5)]"><span>© {new Date().getFullYear()} Lakshita Enterprises</span><a href="#top" className="hover:text-[hsl(var(--accent))]" data-testid="link-footer-top">Back to top ↑</a></div>
        </div>
      </footer>
    </div>
  );
}

export default App;