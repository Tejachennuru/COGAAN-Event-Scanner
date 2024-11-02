import Database from 'better-sqlite3';
import { Attendance } from '../types';

const db = new Database('attendance.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS attendances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    registrationNumber TEXT NOT NULL,
    entryTime TEXT NOT NULL,
    exitTime TEXT,
    date TEXT NOT NULL
  )
`);

export function getAttendances(): { attendances: Attendance[]; stats: { totalPresent: number; currentlyInside: number } } {
  const attendances = db.prepare(`
    SELECT * FROM attendances 
    WHERE date = DATE('now', 'localtime')
    ORDER BY entryTime DESC
  `).all() as Attendance[];

  const currentlyInside = attendances.filter(a => !a.exitTime).length;
  const totalPresent = new Set(attendances.map(a => a.registrationNumber)).size;

  return {
    attendances,
    stats: {
      totalPresent,
      currentlyInside
    }
  };
}

export function recordAttendance(registrationNumber: string): void {
  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toISOString();

  const lastRecord = db.prepare(`
    SELECT * FROM attendances 
    WHERE registrationNumber = ? AND date = ? 
    ORDER BY entryTime DESC LIMIT 1
  `).get(registrationNumber, today) as Attendance | undefined;

  if (lastRecord && !lastRecord.exitTime) {
    // Mark exit
    db.prepare(`
      UPDATE attendances 
      SET exitTime = ? 
      WHERE id = ?
    `).run(now, lastRecord.id);
  } else {
    // Record entry
    db.prepare(`
      INSERT INTO attendances (registrationNumber, entryTime, date)
      VALUES (?, ?, ?)
    `).run(registrationNumber, now, today);
  }
}