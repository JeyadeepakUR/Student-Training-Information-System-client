import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background-color: #e5e7eb;
  text-align: left;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableHeader = styled.th`
  padding: 1rem;
  border-bottom: 1px solid #d1d5db;
`;

const TableRow = styled.tr`
  cursor: pointer;
  border-top: 1px solid #d1d5db;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
`;

const StudentList = ({ students, batch, onStudentSelect }) => {
  console.log('Rendering StudentList with students:', students);
  return (
    <Container>
      <Title>{batch} Students</Title>
      <Table>
        <TableHead>
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Reg. No</TableHeader>
            <TableHeader>Email</TableHeader>
          </tr>
        </TableHead>
        <tbody>
          {students.map((stu, idx) => (
            <TableRow
              key={idx}
              onClick={() => onStudentSelect(stu)}
            >
              <TableCell>{stu.name}</TableCell>
              <TableCell>{stu.regNo}</TableCell>
              <TableCell>{stu.email}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default StudentList;
