import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import sampleData from '../../../sampleData.json';

const Container = styled.div`
  padding: 2rem;
  max-width: 600px;
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

const ProfileItem = styled.div`
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #4b5563;
`;

const Label = styled.span`
  font-weight: 600;
  color: #111827;
`;

const Profile = () => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const currentStudent = sampleData.students[0];
    setStudent(currentStudent);
  }, []);

  if (!student) return <Container>Loading...</Container>;

  return (
    <Container>
      <Title>Profile</Title>
      <ProfileItem>
        <Label>Name: </Label>{student.name}
      </ProfileItem>
      <ProfileItem>
        <Label>Registration Number: </Label>{student.regNo}
      </ProfileItem>
      <ProfileItem>
        <Label>Email: </Label>{student.email}
      </ProfileItem>
      <ProfileItem>
        <Label>Batch: </Label>{student.batch}
      </ProfileItem>
      <ProfileItem>
        <Label>Passout Year: </Label>{student.passoutYear}
      </ProfileItem>
      <ProfileItem>
        <Label>LeetCode ID: </Label>{student.leetcodeId}
      </ProfileItem>
      <ProfileItem>
        <Label>CodeChef ID: </Label>{student.codechefId}
      </ProfileItem>
      <ProfileItem>
        <Label>Coding Practice Stats: </Label>Problems Solved: (mocked) 120, Preferred Languages: (mocked) JavaScript, Python
      </ProfileItem>
    </Container>
  );
};

export default Profile;
