import React, { useEffect, useState } from 'react';
import sampleData from '../../sampleData.json';

const batchTypes = ['Marquee', 'Super Dream', 'Dream', 'Service'];

const AdminDashboard = () => {
  const [counts, setCounts] = useState({});
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const totalStudents = sampleData.students.length;
    const batchCounts = batchTypes.reduce((acc, batch) => {
      acc[batch] = sampleData.students.filter(s => s.batch === batch).length;
      return acc;
    }, {});
    setCounts({ total: totalStudents, ...batchCounts });
  }, []);

  const fetchStudentsByBatch = (batch) => {
    setSelectedBatch(batch);
    const filteredStudents = sampleData.students.filter(s => s.batch === batch);
    setStudents(filteredStudents);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Admin Dashboard</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-md">
            <p className="text-sm font-medium text-blue-100 mb-2">Total Students</p>
            <p className="text-3xl font-bold text-white">{counts.total || 0}</p>
          </div>
          {batchTypes.map(batch => (
            <div
              key={batch}
              onClick={() => fetchStudentsByBatch(batch)}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-1"
            >
              <p className="text-sm font-medium text-gray-600 mb-2">{batch}</p>
              <p className="text-3xl font-bold text-gray-900">{counts[batch] || 0}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedBatch && (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">{selectedBatch} Students</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {students.length} students
            </span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Reg. No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Email</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((stu, idx) => (
                  <tr 
                    key={idx} 
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stu.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{stu.regNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{stu.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
