import React, { useState } from 'react';
import { Button, Input } from './UIComponents';
import { 
  CreditCard, Smartphone, Heart, Check, Loader2, Globe, QrCode, DollarSign 
} from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = 'VISA' | 'MASTERCARD' | 'PAYPAL' | 'EXPRESS' | 'AFRIMONEY' | 'UNITEL_MONEY' | 'PAYPAY';

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'AMOUNT' | 'METHOD' | 'DETAILS' | 'PROCESSING' | 'SUCCESS'>('AMOUNT');
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    identifier: '', // Phone or Card number
    name: ''
  });

  if (!isOpen) return null;

  const handleAmountSelect = (val: string) => {
    setAmount(val);
    setStep('METHOD');
  };

  const handleMethodSelect = (m: PaymentMethod) => {
    setMethod(m);
    setStep('DETAILS');
  };

  const processPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('PROCESSING');

    // SIMULATION OF PAYMENT GATEWAY INTERACTION
    // In a real app, this is where you call your backend API
    setTimeout(() => {
      setStep('SUCCESS');
    }, 3000);
  };

  const reset = () => {
    setStep('AMOUNT');
    setAmount('');
    setMethod(null);
    setPaymentDetails({ identifier: '', name: '' });
    onClose();
  };

  const getMethodIcon = (m: PaymentMethod) => {
    switch (m) {
      case 'VISA': case 'MASTERCARD': return <CreditCard className="w-6 h-6" />;
      case 'PAYPAL': return <Globe className="w-6 h-6" />;
      case 'PAYPAY': return <QrCode className="w-6 h-6" />;
      default: return <Smartphone className="w-6 h-6" />;
    }
  };

  const getMethodName = (m: PaymentMethod) => {
    switch (m) {
        case 'EXPRESS': return 'Multicaixa Express';
        case 'UNITEL_MONEY': return 'Unitel Money';
        case 'PAYPAY': return 'PayPay África';
        default: return m.charAt(0) + m.slice(1).toLowerCase();
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-800 rounded-2xl w-full max-w-lg border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 p-6 text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">✕</button>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
            <Heart className="w-6 h-6 text-white fill-current animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white">Fazer uma Oferta</h2>
          <p className="text-white/80 text-sm mt-1">Semeie no reino e transforme vidas.</p>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* STEP 1: AMOUNT */}
          {step === 'AMOUNT' && (
            <div className="space-y-6">
              <p className="text-slate-300 text-center text-sm">Selecione ou digite o valor da sua oferta (KZ)</p>
              <div className="grid grid-cols-2 gap-4">
                {['1000', '2000', '5000', '10000'].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleAmountSelect(val)}
                    className="py-4 rounded-xl border border-slate-600 bg-slate-700/50 hover:bg-teal-500/20 hover:border-teal-500 hover:text-teal-400 transition-all font-bold text-lg"
                  >
                    {val} KZ
                  </button>
                ))}
              </div>
              <div className="relative">
                 <span className="absolute left-4 top-3.5 text-slate-400 font-bold">KZ</span>
                 <input 
                    type="number" 
                    placeholder="Outro valor" 
                    className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pl-12 pr-4 text-white focus:border-teal-500 focus:outline-none"
                    onKeyDown={(e) => {
                        if(e.key === 'Enter') handleAmountSelect(e.currentTarget.value);
                    }}
                 />
              </div>
            </div>
          )}

          {/* STEP 2: METHOD */}
          {step === 'METHOD' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-teal-400 font-bold text-xl">{amount} KZ</span>
                 <button onClick={() => setStep('AMOUNT')} className="text-slate-400 text-sm hover:text-white">Alterar</button>
              </div>
              <p className="text-slate-300 text-sm">Como deseja ofertar?</p>
              
              <div className="space-y-3">
                {/* Angolan Methods */}
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4">Angola</p>
                <button onClick={() => handleMethodSelect('EXPRESS')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-700/50 border border-slate-600 hover:bg-orange-500/10 hover:border-orange-500 transition-all group">
                   <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-orange-600 font-bold text-xs shadow">MCX</div>
                   <span className="font-medium text-white group-hover:text-orange-400">Multicaixa Express</span>
                </button>
                <button onClick={() => handleMethodSelect('UNITEL_MONEY')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-700/50 border border-slate-600 hover:bg-orange-600/10 hover:border-orange-600 transition-all group">
                   <div className="w-10 h-10 bg-orange-600 rounded flex items-center justify-center text-white font-bold text-xs shadow">UM</div>
                   <span className="font-medium text-white group-hover:text-orange-500">Unitel Money</span>
                </button>
                <button onClick={() => handleMethodSelect('AFRIMONEY')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-700/50 border border-slate-600 hover:bg-red-600/10 hover:border-red-600 transition-all group">
                   <div className="w-10 h-10 bg-black rounded flex items-center justify-center text-white font-bold text-xs shadow overflow-hidden border border-white/10">
                      <span className="text-[8px]">Afri</span>
                   </div>
                   <span className="font-medium text-white group-hover:text-red-500">Afrimoney</span>
                </button>
                 <button onClick={() => handleMethodSelect('PAYPAY')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-700/50 border border-slate-600 hover:bg-blue-500/10 hover:border-blue-500 transition-all group">
                   <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs shadow">PP</div>
                   <span className="font-medium text-white group-hover:text-blue-400">PayPay África</span>
                </button>

                {/* International Methods */}
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-4">Internacional</p>
                <div className="grid grid-cols-3 gap-3">
                    <button onClick={() => handleMethodSelect('VISA')} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-700/30 border border-slate-600 hover:bg-blue-900/20 hover:border-blue-500">
                        <CreditCard className="text-blue-400" />
                        <span className="text-xs">Visa</span>
                    </button>
                    <button onClick={() => handleMethodSelect('MASTERCARD')} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-700/30 border border-slate-600 hover:bg-red-900/20 hover:border-red-500">
                        <div className="flex -space-x-1"><div className="w-4 h-4 rounded-full bg-red-500/80"></div><div className="w-4 h-4 rounded-full bg-yellow-500/80"></div></div>
                        <span className="text-xs">Master</span>
                    </button>
                    <button onClick={() => handleMethodSelect('PAYPAL')} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-700/30 border border-slate-600 hover:bg-blue-500/20 hover:border-blue-400">
                        <Globe className="text-blue-400" />
                        <span className="text-xs">PayPal</span>
                    </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS */}
          {step === 'DETAILS' && method && (
            <form onSubmit={processPayment} className="space-y-6">
               <div className="flex justify-between items-center mb-2">
                 <div className="flex items-center gap-2">
                    {getMethodIcon(method)}
                    <span className="text-white font-bold">{getMethodName(method)}</span>
                 </div>
                 <button type="button" onClick={() => setStep('METHOD')} className="text-slate-400 text-sm hover:text-white">Alterar</button>
              </div>

              {['VISA', 'MASTERCARD'].includes(method) ? (
                 <>
                    <Input label="Número do Cartão" placeholder="0000 0000 0000 0000" required />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Validade" placeholder="MM/AA" required />
                        <Input label="CVV" placeholder="123" required />
                    </div>
                    <Input label="Nome no Cartão" placeholder="Como aparece no cartão" required />
                 </>
              ) : method === 'PAYPAL' ? (
                  <div className="text-center py-8">
                      <p className="text-slate-300 mb-4">Será redirecionado para o PayPal para concluir a oferta segura.</p>
                      <Button className="w-full">Ir para PayPal</Button>
                  </div>
              ) : (
                  // Mobile Money Inputs (Express, Unitel, Afrimoney, PayPay)
                  <>
                     <Input 
                        label="Número de Telefone" 
                        type="tel" 
                        placeholder={method === 'EXPRESS' ? "Número associado ao banco" : "9XX XXX XXX"} 
                        required 
                        value={paymentDetails.identifier}
                        onChange={(e) => setPaymentDetails({...paymentDetails, identifier: e.target.value})}
                     />
                     <p className="text-xs text-slate-400 bg-slate-900/50 p-3 rounded border border-slate-700">
                        {method === 'EXPRESS' && "Você receberá uma notificação no seu aplicativo Multicaixa Express para confirmar."}
                        {method === 'UNITEL_MONEY' && "Confirme a transação no seu telemóvel via USSD ou App Unitel Money."}
                        {method === 'AFRIMONEY' && "Insira o seu PIN Afrimoney quando solicitado no telemóvel."}
                        {method === 'PAYPAY' && "Abra o App PayPay ou aguarde o push notification."}
                     </p>
                  </>
              )}

              {method !== 'PAYPAL' && (
                 <Button type="submit" className="w-full py-4 text-lg shadow-xl shadow-teal-500/20">
                    Confirmar Oferta ({amount} KZ)
                 </Button>
              )}
            </form>
          )}

          {/* STEP 4: PROCESSING */}
          {step === 'PROCESSING' && (
            <div className="text-center py-12">
               <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                  <Heart className="absolute inset-0 m-auto w-8 h-8 text-teal-500 animate-pulse" />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Processando Pagamento...</h3>
               <p className="text-slate-400">Aguarde a confirmação do seu provedor.</p>
            </div>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 'SUCCESS' && (
            <div className="text-center py-8 animate-in zoom-in-95">
               <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30">
                  <Check className="w-10 h-10 text-white" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-2">Oferta Recebida!</h3>
               <p className="text-slate-300 mb-6">
                 Obrigado pela sua generosidade. <br/>
                 Sua oferta de <span className="text-teal-400 font-bold">{amount} KZ</span> foi confirmada.
               </p>
               <Button onClick={reset} className="w-full bg-slate-700 hover:bg-slate-600">Fechar</Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
