import { useState } from 'react';
import { Utensils, ShoppingCart, FileText, Bell, CreditCard, LogOut, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { AgeVerification } from './components/age-verification';
import { Login } from './components/login';
import { CustomerMenuView } from './components/customer-menu-view';
import { CustomerOrderView } from './components/customer-order-view';
import { WaiterCall } from './components/waiter-call';
import { PaymentSystem, PaymentMethod } from './components/payment-system';
import { MenuItem } from './components/menu-management';

// Import do sistema administrativo
import { MenuManagement } from './components/menu-management';
import { OrderManagement, Order } from './components/order-management';
import { ReservationSystem, Reservation } from './components/reservation-system';
import { EmployeeManagement, Employee } from './components/employee-management';
import { TableQRCode } from './components/table-qrcode';
import { ClipboardList, Calendar, Users, QrCode } from 'lucide-react';

interface CartItem {
  item: MenuItem;
  quantity: number;
  customizations: {
    additions: string[];
    removals: string[];
    notes: string;
  };
}

interface CustomerOrder {
  id: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    customizations: {
      additions: string[];
      removals: string[];
      notes: string;
    };
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'cancelled';
  timestamp: Date;
  canCancel: boolean;
}

export default function App() {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'staff' | 'customer' | null>(null);
  const [customerTableNumber, setCustomerTableNumber] = useState<string>('');
  const [activeTab, setActiveTab] = useState('menu');

  // Estados do sistema administrativo
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Risoto de Camarão',
      description: 'Risoto cremoso com camarões frescos e açafrão',
      price: 68.90,
      category: 'Pratos Principais',
      image: 'https://images.unsplash.com/photo-1712746784068-703c0c915611?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRpc2h8ZW58MXx8fHwxNzcwNjY2NDU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
    },
    {
      id: '2',
      name: 'Pasta Carbonara',
      description: 'Massa italiana com molho carbonara tradicional',
      price: 52.90,
      category: 'Massas',
      image: 'https://images.unsplash.com/photo-1691689115767-1532d12c119f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwcGFzdGElMjBpdGFsaWFufGVufDF8fHx8MTc3MDc2MTY0MXww&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
    },
    {
      id: '3',
      name: 'Picanha Premium',
      description: 'Picanha grelhada ao ponto com acompanhamentos',
      price: 89.90,
      category: 'Pratos Principais',
      image: 'https://images.unsplash.com/photo-1693422660544-014dd9f3ef73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwc3RlYWslMjBtZWF0fGVufDF8fHx8MTc3MDc0Mjg5Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
    },
    {
      id: '4',
      name: 'Salada Caesar',
      description: 'Alface romana, croutons, parmesão e molho caesar',
      price: 32.90,
      category: 'Saladas',
      image: 'https://images.unsplash.com/photo-1654458804670-2f4f26ab3154?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwaGVhbHRoeXxlbnwxfHx8fDE3NzA2NDkyMDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
    },
    {
      id: '5',
      name: 'Petit Gâteau',
      description: 'Bolo de chocolate quente com sorvete de baunilha',
      price: 28.90,
      category: 'Sobremesas',
      image: 'https://images.unsplash.com/photo-1736840334919-aac2d5af73e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NzA2NzEyOTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
    },
    {
      id: '6',
      name: 'Limonada Suíça',
      description: 'Limonada fresca com leite condensado e gelo',
      price: 12.90,
      category: 'Bebidas',
      image: 'https://images.unsplash.com/photo-1690988109026-1a16b58d4bf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xkJTIwYmV2ZXJhZ2UlMjBkcmlua3xlbnwxfHx8fDE3NzA3NjE2NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
    },
  ]);

  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Carlos Silva',
      role: 'Garçom',
      phone: '(11) 99999-0001',
      email: 'carlos@restaurante.com',
      shift: 'Tarde (14h-22h)',
      rating: 4.8,
      reviews: [],
      status: 'active',
    },
  ]);

  // Estados do cliente
  const [customerCart, setCustomerCart] = useState<CartItem[]>([]);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const handleLogin = (type: 'staff' | 'customer', tableNumber?: string) => {
    setUserType(type);
    setIsLoggedIn(true);
    if (type === 'customer' && tableNumber) {
      setCustomerTableNumber(tableNumber);
      toast.success(`Bem-vindo! Mesa ${tableNumber}`);
    } else if (type === 'staff') {
      toast.success('Login realizado com sucesso!');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setCustomerTableNumber('');
    setCustomerCart([]);
    setActiveTab('menu');
    toast.info('Você saiu do sistema');
  };

  const handleCustomerAddToCart = (
    item: MenuItem,
    quantity: number,
    customizations: CartItem['customizations']
  ) => {
    const newCartItem: CartItem = {
      item,
      quantity,
      customizations,
    };
    setCustomerCart([...customerCart, newCartItem]);
    toast.success(`${item.name} adicionado ao carrinho!`);
  };

  const handleCreateCustomerOrder = () => {
    if (customerCart.length === 0) {
      toast.error('Carrinho vazio');
      return;
    }

    const total = customerCart.reduce((sum, cartItem) => {
      const additionsPrice = cartItem.customizations.additions.length * 5;
      return sum + (cartItem.item.price + additionsPrice) * cartItem.quantity;
    }, 0);

    const newOrder: CustomerOrder = {
      id: (1000 + customerOrders.length + 1).toString(),
      items: customerCart.map(cartItem => ({
        name: cartItem.item.name,
        quantity: cartItem.quantity,
        price: cartItem.item.price + cartItem.customizations.additions.length * 5,
        customizations: cartItem.customizations,
      })),
      total,
      status: 'pending',
      timestamp: new Date(),
      canCancel: true,
    };

    setCustomerOrders([newOrder, ...customerOrders]);
    setCustomerCart([]);
    
    // Simula confirmação do pedido após 10 segundos
    setTimeout(() => {
      setCustomerOrders(prev =>
        prev.map(o =>
          o.id === newOrder.id
            ? { ...o, status: 'confirmed', canCancel: false }
            : o
        )
      );
      toast.info('Pedido confirmado! Não pode mais ser cancelado.');
    }, 10000);

    toast.success('Pedido enviado para a cozinha!', {
      description: 'Você tem 10 segundos para cancelar se necessário',
    });
    setActiveTab('orders');
  };

  const handleCancelCustomerOrder = (orderId: string) => {
    const order = customerOrders.find(o => o.id === orderId);
    if (order && order.canCancel && order.status === 'pending') {
      setCustomerOrders(
        customerOrders.map(o =>
          o.id === orderId ? { ...o, status: 'cancelled' } : o
        )
      );
      toast.success('Pedido cancelado com sucesso');
    } else {
      toast.error('Este pedido não pode mais ser cancelado');
    }
  };

  const handlePaymentComplete = (method: PaymentMethod) => {
    toast.success('Pagamento realizado com sucesso!');
    setPaymentDialogOpen(false);
  };

  const getTotalBill = () => {
    return customerOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0);
  };

  // Sistema de verificação de idade
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <AgeVerification onVerified={() => setIsVerified(true)} />
      </div>
    );
  }

  // Tela de login
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Interface do Cliente
  if (userType === 'customer') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />

        <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Utensils className="h-8 w-8 text-orange-600" />
                <div>
                  <h1 className="text-2xl">Restaurante Gastronômico</h1>
                  <p className="text-sm text-gray-500">Mesa {customerTableNumber}</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 pb-24">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 gap-2">
              <TabsTrigger value="menu" className="flex flex-col gap-1 h-auto py-3">
                <Utensils className="h-5 w-5" />
                <span className="text-xs">Cardápio</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex flex-col gap-1 h-auto py-3">
                <FileText className="h-5 w-5" />
                <span className="text-xs">Comanda</span>
                {customerOrders.filter(o => o.status !== 'cancelled').length > 0 && (
                  <span className="absolute top-1 right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {customerOrders.filter(o => o.status !== 'cancelled').length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="call" className="flex flex-col gap-1 h-auto py-3">
                <Bell className="h-5 w-5" />
                <span className="text-xs">Chamar</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex flex-col gap-1 h-auto py-3">
                <CreditCard className="h-5 w-5" />
                <span className="text-xs">Pagar</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="menu">
              <CustomerMenuView
                menuItems={menuItems}
                onAddToCart={handleCustomerAddToCart}
                cart={customerCart}
                onUpdateCart={setCustomerCart}
              />
            </TabsContent>

            <TabsContent value="orders">
              <CustomerOrderView
                orders={customerOrders}
                onCancelOrder={handleCancelCustomerOrder}
              />
            </TabsContent>

            <TabsContent value="call">
              <WaiterCall
                tableNumber={customerTableNumber}
                waiterName={employees.find(e => e.role === 'Garçom')?.name}
              />
            </TabsContent>

            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Finalizar Pagamento</CardTitle>
                  <CardDescription>
                    Revise sua conta e escolha a forma de pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>R$ {getTotalBill().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Taxa de serviço (10%)</span>
                      <span>R$ {(getTotalBill() * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-xl">
                      <span>Total</span>
                      <span className="text-green-600">
                        R$ {(getTotalBill() * 1.1).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {getTotalBill() > 0 ? (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => setPaymentDialogOpen(true)}
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      Pagar Conta
                    </Button>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum pedido para pagar
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        {customerCart.length > 0 && activeTab === 'menu' && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
            <div className="container mx-auto">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600">
                    {customerCart.reduce((sum, item) => sum + item.quantity, 0)} itens
                  </p>
                  <p className="text-xl text-green-600">
                    R${' '}
                    {customerCart
                      .reduce(
                        (sum, item) =>
                          sum +
                          (item.item.price + item.customizations.additions.length * 5) *
                            item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </p>
                </div>
                <Button size="lg" onClick={handleCreateCustomerOrder}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Fazer Pedido
                </Button>
              </div>
              <p className="text-xs text-center text-gray-500">
                Você terá 10 segundos para cancelar após confirmar
              </p>
            </div>
          </div>
        )}

        <PaymentSystem
          amount={getTotalBill()}
          orderId={`MESA-${customerTableNumber}`}
          onPaymentComplete={handlePaymentComplete}
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
        />
      </div>
    );
  }

  // Interface Administrativa (Staff)
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Utensils className="h-8 w-8 text-orange-600" />
              <div>
                <h1 className="text-2xl">Sistema RestauranteX</h1>
                <p className="text-sm text-gray-500">Gestão Completa de Restaurante</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 gap-2">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Pedidos</span>
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Menu</span>
            </TabsTrigger>
            <TabsTrigger value="reservations" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Reservas</span>
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Equipe</span>
            </TabsTrigger>
            <TabsTrigger value="qrcode" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">QR Code</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Caixa</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrderManagement orders={orders} onUpdateStatus={() => {}} />
          </TabsContent>

          <TabsContent value="menu">
            <MenuManagement menuItems={menuItems} onUpdate={setMenuItems} />
          </TabsContent>

          <TabsContent value="reservations">
            <ReservationSystem reservations={reservations} onUpdate={setReservations} />
          </TabsContent>

          <TabsContent value="employees">
            <EmployeeManagement employees={employees} onUpdate={setEmployees} />
          </TabsContent>

          <TabsContent value="qrcode">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl">QR Code das Mesas</h2>
                <p className="text-gray-500 mt-1">
                  Gere QR Codes para acesso direto ao cardápio via mesa
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 20 }, (_, i) => (i + 1).toString()).map(tableNum => (
                  <TableQRCode key={tableNum} tableNumber={tableNum} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payment">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl">Operação de Caixa</h2>
                <p className="text-gray-500 mt-1">
                  Processe pagamentos de forma rápida e segura
                </p>
              </div>
              <div className="text-center py-12 text-gray-500">
                Nenhum pedido pronto para pagamento
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl">Dashboard - Visão Geral</h2>
                <p className="text-gray-500 mt-1">
                  Acompanhe as principais métricas do restaurante
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Pedidos Hoje</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl">{orders.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Reservas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl">{reservations.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Funcionários Ativos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl">
                      {employees.filter(e => e.status === 'active').length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Itens no Menu</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl">{menuItems.length}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
