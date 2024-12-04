import React, { useState, useEffect } from 'react';
import { createRecord, updateProfileByNewRecord } from '../../../connector.js';
import { useNavigate } from 'react-router-dom';
import './Application.css';

const Application = () => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];
    const [formData, setFormData] = useState({
        company: '',
        positionType: '',
        receivedInterview: '',
        receivedOffer: '',
        jobTitle: '',
        dateApplied: today,
        applicationLink: '',
        comment: '',
    });
    const [commentLength, setCommentLength] = useState(0);
    const [commentError, setCommentError] = useState('');

    useEffect(() => {
        document.getElementById('date-applied').setAttribute('max', today);
    }, [today]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'comment') {
            const length = value.length;
            if (length > 250) {
                setFormData({ ...formData, comment: value.substring(0, 250) });
                setCommentLength(250);
                setCommentError('Comment cannot be more than 250 characters');
            } else {
                setFormData({ ...formData, comment: value });
                setCommentLength(length);
                setCommentError('');
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = JSON.parse(localStorage.getItem('userInfo'))._id;
            const recordData = {
                company: formData.company,
                type: formData.positionType,
                jobTitle: formData.jobTitle,
                appliedDate: formData.dateApplied,
                receivedInterview: formData.receivedInterview === 'Yes',
                receivedOffer: formData.receivedOffer === 'Yes',
                websiteLink: formData.applicationLink,
                comment: formData.comment || '',
                click: 1,
                appliedBy: [userId],
            };

            const newRecord = await createRecord(recordData);

            // Update the user's profile with the new record ID
            await updateProfileByNewRecord(userId, { recordId: newRecord._id });
            alert('Thank you! Your record has been saved.');
            navigate('/MainPage');
        } catch (error) {
            console.error('Error creating record:', error);
            alert('Whoops, something is wrong.');
        }
    };

    return (
        <div className="application-form-container">
            <form className="application-form" onSubmit={handleSubmit}>
                <h2>Add Your Application</h2>
                <label>Company<span>*</span></label>
                <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                />
                <div>
                    <label>Position Type<span>*</span></label>
                    <select
                        name="positionType"
                        value={formData.positionType}
                        onChange={handleChange}
                    >
                        <option value="">Type of Position</option>
                        <option value="Intern">Intern</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Coop">Coop</option>
                    </select>
                </div>
                <div className="line">
                    <div>
                        <label>Received Interview?</label>
                        <select
                            name="receivedInterview"
                            value={formData.receivedInterview}
                            onChange={handleChange}
                        >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                    {formData.receivedInterview === 'Yes' && (
                        <div>
                            <label>Received Offer?</label>
                            <select
                                name="receivedOffer"
                                value={formData.receivedOffer}
                                onChange={handleChange}
                            >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </div>
                    )}
                </div>
                <label>Job Title<span>*</span></label>
                <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                />
                <label>Date<span>*</span></label>
                <input
                    type="date"
                    id="date-applied"
                    name="dateApplied"
                    value={formData.dateApplied}
                    onChange={handleChange}
                />
                <label>Application Link<span>*</span></label>
                <input
                    type="url"
                    name="applicationLink"
                    value={formData.applicationLink}
                    onChange={handleChange}
                />
                <label>Comment</label>
                <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                />
                <div className="comment-info">
                    <span>{commentLength}/250</span>
                    {commentError && <span className="error-message">{commentError}</span>}
                </div>
                <div className="bottom-btn">
                    <button
                        type="button"
                        className="application-cancel-button"
                        onClick={() => navigate('/profile')}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="application-submit-button">Save Changes</button>
                </div>
            </form>
        </div>
    );
};

export default Application;
