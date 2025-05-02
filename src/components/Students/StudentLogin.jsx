import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';

const Container = styled.div`
  max-width: 400px;
  margin: 5rem auto;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const RegisterPrompt = styled.div`
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
  color: #374151;
`;

const StyledLink = styled(Link)`
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const StudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    // TODO: Implement actual login logic with API
    // For now, simulate successful login
    localStorage.setItem('isStudentAuthenticated', 'true');
    navigate('/');
  };

  return (
    <Container>
      <Title>Student Login</Title>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="student@example.com"
        />
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <Button type="submit">Login</Button>
      </Form>
      <RegisterPrompt>
        New student? <StyledLink to="/register">Register here</StyledLink>
      </RegisterPrompt>
    </Container>
  );
};

export default StudentLogin;
