import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import api from '../../services/api'; // ✅ use configured Axios instance
import { getUserRole } from '../../services/auth';

const CourseList = ({ onSelectCourse }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = getUserRole();
    console.log('Current user role:', role); // Debug log
    setUserRole(role);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/Courses'); // ✅ Axios adds baseURL and auth header
        console.log("📘 Fetched courses:", res.data);
        setCourses(res.data);
      } catch (err) {
        console.error('❌ Error fetching courses:', err.response?.data || err.message);
        setError('Failed to load courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      await api.delete(`/Courses/${courseId}`);
      setCourses(courses.filter(course => course.courseId !== courseId));
    } catch (err) {
      console.error('❌ Error deleting course:', err.response?.data || err.message);
      alert('Failed to delete course. Please try again.');
    }
  };

  // Debug log for render
  console.log('Rendering CourseList with userRole:', userRole);

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Loading courses...</p>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger" role="alert">
      <i className="fas fa-exclamation-circle me-2"></i>
      {error}
    </div>
  );

  if (courses.length === 0) return (
    <div className="text-center py-5">
      <i className="fas fa-book fa-3x text-muted mb-3"></i>
      <h4>No courses available</h4>
      <p className="text-muted">There are no courses to display at the moment.</p>
    </div>
  );

  return (
    <div className="courses-page">
      <div className="page-header mb-4">
        <h1 className="fw-bold" style={{ color: 'var(--primary-color)' }}>Available Courses</h1>
        <p className="text-secondary">Browse all courses and start learning today!</p>
      </div>
      <Row className="g-4">
        {courses.map((course) => (
          <Col key={course.courseId} xs={12} md={6} lg={4}>
            <Card className="h-100 course-card shadow-sm border-0" style={{ borderRadius: '1.25rem', overflow: 'hidden', background: '#f3f4f6' }}>
              <div style={{ height: 70, background: '#f1f1f3', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1.5px solid #e5e7eb' }}>
                <span style={{ color: '#18181b', fontWeight: 700, fontSize: '1.18rem', letterSpacing: '0.5px', textAlign: 'center', padding: '0 1rem', width: '100%' }}>
                  {course.title}
                </span>
              </div>
              <Card.Body className="d-flex flex-column">
                {/* <Card.Title className="mb-2 fw-bold" style={{ color: 'var(--primary-color)' }}>{course.title}</Card.Title> */}
                <Card.Text className="mb-2 text-secondary" style={{ minHeight: 48 }}>
                  {course.description || 'No description available'}
                </Card.Text>
                {course.instructor && (
                  <div className="mb-2">
                    <span className="badge" style={{ background: 'var(--accent-color)', color: '#fff', fontWeight: 500 }}>
                      <i className="fas fa-user-tie me-1"></i> {course.instructor}
                    </span>
                  </div>
                )}
                <div className="mt-auto d-flex flex-column gap-2">
                  {userRole === 'Instructor' && (
                    <Button 
                      variant="danger"
                      className="w-100"
                      onClick={() => handleDelete(course.courseId)}
                      style={{ fontWeight: 600, letterSpacing: 0.5 }}
                    >
                      <i className="fas fa-trash-alt me-2"></i>
                      Delete Course
                    </Button>
                  )}
                  {onSelectCourse ? (
                    <Button 
                      className="course-action-btn w-100"
                      onClick={() => onSelectCourse(course)}
                      style={{ fontWeight: 600, letterSpacing: 0.5 }}
                    >
                      <i className="fas fa-eye me-2"></i>
                      View Details
                    </Button>
                  ) : (
                    <a 
                      href={course.mediaUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="media-action-btn w-100"
                      style={{ fontWeight: 600, letterSpacing: 0.5, display: 'inline-block', textAlign: 'center', padding: '0.75rem 1.25rem', borderRadius: '0.6rem', marginTop: '0.5rem', textDecoration: 'none' }}
                    >
                      <i className="fas fa-play-circle me-2"></i>
                      View Media
                    </a>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CourseList;
