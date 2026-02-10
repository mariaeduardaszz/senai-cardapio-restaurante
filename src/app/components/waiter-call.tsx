import { useState } from 'react';
import { Bell, User, MessageSquare, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface WaiterCallProps {
  tableNumber: string;
  waiterName?: string;
}

export function WaiterCall({ tableNumber, waiterName = 'Garçom' }: WaiterCallProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [requestType, setRequestType] = useState('general');
  const [message, setMessage] = useState('');
  const [lastCallTime, setLastCallTime] = useState<Date | null>(null);

  const requestTypes = [
    { value: 'general', label: 'Chamar Garçom', icon: User },
    { value: 'bill', label: 'Solicitar Conta', icon: Bell },
    { value: 'help', label: 'Ajuda / Dúvida', icon: MessageSquare },
    { value: 'complaint', label: 'Reclamação', icon: Bell },
  ];

  const quickRequests = [
    { label: 'Mais água', message: 'Por favor, pode trazer mais água?' },
    { label: 'Guardanapos', message: 'Preciso de guardanapos, por favor.' },
    { label: 'Talheres', message: 'Pode trazer talheres extras?' },
    { label: 'Conta', message: 'Gostaria de solicitar a conta, por favor.' },
    { label: 'Cardápio', message: 'Pode trazer o cardápio novamente?' },
  ];

  const handleSendRequest = () => {
    const selectedType = requestTypes.find(t => t.value === requestType);
    
    // Simula envio da chamada
    setLastCallTime(new Date());
    toast.success(`${selectedType?.label} enviado!`, {
      description: `${waiterName} foi notificado e virá atender você em breve.`,
    });
    
    setDialogOpen(false);
    setMessage('');
    setRequestType('general');
  };

  const handleQuickCall = () => {
    setLastCallTime(new Date());
    toast.success('Garçom chamado!', {
      description: `${waiterName} foi notificado e virá até sua mesa.`,
    });
  };

  const canCall = !lastCallTime || (new Date().getTime() - lastCallTime.getTime()) > 30000; // 30 segundos

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Chamar Atendimento
          </CardTitle>
          <CardDescription>
            Mesa {tableNumber} • Atendente: {waiterName}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!canCall && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
              ⏱️ Aguarde alguns instantes antes de chamar novamente
            </div>
          )}

          <Button
            className="w-full h-16 text-lg"
            size="lg"
            onClick={handleQuickCall}
            disabled={!canCall}
          >
            <Bell className="mr-2 h-5 w-5" />
            Chamar Garçom Agora
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" disabled={!canCall}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Fazer Solicitação Específica
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Fazer Solicitação</DialogTitle>
                <DialogDescription>
                  Descreva o que você precisa e enviaremos para o garçom
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="requestType">Tipo de Solicitação</Label>
                  <Select value={requestType} onValueChange={setRequestType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {requestTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Solicitações Rápidas</Label>
                  <div className="flex flex-wrap gap-2">
                    {quickRequests.map(request => (
                      <Badge
                        key={request.label}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => setMessage(request.message)}
                      >
                        {request.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem (opcional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Descreva sua solicitação..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                  ℹ️ Sua solicitação será enviada imediatamente para o garçom responsável pela sua mesa
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSendRequest}>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Solicitação
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {lastCallTime && (
            <div className="text-center text-sm text-gray-500">
              Última chamada: {lastCallTime.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dicas de Atendimento</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <p>• Use o botão de chamada rápida para chamar o garçom à sua mesa</p>
          <p>• Faça solicitações específicas para pedidos mais detalhados</p>
          <p>• Nosso tempo médio de resposta é de 2-5 minutos</p>
          <p>• Em caso de urgência, você também pode chamar verbalmente</p>
        </CardContent>
      </Card>
    </div>
  );
}
