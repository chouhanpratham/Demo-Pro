import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaGraduationCap, FaUser, FaEnvelope, FaLock, FaUserTie } from 'react-icons/fa';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate password length
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/Auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      alert('Registration successful! You can now log in.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="auth-page d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'var(--background-color)' }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={11} md={10} lg={9} xl={8} xxl={7}>
          <Card className="auth-card shadow-lg border-0" style={{ borderRadius: '1.5rem', maxWidth: '700px', margin: '0 auto' }}>
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <FaGraduationCap size={48} className="text-primary mb-3" />
                <h2 className="fw-bold">Join EduSync</h2>
                <p className="text-muted">Create your account and start your learning journey</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleRegister}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaUser className="me-2" />
                    Full Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaEnvelope className="me-2" />
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaLock className="me-2" />
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                  <Form.Text className="text-muted">
                    Password must be at least 8 characters long
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaLock className="me-2" />
                    Confirm Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaUserTie className="me-2" />
                    I am a
                  </Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="Student">Student</option>
                    <option value="Instructor">Instructor</option>
                  </Form.Select>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/" className="text-primary fw-bold">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </Form>

              <div className="mt-4 pt-3 border-top">
                <h5 className="text-center mb-3">Benefits of Joining EduSync</h5>
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="p-3">
                      <h6 className="fw-bold">For Students</h6>
                      <ul className="list-unstyled text-muted">
                        <li>✓ Access to quality courses</li>
                        <li>✓ Track your progress</li>
                        <li>✓ Get instant feedback</li>
                      </ul>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="p-3">
                      <h6 className="fw-bold">For Instructors</h6>
                      <ul className="list-unstyled text-muted">
                        <li>✓ Create engaging courses</li>
                        <li>✓ Monitor student progress</li>
                        <li>✓ Build your teaching portfolio</li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
