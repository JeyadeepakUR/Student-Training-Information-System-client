import React, { useState } from 'react';
import { parseExcelFile } from '../../utils/excelParser';
import { useSampleData } from '../../utils/sampleDataContext.jsx';

const requiredColumns = ['regno', 'score'];

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
    <div className="space-y-8">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Upload Exam Scores</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Training Module
            </label>
            <select
              value={selectedModule}
              onChange={handleModuleChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">-- Select Module --</option>
              {modules.map((mod) => (
                <option key={mod._id} value={mod._id}>{mod.title}</option>
              ))}
            </select>
          </div>

          <div className="mb-8">
            <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  mode === 'excel'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => { setMode('excel'); setError(''); setSuccessMessage(''); }}
              >
                Excel Upload
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  mode === 'individual'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => { setMode('individual'); setError(''); setSuccessMessage(''); }}
              >
                Individual Entry
              </button>
            </div>
          </div>

          {mode === 'excel' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Score Sheet
                </label>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    focus:outline-none"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Excel file should contain columns: Registration Number (regno) and Score
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleParse}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Parse Excel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={parsedData.length === 0 || isSubmitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Scores'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="regno" className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Number
                  </label>
                  <input
                    id="regno"
                    type="text"
                    name="regno"
                    value={formData.regno}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter registration number"
                  />
                </div>
                <div>
                  <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
                    Score
                  </label>
                  <input
                    id="score"
                    type="number"
                    name="score"
                    min="0"
                    max="100"
                    value={formData.score}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter score (0-100)"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={addIndividualEntry}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Entry
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={individualEntries.length === 0 || isSubmitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Scores'}
                </button>
              </div>
            </>
          )}
        </div>

        {(mode === 'excel' ? parsedData.length > 0 : individualEntries.length > 0) && (
          <div className="mt-8 overflow-hidden border border-gray-200 rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Registration Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(mode === 'excel' ? parsedData : individualEntries).map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {row.regno}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {row.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreUpload;
