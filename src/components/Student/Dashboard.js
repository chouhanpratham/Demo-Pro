import React from 'react';
import { Link } from 'react-router-dom';

const actions = [
  {
    title: 'View Courses',
    desc: 'Browse and access your enrolled courses.',
    icon: 'fas fa-book',
    to: '/student/courses',
  },
  {
    title: 'Take Assessment',
    desc: 'Attempt available assessments for your courses.',
    icon: 'fas fa-tasks',
    to: '/student/assessments-list',
  },
  {
    title: 'View Results',
    desc: 'Check your assessment results and progress.',
    icon: 'fas fa-chart-bar',
    to: '/student/results',
  },
];

const Dashboard = () => {
  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="dashboard-page p-4 p-md-5 w-100" style={{ maxWidth: 900 }}>
        <h2 className="mb-4 text-center fw-bold" style={{ color: 'var(--primary-color)' }}>Student Dashboard</h2>
        <div className="row g-4">
          {actions.map((action) => (
            <div className="col-12 col-md-6 col-lg-4" key={action.title}>
              <Link
                to={action.to}
                className={`dashboard-action-card h-100 p-4 d-flex flex-column align-items-center justify-content-center text-center shadow-lg`}
                style={{ borderRadius: '1.25rem', cursor: 'pointer', minHeight: 200, textDecoration: 'none' }}
                tabIndex={0}
              >
                <div className="mb-3">
                  <i className={`${action.icon} fa-2x`}></i>
                </div>
                <h5 className="fw-bold mb-2">{action.title}</h5>
                <p className="mb-0 text-light-emphasis">{action.desc}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
