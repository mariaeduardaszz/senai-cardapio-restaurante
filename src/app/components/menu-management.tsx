import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

interface MenuManagementProps {
  menuItems: MenuItem[];
  onUpdate: (items: MenuItem[]) => void;
}

export function MenuManagement({ menuItems, onUpdate }: MenuManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });

  const categories = ['Entradas', 'Pratos Principais', 'Massas', 'Saladas', 'Sobremesas', 'Bebidas'];

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        image: item.image,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: categories[0],
        image: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const newItem: MenuItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image || 'https://images.unsplash.com/photo-1712746784068-703c0c915611?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRpc2h8ZW58MXx8fHwxNzcwNjY2NDU0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      available: editingItem?.available ?? true,
    };

    if (editingItem) {
      onUpdate(menuItems.map(item => item.id === editingItem.id ? newItem : item));
    } else {
      onUpdate([...menuItems, newItem]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    onUpdate(menuItems.filter(item => item.id !== id));
  };

  const toggleAvailability = (id: string) => {
    onUpdate(menuItems.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl">Gerenciar Cardápio</h2>
          <p className="text-gray-500 mt-1">Cadastre e atualize os itens do menu</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar Item' : 'Novo Item'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Edite as informações do item' : 'Adicione um novo item ao cardápio'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Prato</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Risoto de Camarão"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o prato..."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">URL da Imagem (opcional)</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <Card key={item.id} className={!item.available ? 'opacity-50' : ''}>
            <CardHeader className="p-0">
              <div className="relative h-40 overflow-hidden rounded-t-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    size="sm"
                    variant={item.available ? 'default' : 'secondary'}
                    onClick={() => toggleAvailability(item.id)}
                  >
                    {item.available ? 'Disponível' : 'Indisponível'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-xl mb-2">{item.name}</CardTitle>
              <CardDescription className="text-sm mb-3 line-clamp-2">
                {item.description}
              </CardDescription>
              <div className="flex items-center justify-between">
                <span className="text-lg text-green-600">
                  R$ {item.price.toFixed(2)}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDialog(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                  {item.category}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
