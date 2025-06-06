import React from 'react';
import { useNavigate } from 'react-router-dom';

const actions = [
  {
    title: 'Upload Course',
    desc: 'Create and share new courses with students.',
    icon: 'fas fa-upload',
    onClick: (navigate) => navigate('/instructor/upload-course'),
  },
  {
    title: 'Upload Assessment',
    desc: 'Add new assessments for your courses.',
    icon: 'fas fa-plus-circle',
    onClick: (navigate) => navigate('/instructor/upload-assessment'),
  },
  {
    title: 'View Courses',
    desc: 'See all your created courses.',
    icon: 'fas fa-book',
    onClick: (navigate) => navigate('/instructor/courses'),
  },
  {
    title: 'View Assessments',
    desc: 'Manage and review all assessments.',
    icon: 'fas fa-tasks',
    onClick: (navigate) => navigate('/instructor/assessments'),
  },
];

const InstructorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="dashboard-page p-4 p-md-5 w-100" style={{ maxWidth: 900 }}>
        <h2 className="mb-4 text-center fw-bold" style={{ color: 'var(--primary-color)' }}>Instructor Dashboard</h2>
        <div className="row g-4">
          {actions.map((action, idx) => (
            <div className="col-12 col-md-6" key={action.title}>
              <div
                className={`dashboard-action-card h-100 p-4 d-flex flex-column align-items-center justify-content-center text-center shadow-lg`}
                style={{ borderRadius: '1.25rem', cursor: 'pointer', minHeight: 200 }}
                onClick={() => action.onClick(navigate)}
                tabIndex={0}
                role="button"
                onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && action.onClick(navigate)}
              >
                <div className="mb-3">
                  <i className={`${action.icon} fa-2x`}></i>
                </div>
                <h5 className="fw-bold mb-2">{action.title}</h5>
                <p className="mb-0 text-light-emphasis">{action.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
