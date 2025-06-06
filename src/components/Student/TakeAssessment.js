import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

// ✅ Correct helper to extract userId from JWT token
const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

    // ✅ Microsoft-style claim key for userId:
    const userIdClaim =
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";
    return payload[userIdClaim] || null;
  } catch (err) {
    console.error("Invalid token format:", err);
    return null;
  }
};

const TakeAssessment = () => {
  const { id: assessmentId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await api.get(`/Assessments/${assessmentId}`);
        const parsedQuestions =
          typeof res.data.questions === "string"
            ? JSON.parse(res.data.questions)
            : res.data.questions;

        setAssessment(res.data);
        setQuestions(parsedQuestions || []);
      } catch (error) {
        alert("Failed to load assessment.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId, navigate]);

  const handleChange = (questionIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    const userId = getUserIdFromToken();
    console.log("Extracted User ID:", userId);

    if (!userId) {
      alert("User ID missing. Please log in.");
      navigate("/login");
      return;
    }

    if (Object.keys(answers).length !== questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    let correctCount = 0;
    questions.forEach((q, idx) => {
      const selectedOption = q.options[answers[idx]];
      console.log(
        `Q${idx + 1}: Selected = ${selectedOption}, Correct = ${q.answer}`
      );
      if (selectedOption === q.answer) correctCount++;
    });

    // 10 marks per correct answer
    const score = correctCount * 10;

    const resultDto = {
      assessmentId,
      userId,
      score,
    };

    try {
      await api.post("/Results", resultDto);
      console.log("Assessment submitted:", resultDto);
      alert("Assessment submitted successfully!");
      navigate("/results");
    } catch (error) {
      console.error("Error submitting result:", error);
      alert("Failed to submit assessment.");
    }
  };

  if (loading) return <p>Loading assessment...</p>;
  if (!assessment) return <p>Assessment not found.</p>;

  return (
    <div className="container py-4">
      <div className="assessment-page-card mx-auto" style={{ maxWidth: 900, background: '#fff', borderRadius: '1.3rem', boxShadow: '0 4px 24px 0 rgba(124,58,237,0.10)', padding: '2.5rem 2rem' }}>
        <div className="mb-4 text-center">
          <h2 className="fw-bold mb-1" style={{ color: '#7c3aed' }}>{assessment.title}</h2>
          {assessment.description && <p className="text-secondary mb-0">{assessment.description}</p>}
        </div>
        <form>
          {questions.map((q, index) => (
            <div key={index} className="mb-4 p-4 question-card" style={{ background: '#f7f7fa', borderRadius: '1rem', boxShadow: '0 2px 8px 0 rgba(124,58,237,0.06)' }}>
              <div className="mb-3 fw-semibold" style={{ color: '#18181b', fontSize: '1.13rem' }}>
                <span className="me-2" style={{ color: '#7c3aed', fontWeight: 700 }}>Q{index + 1}.</span> {q.question}
              </div>
              <div className="row g-2">
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="col-12 col-md-6">
                    <label className="option-radio-label d-flex align-items-center gap-2 p-2" style={{ background: '#fff', borderRadius: '0.7rem', border: '1.5px solid #e5e7eb', cursor: 'pointer', fontWeight: 500 }}>
                      <input
                        className="form-check-input me-2"
                        type="radio"
                        name={`question-${index}`}
                        id={`question-${index}-option-${optIndex}`}
                        value={optIndex}
                        checked={answers[index] === optIndex}
                        onChange={() => handleChange(index, optIndex)}
                        style={{ accentColor: '#7c3aed', width: 18, height: 18 }}
                      />
                      <span style={{ color: '#18181b', fontSize: '1.05rem' }}>{opt}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="text-center mt-4">
            <button
              type="button"
              className="btn btn-primary px-5 py-2"
              style={{ fontWeight: 700, fontSize: '1.13rem', borderRadius: '0.7rem' }}
              onClick={handleSubmit}
            >
              Submit Assessment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TakeAssessment;
