import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #4b5563;
  
  &:hover {
    color: #1f2937;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
`;

const DetailGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-size: 1rem;
  color: #111827;
`;

const TrainingsContainer = styled.div`
  margin-top: 2rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
`;

const TrainingCard = styled.div`
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
`;

const TrainingTitle = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  margin-top: 0.5rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${props => props.percentage >= 75 ? '#059669' : props.percentage >= 60 ? '#d97706' : '#dc2626'};
  width: ${props => props.percentage}%;
`;

const ExternalLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ExternalLink = styled.a`
  color: #2563eb;
  text-decoration: none;
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ExamScores = styled.div`
  margin-top: 1rem;
`;

const ExamScore = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: white;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ExamLabel = styled.span`
  font-size: 0.875rem;
  color: #4b5563;
`;

const ExamValue = styled.span`
  font-weight: 500;
  color: ${props => props.score >= 75 ? '#059669' : props.score >= 60 ? '#d97706' : '#dc2626'};
`;

const StudentDetailsModal = ({ student, onClose }) => {
  if (!student) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>Student Details</Title>

        <DetailGroup>
          <DetailLabel>Name</DetailLabel>
          <DetailValue>{student.name}</DetailValue>
        </DetailGroup>

        <DetailGroup>
          <DetailLabel>Registration Number</DetailLabel>
          <DetailValue>{student.regNo}</DetailValue>
        </DetailGroup>

        <DetailGroup>
          <DetailLabel>Email</DetailLabel>
          <DetailValue>{student.email}</DetailValue>
        </DetailGroup>

        <DetailGroup>
          <DetailLabel>Batch</DetailLabel>
          <DetailValue>{student.batch}</DetailValue>
        </DetailGroup>

        <DetailGroup>
          <DetailLabel>Passout Year</DetailLabel>
          <DetailValue>{student.passoutYear}</DetailValue>
        </DetailGroup>

        <ExternalLinks>
          {student.codechefId && (
            <ExternalLink 
              href={`https://www.codechef.com/users/${student.codechefId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              CodeChef Profile
            </ExternalLink>
          )}
          {student.leetcodeId && (
            <ExternalLink 
              href={`https://leetcode.com/${student.leetcodeId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              LeetCode Profile
            </ExternalLink>
          )}
        </ExternalLinks>

        <TrainingsContainer>
          <Title>Training Modules ({student.trainings ? student.trainings.length : 0} trainings)</Title>
          {student.trainings && student.trainings.length > 0 ? (
            student.trainings.map((training, index) => (
              <TrainingCard key={index}>
                <TrainingTitle>{training.moduleId.title}</TrainingTitle>
                <DetailGroup>
                  <DetailLabel>Status</DetailLabel>
                  <DetailValue>
                    {training.progress.isCompleted ? 'Completed' : 'In Progress'}
                  </DetailValue>
                </DetailGroup>
                {training.progress.score !== undefined && (
                  <DetailGroup>
                    <DetailLabel>Score</DetailLabel>
                    <DetailValue>{training.progress.score}%</DetailValue>
                    <ProgressBar>
                      <ProgressFill percentage={training.progress.score} />
                    </ProgressBar>
                  </DetailGroup>
                )}
                {training.progress.attendance !== undefined && (
                  <DetailGroup>
                    <DetailLabel>Attendance</DetailLabel>
                    <DetailValue>{training.progress.attendance}%</DetailValue>
                    <ProgressBar>
                      <ProgressFill percentage={training.progress.attendance} />
                    </ProgressBar>
                  </DetailGroup>
                )}
                {training.progress.examScores && training.progress.examScores.length > 0 && (
                  <DetailGroup>
                    <DetailLabel>Exam Scores</DetailLabel>
                    <ExamScores>
                      {training.progress.examScores.map((exam, examIndex) => (
                        <ExamScore key={examIndex}>
                          <ExamLabel>Exam {exam.exam}</ExamLabel>
                          <ExamValue score={exam.score}>{exam.score}%</ExamValue>
                        </ExamScore>
                      ))}
                    </ExamScores>
                  </DetailGroup>
                )}
              </TrainingCard>
            ))
          ) : (
            <DetailValue style={{ textAlign: 'center', color: '#6b7280' }}>
              No training modules attended yet
            </DetailValue>
          )}
        </TrainingsContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default StudentDetailsModal; 