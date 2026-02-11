import { Clock, CheckCircle, ChefHat, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  customizations: {
    additions: string[];
    removals: string[];
    notes: string;
  };
}

interface CustomerOrder {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'cancelled';
  timestamp: Date;
  canCancel: boolean;
}

interface CustomerOrderViewProps {
  orders: CustomerOrder[];
  onCancelOrder: (orderId: string) => void;
}

export function CustomerOrderView({ orders, onCancelOrder }: CustomerOrderViewProps) {
  const statusInfo = {
    pending: {
      label: 'Aguardando Confirmação',
      icon: Clock,
      color: 'bg-yellow-500',
      description: 'Seu pedido está sendo processado',
    },
    confirmed: {
      label: 'Confirmado',
      icon: CheckCircle,
      color: 'bg-blue-500',
      description: 'Pedido confirmado pela cozinha',
    },
    preparing: {
      label: 'Em Preparo',
      icon: ChefHat,
      color: 'bg-orange-500',
      description: 'Seu pedido está sendo preparado',
    },
    ready: {
      label: 'Pronto',
      icon: CheckCircle,
      color: 'bg-green-500',
      description: 'Seu pedido está pronto!',
    },
    cancelled: {
      label: 'Cancelado',
      icon: XCircle,
      color: 'bg-red-500',
      description: 'Pedido cancelado',
    },
  };

  const activeOrders = orders.filter(o => o.status !== 'cancelled');
  const totalAmount = activeOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Minha Comanda</h2>
        <p className="text-gray-500">Acompanhe seus pedidos em tempo real</p>
      </div>

      {activeOrders.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você ainda não fez nenhum pedido. Explore nosso cardápio e faça seu primeiro pedido!
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <Card className="bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader>
              <CardTitle>Resumo da Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-lg">
                  <span>Subtotal</span>
                  <span>R$ {totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Taxa de serviço (10%)</span>
                  <span>R$ {(totalAmount * 0.1).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-2xl">
                  <span>Total</span>
                  <span className="text-green-600">R$ {(totalAmount * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {orders.map(order => {
              const status = statusInfo[order.status];
              const StatusIcon = status.icon;

              return (
                <Card key={order.id} className={order.status === 'cancelled' ? 'opacity-50' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                        <CardDescription>
                          {order.timestamp.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </CardDescription>
                      </div>
                      <Badge className={`${status.color} text-white`}>
                        <StatusIcon className="mr-1 h-4 w-4" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="text-gray-600">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          {item.customizations.additions.length > 0 && (
                            <div className="text-sm text-gray-600 ml-4">
                              <span className="text-green-600">+</span> {item.customizations.additions.join(', ')}
                            </div>
                          )}
                          {item.customizations.removals.length > 0 && (
                            <div className="text-sm text-gray-600 ml-4">
                              <span className="text-red-600">-</span> {item.customizations.removals.join(', ')}
                            </div>
                          )}
                          {item.customizations.notes && (
                            <div className="text-sm text-gray-600 ml-4 italic">
                              "{item.customizations.notes}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="text-lg">Total</span>
                      <span className="text-xl text-green-600">
                        R$ {order.total.toFixed(2)}
                      </span>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">{status.description}</p>
                    </div>

                    {order.canCancel && order.status === 'pending' && (
                      <div className="space-y-2">
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => onCancelOrder(order.id)}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancelar Pedido
                        </Button>
                        <p className="text-xs text-center text-gray-500">
                          Você só pode cancelar pedidos que ainda não foram confirmados
                        </p>
                      </div>
                    )}

                    {!order.canCancel && order.status !== 'cancelled' && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Este pedido já foi confirmado e não pode mais ser cancelado
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
