import express from 'express';
import { getAttendances, recordAttendance } from './db';
import * as XLSX from 'xlsx';

const app = express();
app.use(express.json());

app.get('/api/attendances', (req, res) => {
  try {
    const data = getAttendances();
    res.json(data);
  } catch (error) {
    console.error('Error fetching attendances:', error);
    res.status(500).json({ error: 'Failed to fetch attendances' });
  }
});

app.post('/api/attendances', (req, res) => {
  try {
    const { registrationNumber } = req.body;
    if (!registrationNumber) {
      return res.status(400).json({ error: 'Registration number is required' });
    }
    recordAttendance(registrationNumber);
    res.json({ success: true });
  } catch (error) {
    console.error('Error recording attendance:', error);
    res.status(500).json({ error: 'Failed to record attendance' });
  }
});

app.get('/api/download', (req, res) => {
  try {
    const { attendances } = getAttendances();
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(attendances);
    
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    
    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=attendance_${new Date().toISOString().split('T')[0]}.xlsx`);
    res.send(buffer);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});