import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 3rem 1rem;
  
  @media (min-width: 640px) {
    padding: 3rem 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 3rem 2rem;
  }
`;

const FormContainer = styled.div`
  max-width: 28rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Title = styled.h2`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
`;

const Form = styled.form`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: -1px;
`;

const Label = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const Input = styled.input`
  appearance: none;
  position: relative;
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  background-color: white;
  color: #111827;
  font-size: 0.875rem;
  border-radius: ${props => props.isFirst ? '0.375rem 0.375rem 0 0' : '0 0 0.375rem 0.375rem'};
  
  &::placeholder {
    color: #6b7280;
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    z-index: 10;
  }
`;

const Button = styled.button`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  color: white;
  background-color: #2563eb;
  
  &:hover {
    background-color: #1d4ed8;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  text-align: center;
`;

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // For demo purposes, using a simple check
    // In a real app, you would validate against your backend
    if (email === 'admin@example.com' && password === 'admin123') {
      // Store auth state
      localStorage.setItem('isAdminAuthenticated', 'true');
      // Redirect to dashboard
      navigate('/admin/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Container>
      <FormContainer>
        <div>
          <Title>Admin Login</Title>
        </div>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isFirst
            />
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit">
            Sign in
          </Button>
        </Form>
      </FormContainer>
    </Container>
  );
};

export default AdminLogin;
