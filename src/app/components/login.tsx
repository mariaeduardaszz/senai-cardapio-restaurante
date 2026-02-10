import { useState } from 'react';
import { Utensils, User, ChefHat } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface LoginProps {
  onLogin: (userType: 'staff' | 'customer', tableNumber?: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Autenticação simplificada para demo
    if (staffEmail && staffPassword) {
      onLogin('staff');
    }
  };

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (tableNumber && customerName) {
      onLogin('customer', tableNumber);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Utensils className="h-12 w-12 text-orange-600" />
            <h1 className="text-4xl">Restaurante Gastronômico</h1>
          </div>
          <p className="text-gray-600">Sistema de Gestão e Atendimento</p>
        </div>

        <Card className="shadow-2xl">
          <Tabs defaultValue="customer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Acesso Cliente
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex items-center gap-2">
                <ChefHat className="h-4 w-4" />
                Acesso Restaurante
              </TabsTrigger>
            </TabsList>

            <TabsContent value="customer">
              <CardHeader>
                <CardTitle>Bem-vindo!</CardTitle>
                <CardDescription>
                  Acesse o cardápio digital da sua mesa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCustomerLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Seu Nome</Label>
                    <Input
                      id="customerName"
                      placeholder="Digite seu nome"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tableNumber">Número da Mesa</Label>
                    <Input
                      id="tableNumber"
                      type="number"
                      placeholder="Ex: 5"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      required
                      min="1"
                      max="50"
                    />
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Dica:</strong> O número da mesa está no QR Code sobre a mesa. Você também pode escanear o QR Code para acesso direto!
                    </p>
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Acessar Cardápio
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="staff">
              <CardHeader>
                <CardTitle>Acesso Administrativo</CardTitle>
                <CardDescription>
                  Faça login para gerenciar o restaurante
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      🔒 <strong>Demo:</strong> Use qualquer e-mail e senha para acessar
                    </p>
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Entrar no Sistema
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>Sistema desenvolvido com segurança e rapidez</p>
        </div>
      </div>
    </div>
  );
}
