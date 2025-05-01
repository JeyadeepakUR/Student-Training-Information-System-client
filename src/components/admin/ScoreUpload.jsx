import React, { useState } from 'react';
import styled from 'styled-components';
import { parseExcelFile } from '../../utils/excelParser';
import { useSampleData } from '../../utils/sampleDataContext.jsx';

const requiredColumns = ['regno', 'score'];

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

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #111827;
  font-size: 0.875rem;
  transition: all 200ms ease-in-out;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;

const ModeSelector = styled.div`
  margin-bottom: 2rem;
`;

const ModeButtonGroup = styled.div`
  display: inline-flex;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  padding: 0.25rem;
  background-color: #f9fafb;
`;

const ModeButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 200ms ease-in-out;
  background-color: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#2563eb' : '#4b5563'};
  box-shadow: ${props => props.active ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'};

  &:hover {
    color: ${props => props.active ? '#2563eb' : '#111827'};
  }
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #111827;
  font-size: 0.875rem;
  transition: all 200ms ease-in-out;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  &::file-selector-button {
    margin-right: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: none;
    font-size: 0.875rem;
    font-weight: 600;
    background-color: #eff6ff;
    color: #1d4ed8;
    cursor: pointer;
    transition: background-color 150ms ease-in-out;

    &:hover {
      background-color: #dbeafe;
    }
  }
`;

const HelperText = styled.p`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  background-color: ${props => props.variant === 'success' ? '#059669' : '#2563eb'};
  border: none;
  cursor: pointer;
  transition: all 200ms ease-in-out;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: ${props => props.variant === 'success' ? '#047857' : '#1d4ed8'};
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.variant === 'success' ? 'rgba(5, 150, 105, 0.5)' : 'rgba(59, 130, 246, 0.5)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 0.375rem;
  color: #dc2626;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f0fdf4;
  border: 1px solid #dcfce7;
  border-radius: 0.375rem;
  color: #059669;
  font-size: 0.875rem;
`;

const ScoreUpload = () => {
  const { data, updateScores } = useSampleData();
  const [mode, setMode] = useState('excel');
  const [modules] = useState(data.modules);
  const [selectedModule, setSelectedModule] = useState('');
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [individualEntries, setIndividualEntries] = useState([]);
  const [formData, setFormData] = useState({
    regno: '',
    score: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleModuleChange = (e) => {
    setSelectedModule(e.target.value);
    setParsedData([]);
    setIndividualEntries([]);
    setError('');
    setSuccessMessage('');
  };

  const handleFileChange = (e) => {
    setError('');
    setSuccessMessage('');
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleParse = async () => {
    if (!selectedModule) {
      setError('Please select a training module.');
      return;
    }
    if (!file) {
      setError('Please select an Excel file to upload.');
      return;
    }
    try {
      const data = await parseExcelFile(file);
      const columns = Object.keys(data[0] || {}).map(col => col.toLowerCase());
      const missingColumns = requiredColumns.filter(col => !columns.includes(col));
      if (missingColumns.length > 0) {
        setError(`Missing required columns: ${missingColumns.join(', ')}`);
        setParsedData([]);
        return;
      }

      // Validate registration numbers exist in the system
      const invalidStudents = data.filter(entry => 
        !data.students.some(student => student.regNo === entry.regno)
      );

      if (invalidStudents.length > 0) {
        setError(`Invalid registration numbers found: ${invalidStudents.map(s => s.regno).join(', ')}`);
        setParsedData([]);
        return;
      }

      setParsedData(data);
      setError('');
    } catch {
      setError('Failed to parse Excel file. Please ensure it is a valid Excel file.');
      setParsedData([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addIndividualEntry = () => {
    if (!selectedModule) {
      setError('Please select a training module.');
      return;
    }
    const { regno, score } = formData;
    if (!regno || !score) {
      setError('Please fill all fields to add an entry.');
      return;
    }
    if (isNaN(score) || score < 0 || score > 100) {
      setError('Score must be a number between 0 and 100.');
      return;
    }

    // Validate registration number exists
    const studentExists = data.students.some(student => student.regNo === regno);
    if (!studentExists) {
      setError('Invalid registration number. Student not found.');
      return;
    }

    setIndividualEntries(prev => [...prev, { regno, score: parseInt(score, 10) }]);
    setFormData({
      regno: '',
      score: '',
    });
    setError('');
  };

  const handleSubmit = () => {
    if (!selectedModule) {
      setError('Please select a training module.');
      return;
    }

    const dataToSubmit = mode === 'excel' ? parsedData : individualEntries;
    
    if (dataToSubmit.length === 0) {
      setError(`No data to submit. Please ${mode === 'excel' ? 'parse a valid Excel file' : 'add at least one score'} first.`);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      updateScores(selectedModule, dataToSubmit);
      setSuccessMessage(`Successfully processed scores for ${dataToSubmit.length} students.`);
      
      // Reset form state
      if (mode === 'excel') {
        setParsedData([]);
        setFile(null);
      } else {
        setIndividualEntries([]);
        setFormData({
          regno: '',
          score: '',
        });
      }
      setSelectedModule('');
    } catch (err) {
      console.error('Error submitting scores:', err);
      setError('Failed to submit scores. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Upload Exam Scores</Title>
        
        <FormGroup>
          <Label>Select Training Module</Label>
          <Select
            value={selectedModule}
            onChange={handleModuleChange}
          >
            <option value="">-- Select Module --</option>
            {modules.map((mod) => (
              <option key={mod._id} value={mod._id}>{mod.title}</option>
            ))}
          </Select>
        </FormGroup>

        <ModeSelector>
          <ModeButtonGroup>
            <ModeButton
              active={mode === 'excel'}
              onClick={() => { setMode('excel'); setError(''); setSuccessMessage(''); }}
            >
              Excel Upload
            </ModeButton>
            <ModeButton
              active={mode === 'individual'}
              onClick={() => { setMode('individual'); setError(''); setSuccessMessage(''); }}
            >
              Individual Entry
            </ModeButton>
          </ModeButtonGroup>
        </ModeSelector>

        {mode === 'excel' ? (
          <>
            <FormGroup>
              <Label>Upload Score Sheet</Label>
              <Input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
              />
              <HelperText>
                Excel file should contain columns: Registration Number (regno) and Score
              </HelperText>
            </FormGroup>

            <ButtonGroup>
              <Button onClick={handleParse} disabled={isSubmitting}>
                Parse Excel
              </Button>
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={parsedData.length === 0 || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Scores'}
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="regno">Registration Number</Label>
                <Input
                  id="regno"
                  type="text"
                  name="regno"
                  value={formData.regno}
                  onChange={handleInputChange}
                  placeholder="Enter registration number"
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="score">Score</Label>
                <Input
                  id="score"
                  type="number"
                  name="score"
                  value={formData.score}
                  onChange={handleInputChange}
                  placeholder="Enter score (0-100)"
                  min="0"
                  max="100"
                />
              </FormGroup>
            </FormGrid>

            <ButtonGroup>
              <Button onClick={addIndividualEntry}>
                Add Score
              </Button>
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={individualEntries.length === 0 || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Scores'}
              </Button>
            </ButtonGroup>
          </>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      </Card>
    </Container>
  );
};

export default ScoreUpload;
