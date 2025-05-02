import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import StudentNav from './StudentNav';
import StudentDashboard from './StudentDashboard';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ContentArea = styled.main`
  flex: 1;
  overflow-y: auto;
  background-color: #fff;
  padding: 1rem 2rem;
`;

const StudentLayout = () => {
  return (
    <LayoutContainer>
      <StudentNav />
      <ContentArea>
        <Outlet />
      </ContentArea>
    </LayoutContainer>
  );
};

export default StudentLayout;
