import React, { useState, useEffect } from 'react';
import { QRScanner } from './components/QRScanner';
import { AttendanceList } from './components/AttendanceList';
import { Toaster } from 'react-hot-toast';
import type { Attendance, AttendanceStats } from './types';
import { QrCode } from 'lucide-react';

function App() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({
    totalPresent: 0,
    currentlyInside: 0,
  });

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    try {
      const response = await fetch('/api/attendances');
      const data = await response.json();
      setAttendances(data.attendances);
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch attendances:', error);
    }
  };

  const handleScan = async (registrationNumber: string) => {
    try {
      const response = await fetch('/api/attendances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registrationNumber }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to record attendance');
      }

      fetchAttendances();
    } catch (error) {
      console.error('Error recording attendance:', error);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/download');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <QrCode size={40} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Event Attendance Tracker
            </h1>
          </div>
          <p className="text-gray-600">
            Scan QR codes or enter registration numbers manually to track attendance
          </p>
        </div>

        <QRScanner onScan={handleScan} />
        <AttendanceList
          attendances={attendances}
          stats={stats}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
}

export default App;