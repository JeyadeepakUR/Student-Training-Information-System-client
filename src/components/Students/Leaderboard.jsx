import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import sampleData from '../../../sampleData.json';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #374151;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border-bottom: 2px solid #e5e7eb;
  padding: 0.75rem;
  text-align: left;
  color: #6b7280;
`;

const Td = styled.td`
  border-bottom: 1px solid #e5e7eb;
  padding: 0.75rem;
  color: #374151;
`;

const Leaderboard = () => {
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    // Compute rankings based on average scores from trainingProgress
    const studentScores = {};

    sampleData.trainingProgress.forEach((progress) => {
      const studentId = progress.student;
      if (!studentScores[studentId]) {
        studentScores[studentId] = { totalScore: 0, count: 0 };
      }
      studentScores[studentId].totalScore += progress.averageScore;
      studentScores[studentId].count += 1;
    });

    const rankingArray = Object.entries(studentScores).map(([studentId, data]) => {
      const student = sampleData.students.find((s) => s._id === studentId);
      return {
        id: studentId,
        name: student ? student.name : 'Unknown',
        averageScore: data.totalScore / data.count,
      };
    });

    rankingArray.sort((a, b) => b.averageScore - a.averageScore);

    setRankings(rankingArray);
  }, []);

  return (
    <Container>
      <Title>College Leaderboard</Title>
      <Table>
        <thead>
          <tr>
            <Th>Rank</Th>
            <Th>Name</Th>
            <Th>Average Score</Th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((student, index) => (
            <tr key={student.id}>
              <Td>{index + 1}</Td>
              <Td>{student.name}</Td>
              <Td>{student.averageScore.toFixed(2)}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Leaderboard;
