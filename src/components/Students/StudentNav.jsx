import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const NavContainer = styled.nav`
  width: 220px;
  background-color: #f3f4f6;
  height: 100vh;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const NavItem = styled(NavLink)`
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  color: #374151;
  text-decoration: none;
  font-weight: 600;
  border-radius: 6px;

  &.active {
    background-color: #3b82f6;
    color: white;
  }

  &:hover {
    background-color: #dbeafe;
    color: #1e40af;
  }
`;

const StudentNav = () => {
  return (
    <NavContainer>
      <NavItem to="/" end>
        Dashboard
      </NavItem>
      <NavItem to="/student/profile">
        Profile
      </NavItem>
      <NavItem to="/student/trainings">
        My Trainings
      </NavItem>
      <NavItem to="/student/attendance">
        Attendance
      </NavItem>
      <NavItem to="/student/exams">
        Exam Performance
      </NavItem>
      <NavItem to="/student/leaderboard">
        Leaderboard
      </NavItem>
    </NavContainer>
  );
};

export default StudentNav;
