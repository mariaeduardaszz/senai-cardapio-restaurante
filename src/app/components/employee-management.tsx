import { useState } from 'react';
import { Plus, Edit, Trash2, Star, UserCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

export interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  rating: number;
  reviews: Review[];
  status: 'active' | 'inactive';
  shift: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  author: string;
}

interface EmployeeManagementProps {
  employees: Employee[];
  onUpdate: (employees: Employee[]) => void;
}

export function EmployeeManagement({ employees, onUpdate }: EmployeeManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    phone: '',
    email: '',
    shift: '',
  });
  const [reviewForm, setReviewForm] = useState({
    rating: '5',
    comment: '',
    author: '',
  });

  const roles = ['Garçom', 'Cozinheiro', 'Gerente', 'Caixa', 'Auxiliar de Cozinha'];
  const shifts = ['Manhã (6h-14h)', 'Tarde (14h-22h)', 'Noite (18h-2h)'];

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        role: employee.role,
        phone: employee.phone,
        email: employee.email,
        shift: employee.shift,
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: '',
        role: roles[0],
        phone: '',
        email: '',
        shift: shifts[0],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const newEmployee: Employee = {
      id: editingEmployee?.id || Date.now().toString(),
      name: formData.name,
      role: formData.role,
      phone: formData.phone,
      email: formData.email,
      shift: formData.shift,
      rating: editingEmployee?.rating || 0,
      reviews: editingEmployee?.reviews || [],
      status: editingEmployee?.status || 'active',
    };

    if (editingEmployee) {
      onUpdate(employees.map(e => e.id === editingEmployee.id ? newEmployee : e));
    } else {
      onUpdate([...employees, newEmployee]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    onUpdate(employees.filter(e => e.id !== id));
  };

  const toggleStatus = (id: string) => {
    onUpdate(employees.map(e => 
      e.id === id ? { ...e, status: e.status === 'active' ? 'inactive' : 'active' } : e
    ));
  };

  const handleAddReview = () => {
    if (!selectedEmployee) return;

    const newReview: Review = {
      id: Date.now().toString(),
      rating: parseInt(reviewForm.rating),
      comment: reviewForm.comment,
      date: new Date().toISOString(),
      author: reviewForm.author,
    };

    const updatedReviews = [...selectedEmployee.reviews, newReview];
    const newRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;

    onUpdate(employees.map(e => 
      e.id === selectedEmployee.id 
        ? { ...e, reviews: updatedReviews, rating: newRating }
        : e
    ));

    setIsReviewDialogOpen(false);
    setReviewForm({ rating: '5', comment: '', author: '' });
  };

  const openReviewDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsReviewDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl">Controle de Funcionários</h2>
          <p className="text-gray-500 mt-1">
            Gerencie a equipe e avaliações
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do funcionário
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shift">Turno</Label>
                  <Select value={formData.shift} onValueChange={(value) => setFormData({ ...formData, shift: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {shifts.map(shift => (
                        <SelectItem key={shift} value={shift}>{shift}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Avaliar Funcionário</DialogTitle>
              <DialogDescription>
                Avalie o desempenho de {selectedEmployee?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="author">Seu Nome</Label>
                <Input
                  id="author"
                  value={reviewForm.author}
                  onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                  placeholder="Nome do avaliador"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Nota (1-5)</Label>
                <Select value={reviewForm.rating} onValueChange={(value) => setReviewForm({ ...reviewForm, rating: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Estrela' : 'Estrelas'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Comentário</Label>
                <Textarea
                  id="comment"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows={4}
                  placeholder="Descreva o desempenho do funcionário..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddReview}>Enviar Avaliação</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {employees.map((employee) => (
          <Card key={employee.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserCircle className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <CardDescription>{employee.role}</CardDescription>
                  </div>
                </div>
                <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                  {employee.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">{employee.phone}</p>
                <p className="text-gray-600">{employee.email}</p>
                <p className="text-gray-600">{employee.shift}</p>
              </div>
              
              {employee.reviews.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg">{employee.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">
                      ({employee.reviews.length} {employee.reviews.length === 1 ? 'avaliação' : 'avaliações'})
                    </span>
                  </div>
                  <Progress value={employee.rating * 20} className="h-2" />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => openReviewDialog(employee)}
                >
                  <Star className="mr-1 h-4 w-4" />
                  Avaliar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDialog(employee)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={employee.status === 'active' ? 'secondary' : 'default'}
                  onClick={() => toggleStatus(employee.id)}
                >
                  {employee.status === 'active' ? 'Desativar' : 'Ativar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {employees.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhum funcionário cadastrado
        </div>
      )}
    </div>
  );
}
