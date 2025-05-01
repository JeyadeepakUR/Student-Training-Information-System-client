import React from 'react';

const StudentProfile = ({ student }) => {
  if (!student) {
    return <div>Select a student to view details</div>;
  }

  // Determine animation image based on number of trainings completed
  const getAnimationImage = (numTrainings) => {
    if (numTrainings === 0) return '/assets/child.png';
    if (numTrainings < 3) return '/assets/teen.png';
    if (numTrainings < 6) return '/assets/young_adult.png';
    return '/assets/adult.png';
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">{student.name} - Profile</h2>
      <img
        src={getAnimationImage(student.numTrainingsCompleted)}
        alt="Training Progress Animation"
        className="mb-4 w-48 h-48 object-contain"
      />
      <p><strong>Registration No:</strong> {student.regNo}</p>
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Batch:</strong> {student.batch}</p>
      <p><strong>Passout Year:</strong> {student.passoutYear}</p>
      <p><strong>Number of Trainings Completed:</strong> {student.numTrainingsCompleted}</p>
      <h3 className="mt-4 font-semibold">Trainings Attended:</h3>
      <ul className="list-disc list-inside">
        {student.trainings && student.trainings.length > 0 ? (
          student.trainings.map((training, idx) => (
            <li key={idx}>{training.moduleId}</li> // moduleId can be replaced with module title if available
          ))
        ) : (
          <li>No trainings attended yet.</li>
        )}
      </ul>
    </div>
  );
};

export default StudentProfile;
