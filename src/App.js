import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Offcanvas, NavDropdown, Row, Col } from 'react-bootstrap';
import { getUserRole, clearToken } from './services/auth';

import AuthLogin from './components/Auth/Login';
import Register from './components/Auth/Register';

import InstructorDashboard from './components/Instructor/Dashboard';
import UploadCourse from './components/Instructor/UploadCourse';
import UploadAssessment from './components/Instructor/UploadAssessment';

import StudentDashboard from './components/Student/Dashboard';
import StudentAssessmentPage from './components/Student/StudentAssessmentPage';
import ViewResults from './components/Student/ViewResults';
import AssessmentSubmission from './components/AssessmentSubmission';

import CourseList from './components/shared/CourseList';
import AssessmentList from './components/shared/AssessmentList';
import TakeAssessment from './components/Student/TakeAssessment';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  useEffect(() => {
    const role = getUserRole();
    if (role) {
      setUserRole(role);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
    setUserRole(null);
  };

  const PrivateRoute = ({ children, role }) => {
    if (!isLoggedIn) return <Navigate to="/login" />;
    if (role) {
      const allowedRoles = Array.isArray(role) ? role : [role];
      if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/login" />;
      }
    }
    return children;
  };

  useEffect(() => {
    const role = getUserRole();
    const id = localStorage.getItem('userId');
    if (role) {
      setUserRole(role);
      setUserId(id);
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Navbar bg="primary" variant="dark" expand="lg" className="navbar-custom">
          <Container>
            <Navbar.Brand as={Link} to="/" className="brand-text">
              <i className="fas fa-graduation-cap me-2"></i>
              EduSync LMS
            </Navbar.Brand>
            <Navbar.Toggle 
              aria-controls="offcanvasNavbar-expand-lg" 
              onClick={() => setShowOffcanvas(true)}
            />
            <Navbar.Offcanvas
              id="offcanvasNavbar-expand-lg"
              aria-labelledby="offcanvasNavbarLabel-expand-lg"
              placement="end"
              show={showOffcanvas}
              onHide={() => setShowOffcanvas(false)}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                  EduSync LMS
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                {isLoggedIn ? (
                  <>
                    <Nav className="me-auto">
                      {userRole === 'Instructor' && (
                        <>
                          <Nav.Link as={Link} to="/instructor" onClick={() => setShowOffcanvas(false)}>
                            <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                          </Nav.Link>
                          
                          <NavDropdown 
                            title={
                              <span>
                                <i className="fas fa-book me-2"></i>Courses
                              </span>
                            }
                            id="courses-dropdown"
                          >
                            <NavDropdown.Item as={Link} to="/instructor/courses" onClick={() => setShowOffcanvas(false)}>
                              <i className="fas fa-list me-2"></i>All Courses
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/instructor/upload-course" onClick={() => setShowOffcanvas(false)}>
                              <i className="fas fa-upload me-2"></i>Upload Course
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/instructor/course-analytics" onClick={() => setShowOffcanvas(false)}>
                              <i className="fas fa-chart-line me-2"></i>Course Analytics
                            </NavDropdown.Item>
                          </NavDropdown>

                          <NavDropdown 
                            title={
                              <span>
                                <i className="fas fa-tasks me-2"></i>Assessments
                              </span>
                            }
                            id="assessments-dropdown"
                          >
                            <NavDropdown.Item as={Link} to="/instructor/assessments" onClick={() => setShowOffcanvas(false)}>
                              <i className="fas fa-list-alt me-2"></i>All Assessments
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/instructor/upload-assessment" onClick={() => setShowOffcanvas(false)}>
                              <i className="fas fa-plus-circle me-2"></i>Create Assessment
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/instructor/assessment-results" onClick={() => setShowOffcanvas(false)}>
                              <i className="fas fa-chart-bar me-2"></i>View Results
                            </NavDropdown.Item>
                          </NavDropdown>
                        </>
                      )}
                      {userRole === 'Student' && (
                        <>
                          <Nav.Link as={Link} to="/student" onClick={() => setShowOffcanvas(false)}>
                            <i className="fas fa-tachometer-alt me-2"></i>Dashboard
                          </Nav.Link>

                          <NavDropdown 
                            title={
                              <span>
                                <i className="fas fa-book me-2"></i>Courses
                              </span>
                            }
                            id="student-courses-dropdown"
                          >
                            <NavDropdown.Item as={Link} to="/student/courses" onClick={() => setShowOffcanvas(false)}>
                              <i className="fas fa-list me-2"></i>My Courses
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/student/course-progress" onClick={() => setShowOffcanvas(false)}>
                              <i className="fas fa-chart-line me-2"></i>Course Progress
                            </NavDropdown.Item>
                          </NavDropdown>

                          <NavDropdown 
                            title={
                              <span>
                                <i className="fas fa-tasks me-2"></i>Assessments
                              </span>
                            }
                            id="student-assessments-dropdown"
                          >
                            <NavDropdown.Item as={Link} to="/student/assessments-list" onClick={() => setShowOffcanvas(false)}>
                              <i className="fas fa-list-alt me-2"></i>Available Assessments
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/student/pending-assessments" onClick={() => setShowOffcanvas(false)}>
                              <i className="fas fa-clock me-2"></i>Pending Assessments
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/student/completed-assessments" onClick={() => setShowOffcanvas(false)}>
                              <i className="fas fa-check-circle me-2"></i>Completed
                            </NavDropdown.Item>
                          </NavDropdown>

                          <NavDropdown 
                            title={
                              <span>
                                <i className="fas fa-chart-bar me-2"></i>Results
                              </span>
                            }
                            id="student-results-dropdown"
                          >
                            <NavDropdown.Item as={Link} to="/student/results" onClick={() => setShowOffcanvas(false)}>
                              <i className="fas fa-list me-2"></i>All Results
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/student/performance" onClick={() => setShowOffcanvas(false)}>
                              <i className="fas fa-chart-line me-2"></i>Performance Analysis
                            </NavDropdown.Item>
                          </NavDropdown>
                        </>
                      )}
                    </Nav>
                    <div className="d-flex align-items-center user-section">
                      <span className="text-light me-3">
                        <i className="fas fa-user me-2"></i>Welcome, {userRole}
                      </span>
                      <Button 
                        variant="outline-light" 
                        onClick={handleLogout}
                        className="logout-btn"
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <Nav className="ms-auto">
                    <Nav.Link as={Link} to="/login" onClick={() => setShowOffcanvas(false)}>
                      <i className="fas fa-sign-in-alt me-2"></i>Login
                    </Nav.Link>
                    <Nav.Link as={Link} to="/register" onClick={() => setShowOffcanvas(false)}>
                      <i className="fas fa-user-plus me-2"></i>Register
                    </Nav.Link>
                  </Nav>
                )}
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>

        <Container fluid className="main-content">
          <Container className="py-4">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={
                isLoggedIn ? (
                  userRole === 'Instructor' ? <Navigate to="/instructor" /> : <Navigate to="/student" />
                ) : (
                  <AuthLogin onLogin={(role) => {
                    setUserRole(role);
                    setIsLoggedIn(true);
                  }} />
                )
              } />
              <Route path="/register" element={<Register />} />

              {/* Instructor Routes */}
              <Route path="/instructor" element={
                <PrivateRoute role="Instructor">
                  <InstructorDashboard />
                </PrivateRoute>
              } />
              <Route path="/instructor/courses" element={
                <PrivateRoute role="Instructor">
                  <CourseList />
                </PrivateRoute>
              } />
              <Route path="/instructor/upload-course" element={
                <PrivateRoute role="Instructor">
                  <UploadCourse />
                </PrivateRoute>
              } />
              <Route path="/instructor/course-analytics" element={
                <PrivateRoute role="Instructor">
                  <CourseList />
                </PrivateRoute>
              } />
              <Route path="/instructor/assessments" element={
                <PrivateRoute role="Instructor">
                  <AssessmentList />
                </PrivateRoute>
              } />
              <Route path="/instructor/upload-assessment" element={
                <PrivateRoute role="Instructor">
                  <UploadAssessment />
                </PrivateRoute>
              } />
              <Route path="/instructor/assessment-results" element={
                <PrivateRoute role="Instructor">
                  <AssessmentList />
                </PrivateRoute>
              } />

              {/* Student Routes */}
              <Route path="/student" element={
                <PrivateRoute role="Student">
                  <StudentDashboard />
                </PrivateRoute>
              } />
              <Route path="/student/courses" element={
                <PrivateRoute role="Student">
                  <CourseList />
                </PrivateRoute>
              } />
              <Route path="/student/course-progress" element={
                <PrivateRoute role="Student">
                  <CourseList />
                </PrivateRoute>
              } />
              <Route path="/student/assessments-list" element={
                <PrivateRoute role="Student">
                  <StudentAssessmentPage />
                </PrivateRoute>
              } />
              <Route path="/student/pending-assessments" element={
                <PrivateRoute role="Student">
                  <StudentAssessmentPage />
                </PrivateRoute>
              } />
              <Route path="/student/completed-assessments" element={
                <PrivateRoute role="Student">
                  <StudentAssessmentPage />
                </PrivateRoute>
              } />
              <Route path="/student/assessments/:id" element={
                <PrivateRoute role="Student">
                  <AssessmentSubmission />
                </PrivateRoute>
              } />
              <Route path="/student/results" element={
                <PrivateRoute role="Student">
                  <ViewResults />
                </PrivateRoute>
              } />
              <Route path="/student/performance" element={
                <PrivateRoute role="Student">
                  <ViewResults />
                </PrivateRoute>
              } />
              <Route path="/student/take-assessment/:id" element={<TakeAssessment userId={userId} />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Container>
        </Container>

        <footer className="footer">
          <Container>
            <Row className="align-items-center">
              <Col xs={12} md={6}>
                <p className="mb-0">© 2025 EduSync LMS. All rights reserved.</p>
              </Col>
              <Col xs={12} md={6} className="text-md-end">
                <p className="mb-0">Version 1.0.0</p>
              </Col>
            </Row>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;
