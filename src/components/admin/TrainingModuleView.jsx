import React, { useState, useEffect } from 'react';
import sampleData from '../../../sampleData.json';

const TrainingModuleView = () => {
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [studentsWithScores, setStudentsWithScores] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    setModules(sampleData.modules || []);
  }, []);

  useEffect(() => {
    if (!selectedModuleId) {
      setStudentsWithScores([]);
      return;
    }
    // Find students who have done the selected module with scores
    const trainingProgress = sampleData.trainingProgress.filter(
      (tp) => tp.training === selectedModuleId
    );

    const studentsData = trainingProgress.map((tp) => {
      const student = sampleData.students.find((s) => s._id === tp.student);
      const averageScore = tp.averageScore || 'NA';
      return {
        regNo: student?.regNo || 'Unknown',
        name: student?.name || 'Unknown',
        averageScore,
      };
    });

    setStudentsWithScores(studentsData);
  }, [selectedModuleId]);

  const handleSort = () => {
    const sorted = [...studentsWithScores].sort((a, b) => {
      if (a.averageScore === 'NA') return 1;
      if (b.averageScore === 'NA') return -1;
      return sortOrder === 'asc'
        ? a.averageScore - b.averageScore
        : b.averageScore - a.averageScore;
    });
    setStudentsWithScores(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Training Modules</h2>
      <select
        value={selectedModuleId}
        onChange={(e) => setSelectedModuleId(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      >
        <option value="">-- Select Module --</option>
        {modules.map((mod) => (
          <option key={mod._id} value={mod._id}>
            {mod.title}
          </option>
        ))}
      </select>

      {selectedModuleId && (
        <>
          <button
            onClick={handleSort}
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Sort by Average Score ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
          </button>
          <table className="min-w-full border bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Reg. No</th>
                <th className="p-3">Average Score</th>
              </tr>
            </thead>
            <tbody>
              {studentsWithScores.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-3 text-center">
                    No students have completed this module or scores not uploaded.
                  </td>
                </tr>
              ) : (
                studentsWithScores.map((stu, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-3">{stu.name}</td>
                    <td className="p-3">{stu.regNo}</td>
                    <td className="p-3">{stu.averageScore !== undefined ? stu.averageScore : 'NA'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default TrainingModuleView;
