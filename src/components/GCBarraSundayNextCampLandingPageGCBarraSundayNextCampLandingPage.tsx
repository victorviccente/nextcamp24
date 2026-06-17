import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  Clipboard,
  ArrowDown,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Share2,
  Flame,
  Heart,
  Clock,
  ShieldCheck,
  Tent,
  Calendar,
  MapPin,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- ARQUIVOS LOCAIS ---
import qr from "../assets/qr-pix.png";

// Arte oficial NEXT CAMP 26 (em /public)
const BILLBOARD_ART = "/nextcamp26-billboard.png";
const BANNER_ART = "/nextcamp26-banner.png";

// Imagens do carousel (momentos reais do GC NEXT ONLINE)
const carouselImages: { src: string; caption: string }[] = [
  { src: "/galeria-1.png", caption: "Nossos encontros online toda semana" },
  { src: "/galeria-2.png", caption: "O GC NEXT ONLINE reunido de casa" },
  { src: "/galeria-3.png", caption: "Juntos também presencialmente" },
  { src: "/galeria-4.png", caption: "Batismo de uma jovem do nosso GC" },
  { src: "/galeria-5.png", caption: "Famílias participando — entrando nas casas" },
  { src: "/galeria-6.png", caption: "Cada encontro vira memória" },
];

// --- TIPAGENS ---
interface CampaignData {
  eventName: string;
  groupName: string;
  church: string;
  pixKey: string;
  contactPhone: string;
  eventDate: string;
  donationDeadline: string; // ISO
  donationDeadlineLabel: string;
  instagramUrl: string;
  officialUrl: string;
  lotLabel: string;
  fullTicketPrice: number;
  leaders: { name: string; role: string }[];
}

interface ToastState {
  show: boolean;
  message: string;
  type: "success" | "error";
}

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

interface CarouselSlide {
  src: string;
  caption: string;
}

interface CarouselProps {
  images: CarouselSlide[];
  title: string;
  autoPlay?: boolean;
}

// --- DADOS DA CAMPANHA ---
const CAMPAIGN_DATA: CampaignData = {
  eventName: "NEXT CAMP 26",
  groupName: "GC NEXT ONLINE",
  church: "Igreja Novos Começos",
  pixKey: "f8a8356b-f39f-4d54-af31-fdb2a2762613",
  contactPhone: "5521973779257",
  eventDate: "31 de julho a 02 de agosto de 2026",
  donationDeadline: "2026-07-10T23:59:59",
  donationDeadlineLabel: "10 de julho de 2026",
  instagramUrl: "https://www.instagram.com/p/DYx7KLamGXZ/",
  officialUrl:
    "https://eventos.igrejanovoscomecos.com.br/next-camp-26-barra-1773165310",
  lotLabel: "2º lote",
  fullTicketPrice: 640,
  leaders: [
    { name: "Victor Vicente", role: "Liderança" },
    { name: "Larissa Belarmino", role: "Liderança" },
  ],
};

const SUGGESTED_VALUES = [25, 50, 100, 200];

const SHARE_MESSAGE = `Tô ajudando o ${CAMPAIGN_DATA.groupName} a ir pro NEXT CAMP 26! A meta é abençoar TODO o GC. Bora junto: `;

// --- COMPONENTES AUXILIARES ---

const Toast: React.FC<{ toast: ToastState; onClose: () => void }> = ({
  toast,
  onClose,
}) => {
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast.show, onClose]);

  return (
    <AnimatePresence>
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -40, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -40, x: "-50%" }}
          className={`fixed top-4 left-1/2 z-[60] px-5 py-3 rounded-lg shadow-hard font-pixel text-[10px] sm:text-xs uppercase border-2 border-charcoal ${
            toast.type === "success"
              ? "bg-spark text-charcoal"
              : "bg-blaze text-cream"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <span>⚠️</span>
            )}
            {toast.message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Pequena chuva de emojis ao copiar o PIX
const CelebrationBurst: React.FC<{ show: boolean }> = ({ show }) => {
  const emojis = ["🔥", "🙏", "💙", "✨", "🏕️", "💚", "🧡", "⭐", "🔥", "🙌"];
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[55] pointer-events-none overflow-hidden">
          {emojis.map((e, i) => (
            <motion.span
              key={i}
              className="absolute text-3xl"
              style={{ left: `${5 + i * 9}%`, bottom: "-10%" }}
              initial={{ y: 0, opacity: 0, rotate: 0 }}
              animate={{ y: "-110vh", opacity: [0, 1, 1, 0], rotate: 360 }}
              transition={{ duration: 1.8, delay: i * 0.05, ease: "easeOut" }}
            >
              {e}
            </motion.span>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

// Contagem regressiva até o prazo
const useCountdown = (targetIso: string) => {
  const calc = () => {
    const diff = new Date(targetIso).getTime() - Date.now();
    const clamped = Math.max(0, diff);
    return {
      days: Math.floor(clamped / 86400000),
      hours: Math.floor((clamped % 86400000) / 3600000),
      minutes: Math.floor((clamped % 3600000) / 60000),
      seconds: Math.floor((clamped % 60000) / 1000),
      ended: diff <= 0,
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetIso]);
  return time;
};

const CountdownDigit: React.FC<{ value: number; label: string }> = ({
  value,
  label,
}) => (
  <div className="flex flex-col items-center">
    <div className="bg-cream text-charcoal border-2 border-charcoal shadow-hard-sm px-2 py-2 sm:px-4 sm:py-3 min-w-[44px] sm:min-w-[72px] text-center clip-sticker">
      <span className="font-pixel text-sm sm:text-2xl tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
    </div>
    <span className="font-pixel text-[7px] sm:text-[9px] uppercase text-cream mt-1.5 tracking-wider">
      {label}
    </span>
  </div>
);

const Countdown: React.FC<{ targetIso: string; compact?: boolean }> = ({
  targetIso,
  compact = false,
}) => {
  const t = useCountdown(targetIso);
  if (compact) {
    return (
      <span className="font-pixel text-[9px] sm:text-xs text-spark tabular-nums">
        {t.days}d {String(t.hours).padStart(2, "0")}h{" "}
        {String(t.minutes).padStart(2, "0")}m{" "}
        {String(t.seconds).padStart(2, "0")}s
      </span>
    );
  }
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      <CountdownDigit value={t.days} label="Dias" />
      <CountdownDigit value={t.hours} label="Horas" />
      <CountdownDigit value={t.minutes} label="Min" />
      <CountdownDigit value={t.seconds} label="Seg" />
    </div>
  );
};

const Carousel: React.FC<CarouselProps> = ({
  images,
  title,
  autoPlay = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length, isAutoPlaying]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    setIsAutoPlaying(false);
  };
  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    setIsAutoPlaying(false);
  };
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="font-pixel text-xs sm:text-sm text-cream">{title}</h3>
      </div>

      <div className="relative bg-cream rounded-md shadow-hard-lg p-2 sm:p-3 border-4 border-charcoal -rotate-1">
        <div className="relative h-80 sm:h-96 md:h-[30rem] bg-army-dark rounded-sm overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={images[currentIndex].src}
              alt={images[currentIndex].caption}
              className="absolute inset-0 w-full h-full object-contain"
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>

          {/* Legenda */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/90 to-transparent pt-10 pb-9 px-3">
            <p className="text-cream text-center text-sm sm:text-base font-semibold [text-shadow:1px_1px_0_#221F1A]">
              {images[currentIndex].caption}
            </p>
          </div>

          <button
            onClick={goToPrevious}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-charcoal/80 hover:bg-charcoal text-cream p-2 border-2 border-cream transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            aria-label="Próxima foto"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-charcoal/80 hover:bg-charcoal text-cream p-2 border-2 border-cream transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                aria-label={`Ir para foto ${index + 1}`}
                className={`w-3 h-3 border border-charcoal transition-all ${
                  index === currentIndex ? "bg-blaze scale-110" : "bg-cream/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <span className="font-pixel text-[9px] text-cream/80">
          {currentIndex + 1} / {images.length}
        </span>
      </div>
    </div>
  );
};

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b-2 border-cream/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-4 sm:py-5 px-2 text-cream hover:bg-white/5 transition-colors"
      >
        <span className="font-display uppercase tracking-wide text-base md:text-xl pr-3">
          {question}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="shrink-0">
          <ArrowDown className="w-5 h-5 text-spark" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-5 px-2 text-cream/90 leading-relaxed text-sm md:text-base">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sticker / selo de acampamento
const Sticker: React.FC<{
  children: React.ReactNode;
  variant?: "cream" | "blaze" | "army";
  className?: string;
}> = ({ children, variant = "cream", className = "" }) => {
  const styles = {
    cream: "bg-cream text-charcoal",
    blaze: "bg-blaze text-cream",
    army: "bg-army text-cream",
  }[variant];
  return (
    <span
      className={`inline-flex items-center gap-2 border-2 border-charcoal shadow-hard-sm px-3 py-2 font-pixel text-[9px] sm:text-[10px] uppercase leading-relaxed ${styles} ${className}`}
    >
      {children}
    </span>
  );
};

// --- COMPONENTE PRINCIPAL ---
const NextCampLP: React.FC = () => {
  const { pixKey, instagramUrl } = CAMPAIGN_DATA;
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });
  const [celebrate, setCelebrate] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) =>
        setShowStickyCta(
          !entry.isIntersecting && entry.boundingClientRect.bottom < 0
        ),
      { threshold: 0 }
    );
    const current = heroRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  const copyPix = (suggested?: number): void => {
    navigator.clipboard.writeText(pixKey).then(
      () => {
        setToast({
          show: true,
          message: suggested
            ? `PIX copiado! Sugestão: R$ ${suggested}. Obrigado!`
            : "Chave PIX copiada! Você é uma bênção",
          type: "success",
        });
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 1900);
      },
      () =>
        setToast({
          show: true,
          message: "Não consegui copiar. Tente o QR Code.",
          type: "error",
        })
    );
  };

  const whatsappLink = `https://wa.me/${CAMPAIGN_DATA.contactPhone}`;
  const shareWhatsapp = `https://wa.me/?text=${encodeURIComponent(
    SHARE_MESSAGE + window.location.href
  )}`;

  const sectionAnimation = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.7, ease: "easeOut" },
  } as const;

  const sectionSpacing = "py-14 sm:py-20 lg:py-24";

  return (
    <>
      <Toast toast={toast} onClose={() => setToast({ ...toast, show: false })} />
      <CelebrationBurst show={celebrate} />

      {/* === BARRA DE URGÊNCIA FIXA NO TOPO === */}
      <div className="fixed top-0 left-0 w-full z-50 bg-charcoal border-b-2 border-blaze">
        <div className="container mx-auto px-3 py-2 flex items-center justify-center gap-1.5 sm:gap-3 text-center whitespace-nowrap">
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blaze shrink-0" />
          <span className="font-pixel text-[7px] sm:text-[10px] text-cream uppercase">
            <span className="sm:hidden">Prazo —</span>
            <span className="hidden sm:inline">
              Prazo {CAMPAIGN_DATA.donationDeadlineLabel} —
            </span>
          </span>
          <Countdown targetIso={CAMPAIGN_DATA.donationDeadline} compact />
        </div>
      </div>

      <div className="min-h-screen bg-sky text-cream font-sans pt-9">
        {/* === SEÇÃO 1: HERO === */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 bg-sky-clouds overflow-hidden"
        >
          {/* Nuvens pixeladas decorativas */}
          <div className="pointer-events-none absolute top-16 left-6 w-16 h-8 bg-cream-light/90 [clip-path:polygon(0_50%,15%_50%,15%_0,55%_0,55%_50%,100%_50%,100%_100%,0_100%)]" />
          <div className="pointer-events-none absolute top-28 right-8 w-24 h-10 bg-cream-light/80 [clip-path:polygon(0_50%,20%_50%,20%_0,70%_0,70%_50%,100%_50%,100%_100%,0_100%)]" />
          {/* Setas grunge laranja (canto) */}
          <div className="pointer-events-none absolute -top-4 -right-4 w-40 h-40 bg-blaze/80 [clip-path:polygon(100%_0,100%_60%,60%_100%,0_100%,40%_60%,40%_0)] rotate-12" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="relative z-10 max-w-4xl mx-auto w-full"
          >
            <Sticker className="!bg-charcoal !text-spark -rotate-2 mb-6">
              <Tent className="w-3.5 h-3.5" /> {CAMPAIGN_DATA.groupName}
            </Sticker>

            {/* Lockup NEXT CAMP 26 */}
            <h1 className="font-display uppercase leading-[0.82] tracking-tight mb-2">
              <span className="block text-cream text-5xl sm:text-8xl md:text-9xl [text-shadow:4px_4px_0_#221F1A] text-stroke-charcoal">
                NEXT CAMP
              </span>
              <span className="mt-3 inline-block bg-cream px-4 sm:px-6 border-4 border-charcoal shadow-hard clip-sticker">
                <span className="font-display text-6xl sm:text-8xl md:text-[8rem] text-blaze [text-shadow:4px_4px_0_#221F1A] leading-none">
                  26
                </span>
              </span>
            </h1>

            {/* Faixa de data */}
            <div className="mt-7 inline-block -skew-x-6 bg-charcoal px-5 py-3 shadow-hard">
              <p className="skew-x-6 font-pixel text-[9px] sm:text-sm uppercase tracking-widest text-cream">
                31 de Julho <span className="text-spark">a</span> 02 de Agosto
                <span className="text-spark"> · 2026</span>
              </p>
            </div>

            <p className="mt-7 text-base md:text-lg text-cream max-w-2xl mx-auto leading-relaxed [text-shadow:1px_1px_0_#221F1A]">
              <strong>Os melhores dias do ano estão chegando!</strong> Estamos
              arrecadando para abençoar <strong>TODO o GC NEXT ONLINE</strong> e
              levar nossa galera para esse acampamento que vai marcar uma
              geração.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-9">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#donate"
                className="w-full sm:w-auto bg-blaze text-cream font-display uppercase tracking-wide text-lg py-3 px-8 border-4 border-charcoal shadow-hard hover:bg-blaze-light transition-colors"
              >
                Quero abençoar o GC
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-army text-cream font-display uppercase tracking-wide text-lg py-3 px-8 border-4 border-charcoal shadow-hard hover:bg-army-light transition-colors"
              >
                Falar no WhatsApp
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 1.2,
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
          >
            <ArrowDown className="w-7 h-7 text-cream" />
          </motion.div>
        </section>

        {/* === SEÇÃO 2: URGÊNCIA / ESCASSEZ === */}
        <motion.section
          {...sectionAnimation}
          className="relative bg-blaze bg-grunge-noise overflow-hidden"
        >
          <div className="absolute inset-0 bg-halftone opacity-30 mix-blend-multiply pointer-events-none" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10 text-center">
            <Sticker variant="cream" className="-rotate-2 mb-5">
              <Clock className="w-3.5 h-3.5" /> Atenção
            </Sticker>
            <h2 className="font-display uppercase text-3xl sm:text-5xl text-cream [text-shadow:3px_3px_0_#221F1A] mb-4">
              Os ingressos vão esgotar!
            </h2>
            <p className="text-cream max-w-2xl mx-auto mb-8 leading-relaxed [text-shadow:1px_1px_0_#221F1A] text-sm sm:text-base">
              Precisamos comprar os ingressos do NEXT CAMP 26 o quanto antes para
              garantir o lugar de todo o GC NEXT ONLINE. Por isso, o prazo da
              campanha é <strong>{CAMPAIGN_DATA.donationDeadlineLabel}</strong>.
              Quanto antes você abençoar, mais cedo garantimos cada vaga. Não
              deixe para depois!
            </p>
            <div className="bg-charcoal/90 inline-block px-5 py-6 sm:px-8 border-4 border-cream shadow-hard">
              <p className="font-pixel text-[8px] sm:text-[10px] text-spark uppercase mb-4 tracking-wider">
                Tempo restante para abençoar
              </p>
              <Countdown targetIso={CAMPAIGN_DATA.donationDeadline} />
            </div>
          </div>
        </motion.section>

        {/* === CORPO (céu) === */}
        <div className="relative bg-sky-clouds">
          {/* === SEÇÃO 3: SOBRE / OUTDOOR OFICIAL === */}
          <motion.section
            {...sectionAnimation}
            id="about"
            className={`${sectionSpacing} relative z-10`}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="font-display uppercase text-3xl md:text-5xl text-cream [text-shadow:3px_3px_0_#221F1A] mb-4">
                  O que é o NEXT CAMP 26?
                </h2>
                <p className="text-cream max-w-3xl mx-auto leading-relaxed [text-shadow:1px_1px_0_#221F1A]">
                  Três dias de aventura, adoração, fogueira e encontro com Deus —
                  de 31 de julho a 02 de agosto de 2026.
                </p>
              </div>

              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Arte oficial (outdoor) */}
                <motion.div
                  {...sectionAnimation}
                  className="bg-cream rounded-md shadow-hard-lg p-2 border-4 border-charcoal rotate-1"
                >
                  <img
                    src={BILLBOARD_ART}
                    alt="Arte oficial do NEXT CAMP 26"
                    className="rounded-sm object-cover w-full"
                  />
                </motion.div>

                {/* Painel camo com a mensagem central */}
                <motion.div
                  {...sectionAnimation}
                  className="relative bg-camo-pixel rounded-md shadow-hard-lg p-6 sm:p-8 border-4 border-cream"
                >
                  <div className="relative z-10">
                    <h3 className="font-display uppercase text-2xl text-cream mb-5 flex items-center gap-2">
                      <Flame className="w-6 h-6 text-blaze" /> Estamos arrecadando
                    </h3>
                    <div className="space-y-4 text-cream/95 leading-relaxed text-sm md:text-base">
                      <p>
                        Somos um <strong>Grupo de Crescimento</strong> da{" "}
                        {CAMPAIGN_DATA.church}, unidos pelo propósito de crescer
                        na fé e fortalecer nossos relacionamentos com Deus e uns
                        com os outros.
                      </p>
                      <p>
                        Nossa meta é simples e ousada:{" "}
                        <strong>abençoar TODO o GC NEXT ONLINE</strong> para que
                        ninguém fique de fora dessa experiência que transforma
                        vidas.
                      </p>
                      <p>
                        Cada contribuição, grande ou pequena, é semente plantada
                        na vida da nossa galera e no Reino de Deus.
                      </p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Sticker variant="blaze">
                        <Calendar className="w-3.5 h-3.5" /> 31/07 a 02/08
                      </Sticker>
                      <Sticker variant="cream">
                        <MapPin className="w-3.5 h-3.5" /> Acampamento
                      </Sticker>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* === SEÇÃO 3.5: BANNER OFICIAL / LINE-UP === */}
          <motion.section
            {...sectionAnimation}
            className={`${sectionSpacing} relative z-10`}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <Sticker variant="blaze" className="-rotate-2 mb-4">
                  <Flame className="w-3.5 h-3.5" /> Banner oficial
                </Sticker>
                <h2 className="font-display uppercase text-3xl md:text-5xl text-cream [text-shadow:3px_3px_0_#221F1A] mb-4">
                  Quem vai estar no NEXT CAMP 26
                </h2>
                <p className="text-cream max-w-2xl mx-auto [text-shadow:1px_1px_0_#221F1A]">
                  Um line-up que vai marcar essa edição. Toque no banner para
                  conferir tudo no site oficial.
                </p>
              </div>
              <motion.a
                href={CAMPAIGN_DATA.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.01 }}
                className="block max-w-5xl mx-auto bg-cream rounded-md shadow-hard-lg p-2 sm:p-3 border-4 border-charcoal -rotate-1 hover:rotate-0 transition-transform"
              >
                <img
                  src="/nextcamp26-oficial.png"
                  alt="Banner oficial do NEXT CAMP 26 com o line-up de preletores e ministros de louvor"
                  className="rounded-sm w-full"
                />
              </motion.a>
            </div>
          </motion.section>

          {/* === SEÇÃO 4: PRA ONDE VAI SUA DOAÇÃO === */}
          <motion.section
            {...sectionAnimation}
            className={`${sectionSpacing} relative z-10`}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="font-display uppercase text-3xl md:text-5xl text-cream [text-shadow:3px_3px_0_#221F1A] mb-4">
                  Pra onde vai sua doação
                </h2>
                <p className="text-cream max-w-2xl mx-auto [text-shadow:1px_1px_0_#221F1A]">
                  Transparência total: tudo é destinado a fazer o NEXT CAMP 26
                  acontecer para todo o GC.
                </p>
              </div>
              <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { icon: "🎟️", title: "Ingressos", desc: "Garantir a vaga de cada um no acampamento." },
                  { icon: "🚌", title: "Transporte", desc: "Levar e trazer nossa galera com segurança." },
                  { icon: "🍳", title: "Alimentação", desc: "Energia pra viver cada momento intenso." },
                  { icon: "⛺", title: "Estrutura", desc: "Tudo pronto pra um encontro inesquecível." },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-cream text-charcoal border-4 border-charcoal shadow-hard p-4 sm:p-5 text-center ${
                      i % 2 === 0 ? "-rotate-1" : "rotate-1"
                    }`}
                  >
                    <div className="text-3xl sm:text-4xl mb-2">{item.icon}</div>
                    <h3 className="font-display uppercase text-base sm:text-lg mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm leading-snug">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* === SEÇÃO 5: MOMENTOS === */}
          <motion.section
            {...sectionAnimation}
            className={`${sectionSpacing} relative z-10`}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="font-display uppercase text-3xl md:text-5xl text-cream [text-shadow:3px_3px_0_#221F1A] mb-4">
                  Momentos que marcam
                </h2>
                <p className="text-cream max-w-2xl mx-auto [text-shadow:1px_1px_0_#221F1A]">
                  Reviva a presença de Deus e a comunhão da nossa galera.
                </p>
              </div>
              <Carousel
                images={carouselImages}
                title="Galeria de Momentos"
                autoPlay={true}
              />
            </div>
          </motion.section>

          {/* === SEÇÃO 6: DOAÇÃO === */}
          <motion.section
            {...sectionAnimation}
            id="donate"
            className={`${sectionSpacing} relative z-10`}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <Sticker variant="blaze" className="mb-4 -rotate-2">
                  <Heart className="w-3.5 h-3.5" /> Faça parte
                </Sticker>
                <h2 className="font-display uppercase text-3xl md:text-5xl text-cream [text-shadow:3px_3px_0_#221F1A] mb-4">
                  Doe via PIX
                </h2>
                <p className="text-cream max-w-2xl mx-auto [text-shadow:1px_1px_0_#221F1A]">
                  Estamos arrecadando para abençoar TODO o GC NEXT ONLINE.
                  Qualquer valor é bem-vindo e faz diferença!
                </p>
                <a
                  href={CAMPAIGN_DATA.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 font-pixel text-[8px] sm:text-[10px] text-spark hover:text-cream uppercase underline underline-offset-4"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Conferir valores no
                  site oficial
                </a>
              </div>

              {/* Abençoe uma inscrição por inteiro */}
              <div className="max-w-4xl mx-auto mb-6">
                <div className="bg-blaze bg-grunge-noise border-4 border-charcoal shadow-hard-lg p-5 sm:p-7 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-halftone opacity-25 mix-blend-multiply pointer-events-none" />
                  <div className="relative z-10">
                    <Sticker variant="cream" className="-rotate-2 mb-3">
                      <Flame className="w-3.5 h-3.5" /> Quer abençoar por inteiro?
                    </Sticker>
                    <h3 className="font-display uppercase text-2xl sm:text-3xl text-cream [text-shadow:2px_2px_0_#221F1A] mb-2">
                      Apadrinhe uma inscrição completa
                    </h3>
                    <p className="text-cream text-sm sm:text-base max-w-xl mx-auto mb-5 [text-shadow:1px_1px_0_#221F1A]">
                      O NEXT CAMP 26 está no <strong>{CAMPAIGN_DATA.lotLabel}</strong> e
                      uma inscrição inteira custa{" "}
                      <strong>
                        R$ {CAMPAIGN_DATA.fullTicketPrice.toLocaleString("pt-BR")},00
                      </strong>
                      . Se Deus tocar no seu coração, você pode bancar a vaga
                      completa de um jovem do nosso GC!
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96, y: 2 }}
                      onClick={() => copyPix(CAMPAIGN_DATA.fullTicketPrice)}
                      className="inline-flex items-center justify-center gap-2 bg-cream text-charcoal font-display uppercase text-lg py-3 px-7 border-4 border-charcoal shadow-hard hover:bg-spark transition-colors"
                    >
                      <Heart className="w-5 h-5" /> Abençoar uma inscrição (R${" "}
                      {CAMPAIGN_DATA.fullTicketPrice})
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="max-w-4xl mx-auto bg-army rounded-md shadow-hard-lg p-4 sm:p-8 border-4 border-cream">
                {/* Valores sugeridos */}
                <p className="font-pixel text-[9px] sm:text-[10px] text-spark uppercase text-center mb-4 tracking-wider">
                  Sugestões de valor (clique e o PIX é copiado)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {SUGGESTED_VALUES.map((v) => (
                    <motion.button
                      key={v}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96, y: 2 }}
                      onClick={() => copyPix(v)}
                      className="bg-cream text-charcoal font-display uppercase text-lg py-3 border-2 border-charcoal shadow-hard-sm hover:bg-spark transition-colors"
                    >
                      R$ {v}
                    </motion.button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="text-center">
                    <h3 className="font-display uppercase text-xl text-cream mb-4">
                      1. QR Code
                    </h3>
                    <div className="bg-white p-3 border-4 border-charcoal shadow-hard inline-block">
                      <img
                        src={qr}
                        alt="QR Code do PIX para doar ao NEXT CAMP 26"
                        className="w-44 h-44 sm:w-52 sm:h-52 mx-auto"
                      />
                    </div>
                    <p className="text-cream/80 text-xs mt-3">
                      Abra o app do seu banco e aponte a câmera.
                    </p>
                  </div>

                  <div className="flex flex-col justify-center">
                    <h3 className="font-display uppercase text-xl text-cream mb-4 text-center lg:text-left">
                      2. Chave PIX (aleatória)
                    </h3>
                    <div className="bg-charcoal/60 p-3 border-2 border-cream/30 mb-4 break-all text-center">
                      <p className="text-xs sm:text-sm text-cream font-mono leading-relaxed tracking-wide">
                        {pixKey}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97, y: 2 }}
                      onClick={() => copyPix()}
                      className="w-full flex items-center justify-center gap-2 bg-blaze text-cream font-display uppercase text-lg py-3 border-4 border-charcoal shadow-hard hover:bg-blaze-light transition-colors"
                    >
                      <Clipboard className="w-5 h-5" /> Copiar chave PIX
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* === SEÇÃO 7: COMPARTILHAR === */}
          <motion.section
            {...sectionAnimation}
            className={`${sectionSpacing} relative z-10`}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="font-display uppercase text-3xl md:text-5xl text-cream [text-shadow:3px_3px_0_#221F1A] mb-4">
                Não pode doar? Compartilhe!
              </h2>
              <p className="text-cream max-w-2xl mx-auto mb-8 [text-shadow:1px_1px_0_#221F1A]">
                Sua oração e seu compartilhamento também abençoam. Espalhe essa
                missão e siga o NEXT CAMP 26 no Instagram!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={shareWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-army text-cream font-display uppercase text-lg py-3 px-8 border-4 border-charcoal shadow-hard hover:bg-army-light transition-colors"
                >
                  <Share2 className="w-5 h-5" /> Compartilhar no WhatsApp
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blaze text-cream font-display uppercase text-lg py-3 px-8 border-4 border-charcoal shadow-hard hover:bg-blaze-light transition-colors"
                >
                  <Instagram className="w-5 h-5" /> Ver no Instagram
                </motion.a>
              </div>

              <div className="max-w-md mx-auto mt-10">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-cream rounded-md shadow-hard-lg p-2 border-4 border-charcoal -rotate-1 hover:rotate-0 transition-transform"
                >
                  <img
                    src={BANNER_ART}
                    alt="Post oficial do NEXT CAMP 26 no Instagram"
                    className="rounded-sm w-full"
                  />
                  <span className="block font-pixel text-[9px] text-charcoal py-2">
                    @ NEXT CAMP 26 · toque para abrir
                  </span>
                </a>
              </div>
            </div>
          </motion.section>

          {/* === SEÇÃO 8: FAQ === */}
          <motion.section
            {...sectionAnimation}
            id="faq"
            className={`${sectionSpacing} relative z-10`}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="font-display uppercase text-3xl md:text-5xl text-cream [text-shadow:3px_3px_0_#221F1A]">
                  Dúvidas frequentes
                </h2>
              </div>
              <div className="max-w-3xl mx-auto bg-charcoal-soft rounded-md shadow-hard-lg p-3 sm:p-6 border-4 border-cream">
                <FAQItem
                  question="Para onde vai a minha doação?"
                  answer={
                    <p>
                      Tudo o que arrecadamos é destinado a comprar os ingressos
                      do <strong>NEXT CAMP 26</strong> e abençoar TODO o GC NEXT
                      ONLINE. A liderança cuida de cada detalhe com total
                      transparência.
                    </p>
                  }
                />
                <FAQItem
                  question="Posso doar qualquer valor?"
                  answer={
                    <p>
                      <strong>Com certeza!</strong> Qualquer valor é muito
                      bem-vindo e faz uma diferença enorme. Use o QR Code ou a
                      chave PIX com a quantia que sentir no coração. E quem puder
                      abençoar uma inscrição inteira (R${" "}
                      {CAMPAIGN_DATA.fullTicketPrice.toLocaleString("pt-BR")},00,{" "}
                      {CAMPAIGN_DATA.lotLabel}) abençoa em dobro!
                    </p>
                  }
                />
                <FAQItem
                  question="Até quando posso ajudar?"
                  answer={
                    <p>
                      O prazo é{" "}
                      <strong>{CAMPAIGN_DATA.donationDeadlineLabel}</strong>. Os
                      ingressos estão esgotando e precisamos comprá-los o quanto
                      antes, então quanto mais cedo você contribuir, melhor!
                    </p>
                  }
                />
                <FAQItem
                  question="E se eu não puder doar agora?"
                  answer={
                    <p>
                      Você ainda pode abençoar muito:{" "}
                      <strong>ore por nós</strong> e{" "}
                      <strong>compartilhe</strong> esta página com seus amigos e
                      familiares. Espalhar a missão também faz acontecer!
                    </p>
                  }
                />
              </div>
            </div>
          </motion.section>

          {/* === SEÇÃO 9: LIDERANÇA / CONTATO === */}
          <motion.section
            {...sectionAnimation}
            id="contact"
            className={`${sectionSpacing} relative z-10 text-center`}
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <Sticker variant="army" className="mb-5">
                <ShieldCheck className="w-3.5 h-3.5" /> Liderança responsável
              </Sticker>
              <h2 className="font-display uppercase text-3xl md:text-5xl text-cream [text-shadow:3px_3px_0_#221F1A] mb-4">
                Fale com a gente
              </h2>
              <p className="text-cream max-w-2xl mx-auto mb-8 [text-shadow:1px_1px_0_#221F1A]">
                {CAMPAIGN_DATA.leaders.map((l) => l.name).join(" e ")} estão de
                braços abertos para te ajudar. Bora juntos fazer o NEXT CAMP 26
                acontecer!
              </p>
              <div className="flex flex-wrap gap-4 justify-center mb-8">
                {CAMPAIGN_DATA.leaders.map((l) => (
                  <Sticker key={l.name} variant="cream" className="!text-xs py-3">
                    <Sparkles className="w-3.5 h-3.5 text-blaze" />
                    <span className="flex flex-col items-start">
                      <span className="font-display text-sm normal-case">
                        {l.name}
                      </span>
                      <span className="text-[7px]">{l.role}</span>
                    </span>
                  </Sticker>
                ))}
              </div>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-army text-cream font-display uppercase text-lg py-3 px-8 border-4 border-charcoal shadow-hard hover:bg-army-light transition-colors"
              >
                <Phone className="w-5 h-5" /> Chamar no WhatsApp
              </motion.a>
            </div>
          </motion.section>
        </div>

        {/* === RODAPÉ === */}
        <footer className="relative z-10 bg-grass-pixel pt-10">
          <div className="bg-charcoal text-cream py-8 pb-24 sm:pb-8 text-center border-t-4 border-army-light">
            <div className="container mx-auto px-4">
              <p className="font-display uppercase text-2xl text-cream">
                NEXT CAMP 26
              </p>
              <p className="font-pixel text-[9px] text-spark mt-2">
                31 de Julho a 02 de Agosto de 2026
              </p>
              <p className="text-sm text-cream/70 mt-3">
                {CAMPAIGN_DATA.groupName} · {CAMPAIGN_DATA.church}
              </p>
              <p className="text-xs text-cream/60 mt-1">
                Liderança:{" "}
                {CAMPAIGN_DATA.leaders.map((l) => l.name).join(" & ")}
              </p>
              <p className="text-[10px] text-cream/50 mt-4">
                © {new Date().getFullYear()} — Feito com fé para o Reino de Deus.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* === CTA FIXO MOBILE === */}
      <AnimatePresence>
        {showStickyCta && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 w-full z-50 bg-charcoal border-t-2 border-blaze p-2.5 flex gap-2 sm:hidden"
          >
            <a
              href="#donate"
              className="flex-1 flex items-center justify-center gap-1.5 bg-blaze text-cream font-display uppercase text-sm py-3 border-2 border-cream"
            >
              <Heart className="w-4 h-4" /> Doar via PIX
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-army text-cream font-display uppercase text-sm py-3 border-2 border-cream"
            >
              <Phone className="w-4 h-4" /> WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NextCampLP;
