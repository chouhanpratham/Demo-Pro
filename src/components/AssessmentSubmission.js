import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentService } from '../services/assessmentService';
import './AssessmentSubmission.css';

const AssessmentSubmission = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assessment, setAssessment] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                const data = await assessmentService.getAssessmentById(id);
                setAssessment(data);
                // Initialize answers array with empty selections
                setAnswers(data.questions.map(q => ({
                    questionId: q.questionId,
                    selectedOptionId: null
                })));
                setLoading(false);
            } catch (err) {
                setError('Failed to load assessment');
                setLoading(false);
            }
        };

        fetchAssessment();
    }, [id]);

    const handleOptionSelect = (questionId, optionId) => {
        setAnswers(prevAnswers => 
            prevAnswers.map(answer => 
                answer.questionId === questionId 
                    ? { ...answer, selectedOptionId: optionId }
                    : answer
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const submission = {
                assessmentId: id,
                answers: answers
            };

            await assessmentService.submitAssessment(submission);
            navigate('/assessments/results', { state: { assessmentId: id } });
        } catch (err) {
            setError('Failed to submit assessment. Please try again.');
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading">Loading assessment...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!assessment) return <div className="error">Assessment not found</div>;

    return (
        <div className="assessment-submission">
            <h2>{assessment.title}</h2>
            <p className="description">{assessment.description}</p>
            
            <form onSubmit={handleSubmit}>
                {assessment.questions.map((question, index) => (
                    <div key={question.questionId} className="question-container">
                        <h3>Question {index + 1}</h3>
                        <p>{question.text}</p>
                        
                        <div className="options-container">
                            {question.options.map(option => (
                                <div key={option.optionId} className="option">
                                    <input
                                        type="radio"
                                        id={`option-${option.optionId}`}
                                        name={`question-${question.questionId}`}
                                        value={option.optionId}
                                        checked={answers.find(a => a.questionId === question.questionId)?.selectedOptionId === option.optionId}
                                        onChange={() => handleOptionSelect(question.questionId, option.optionId)}
                                    />
                                    <label htmlFor={`option-${option.optionId}`}>
                                        {option.text}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={submitting || answers.some(a => a.selectedOptionId === null)}
                >
                    {submitting ? 'Submitting...' : 'Submit Assessment'}
                </button>
            </form>
        </div>
    );
};

export default AssessmentSubmission; 