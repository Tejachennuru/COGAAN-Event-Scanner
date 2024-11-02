import React from 'react';
import { format } from 'date-fns';
import { Download, Users } from 'lucide-react';
import type { Attendance, AttendanceStats } from '../types';

interface Props {
  attendances: Attendance[];
  stats: AttendanceStats;
  onDownload: () => void;
}

export function AttendanceList({ attendances, stats, onDownload }: Props) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Users className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Currently Inside</p>
                <p className="text-2xl font-bold">{stats.currentlyInside}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Attendance</p>
              <p className="text-2xl font-bold">{stats.totalPresent}</p>
            </div>
          </div>
          <button
            onClick={onDownload}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={20} />
            <span>Download Report</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entry Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exit Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendances.map((attendance) => (
                <tr key={attendance.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {attendance.registrationNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(attendance.entryTime), 'HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {attendance.exitTime
                      ? format(new Date(attendance.exitTime), 'HH:mm:ss')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        attendance.exitTime
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {attendance.exitTime ? 'Left' : 'Present'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}