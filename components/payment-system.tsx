import { useState } from 'react';
import { CreditCard, Wallet, Smartphone, DollarSign, Receipt } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

export type PaymentMethod = 'credit' | 'debit' | 'pix' | 'cash';

interface PaymentSystemProps {
  amount: number;
  orderId: string;
  onPaymentComplete: (method: PaymentMethod) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentSystem({ amount, orderId, onPaymentComplete, open, onOpenChange }: PaymentSystemProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('credit');
  const [cashAmount, setCashAmount] = useState('');
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    { id: 'credit' as const, name: 'Cartão de Crédito', icon: CreditCard, description: 'Parcelamento disponível' },
    { id: 'debit' as const, name: 'Cartão de Débito', icon: CreditCard, description: 'À vista' },
    { id: 'pix' as const, name: 'PIX', icon: Smartphone, description: 'Instantâneo' },
    { id: 'cash' as const, name: 'Dinheiro', icon: Wallet, description: 'Em espécie' },
  ];

  const handlePayment = () => {
    if (selectedMethod === 'cash') {
      const cash = parseFloat(cashAmount);
      if (!cash || cash < amount) {
        toast.error('Valor em dinheiro insuficiente');
        return;
      }
    }

    setProcessing(true);
    
    setTimeout(() => {
      setProcessing(false);
      onPaymentComplete(selectedMethod);
      onOpenChange(false);
      
      if (selectedMethod === 'cash' && parseFloat(cashAmount) > amount) {
        const change = parseFloat(cashAmount) - amount;
        toast.success(`Pagamento realizado! Troco: R$ ${change.toFixed(2)}`);
      } else {
        toast.success('Pagamento realizado com sucesso!');
      }
      
      setCashAmount('');
    }, 2000);
  };

  const getChange = () => {
    if (selectedMethod === 'cash' && cashAmount) {
      const cash = parseFloat(cashAmount);
      if (cash > amount) {
        return cash - amount;
      }
    }
    return 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Finalizar Pagamento</DialogTitle>
          <DialogDescription>
            Pedido #{orderId} • Total: <span className="text-lg text-green-600">R$ {amount.toFixed(2)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label className="text-base mb-3 block">Forma de Pagamento</Label>
            <RadioGroup value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <Card
                      key={method.id}
                      className={`cursor-pointer transition-all ${
                        selectedMethod === method.id ? 'ring-2 ring-primary' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedMethod(method.id)}
                    >
                      <CardHeader className="p-4">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <Icon className="h-6 w-6" />
                          <div className="flex-1">
                            <Label htmlFor={method.id} className="cursor-pointer">
                              {method.name}
                            </Label>
                            <p className="text-xs text-gray-500">{method.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {selectedMethod === 'cash' && (
            <div className="space-y-2">
              <Label htmlFor="cashAmount">Valor Recebido em Dinheiro</Label>
              <Input
                id="cashAmount"
                type="number"
                step="0.01"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                placeholder="0.00"
              />
              {getChange() > 0 && (
                <p className="text-sm text-green-600">
                  Troco: R$ {getChange().toFixed(2)}
                </p>
              )}
            </div>
          )}

          {selectedMethod === 'pix' && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-center flex-col gap-3">
                  <div className="bg-white p-4 rounded">
                    <div className="h-40 w-40 bg-gray-200 flex items-center justify-center">
                      <Smartphone className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-sm text-center text-gray-600">
                    Escaneie o QR Code com o app do seu banco
                  </p>
                  <Badge>Chave PIX: restaurante@email.com</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {(selectedMethod === 'credit' || selectedMethod === 'debit') && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-center flex-col gap-2">
                  <CreditCard className="h-12 w-12 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Insira ou aproxime o cartão na maquininha
                  </p>
                  <Badge variant="secondary">Conexão segura</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Resumo do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>R$ {amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de serviço (10%)</span>
                  <span>R$ {(amount * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span>Total</span>
                  <span className="text-lg">R$ {(amount * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handlePayment} disabled={processing}>
            {processing ? 'Processando...' : 'Confirmar Pagamento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
