import { useState } from 'react';
import { Clock, CheckCircle, ChefHat, Truck, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MenuItem } from './menu-management';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  tableNumber: string;
  items: { item: MenuItem; quantity: number }[];
  total: number;
  status: OrderStatus;
  timestamp: Date;
  type: 'dine-in' | 'delivery';
  waiterName?: string;
}

interface OrderManagementProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export function OrderManagement({ orders, onUpdateStatus }: OrderManagementProps) {
  const statusInfo = {
    pending: { label: 'Pendente', icon: Clock, color: 'bg-yellow-500' },
    preparing: { label: 'Preparando', icon: ChefHat, color: 'bg-blue-500' },
    ready: { label: 'Pronto', icon: CheckCircle, color: 'bg-green-500' },
    delivered: { label: 'Entregue', icon: Truck, color: 'bg-gray-500' },
    cancelled: { label: 'Cancelado', icon: XCircle, color: 'bg-red-500' },
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'delivered',
      delivered: null,
      cancelled: null,
    };
    return statusFlow[currentStatus];
  };

  const filterOrders = (type: 'all' | 'dine-in' | 'delivery') => {
    if (type === 'all') return orders;
    return orders.filter(order => order.type === type);
  };

  const OrderCard = ({ order }: { order: Order }) => {
    const status = statusInfo[order.status];
    const StatusIcon = status.icon;
    const nextStatus = getNextStatus(order.status);

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Pedido #{order.id}</CardTitle>
              <CardDescription>
                {order.type === 'dine-in' ? `Mesa ${order.tableNumber}` : 'Delivery'}
                {order.waiterName && ` • Garçom: ${order.waiterName}`}
              </CardDescription>
            </div>
            <Badge className={`${status.color} text-white`}>
              <StatusIcon className="mr-1 h-4 w-4" />
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {order.items.map((orderItem, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {orderItem.quantity}x {orderItem.item.name}
                </span>
                <span className="text-gray-600">
                  R$ {(orderItem.item.price * orderItem.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="text-lg">R$ {order.total.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {order.timestamp.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="flex gap-2">
            {nextStatus && (
              <Button
                className="flex-1"
                onClick={() => onUpdateStatus(order.id, nextStatus)}
              >
                Avançar para {statusInfo[nextStatus].label}
              </Button>
            )}
            {order.status === 'pending' && (
              <Button
                variant="destructive"
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
              >
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl">Gerenciar Pedidos</h2>
        <p className="text-gray-500 mt-1">
          Acompanhe o status dos pedidos em tempo real
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            Todos ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="dine-in">
            Salão ({orders.filter(o => o.type === 'dine-in').length})
          </TabsTrigger>
          <TabsTrigger value="delivery">
            Delivery ({orders.filter(o => o.type === 'delivery').length})
          </TabsTrigger>
        </TabsList>

        {(['all', 'dine-in', 'delivery'] as const).map(type => (
          <TabsContent key={type} value={type} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filterOrders(type).map(order => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
            {filterOrders(type).length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Nenhum pedido encontrado
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
