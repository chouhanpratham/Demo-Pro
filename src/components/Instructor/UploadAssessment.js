import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const UploadAssessment = () => {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [questions, setQuestions] = useState('');
  const [maxScore, setMaxScore] = useState('');
  const [courses, setCourses] = useState([]);

  // JSON example string to show in UI
  const exampleJson = `[{"question":"What is 2+2?","options":["3","4","5"],"answer":"4"}]`;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/Courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    // Validate JSON input
    try {
      JSON.parse(questions);
    } catch {
      alert('Questions field contains invalid JSON');
      return;
    }

    if (!courseId) {
      alert('Please select a course');
      return;
    }

    try {
      await api.post('/Assessments', {
        title,
        courseId,
        questions, // send as string (JSON string)
        maxScore: parseInt(maxScore),
      });
      alert('Assessment uploaded successfully');
      // Clear form after success
      setTitle('');
      setCourseId('');
      setQuestions('');
      setMaxScore('');
    } catch (error) {
      console.error('Upload failed:', error.response || error.message);
      alert('Failed to upload assessment');
    }
  };

  return (
    <div className="container py-4">
      <div className="upload-assessment-card mx-auto" style={{ maxWidth: 900, background: '#fff', borderRadius: '1.3rem', boxShadow: '0 4px 24px 0 rgba(124,58,237,0.10)', padding: '2.5rem 2rem' }}>
        <div className="mb-4 text-center">
          <h2 className="fw-bold mb-1" style={{ color: '#7c3aed' }}>Upload Assessment</h2>
        </div>
        <form onSubmit={handleUpload}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Title:</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ borderRadius: '0.7rem', border: '1.5px solid #e5e7eb' }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Course:</label>
            <select
              className="form-control"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
              style={{ borderRadius: '0.7rem', border: '1.5px solid #e5e7eb' }}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Questions (JSON format):</label>
            <textarea
              className="form-control"
              rows={8}
              value={questions}
              onChange={(e) => setQuestions(e.target.value)}
              required
              style={{ borderRadius: '0.7rem', border: '1.5px solid #e5e7eb' }}
            />
            <small className="form-text text-muted">
              Enter valid JSON, e.g. {exampleJson}
            </small>
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Max Score:</label>
            <input
              type="number"
              className="form-control"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              required
              style={{ borderRadius: '0.7rem', border: '1.5px solid #e5e7eb' }}
            />
          </div>
          <div className="text-center">
            <button className="btn btn-primary px-5 py-2" type="submit" style={{ fontWeight: 700, fontSize: '1.13rem', borderRadius: '0.7rem' }}>
              Upload Assessment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadAssessment;
