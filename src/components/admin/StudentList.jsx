import React from 'react';

const StudentList = ({ students, batch, onStudentSelect }) => {
  console.log('Rendering StudentList with students:', students);
  return (
    <div style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>{batch} Students</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '0.5rem', overflow: 'hidden' }}>
        <thead style={{ backgroundColor: '#e5e7eb', textAlign: 'left', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <tr>
            <th style={{ padding: '1rem', borderBottom: '1px solid #d1d5db' }}>Name</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid #d1d5db' }}>Reg. No</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid #d1d5db' }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map((stu, idx) => (
            <tr
              key={idx}
              onClick={() => onStudentSelect(stu)}
              style={{ cursor: 'pointer', borderTop: '1px solid #d1d5db', transition: 'background-color 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <td style={{ padding: '1rem' }}>{stu.name}</td>
              <td style={{ padding: '1rem' }}>{stu.regNo}</td>
              <td style={{ padding: '1rem' }}>{stu.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
