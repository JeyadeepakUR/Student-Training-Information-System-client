import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getAllModules, getModuleStudents, getStudentModulePerformance } from '../../services/api';
import StudentDetailsModal from './StudentDetailsModal';

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
  cursor: pointer;

  &:hover {
    background-color: #f9fafb;
  }
`;

const EmptyMessage = styled.td`
  padding: 0.75rem;
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;
  background-color: #fee2e2;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
`;

const LoadingMessage = styled.div`
  color: #4b5563;
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;
`;

const TrainingModuleView = () => {
  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [studentsWithScores, setStudentsWithScores] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllModules();
        setModules(response.data.modules || []);
      } catch (err) {
        setError('Failed to fetch training modules');
        setModules([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, []);

  useEffect(() => {
    const fetchModuleStudents = async () => {
      if (!selectedModuleId) {
        setStudentsWithScores([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await getModuleStudents(selectedModuleId);
        console.log(response.data);
        const students = response.data.students || [];
        setStudentsWithScores(students.map(student => ({
          _id: student._id,
          name: student.name,
          regNo: student.regNo,
          averageScore: student.trainingProgress?.averageScore || 'NA'
        })));
      } catch (err) {
        setError('Failed to fetch module students');
        setStudentsWithScores([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModuleStudents();
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

  const handleStudentClick = async (studentId) => {
    try {
      if (!selectedModuleId) {
        setError('No module selected');
        return;
      }
      const response = await getStudentModulePerformance(studentId, selectedModuleId);
      const studentDetails = {
        ...response.data.student,
        trainings: [{
          moduleId: response.data.module,
          progress: {
            isCompleted: response.data.performance.averageScore >= 75,
            score: response.data.performance.averageScore,
            attendance: response.data.performance.attendance.percentage,
            examScores: response.data.performance.examScores
          }
        }]
      };
      setSelectedStudent(studentDetails);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch student details:', err);
      setError('Failed to fetch student details');
    }
  };

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Training Modules</Title>
      
      {isLoading && modules.length === 0 ? (
        <LoadingMessage>Loading training modules...</LoadingMessage>
      ) : (
        <>
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
                  {isLoading ? (
                    <TableRow>
                      <EmptyMessage colSpan="3">
                        Loading students...
                      </EmptyMessage>
                    </TableRow>
                  ) : studentsWithScores.length === 0 ? (
                    <TableRow>
                      <EmptyMessage colSpan="3">
                        No students have completed this module or scores not uploaded.
                      </EmptyMessage>
                    </TableRow>
                  ) : (
                    studentsWithScores.map((stu) => (
                      <TableRow 
                        key={stu._id} 
                        onClick={() => handleStudentClick(stu._id)}
                      >
                        <TableCell>{stu.name}</TableCell>
                        <TableCell>{stu.regNo}</TableCell>
                        <TableCell>{stu.averageScore}</TableCell>
                      </TableRow>
                    ))
                  )}
                </tbody>
              </Table>
            </>
          )}
        </>
      )}

      {isModalOpen && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </Container>
  );
};

export default TrainingModuleView;
