import { useState } from 'react';
import { Calendar, Clock, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  tableNumber: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
}

interface ReservationSystemProps {
  reservations: Reservation[];
  onUpdate: (reservations: Reservation[]) => void;
}

export function ReservationSystem({ reservations, onUpdate }: ReservationSystemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    date: '',
    time: '',
    guests: '2',
    tableNumber: '',
    notes: '',
  });

  const handleOpenDialog = (reservation?: Reservation) => {
    if (reservation) {
      setEditingReservation(reservation);
      setFormData({
        customerName: reservation.customerName,
        customerPhone: reservation.customerPhone,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests.toString(),
        tableNumber: reservation.tableNumber,
        notes: reservation.notes || '',
      });
    } else {
      setEditingReservation(null);
      setFormData({
        customerName: '',
        customerPhone: '',
        date: '',
        time: '',
        guests: '2',
        tableNumber: '',
        notes: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const newReservation: Reservation = {
      id: editingReservation?.id || Date.now().toString(),
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      date: formData.date,
      time: formData.time,
      guests: parseInt(formData.guests),
      tableNumber: formData.tableNumber,
      status: editingReservation?.status || 'pending',
      notes: formData.notes,
    };

    if (editingReservation) {
      onUpdate(reservations.map(r => r.id === editingReservation.id ? newReservation : r));
    } else {
      onUpdate([...reservations, newReservation]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    onUpdate(reservations.filter(r => r.id !== id));
  };

  const handleStatusChange = (id: string, status: Reservation['status']) => {
    onUpdate(reservations.map(r => r.id === id ? { ...r, status } : r));
  };

  const statusColors = {
    confirmed: 'bg-green-500',
    pending: 'bg-yellow-500',
    cancelled: 'bg-red-500',
  };

  const today = new Date().toISOString().split('T')[0];
  const upcomingReservations = reservations.filter(r => r.date >= today && r.status !== 'cancelled');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl">Reservas de Mesa</h2>
          <p className="text-gray-500 mt-1">
            Gerencie as reservas do restaurante
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Reserva
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingReservation ? 'Editar Reserva' : 'Nova Reserva'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações da reserva
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Nome do Cliente</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Telefone</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={today}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guests">Nº de Pessoas</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tableNumber">Mesa</Label>
                  <Input
                    id="tableNumber"
                    value={formData.tableNumber}
                    onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                    placeholder="Ex: 5"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ocasião especial, restrições..."
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {upcomingReservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{reservation.customerName}</CardTitle>
                <Badge className={`${statusColors[reservation.status]} text-white`}>
                  {reservation.status === 'confirmed' ? 'Confirmada' : 'Pendente'}
                </Badge>
              </div>
              <CardDescription>{reservation.customerPhone}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{new Date(reservation.date + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{reservation.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{reservation.guests} pessoas • Mesa {reservation.tableNumber}</span>
                </div>
              </div>
              {reservation.notes && (
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  {reservation.notes}
                </p>
              )}
              <div className="flex gap-2">
                {reservation.status === 'pending' && (
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                  >
                    Confirmar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenDialog(reservation)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(reservation.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {upcomingReservations.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhuma reserva agendada
        </div>
      )}
    </div>
  );
}
