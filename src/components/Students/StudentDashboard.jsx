import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import sampleData from '../../../sampleData.json';

// Simple avatar growth animation keyframes
const grow = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const Container = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #6b7280, #9ca3af);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  animation: \${grow} 3s ease-in-out infinite;
`;

const Summary = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const SummaryItem = styled.div`
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin: 0.5rem;
  flex: 1 1 150px;
  text-align: center;
`;

const Tag = styled.span`
  background-color: #3b82f6;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
  user-select: none;
`;

const ModulesList = styled.div`
  margin-bottom: 2rem;
`;

const ModuleItem = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    background-color: #e0e7ff;
  }
`;

const ModuleDetails = styled.div`
  flex: 1;
`;

const ModuleTitle = styled.h3`
  margin: 0 0 0.25rem 0;
  font-weight: 700;
`;

const ModuleInfo = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const Score = styled.div`
  font-weight: 600;
  font-size: 1rem;
  min-width: 50px;
  text-align: right;
`;

const CodingPractice = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: #374151;
`;

const PracticeStat = styled.div`
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #4b5563;
`;

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [trainingProgress, setTrainingProgress] = useState([]);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    // For demo, pick first student from sample data
    const currentStudent = sampleData.students[0];
    setStudent(currentStudent);

    // Get modules data
    setModules(sampleData.modules);

    // Get training progress for this student
    const progress = sampleData.trainingProgress.filter(tp => tp.student === currentStudent._id);
    setTrainingProgress(progress);
  }, []);

  if (!student) return <Container>Loading...</Container>;

  // Calculate summary data
  const totalModules = student.trainings.length;
  const attendancePercentages = trainingProgress.map(tp => {
    const totalDays = tp.attendance.length;
    const presentDays = tp.attendance.filter(a => a.present).length;
    return totalDays > 0 ? (presentDays / totalDays) * 100 : 0;
  });
  const avgAttendance = attendancePercentages.length > 0 ? (attendancePercentages.reduce((a,b) => a+b, 0) / attendancePercentages.length).toFixed(1) : 'NA';

  const avgScores = trainingProgress.map(tp => tp.averageScore);
  const overallAvgScore = avgScores.length > 0 ? (avgScores.reduce((a,b) => a+b, 0) / avgScores.length).toFixed(1) : 'NA';

  // Determine avatar stage based on number of trainings completed
  const avatarStages = ['👶', '🧑', '🧑‍🎓', '🧑‍💼', '🧓'];
  const avatarIndex = Math.min(student.numTrainingsCompleted, avatarStages.length - 1);
  const avatar = avatarStages[avatarIndex];

  return (
    <Container>
      <Avatar title="Your growth avatar">{avatar}</Avatar>
      <Summary>
        <SummaryItem>
          <div>Modules Attended</div>
          <div><strong>{totalModules}</strong></div>
        </SummaryItem>
        <SummaryItem>
          <div>Average Score</div>
          <div><strong>{overallAvgScore}</strong></div>
        </SummaryItem>
        <SummaryItem>
          <div>Attendance %</div>
          <div><strong>{avgAttendance}</strong></div>
        </SummaryItem>
        <SummaryItem>
          <div>Placement Category</div>
          <Tag>{student.batch}</Tag>
        </SummaryItem>
      </Summary>

      <ModulesList>
        <SectionTitle>Your Training Modules</SectionTitle>
        {student.trainings.map(({ moduleId }) => {
          const module = modules.find(m => m._id === moduleId);
          const progress = trainingProgress.find(tp => tp.training === moduleId);
          const scoreDisplay = progress ? progress.averageScore.toFixed(1) : 'NA';
          return (
            <ModuleItem key={moduleId} onClick={() => alert('Module details not implemented yet')}>
              <ModuleDetails>
                <ModuleTitle>{module.title}</ModuleTitle>
                <ModuleInfo>Duration: {module.durationDays} days | Exams: {module.examsCount}</ModuleInfo>
              </ModuleDetails>
              <Score>{scoreDisplay}</Score>
            </ModuleItem>
          );
        })}
      </ModulesList>

      <CodingPractice>
        <SectionTitle>Coding Practice Stats</SectionTitle>
        <PracticeStat>LeetCode ID: {student.leetcodeId}</PracticeStat>
        <PracticeStat>CodeChef ID: {student.codechefId}</PracticeStat>
        <PracticeStat>Problems Solved: (mocked) 120</PracticeStat>
        <PracticeStat>Preferred Languages: (mocked) JavaScript, Python</PracticeStat>
      </CodingPractice>
    </Container>
  );
};

export default StudentDashboard;
