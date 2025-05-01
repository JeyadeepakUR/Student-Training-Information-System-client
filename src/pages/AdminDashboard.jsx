import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import sampleData from '../../sampleData.json';

const batchTypes = ['Marquee', 'Super Dream', 'Dream', 'Service'];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const TotalStatsCard = styled.div`
  background: linear-gradient(to bottom right, #3b82f6, #2563eb);
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const BatchStatsCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 200ms ease-in-out;
  
  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-0.25rem);
  }
`;

const StatsLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.isTotal ? '#e0e7ff' : '#4b5563'};
  margin-bottom: 0.5rem;
`;

const StatsValue = styled.p`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${props => props.isTotal ? 'white' : '#111827'};
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const TableTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
`;

const StudentCount = styled.span`
  padding: 0.25rem 0.75rem;
  background-color: #eff6ff;
  color: #1e40af;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
`;

const TableBody = styled.tbody`
  background-color: white;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 150ms ease-in-out;
  
  &:hover {
    background-color: #f9fafb;
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  white-space: nowrap;
  font-size: 0.875rem;
  color: ${props => props.isName ? '#111827' : '#4b5563'};
  font-weight: ${props => props.isName ? '500' : 'normal'};
`;

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
    <Container>
      <Card>
        <Title>Admin Dashboard</Title>
        
        <StatsGrid>
          <TotalStatsCard>
            <StatsLabel isTotal>Total Students</StatsLabel>
            <StatsValue isTotal>{counts.total || 0}</StatsValue>
          </TotalStatsCard>
          {batchTypes.map(batch => (
            <BatchStatsCard
              key={batch}
              onClick={() => fetchStudentsByBatch(batch)}
            >
              <StatsLabel>{batch}</StatsLabel>
              <StatsValue>{counts[batch] || 0}</StatsValue>
            </BatchStatsCard>
          ))}
        </StatsGrid>
      </Card>

      {selectedBatch && (
        <Card>
          <TableHeader>
            <TableTitle>{selectedBatch} Students</TableTitle>
            <StudentCount>{students.length} students</StudentCount>
          </TableHeader>
          <TableContainer>
            <Table>
              <TableHead>
                <tr>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Reg. No</TableHeaderCell>
                  <TableHeaderCell>Email</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {students.map((stu, idx) => (
                  <TableRow key={idx}>
                    <TableCell isName>{stu.name}</TableCell>
                    <TableCell>{stu.regNo}</TableCell>
                    <TableCell>{stu.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Container>
  );
};

export default AdminDashboard;
