import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Scan, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  onScan: (data: string) => void;
}

export function QRScanner({ onScan }: Props) {
  const [showScanner, setShowScanner] = useState(false);
  const [manualInput, setManualInput] = useState('');

  const handleScan = (result: any) => {
    if (result) {
      onScan(result?.text);
      setShowScanner(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScan(manualInput.trim());
      setManualInput('');
    } else {
      toast.error('Please enter a registration number');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {showScanner ? (
        <div className="relative">
          <button
            onClick={() => setShowScanner(false)}
            className="absolute top-2 right-2 z-10 bg-red-500 p-2 rounded-full text-white"
          >
            <X size={20} />
          </button>
          <QrReader
            onResult={handleScan}
            constraints={{ facingMode: 'environment' }}
            className="w-full"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setShowScanner(true)}
            className="w-full bg-blue-600 text-white p-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Scan size={24} />
            <span>Start QR Scanner</span>
          </button>

          <div className="relative">
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Enter registration number manually"
                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}