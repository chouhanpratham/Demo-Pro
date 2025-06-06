import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { getToken, getUserRole, debugToken } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

const UploadCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Debug token and role on component mount
    const tokenPayload = debugToken();
    const role = getUserRole();
    console.log('Current role:', role);
    console.log('Token payload:', tokenPayload);

    // Redirect if not an instructor
    if (role !== 'Instructor') {
      setError('You must be an instructor to upload courses');
      navigate('/login');
    }
  }, [navigate]);

  const uploadCourse = async (title, description, mediaFile) => {
    setLoading(true);
    setError('');

    try {
      // Check if token exists and user is instructor
      const token = getToken();
      const role = getUserRole();
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      if (role !== 'Instructor') {
        throw new Error('You must be an instructor to upload courses');
      }

      const formData = new FormData();
      formData.append('file', mediaFile);

      // Step 1: Upload media file
      const mediaResponse = await api.post('/Media/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      const mediaUrl = mediaResponse.data.url || mediaResponse.data;
      console.log('Media uploaded:', mediaUrl);

      // Step 2: Create course using the uploaded media URL
      const courseResponse = await api.post('/Courses', {
        title,
        description,
        mediaUrl,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Course created:', courseResponse.data);
      alert('Course uploaded successfully');

      // Reset form
      setTitle('');
      setDescription('');
      setMediaFile(null);
      document.getElementById('media-file-input').value = '';
    } catch (error) {
      console.error('Upload failed:', error.response || error);
      setError(error.response?.data || error.message || 'Failed to upload course');
      alert(error.response?.data || error.message || 'Failed to upload course');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!mediaFile) {
      setError('Please select a media file.');
      return;
    }
    uploadCourse(title, description, mediaFile);
  };

  return (
    <div className="container py-4">
      <div className="upload-course-card mx-auto" style={{ maxWidth: 900, background: '#fff', borderRadius: '1.3rem', boxShadow: '0 4px 24px 0 rgba(124,58,237,0.10)', padding: '2.5rem 2rem' }}>
        <div className="mb-4 text-center">
          <h2 className="fw-bold mb-1" style={{ color: '#7c3aed' }}>Upload Course</h2>
        </div>
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </div>
        )}
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
            <label className="form-label fw-semibold">Description:</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ borderRadius: '0.7rem', border: '1.5px solid #e5e7eb' }}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Media File:</label>
            <input
              type="file"
              className="form-control"
              id="media-file-input"
              onChange={(e) => setMediaFile(e.target.files[0])}
              required
              style={{ borderRadius: '0.7rem', border: '1.5px solid #e5e7eb' }}
            />
          </div>
          <div className="text-center">
            <button 
              className="btn btn-primary px-5 py-2" 
              type="submit" 
              style={{ fontWeight: 700, fontSize: '1.13rem', borderRadius: '0.7rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Uploading...
                </>
              ) : (
                'Upload Course'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadCourse;
