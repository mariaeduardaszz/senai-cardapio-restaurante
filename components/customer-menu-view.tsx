import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { MenuItem } from './menu-management';

interface CartItem {
  item: MenuItem;
  quantity: number;
  customizations: {
    additions: string[];
    removals: string[];
    notes: string;
  };
}

interface CustomerMenuViewProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem, quantity: number, customizations: CartItem['customizations']) => void;
  cart: CartItem[];
  onUpdateCart: (cart: CartItem[]) => void;
}

export function CustomerMenuView({ menuItems, onAddToCart, cart, onUpdateCart }: CustomerMenuViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customizationDialogOpen, setCustomizationDialogOpen] = useState(false);
  const [customizations, setCustomizations] = useState({
    additions: [] as string[],
    removals: [] as string[],
    notes: '',
  });

  const categories = ['Todos', ...Array.from(new Set(menuItems.map(item => item.category)))];

  const availableAdditions = [
    'Queijo extra',
    'Bacon',
    'Cebola caramelizada',
    'Molho especial',
    'Pimenta',
    'Azeitonas',
    'Cogumelos',
  ];

  const availableRemovals = [
    'Cebola',
    'Tomate',
    'Alho',
    'Pimenta',
    'Sal',
    'Temperos',
    'Molho',
  ];

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

  const handleOpenCustomization = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setCustomizations({
      additions: [],
      removals: [],
      notes: '',
    });
    setCustomizationDialogOpen(true);
  };

  const handleAddToCart = () => {
    if (selectedItem) {
      onAddToCart(selectedItem, quantity, customizations);
      setCustomizationDialogOpen(false);
    }
  };

  const toggleAddition = (addition: string) => {
    setCustomizations(prev => ({
      ...prev,
      additions: prev.additions.includes(addition)
        ? prev.additions.filter(a => a !== addition)
        : [...prev.additions, addition],
    }));
  };

  const toggleRemoval = (removal: string) => {
    setCustomizations(prev => ({
      ...prev,
      removals: prev.removals.includes(removal)
        ? prev.removals.filter(r => r !== removal)
        : [...prev.removals, removal],
    }));
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, cartItem) => {
      const additionsPrice = cartItem.customizations.additions.length * 5; // R$ 5 por adição
      return total + (cartItem.item.price + additionsPrice) * cartItem.quantity;
    }, 0);
  };

  const removeFromCart = (index: number) => {
    onUpdateCart(cart.filter((_, i) => i !== index));
  };

  const updateCartItemQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    const newQuantity = newCart[index].quantity + delta;
    if (newQuantity > 0) {
      newCart[index].quantity = newQuantity;
      onUpdateCart(newCart);
    }
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-0 bg-white z-10 pb-4 border-b">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Buscar pratos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {cart.length > 0 && (
          <div className="flex items-center justify-between bg-orange-50 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-orange-600" />
              <span className="font-medium">{getCartItemCount()} itens no carrinho</span>
            </div>
            <span className="text-lg text-orange-600">
              R$ {getCartTotal().toFixed(2)}
            </span>
          </div>
        )}
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
          <TabsContent key={category} value={category} className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredItems(category).map(item => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex">
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="font-semibold mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg text-green-600">
                          R$ {item.price.toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleOpenCustomization(item)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </div>
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

      <Dialog open={customizationDialogOpen} onOpenChange={setCustomizationDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Personalizar Pedido</DialogTitle>
            <DialogDescription>{selectedItem?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Quantidade</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Adicionar (+R$ 5,00 cada)</Label>
              <div className="space-y-2">
                {availableAdditions.map(addition => (
                  <div key={addition} className="flex items-center space-x-2">
                    <Checkbox
                      id={`add-${addition}`}
                      checked={customizations.additions.includes(addition)}
                      onCheckedChange={() => toggleAddition(addition)}
                    />
                    <label
                      htmlFor={`add-${addition}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {addition}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Remover ingredientes</Label>
              <div className="space-y-2">
                {availableRemovals.map(removal => (
                  <div key={removal} className="flex items-center space-x-2">
                    <Checkbox
                      id={`remove-${removal}`}
                      checked={customizations.removals.includes(removal)}
                      onCheckedChange={() => toggleRemoval(removal)}
                    />
                    <label
                      htmlFor={`remove-${removal}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      {removal}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações especiais</Label>
              <Textarea
                id="notes"
                placeholder="Ex: Ponto da carne, alergias, preferências..."
                value={customizations.notes}
                onChange={(e) => setCustomizations({ ...customizations, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span>Total:</span>
                <span className="text-xl text-green-600">
                  R$ {((selectedItem?.price || 0) + customizations.additions.length * 5) * quantity}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCustomizationDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddToCart}>
              Adicionar ao Carrinho
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
