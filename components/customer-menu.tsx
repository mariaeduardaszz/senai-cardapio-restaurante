import { useState } from 'react';
import { ShoppingCart, Search, Minus, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { MenuItem } from './menu-management';

interface CustomerMenuProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem, quantity: number) => void;
  cart: { item: MenuItem; quantity: number }[];
}

export function CustomerMenu({ menuItems, onAddToCart, cart }: CustomerMenuProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const categories = ['Todos', ...Array.from(new Set(menuItems.map(item => item.category)))];
  
  const filteredItems = (category: string) => {
    let items = menuItems.filter(item => item.available);
    if (category !== 'Todos') {
      items = items.filter(item => item.category === category);
    }
    if (searchTerm) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return items;
  };

  const getQuantity = (itemId: string) => quantities[itemId] || 1;

  const handleQuantityChange = (itemId: string, delta: number) => {
    const current = getQuantity(itemId);
    const newValue = Math.max(1, current + delta);
    setQuantities({ ...quantities, [itemId]: newValue });
  };

  const handleAddToCart = (item: MenuItem) => {
    onAddToCart(item, getQuantity(item.id));
    setQuantities({ ...quantities, [item.id]: 1 });
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl">Cardápio Digital</h2>
          <p className="text-gray-500 mt-1">Escolha seus pratos favoritos</p>
        </div>
        <div className="relative">
          <ShoppingCart className="h-6 w-6" />
          {getCartItemCount() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
              {getCartItemCount()}
            </Badge>
          )}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Buscar pratos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="Todos" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems(category).map(item => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-xl mb-2">{item.name}</CardTitle>
                    <CardDescription className="text-sm mb-4 min-h-[40px]">
                      {item.description}
                    </CardDescription>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl text-green-600">
                        R$ {item.price.toFixed(2)}
                      </span>
                      <Badge variant="secondary">{item.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="h-9 w-9"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center">{getQuantity(item.id)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="h-9 w-9"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        className="flex-1"
                        onClick={() => handleAddToCart(item)}
                      >
                        Adicionar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredItems(category).length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Nenhum prato encontrado
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
