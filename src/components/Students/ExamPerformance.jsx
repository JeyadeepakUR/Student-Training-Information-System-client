import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import sampleData from '../../../sampleData.json';

const Container = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #374151;
`;

const ModuleSelect = styled.select`
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #d1d5db;
`;

const ExamList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ExamItem = styled.li`
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #374151;
`;

const ExamPerformance = () => {
  const [student, setStudent] = useState(null);
  const [modules, setModules] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [examScores, setExamScores] = useState([]);

  useEffect(() => {
    const currentStudent = sampleData.students[0];
    setStudent(currentStudent);
    setModules(sampleData.modules);
    const progress = sampleData.trainingProgress.filter(tp => tp.student === currentStudent._id);
    setTrainingProgress(progress);
  }, []);

  useEffect(() => {
    if (selectedModuleId) {
      const progress = trainingProgress.find(tp => tp.training === selectedModuleId);
      setExamScores(progress ? progress.examScores : []);
    } else {
      setExamScores([]);
    }
  }, [selectedModuleId, trainingProgress]);

  if (!student) return <Container>Loading...</Container>;

  return (
    <Container>
      <Title>Exam Performance</Title>
      <ModuleSelect
        value={selectedModuleId || ''}
        onChange={e => setSelectedModuleId(e.target.value)}
      >
        <option value="" disabled>Select a training module</option>
        {student.trainings.map(({ moduleId }) => {
          const module = modules.find(m => m._id === moduleId);
          return (
            <option key={moduleId} value={moduleId}>
              {module ? module.title : 'Unknown Module'}
            </option>
          );
        })}
      </ModuleSelect>

      <ExamList>
        {examScores.length === 0 && <li>No exam scores available.</li>}
        {examScores.map(({ exam, score }) => (
          <ExamItem key={exam}>
            <span>Exam {exam}</span>
            <span>{score}</span>
          </ExamItem>
        ))}
      </ExamList>
    </Container>
  );
};

export default ExamPerformance;
