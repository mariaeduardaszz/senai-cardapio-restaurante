import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Download } from 'lucide-react';

interface TableQRCodeProps {
  tableNumber: string;
}

export function TableQRCode({ tableNumber }: TableQRCodeProps) {
  const qrValue = `https://restaurante.com/mesa/${tableNumber}`;

  const handleDownload = () => {
    const svg = document.getElementById(`qr-${tableNumber}`);
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `mesa-${tableNumber}-qrcode.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Mesa {tableNumber}</CardTitle>
        <CardDescription>QR Code para acesso ao cardápio</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG
            id={`qr-${tableNumber}`}
            value={qrValue}
            size={200}
            level="H"
            includeMargin={true}
          />
        </div>
        <Button onClick={handleDownload} variant="outline" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Baixar QR Code
        </Button>
      </CardContent>
    </Card>
  );
}
