import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AgeVerificationProps {
  onVerified: () => void;
}

export function AgeVerification({ onVerified }: AgeVerificationProps) {
  const [open, setOpen] = useState(true);
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (!birthDate) {
      setError('Por favor, insira sua data de nascimento');
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      if (age - 1 >= 18) {
        setOpen(false);
        onVerified();
      } else {
        setError('Você precisa ter 18 anos ou mais para acessar o sistema');
      }
    } else if (age >= 18) {
      setOpen(false);
      onVerified();
    } else {
      setError('Você precisa ter 18 anos ou mais para acessar o sistema');
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Verificação de Idade</DialogTitle>
          <DialogDescription>
            Para acessar o sistema, você deve ter 18 anos ou mais.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="birthdate">Data de Nascimento</Label>
            <Input
              id="birthdate"
              type="date"
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value);
                setError('');
              }}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleVerify} className="w-full">
            Verificar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
