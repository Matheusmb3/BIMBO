import { DollarSign, Settings, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

type ClosingScreenProps = {
  onBack: () => void;
};

export function ClosingScreen({ onBack }: ClosingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-[1400px] mx-auto space-y-10">
        
        <div className="text-center space-y-3 pt-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#FF4F00]">Encerramento</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-black">
            Valor gerado pela operação preditiva
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transformando dados em resultado financeiro e eficiência operacional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="rounded-[28px] bg-white border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#FF4F00] font-bold">Bloco 1</p>
                <h2 className="text-xl font-black tracking-tight text-black">Investimento estimado</h2>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-gray-600 mb-6">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#FF4F00] shrink-0" />
                <span>Tecnologia e integração de dados</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#FF4F00] shrink-0" />
                <span>Implementação da torre de controle</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#FF4F00] shrink-0" />
                <span>Treinamento das equipes</span>
              </li>
            </ul>
            <div className="rounded-2xl bg-black text-white p-4 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-1">Valor</p>
              <p className="text-2xl font-black">R$ 500 mil a R$ 1 milhão</p>
            </div>
          </div>

          <div className="rounded-[28px] bg-white border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center">
                <Settings size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#FF4F00] font-bold">Bloco 2</p>
                <h2 className="text-xl font-black tracking-tight text-black">Ganhos operacionais</h2>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#FF4F00] shrink-0" />
                <span><strong>↓ até 30%</strong> de ruptura</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#FF4F00] shrink-0" />
                <span><strong>↓ até 20%</strong> de custo logístico</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#FF4F00] shrink-0" />
                <span><strong>↓</strong> desperdício de produtos perecíveis</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#FF4F00] shrink-0" />
                <span><strong>↑</strong> eficiência operacional</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#FF4F00] shrink-0" />
                <span><strong>↑</strong> nível de serviço</span>
              </li>
            </ul>
          </div>

          <div className="rounded-[28px] bg-white border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#FF4F00] font-bold">Bloco 3</p>
                <h2 className="text-xl font-black tracking-tight text-black">Retorno esperado</h2>
              </div>
            </div>
            <ul className="space-y-3 text-sm text-gray-600 mb-6">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#FF4F00] shrink-0" />
                <span><strong>Payback:</strong> 6 a 12 meses</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#FF4F00] shrink-0" />
                <span>Aumento de receita (menos ruptura)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#FF4F00] shrink-0" />
                <span>Redução de perdas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-2 w-2 rounded-full bg-[#FF4F00] shrink-0" />
                <span>Otimização da operação</span>
              </li>
            </ul>
            <div className="rounded-2xl bg-[#FF4F00] text-black p-4 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-black/70 mb-1">ROI</p>
              <p className="text-2xl font-black">Alto retorno em 12 meses</p>
            </div>
          </div>

        </div>

        <div className="text-center py-8">
          <p className="text-2xl md:text-3xl font-black tracking-tight text-black">
            "Quem antecipa, vende mais, perde menos e opera melhor."
          </p>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-3 rounded-full bg-black px-8 py-4 text-base font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all hover:bg-gray-800 hover:scale-105"
          >
            <CheckCircle size={20} />
            Encerrar apresentação
            <ArrowRight size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}