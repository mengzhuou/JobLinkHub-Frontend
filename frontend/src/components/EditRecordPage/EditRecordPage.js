import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import { updateRecord, getRecordsByUser } from '../../connector'; // Import necessary functions

const EditRecordForm = () => {
    const { id } = useParams(); // Use useParams to get the record ID from the URL
    const navigate = useNavigate(); // Use useNavigate to redirect
    const [record, setRecord] = useState({
        company: '',
        positionType: '',
        receivedInterview: '',
        jobTitle: '',
        dateApplied: '',
        applicationLink: '',
        comment: '',
    });
    const [commentLength, setCommentLength] = useState(0);
    const [commentError, setCommentError] = useState('');

    useEffect(() => {
        // Fetch the record data by ID when the component mounts
        const fetchRecord = async () => {
            try {
                const recordData = await getRecordsByUser(id); // Get the record by ID
                setRecord(recordData);
                setCommentLength(recordData.comment.length);
            } catch (error) {
                console.error('Error fetching record:', error);
            }
        };

        fetchRecord();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'comment') {
            const length = value.length;
            if (length > 250) {
                setRecord((prevState) => ({
                    ...prevState,
                    comment: value.substring(0, 250)
                }));
                setCommentLength(250);
                setCommentError('Comment cannot be more than 250 characters');
            } else {
                setRecord((prevState) => ({
                    ...prevState,
                    [name]: value
                }));
                setCommentLength(length);
                setCommentError('');
            }
        } else {
            setRecord((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Update the record
            await updateRecord(id, {
                company: record.company,
                type: record.positionType,
                jobTitle: record.jobTitle,
                date: record.dateApplied,
                receivedInterview: record.receivedInterview === 'YES',
                websiteLink: record.applicationLink,
                comment: record.comment
            });
            alert("Record updated successfully.");
            navigate('/profile'); 
        } catch (error) {
            console.error('Error updating record:', error);
            alert("Something went wrong.");
        }
    };

    return (
        <div className="application-form-container">
            <form className="application-form" onSubmit={handleSubmit}>
                <h2>Edit Application</h2>
                <label>Company<span>*</span></label>
                <input 
                    type="text" 
                    name="company" 
                    value={record.company} 
                    onChange={handleChange} 
                />
                <div className="line">
                    <div>
                        <label>PositionType<span>*</span></label>
                        <select 
                            name="positionType" 
                            value={record.positionType} 
                            onChange={handleChange}
                        >
                            <option value="">Type of Position</option>
                            <option value="Intern">Intern</option>
                            <option value="Part-Time">Part-Time</option>
                            <option value="Full-Time">Full-Time</option>
                            <option value="Coop">Coop</option>
                        </select>
                    </div>
                    <div>
                        <label>Received Interview?<span>*</span></label>
                        <select 
                            name="receivedInterview" 
                            value={record.receivedInterview} 
                            onChange={handleChange}
                        >
                            <option value="">Received Interview</option>
                            <option value="YES">YES</option>
                            <option value="NO">NO</option>
                        </select>
                    </div>
                </div>
                <label>Job Title<span>*</span></label>
                <input 
                    type="text" 
                    name="jobTitle" 
                    value={record.jobTitle} 
                    onChange={handleChange} 
                />
                <label>Date Applied<span>*</span></label>
                <input 
                    type="date" 
                    id="date-applied" 
                    name="dateApplied" 
                    value={record.dateApplied} 
                    onChange={handleChange} 
                />
                <label>Application Link<span>*</span></label>
                <input 
                    type="url" 
                    name="applicationLink" 
                    value={record.applicationLink} 
                    onChange={handleChange} 
                />
                <label>Comment</label>
                <textarea 
                    name="comment" 
                    value={record.comment} 
                    onChange={handleChange} 
                />
                <div className="comment-info">
                    <span>{commentLength}/250</span>
                    {commentError && <span className="error-message">{commentError}</span>}
                </div>
                <button type="submit" className="submit-button">Save Changes</button>
            </form>
        </div>
    );
};

export default EditRecordForm;
