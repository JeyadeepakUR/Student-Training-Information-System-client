import React, { useState } from 'react';
import { parseExcelFile } from '../../utils/excelParser';

const requiredColumns = ['name', 'regno', 'mail'];
const batchTypes = ['Marquee', 'Super Dream', 'Dream', 'Service'];
const currentYear = new Date().getFullYear();
const passoutYears = Array.from({ length: 8 }, (_, i) => (currentYear + i - 1).toString());

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
      // Add batch and passout year to each entry
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
    <div className="space-y-8">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Bulk Student Enrollment</h2>
        
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Batch
                  </label>
                  <select
                    name="batch"
                    value={excelUploadData.batch}
                    onChange={handleExcelDataChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">-- Select Batch --</option>
                    {batchTypes.map((batch) => (
                      <option key={batch} value={batch}>{batch}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Passout Year
                  </label>
                  <select
                    name="passoutYear"
                    value={excelUploadData.passoutYear}
                    onChange={handleExcelDataChange}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">-- Select Year --</option>
                    {passoutYears.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Excel File
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
                  Excel file should contain columns: Name, Registration Number, and Email
                </p>
              </div>
            </div>

            <div className="flex space-x-4 mb-6">
              <button
                onClick={handleParse}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow"
              >
                Parse Excel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={parsedData.length === 0}
              >
                Submit Students
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter student name"
                />
              </div>
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
                <label htmlFor="mail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="mail"
                  type="email"
                  name="mail"
                  value={formData.mail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">
                  Batch
                </label>
                <select
                  id="batch"
                  name="batch"
                  value={formData.batch}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">-- Select Batch --</option>
                  {batchTypes.map((batch) => (
                    <option key={batch} value={batch}>{batch}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="passoutYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Passout Year
                </label>
                <select
                  id="passoutYear"
                  name="passoutYear"
                  value={formData.passoutYear}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">-- Select Year --</option>
                  {passoutYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-4 mb-6">
              <button
                onClick={addIndividualEntry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow"
              >
                Add Entry
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={individualEntries.length === 0}
              >
                Submit Students
              </button>
            </div>
          </>
        )}

        {(mode === 'excel' ? parsedData.length > 0 : individualEntries.length > 0) && (
          <div className="mt-8 overflow-hidden border border-gray-200 rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Reg. No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Batch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Passout Year</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(mode === 'excel' ? parsedData : individualEntries).map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.regno}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.mail}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.batch}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.passoutYear}</td>
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

export default BulkUpload;