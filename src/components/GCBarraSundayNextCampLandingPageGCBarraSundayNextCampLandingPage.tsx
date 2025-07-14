import React, { useState, useEffect, useRef } from 'react';
import { Phone, Users, CreditCard, Clipboard, Target, ArrowDown, Heart, CheckCircle, Star, Calendar, Clock } from "lucide-react";
import { motion } from 'framer-motion';

// --- ARQUIVOS LOCAIS ---
// Certifique-se que estas imagens existem nos caminhos especificados.
import next from '../assets/next1.jpg'
import qr from '../assets/qr-code.jpg'


// --- TIPAGENS ---
interface CampaignData {
  eventName: string;
  groupName: string;
  totalYouth: number;
  youthHelped: number;
  costPerYouth: number;
  pixKey: string;
  contactPhone: string;
  eventDate: string;
  registrationDeadline: string;
  ageRequirement: string;
  leaders: { name: string }[];
}

interface StickyProgressProps {
    percentage: number;
    raised: number;
}

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  show: boolean;
  onClose: () => void;
}

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}


// --- DADOS DA CAMPANHA ---
const CAMPAIGN_DATA: CampaignData = {
  eventName: "Next Camp 2025",
  groupName: "GC NEXT ONLINE",
  totalYouth: 7,        // ATUALIZADO
  youthHelped: 5,       // ATUALIZADO
  costPerYouth: 625,
  pixKey: "00020126330014BR.GOV.BCB.PIX0111190070187105204000053039865802BR5922VICTOR CALISTO VICENTE6014RIO DE JANEIRO622605223LqIwM8XfbZKjjSy0MiTDC63040A8D",
  contactPhone: "5521973779257",
  eventDate: "1, 2 e 3 de Agosto de 2025",
  registrationDeadline: "27 de Julho de 2025",
  ageRequirement: "A partir de 18 anos",
  leaders: [
    { name: 'Victor Vicente' },
    { name: 'Mirelly Santos' }
  ]
};

// --- COMPONENTES AUXILIARES ---

const Toast: React.FC<ToastProps> = ({ message, type, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      <div className="flex items-center gap-2">
        {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <span>❌</span>}
        {message}
      </div>
    </div>
  );
};

const StickyProgress: React.FC<StickyProgressProps> = ({ percentage, raised }) => (
  <motion.div 
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    exit={{ y: -100 }}
    transition={{ duration: 0.3 }}
    className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-lg shadow-lg z-40"
  >
    <div className="container mx-auto px-4 py-3">
      <div className="flex items-center gap-4">
        <div className="text-sm font-bold text-[#2706b7] whitespace-nowrap">
          <span className='text-lg'>{percentage}%</span> concluído
        </div>
        <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-[#2706b7] to-[#4c1d95] h-full rounded-full shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>
        <div className="text-sm font-bold text-gray-700 whitespace-nowrap">
          R$ {raised.toLocaleString('pt-BR')}
        </div>
      </div>
    </div>
  </motion.div>
);

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="border-b border-white/20">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center text-left py-5 px-2 text-white hover:bg-white/10 transition-colors duration-300 rounded-t-lg"
        >
          <span className="text-base sm:text-lg font-semibold">{question}</span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ArrowDown className="w-5 h-5" />
          </motion.div>
        </button>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0 text-white/90 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </div>
    );
  };


// --- COMPONENTE PRINCIPAL ---
const NextCampLP: React.FC = () => {
  const { totalYouth, youthHelped, costPerYouth, pixKey } = CAMPAIGN_DATA;
  const totalNeeded: number = totalYouth * costPerYouth;
  const totalRaised: number = youthHelped * costPerYouth;
  const percentageRaised: number = Math.min(100, Math.round((totalRaised / totalNeeded) * 100));
  const remaining: number = totalNeeded - totalRaised;

  const [isStickyVisible, setIsStickyVisible] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  const heroSectionRef = useRef<HTMLElement>(null);

  const heroBackgroundImage: string = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80";
  const contentBackgroundImage: string = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsStickyVisible(!entry.isIntersecting && entry.boundingClientRect.bottom < 0),
      { threshold: 0 }
    );
    const currentRef = heroSectionRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(pixKey).then(() => {
      setToast({ show: true, message: "Chave PIX copiada com sucesso!", type: 'success' });
    }, () => {
      setToast({ show: true, message: "Erro ao copiar a chave.", type: 'error' });
    });
  };

  const sectionAnimation = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.8, ease: "easeOut" }
  } as const;
 
  return (
    <>
      <Toast 
        message={toast.message} 
        type={toast.type} 
        show={toast.show} 
        onClose={() => setToast({ ...toast, show: false })}
      />
     
      {isStickyVisible && <StickyProgress percentage={percentageRaised} raised={totalRaised} />}
     
      <div className="min-h-screen bg-[#2706b7] text-white font-sans">
       
        {/* === SEÇÃO 1: HERO === */}
        <section 
          ref={heroSectionRef} 
          className="relative min-h-screen flex flex-col items-center justify-center text-center text-white px-4 sm:px-6 lg:px-8"
          style={{ 
            backgroundImage: `url('${heroBackgroundImage}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-t from-[#2706b7] to-[#2706b7]/60"></div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-xs font-bold text-white uppercase tracking-widest px-4 py-2 rounded-full mb-6 sm:mb-8 border border-white/30">
              <Star className="w-4 h-4" />
              {CAMPAIGN_DATA.groupName}
            </div>
           
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Next Camp<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                2025
              </span>
            </h1>
           
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              <strong>OS TRÊS MELHORES DIAS DA SUA VIDA!</strong><br />
              Junte-se a nós na missão de levar <strong>{CAMPAIGN_DATA.totalYouth} jovens</strong> para viver uma experiência transformadora.
            </p>
           
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#donate" 
                className="w-full sm:w-auto bg-white text-[#2706b7] font-bold py-4 px-8 rounded-full text-lg transition-colors duration-300 shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50"
              >
                🔥 Quero Apoiar um Jovem
              </motion.a>
              
            </div>
           
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[{label: "Jovens Apoiados", value: CAMPAIGN_DATA.youthHelped, color: "text-yellow-400"}, {label: "Meta Atingida", value: `${percentageRaised}%`, color: "text-green-400"}, {label: "Restante", value: `R$ ${remaining.toLocaleString('pt-BR')}`, color: "text-orange-400"}].map((stat, i) => (
                <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * i + 0.5}}
                    className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
         
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ArrowDown className="w-8 h-8 text-white/70"/>
          </motion.div>
        </section>

        <div className="relative" style={{ backgroundImage: `url('${contentBackgroundImage}')`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
          <div className="absolute inset-0 bg-[#2706b7]/95 backdrop-blur-md"></div>
         
          {/* === SEÇÃO 2: SOBRE O NEXT CAMP === */}
          <motion.section {...sectionAnimation} id="about" className="py-16 sm:py-24 relative z-10 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                  O Que É o Next Camp?
                </h2>
                <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  Três dias intensos de <strong>crescimento espiritual</strong>, <strong>adoração</strong> e <strong>comunhão</strong> que vão marcar uma geração!
                </p>
              </div>
             
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <motion.div {...sectionAnimation} className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-white/20">
                  <img src={next} alt="Jovens em adoração no Next Camp" className="rounded-xl object-cover w-full h-full" />
                </motion.div>

                <motion.div {...sectionAnimation} className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">
                    ⭐ Sobre o GC Next Online
                  </h3>
                  <div className="space-y-4 text-white/90 leading-relaxed text-left">
                    <p>Somos um <strong>Grupo de Crescimento</strong> da Igreja Novos Começos, unidos pelo propósito de crescer na fé e fortalecer nossos relacionamentos com Deus e uns com os outros.</p>
                    <p>Nossa missão é criar um ambiente onde jovens possam:</p>
                    <ul className="space-y-2 pl-5 text-white/80 list-disc">
                        <li>Desenvolver uma fé sólida e madura</li>
                        <li>Construir relacionamentos verdadeiros</li>
                        <li>Descobrir seu propósito em Deus</li>
                        <li>Servir ao Reino com excelência</li>
                    </ul>
                    <div className="mt-6 p-4 bg-white/20 rounded-lg border border-white/30">
                      <p className="text-white font-semibold text-center">💙 Estamos aguardando com grandes expectativas! 🙏</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* === SEÇÃO 3: PROGRESSO DETALHADO === */}
          <motion.section {...sectionAnimation} className="py-16 sm:py-24 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                  Nossa Jornada Até Aqui
                </h2>
                <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  Cada doação nos aproxima do nosso objetivo de levar <strong>{totalYouth} jovens</strong> para viver os três melhores dias de suas vidas!
                </p>
              </div>
             
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-white">Progresso da Campanha</span>
                    <span className="text-2xl font-bold text-yellow-400">{percentageRaised}%</span>
                  </div>
                 
                  <div className="w-full bg-white/20 rounded-full h-6 mb-6 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentageRaised}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                    />
                  </div>
                 
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                      <div className="text-3xl font-bold text-green-400 mb-2">R$ {totalRaised.toLocaleString('pt-BR')}</div>
                      <div className="text-sm text-white/80 font-medium">Arrecadado</div>
                    </div>
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                      <div className="text-3xl font-bold text-blue-400 mb-2">R$ {totalNeeded.toLocaleString('pt-BR')}</div>
                      <div className="text-sm text-white/80 font-medium">Meta Total</div>
                    </div>
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
                      <div className="text-3xl font-bold text-orange-400 mb-2">R$ {remaining.toLocaleString('pt-BR')}</div>
                      <div className="text-sm text-white/80 font-medium">Falta Arrecadar</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* === SEÇÃO 4: COMO FUNCIONA === */}
          <motion.section {...sectionAnimation} className="py-16 sm:py-24 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                    Como Sua Doação Transforma Vidas
                    </h2>
                    <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
                    Transparência total: veja exatamente como cada real é investido na transformação de vidas.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
                    <div className="space-y-6">
                        {[
                            { icon: Users, title: "Experiência Completa", description: `Cada um dos ${totalYouth} jovens viverá 3 dias intensos de crescimento, adoração e ministração.` },
                            { icon: CreditCard, title: "Investimento Direcionado", description: `Os R$ ${costPerYouth} por jovem cobrem inscrição, alimentação, hospedagem e transporte. Tudo incluído!` },
                            { icon: Heart, title: "Impacto Eterno", description: "Sua contribuição vai além do acampamento. É um investimento na formação de discípulos e na eternidade." }
                        ].map((item, index) => (
                            <motion.div key={index} {...sectionAnimation} transition={{ ...sectionAnimation.transition, delay: index * 0.2 }} className="flex items-start gap-4 p-6 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 hover:bg-white/20 transition-all duration-300">
                                <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <item.icon className="w-6 h-6 text-white"/>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-white/90 leading-relaxed">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div {...sectionAnimation} className="relative">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                            <h3 className="text-2xl font-bold text-white mb-6 text-center">Valores Sugeridos</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/20 rounded-lg"><span className="font-medium text-white">Abençoe 1 jovem</span><span className="font-bold text-yellow-400">R$ {costPerYouth}</span></div>
                                <div className="flex items-center justify-between p-4 bg-white/20 rounded-lg"><span className="font-medium text-white">Meia bênção</span><span className="font-bold text-yellow-400">R$ {costPerYouth / 2}</span></div>
                                <div className="flex items-center justify-between p-4 bg-white/20 rounded-lg"><span className="font-medium text-white">Contribuição livre</span><span className="font-bold text-yellow-400">Qualquer valor ❤️</span></div>
                            </div>
                            <div className="mt-6 p-4 bg-white/20 rounded-lg border border-white/30">
                                <p className="text-sm text-white font-medium text-center">🔥 Todo valor faz diferença e é bem-vindo!</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
          </motion.section>
          
          {/* === SEÇÃO 5: DOAÇÃO === */}
          <motion.section {...sectionAnimation} id="donate" className="py-16 sm:py-24 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <Target className="w-16 h-16 text-white mx-auto mb-4"/>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                  Faça Parte Desta Missão
                </h2>
                <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
                  Sua doação é um investimento na vida de um jovem. Escolha a forma que preferir e faça parte desta transformação.
                </p>
                <div className="mt-4 bg-red-500/20 backdrop-blur-sm rounded-lg p-3 border border-red-400/30 max-w-md mx-auto">
                  <p className="text-red-200 font-bold text-sm">
                    ⏰ PRAZO LIMITE: {CAMPAIGN_DATA.registrationDeadline}
                  </p>
                </div>
              </div>
             
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/20">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-4">1. PIX QR Code</h3>
                        <div className="bg-white p-2 sm:p-4 rounded-xl shadow-lg inline-block border-4 border-white/50">
                            <img src={qr} alt="QR Code PIX" className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-lg" />
                        </div>
                        <p className="text-white/80 text-sm mt-4">Abra o app do seu banco e aponte a câmera para doar.</p>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h3 className="text-xl font-bold text-white mb-4 text-center lg:text-left">2. PIX Copia e Cola</h3>
                        <div className="bg-black/30 p-4 rounded-lg mb-4 break-all text-left">
                            <p className="text-xs text-white/70 font-mono">{pixKey}</p>
                        </div>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={copyToClipboard} className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-black hover:bg-yellow-400 font-bold py-4 px-6 rounded-full text-lg transition-colors duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-yellow-500/50">
                            <Clipboard className="w-5 h-5" />
                            Copiar Chave PIX
                        </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
          
          {/* === SEÇÃO 6: DÚVIDAS FREQUENTES (FAQ) === */}
          <motion.section {...sectionAnimation} id="faq" className="py-16 sm:py-24 relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                  Dúvidas Frequentes
                </h2>
              </div>
              <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-4 sm:p-6 border border-white/20">
                <FAQItem
                  question="Como sei que minha doação foi usada corretamente?"
                  answer={<p>A campanha é liderada pelo <strong>{CAMPAIGN_DATA.groupName}</strong>, um grupo de crescimento da Igreja Novos Começos. Mantemos total transparência, e o progresso é atualizado em tempo real nesta página.</p>}
                />
                <FAQItem
                  question="Posso doar um valor diferente dos sugeridos?"
                  answer={<p><strong>Com certeza!</strong> Qualquer valor é bem-vindo e fará uma grande diferença. Use o QR Code ou o PIX Copia e Cola para doar a quantia que sentir em seu coração.</p>}
                />
                <FAQItem
                  question="E se a meta for ultrapassada?"
                  answer={<p>Glória a Deus! Se ultrapassarmos a meta, o valor excedente será usado para abençoar <strong>ainda mais jovens</strong> que desejam participar ou para investir em melhorias para o acampamento.</p>}
                />
              </div>
            </div>
          </motion.section>

          {/* === SEÇÃO 7: CONTATO === */}
          <motion.section {...sectionAnimation} id="contact" className="py-16 sm:py-24 relative z-10 text-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ficou com Alguma Dúvida?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-6">
                Nossos líderes estão disponíveis para te ajudar. Fale conosco!
              </p>
              <div className='mb-8 text-white/90 text-lg'>
                <p><strong>Victor Vicente</strong> e <strong>Mirelly Santos</strong></p>
              </div>
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href={`https://wa.me/${CAMPAIGN_DATA.contactPhone}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-green-500 text-white hover:bg-green-600 font-bold py-4 px-8 rounded-full text-lg transition-colors duration-300 shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-500/50">
                <Phone className="w-6 h-6" />
                Chamar no WhatsApp
              </motion.a>
            </div>
          </motion.section>
        </div>

        {/* === SEÇÃO 8: RODAPÉ === */}
        <footer className="relative z-10 bg-[#1e058d] text-white py-8 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="font-bold text-lg">{CAMPAIGN_DATA.groupName}</p>
            <div className="text-sm text-white/70 mt-2">
                <p>Liderança: {CAMPAIGN_DATA.leaders.map(l => l.name).join(' & ')}</p>
                <p>© {new Date().getFullYear()} - Todos os direitos reservados.</p>
            </div>
            <p className="text-xs text-white/50 mt-4">
              Construído com ❤️ para o Reino de Deus.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default NextCampLP;