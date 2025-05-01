import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import sampleData from '../../../sampleData.json';

const Container = styled.div`
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  max-width: 56rem;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const SortButton = styled.button`
  margin-bottom: 1rem;
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 150ms ease-in-out;

  &:hover {
    background-color: #1d4ed8;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const Table = styled.table`
  width: 100%;
  border: 1px solid #e5e7eb;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

const TableHead = styled.thead`
  background-color: #f3f4f6;
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem;
  text-align: left;
`;

const TableCell = styled.td`
  padding: 0.75rem;
`;

const TableRow = styled.tr`
  border-top: 1px solid #e5e7eb;
  transition: background-color 150ms ease-in-out;

  &:hover {
    background-color: #f9fafb;
  }
`;

const EmptyMessage = styled.td`
  padding: 0.75rem;
  text-align: center;
`;

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
    <Container>
      <Title>Training Modules</Title>
      <Select
        value={selectedModuleId}
        onChange={(e) => setSelectedModuleId(e.target.value)}
      >
        <option value="">-- Select Module --</option>
        {modules.map((mod) => (
          <option key={mod._id} value={mod._id}>
            {mod.title}
          </option>
        ))}
      </Select>

      {selectedModuleId && (
        <>
          <SortButton onClick={handleSort}>
            Sort by Average Score ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
          </SortButton>
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Reg. No</TableHeaderCell>
                <TableHeaderCell>Average Score</TableHeaderCell>
              </tr>
            </TableHead>
            <tbody>
              {studentsWithScores.length === 0 ? (
                <TableRow>
                  <EmptyMessage colSpan="3">
                    No students have completed this module or scores not uploaded.
                  </EmptyMessage>
                </TableRow>
              ) : (
                studentsWithScores.map((stu, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{stu.name}</TableCell>
                    <TableCell>{stu.regNo}</TableCell>
                    <TableCell>{stu.averageScore !== undefined ? stu.averageScore : 'NA'}</TableCell>
                  </TableRow>
                ))
              )}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default TrainingModuleView;
