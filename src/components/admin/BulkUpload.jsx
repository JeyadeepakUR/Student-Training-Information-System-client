import React, { useState } from 'react';
import styled from 'styled-components';
import { parseExcelFile } from '../../utils/excelParser';

const requiredColumns = ['name', 'regno', 'mail'];
const batchTypes = ['Marquee', 'Super Dream', 'Dream', 'Service'];
const currentYear = new Date().getFullYear();
const passoutYears = Array.from({ length: 8 }, (_, i) => (currentYear + i - 1).toString());

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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
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

const BulkUpload = () => {
  const [mode, setMode] = useState('excel');
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [individualEntries, setIndividualEntries] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    regno: '',
    mail: '',
    batch: '',
    passoutYear: '',
  });
  const [excelUploadData, setExcelUploadData] = useState({
    batch: '',
    passoutYear: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    setError('');
    setSuccessMessage('');
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleExcelDataChange = (e) => {
    const { name, value } = e.target;
    setExcelUploadData(prev => ({ ...prev, [name]: value }));
  };

  const handleParse = async () => {
    if (!file) {
      setError('Please select an Excel file to upload.');
      return;
    }
    if (!excelUploadData.batch || !excelUploadData.passoutYear) {
      setError('Please select both batch and passout year.');
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
      const enrichedData = data.map(entry => ({
        ...entry,
        batch: excelUploadData.batch,
        passoutYear: excelUploadData.passoutYear,
      }));
      setParsedData(enrichedData);
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
    const { name, regno, mail, batch, passoutYear } = formData;
    if (!name || !regno || !mail || !batch || !passoutYear) {
      setError('Please fill all fields to add an entry.');
      return;
    }
    setIndividualEntries(prev => [...prev, { name, regno, mail, batch, passoutYear }]);
    setFormData({
      name: '',
      regno: '',
      mail: '',
      batch: '',
      passoutYear: '',
    });
    setError('');
  };

  const handleSubmit = () => {
    if (mode === 'excel') {
      if (parsedData.length === 0) {
        setError('No data to submit. Please parse a valid Excel file first.');
        return;
      }
      setSuccessMessage(`Successfully processed ${parsedData.length} students.`);
      setError('');
      setParsedData([]);
      setFile(null);
      setExcelUploadData({ batch: '', passoutYear: '' });
    } else {
      if (individualEntries.length === 0) {
        setError('No individual entries to submit. Please add at least one student.');
        return;
      }
      setSuccessMessage(`Successfully processed ${individualEntries.length} students.`);
      setError('');
      setIndividualEntries([]);
      setFormData({
        name: '',
        regno: '',
        mail: '',
        batch: '',
        passoutYear: '',
      });
    }
  };

  return (
    <Container>
      <Card>
        <Title>Bulk Student Enrollment</Title>
        
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
            <FormGrid>
              <FormGroup>
                <Label>Select Batch</Label>
                <Select
                  name="batch"
                  value={excelUploadData.batch}
                  onChange={handleExcelDataChange}
                >
                  <option value="">-- Select Batch --</option>
                  {batchTypes.map((batch) => (
                    <option key={batch} value={batch}>{batch}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Select Passout Year</Label>
                <Select
                  name="passoutYear"
                  value={excelUploadData.passoutYear}
                  onChange={handleExcelDataChange}
                >
                  <option value="">-- Select Year --</option>
                  {passoutYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Select>
              </FormGroup>
            </FormGrid>

            <FormGroup>
              <Label>Upload Excel File</Label>
              <Input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
              />
              <HelperText>
                Excel file should contain columns: Name, Registration Number, and Email
              </HelperText>
            </FormGroup>

            <ButtonGroup>
              <Button onClick={handleParse}>
                Parse Excel
              </Button>
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={parsedData.length === 0}
              >
                Submit Students
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <>
            <FormGrid>
              <FormGroup>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter student name"
                />
              </FormGroup>
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
                <Label htmlFor="mail">Email</Label>
                <Input
                  id="mail"
                  type="email"
                  name="mail"
                  value={formData.mail}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="batch">Batch</Label>
                <Select
                  id="batch"
                  name="batch"
                  value={formData.batch}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Batch --</option>
                  {batchTypes.map((batch) => (
                    <option key={batch} value={batch}>{batch}</option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label htmlFor="passoutYear">Passout Year</Label>
                <Select
                  id="passoutYear"
                  name="passoutYear"
                  value={formData.passoutYear}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Year --</option>
                  {passoutYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Select>
              </FormGroup>
            </FormGrid>

            <ButtonGroup>
              <Button onClick={addIndividualEntry}>
                Add Student
              </Button>
              <Button
                variant="success"
                onClick={handleSubmit}
                disabled={individualEntries.length === 0}
              >
                Submit Students
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

export default BulkUpload;