import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const AssessmentList = ({ onSelectAssessment }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/Courses');
        setCourses(res.data);
        setFilteredCourses(res.data);
      } catch {
        alert('Failed to load courses.');
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;

    const fetchAssessments = async () => {
      try {
        const res = await api.get(`/Assessments?courseId=${selectedCourse.courseId}`);
        setAssessments(res.data);
      } catch {
        alert('Failed to load assessments.');
      }
    };
    fetchAssessments();
  }, [selectedCourse]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredCourses(
      courses.filter(c => c.title.toLowerCase().includes(term))
    );
  }, [searchTerm, courses]);

  return (
    <div className="container py-4">
      <div className="page-header mb-4 d-flex align-items-center gap-3">
        <span style={{ fontSize: 36, color: '#7c3aed' }}><i className="fas fa-clipboard-list"></i></span>
        <div>
          <h1 className="fw-bold mb-1" style={{ color: '#18181b' }}>Assessments</h1>
          <p className="text-secondary mb-0">Select a course to view and manage assessments.</p>
        </div>
      </div>
      <div className="mb-4">
        <input
          className="form-control form-control-lg"
          style={{ maxWidth: 400, borderRadius: '0.7rem', border: '1.5px solid #e5e7eb', fontSize: '1.08rem' }}
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="row g-4 mb-4">
        {filteredCourses.map((course) => (
          <div className="col-12 col-md-6 col-lg-4" key={course.courseId}>
            <div
              className={`assessment-course-card ${selectedCourse?.courseId === course.courseId ? 'selected' : ''}`}
              style={{
                background: '#f1f1f3',
                border: selectedCourse?.courseId === course.courseId ? '2.5px solid #7c3aed' : '2px solid #e5e7eb',
                borderRadius: '1.1rem',
                padding: '1.3rem 1.1rem',
                cursor: 'pointer',
                fontWeight: 600,
                color: '#18181b',
                boxShadow: selectedCourse?.courseId === course.courseId ? '0 6px 20px 0 rgba(124,58,237,0.13)' : '0 2px 8px 0 rgba(24,24,27,0.06)',
                transition: 'all 0.18s',
                textAlign: 'center',
                marginBottom: '0.5rem',
                outline: selectedCourse?.courseId === course.courseId ? '2px solid #7c3aed' : 'none',
              }}
              onClick={() => setSelectedCourse(course)}
              tabIndex={0}
              onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && setSelectedCourse(course)}
            >
              <span style={{ fontSize: '1.13rem' }}>{course.title}</span>
            </div>
          </div>
        ))}
      </div>
      {selectedCourse && (
        <div className="assessment-list-section mt-4 p-4" style={{ background: '#f7f7fa', borderRadius: '1.2rem', boxShadow: '0 2px 12px 0 rgba(124,58,237,0.06)' }}>
          <h4 className="mb-4" style={{ color: '#18181b' }}>
            <i className="fas fa-book-open me-2 text-secondary"></i>
            Assessments for <span style={{ color: '#7c3aed' }}>{selectedCourse.title}</span>
          </h4>
          <div className="row g-4">
            {assessments.length === 0 ? (
              <div className="col-12 text-center text-secondary">No assessments available for this course.</div>
            ) : assessments.map((assessment) => (
              <div className="col-12 col-md-6 col-lg-4" key={assessment.assessmentId || assessment.id || assessment.title}>
                <div className="assessment-card p-4 h-100 d-flex flex-column justify-content-between" style={{ background: '#fff', border: '2px solid #e5e7eb', borderRadius: '1.1rem', boxShadow: '0 2px 8px 0 rgba(24,24,27,0.06)', transition: 'box-shadow 0.18s, border-color 0.18s', minHeight: 220, padding: '2.2rem 1.5rem' }}>
                  <div>
                    <h5 className="fw-bold mb-2" style={{ color: '#18181b', fontSize: '1.22rem' }}>{assessment.title}</h5>
                    {assessment.type && <span className="badge" style={{ background: '#14b8a6', color: '#fff', fontWeight: 500, marginRight: 8 }}>{assessment.type}</span>}
                    {assessment.dueDate && <span className="badge bg-light text-secondary ms-1" style={{ fontWeight: 500, border: '1px solid #e5e7eb' }}><i className="far fa-clock me-1"></i>Due: {assessment.dueDate}</span>}
                    {assessment.description && <p className="text-secondary mb-3 mt-2">{assessment.description}</p>}
                  </div>
                  <div className="mt-auto d-flex justify-content-center">
                    <button className="media-action-btn w-100 d-flex align-items-center justify-content-center" style={{ fontWeight: 700, color: '#7c3aed', fontSize: '1.25rem', background: 'transparent', border: 'none', boxShadow: 'none', padding: '0.75rem 0', textDecoration: 'none' }} onClick={() => onSelectAssessment && onSelectAssessment(assessment)}>
                      <i className="fas fa-eye me-2" style={{ color: '#7c3aed', fontSize: '1.35rem' }}></i>
                      View Assessment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentList;
