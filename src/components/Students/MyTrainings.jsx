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

const ModuleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ModuleItem = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: #e0e7ff;
  }
`;

const ModuleInfo = styled.div`
  flex: 1;
`;

const ModuleTitle = styled.h3`
  margin: 0 0 0.25rem 0;
  font-weight: 700;
`;

const ModuleDetails = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const Score = styled.div`
  font-weight: 600;
  font-size: 1rem;
  min-width: 50px;
  text-align: right;
`;

const MyTrainings = () => {
  const [student, setStudent] = useState(null);
  const [modules, setModules] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState([]);

  useEffect(() => {
    const currentStudent = sampleData.students[0];
    setStudent(currentStudent);
    setModules(sampleData.modules);
    const progress = sampleData.trainingProgress.filter(tp => tp.student === currentStudent._id);
    setTrainingProgress(progress);
  }, []);

  if (!student) return <Container>Loading...</Container>;

  return (
    <Container>
      <Title>My Trainings</Title>
      <ModuleList>
        {student.trainings.map(({ moduleId }) => {
          const module = modules.find(m => m._id === moduleId);
          const progress = trainingProgress.find(tp => tp.training === moduleId);
          const scoreDisplay = progress ? progress.averageScore.toFixed(1) : 'NA';
          return (
            <ModuleItem key={moduleId}>
              <ModuleInfo>
                <ModuleTitle>{module.title}</ModuleTitle>
                <ModuleDetails>
                  Duration: {module.durationDays} days | Exams: {module.examsCount}
                </ModuleDetails>
              </ModuleInfo>
              <Score>{scoreDisplay}</Score>
            </ModuleItem>
          );
        })}
      </ModuleList>
    </Container>
  );
};

export default MyTrainings;
