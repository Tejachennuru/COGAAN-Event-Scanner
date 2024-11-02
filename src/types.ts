export interface Attendance {
  id: number;
  registrationNumber: string;
  entryTime: string;
  exitTime: string | null;
  date: string;
}

export interface AttendanceStats {
  totalPresent: number;
  currentlyInside: number;
}