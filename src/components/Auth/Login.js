import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/auth';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaGraduationCap, FaUser, FaLock } from 'react-icons/fa';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const { token, role } = await login({ email, password });
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      if (onLogin) onLogin(role);

      if (role === 'Instructor') {
        navigate('/instructor');
      } else if (role === 'Student') {
        navigate('/student');
      } else {
        setError('Unknown role');
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
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
                <h2 className="fw-bold">Welcome to EduSync</h2>
                <p className="text-muted">Your all-in-one learning management platform</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaUser className="me-2" />
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>
                    <FaLock className="me-2" />
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <Form.Text className="text-muted">
                    Password must be at least 8 characters long
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 py-2 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="text-center">
                  <p className="mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary fw-bold">
                      Register here
                    </Link>
                  </p>
                </div>
              </Form>

              <div className="mt-4 pt-3 border-top">
                <h5 className="text-center mb-3">Why Choose EduSync?</h5>
                <Row>
                  <Col md={4} className="text-center mb-3">
                    <div className="p-3">
                      <h6 className="fw-bold">Interactive Learning</h6>
                      <small className="text-muted">Engage with dynamic content and assessments</small>
                    </div>
                  </Col>
                  <Col md={4} className="text-center mb-3">
                    <div className="p-3">
                      <h6 className="fw-bold">Real-time Progress</h6>
                      <small className="text-muted">Track your learning journey effectively</small>
                    </div>
                  </Col>
                  <Col md={4} className="text-center mb-3">
                    <div className="p-3">
                      <h6 className="fw-bold">Expert Support</h6>
                      <small className="text-muted">Get help from qualified instructors</small>
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
};

export default Login;
