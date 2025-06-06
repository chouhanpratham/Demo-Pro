import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    const userIdClaim = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';
    return payload[userIdClaim] || null;
  } catch (err) {
    console.error('Invalid token format:', err);
    return null;
  }
};

const ViewResults = () => {
  const [results, setResults] = useState([]);
  const [assessmentDetails, setAssessmentDetails] = useState({});
  const userId = getUserIdFromToken(); // <- use same method

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get('/Results');
        console.log('✅ Results from backend:', res.data); 
        const filtered = res.data.filter(r => String(r.userId) === String(userId));
        setResults(filtered);
        // Fetch assessment details for each result
        const details = {};
        for (const result of filtered) {
          try {
            const assessmentRes = await api.get(`/Assessments/${result.assessmentId}`);
            details[result.assessmentId] = assessmentRes.data;
          } catch (error) {
            console.error(`Failed to fetch assessment ${result.assessmentId}:`, error);
          }
        }
        setAssessmentDetails(details);
      } catch (error) {
        console.error('Failed to load results:', error);
        alert('Failed to load results.');
      }
    };

    if (userId) fetchResults();
  }, [userId]);

  return (
    <div className="container py-4">
      <div className="results-page-card mx-auto" style={{ maxWidth: 900, background: '#fff', borderRadius: '1.3rem', boxShadow: '0 4px 24px 0 rgba(124,58,237,0.10)', padding: '2.5rem 2rem' }}>
        <div className="mb-4 text-center">
          <h2 className="fw-bold mb-1" style={{ color: '#7c3aed' }}>Your Assessment Results</h2>
        </div>
        {results.length === 0 ? (
          <p className="text-center text-secondary">No results found.</p>
        ) : (
          <div className="row g-3">
            {results.map(r => (
              <div key={r.resultId} className="col-12">
                <div className="result-card p-4" style={{ background: 'linear-gradient(135deg, #f7f7fa 0%, #e9e6ff 100%)', borderRadius: '1rem', boxShadow: '0 2px 8px 0 rgba(124,58,237,0.06)' }}>
                  <div className="d-flex justify-content-between align-items-start flex-wrap">
                    <div>
                      <h4 style={{ fontWeight: 700, color: '#18181b', marginBottom: '0.5rem' }}>{assessmentDetails[r.assessmentId]?.title || 'Loading...'}</h4>
                      <p className="mb-1"><strong>Attempt Date:</strong> {new Date(r.attemptDate).toLocaleString()}</p>
                      <p className="mb-1"><strong>Percentage: </strong>{Math.round((r.score / r.maxScore) * 100)}% </p>
                    </div>
                    <div>
                      <span className="badge" style={{ background: '#7c3aed', color: '#fff', padding: '0.6em 1.2em', borderRadius: '0.5rem', fontWeight: 600, fontSize: '1rem' }}>
                        Score: {r.score} / {r.maxScore}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewResults;
