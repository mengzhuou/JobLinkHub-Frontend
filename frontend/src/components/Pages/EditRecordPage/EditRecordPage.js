import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateRecord, getOneRecordByRecordId } from '../../../connector';
import './EditRecordForm.css';


const EditRecordForm = () => {
    const { id } = useParams(); // Retrieve the record ID from the route
    const navigate = useNavigate();
    const [record, setRecord] = useState({
        company: '',
        positionType: '',
        receivedInterview: '',
        jobTitle: '',
        appliedDate: '',
        websiteLink: '',
        comment: '',
        receivedOffer: ''
    });
    const [commentLength, setCommentLength] = useState(0);
    const [commentError, setCommentError] = useState('');
    const [maxDate, setMaxDate] = useState('');

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setMaxDate(today);

        const fetchRecord = async () => {
            try {
                console.log("id: ", id)
                const recordData = await getOneRecordByRecordId(id);
                console.log("recordData: ", recordData)

                setRecord({
                    ...recordData,
                    appliedDate: recordData.appliedDate
                        ? new Date(recordData.appliedDate).toISOString().split('T')[0]
                        : '',
                    receivedInterview: recordData.receivedInterview ? 'Yes' : 'No', 
                    receivedOffer: recordData.receivedOffer ? 'Yes' : 'No',
                });
                setCommentLength(recordData.comment.length);
            } catch (error) {
                console.error('Error fetching record:', error);
                alert('Error fetching record data. Please try again.');
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
                    comment: value.substring(0, 250),
                }));
                setCommentLength(250);
                setCommentError('Comment cannot exceed 250 characters.');
            } else {
                setRecord((prevState) => ({
                    ...prevState,
                    [name]: value,
                }));
                setCommentLength(length);
                setCommentError('');
            }
        } else {
            setRecord((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateRecord(id, {
                company: record.company,
                type: record.positionType,
                jobTitle: record.jobTitle,
                appliedDate: record.appliedDate,
                receivedInterview: record.receivedInterview === 'Yes',
                receivedOffer: record.receivedOffer === 'Yes',
                websiteLink: record.websiteLink,
                comment: record.comment,
            });
            alert('Record updated successfully.');
            navigate('/profile');
        } catch (error) {
            console.error('Error updating record:', error);
            alert('Failed to update record. Please try again.');
        }
    };
    console.log("record: ", record)

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
                    required
                />
                <div>
                    <label>Position Type<span>*</span></label>
                    <select
                        name="positionType"
                        value={record.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Position</option>
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
                            value={record.receivedInterview}
                            onChange={handleChange}
                            required
                        >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                    { record.receivedInterview === 'Yes' && (
                            <div>
                                <label>Received Offer?</label>
                                <select
                                    name="receivedOffer"
                                    value={record.receivedOffer}
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
                    value={record.jobTitle}
                    onChange={handleChange}
                    required
                />
                <label>Date Applied<span>*</span></label>
                <input
                    type="date"
                    id="date-applied"
                    name="appliedDate"
                    value={record.appliedDate}
                    onChange={handleChange}
                    max={maxDate}
                    required
                />
                <label>Application Link<span>*</span></label>
                <input
                    type="url"
                    name="websiteLink"
                    value={record.websiteLink}
                    onChange={handleChange}
                    required
                />
                <label>Comment</label>
                <textarea
                    name="comment"
                    value={record.comment}
                    onChange={handleChange}
                    maxLength="250"
                />
                <div className="comment-info">
                    <span>{commentLength}/250</span>
                    {commentError && <span className="error-message">{commentError}</span>}
                </div>

                <div className='bottom-btn'>
                    <button 
                        type="cancel" 
                        className="edit-cancel-button"
                        onClick={() => navigate('/profile')} 
                    >
                        Cancel
                    </button>
                    <button type="submit" className="edit-submit-button">Save Changes</button>
                </div>
            </form>
        </div>
    );
};

export default EditRecordForm;
