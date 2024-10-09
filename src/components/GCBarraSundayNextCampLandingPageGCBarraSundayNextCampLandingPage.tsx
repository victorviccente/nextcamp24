import { PhoneIcon, CalendarIcon, UsersIcon, ChurchIcon, CreditCardIcon, HeartIcon, ImageIcon } from "lucide-react"
import { FaHandsHelping} from 'react-icons/fa'
import nextimage from '../assets/next1.jpg'

export default function GCBarraSundayNextCampLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9A31A] to-[#EDA332] text-gray-800">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-lg">Next Camp 2024</h1>
          <p className="text-3xl text-white font-semibold mb-2 drop-shadow-md">GC BARRA SUNDAY</p>
          <p className="text-xl text-white mt-2 drop-shadow-sm">Igreja Lagoinha Barra</p>
        </header>

        <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 md:p-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#00A88F] mb-8 text-center">Ajude Nossos Jovens a Participar!</h2>
            
            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <div className="bg-[#00A88F] text-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <UsersIcon className="mr-2 h-6 w-6" />
                  Precisamos ajudar 10 jovens!
                </h3>
                <p className="text-sm">
                  Temos uma meta importante! Queremos garantir que 10 jovens possam vivenciar 
                  esta experiência transformadora no Next Camp 2024. Sua ajuda é fundamental!
                </p>
              </div>

              <div className="bg-[#F9A31A] text-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <CreditCardIcon className="mr-2 h-6 w-6" />
                  Valor por jovem: R$595
                </h3>
                <p className="text-sm">
                  Cada contribuição conta! O custo do acampamento é de R$595 por pessoa. 
                  Você pode ajudar com qualquer valor para chegarmos ao nosso objetivo.
                </p>
              </div>
            </div>  

            <div className="bg-[#EDA332] text-white p-6 rounded-xl shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <CalendarIcon className="mr-2 h-6 w-6" />
                Prazo: 24/10/2023
              </h3>
              <p className="text-sm">
                O tempo está passando! Temos até 24 de outubro para arrecadar os fundos necessários. 
                Sua contribuição imediata pode fazer toda a diferença na vida desses jovens.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
              <div className="bg-[#00A88F] text-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <HeartIcon className="mr-2 h-6 w-6" />
                  Abençoe com o que tocar seu coração
                </h3>
                <p className="text-sm">
                  Você pode abençoar com o valor que Deus tocar em seu coração. Toda contribuição, 
                  independente do valor, é preciosa e fará diferença na vida de um jovem.
                </p>
              </div>

              <div className="bg-[#F9A31A] text-white p-6 rounded-xl shadow-md">
  <h3 className="text-xl font-semibold mb-3 flex items-center">
    <FaHandsHelping className="mr-2 h-6 w-6" /> {/* Ícone adicionado aqui */}
    Semear na vida de um jovem
  </h3>
  <p className="text-sm">
    Plante sementes na vida de um jovem, permitindo que ele viva experiências únicas com Deus no sobrenatural.
  </p>
</div>
            </div>

            <blockquote className="italic text-gray-700 border-l-4 border-[#00A88F] pl-4 py-2 mb-8 bg-gray-100 rounded-r-lg">
              <p className="mb-2">"E Deus, que dá a semente para semear e o pão para comer, também dará a vocês todas as sementes que vocês precisam. 
              Ele fará com que elas cresçam e deem uma grande colheita, como resultado da generosidade de vocês."</p>
              <footer className="text-right text-sm">— 2 Coríntios 9:10 (NTLH)</footer>
            </blockquote>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-[#00A88F] mb-4 flex items-center">
                <ImageIcon className="mr-2 h-6 w-6" />
                Next Camp 2023
              </h3>
              <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg">
              <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg">
              <img
                src={nextimage}
                alt="Descrição da imagem"
                className="w-full h-full object-cover rounded-xl"
              />
             </div>
              </div>
              <p className="text-gray-700 mt-4 text-center italic">
                Veja como foi incrível o Next Camp do ano passado! Ajude mais jovens a terem essa experiência em 2024.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-[#00A88F] mb-4">O que é o Next Camp?</h3>
              <p className="text-gray-700 mb-4">
                O Next Camp é o acampamento anual dos jovens da Lagoinha Barra. É uma oportunidade única para:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 bg-gray-100 p-4 rounded-lg">
                <li>Fortalecer a fé e o relacionamento com Deus</li>
                <li>Criar laços duradouros com outros jovens da igreja</li>
                <li>Participar de workshops e palestras inspiradoras</li>
                <li>Desfrutar de momentos de adoração e reflexão</li>
                <li>Vivenciar experiências inesquecíveis em comunidade</li>
              </ul>
            </div>

            <div className="bg-[#EDA332] text-white p-6 rounded-xl shadow-md mb-8">
              <h3 className="text-xl font-semibold mb-3 flex items-center">
                <ChurchIcon className="mr-2 h-6 w-6" />
                GC BARRA SUNDAY
              </h3>
              <p className="text-sm">
                Como parte do GC BARRA SUNDAY da Igreja Lagoinha Barra, queremos garantir que todos os nossos 
                10 jovens tenham a chance de participar deste evento transformador. Sua contribuição ajudará a 
                cobrir os custos de inscrição, transporte e acomodação para aqueles que precisam de apoio financeiro.
              </p>
            </div>

            <div className="text-center">
            <a href="https://api.whatsapp.com/send?phone=5521973779257&text=OL%C3%81!!%20GOSTARIA%20DE%20AJUDAR%20NO%20NEXT%20CAMP%202024!!%0A%0AComo%20posso%20ajudar%3F%3F" target="_blank" rel="noopener noreferrer">
              <button className="bg-[#00A88F] hover:bg-[#008C76] text-white text-lg font-bold py-4 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg flex items-center justify-center mx-auto">
                <PhoneIcon className="w-6 h-6 mr-2" />
                Contate-nos via WhatsApp
              </button>
            </a>
              <p className="mt-4 text-gray-600">
                Clique no botão acima ou envie uma mensagem para: <br />
                <span className="font-semibold text-lg">(21) 97377-9257</span>
                <br />
                <span className="font-semibold text-lg">(22) 99287-0920</span>
              </p>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  )
}