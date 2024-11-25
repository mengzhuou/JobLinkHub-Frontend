import React, { Component } from 'react';
import { createRecord } from '../../../connector.js';
import './Application.css';

class ApplicationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            company: '',
            positionType: '',
            receivedInterview: '',
            jobTitle: '',
            dateApplied: '',
            applicationLink: '',
            comment: '',
            commentLength: 0,
            commentError: ''
        };
    }

    componentDidMount() {
        const today = new Date();
        const localDate = today.getFullYear() + '-' + 
                          String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(today.getDate()).padStart(2, '0');
        document.getElementById("date-applied").setAttribute("max", localDate);
    }
    

    handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'comment') {
            const length = value.length;
            if (length > 250) {
                this.setState({
                    comment: value.substring(0, 250),
                    commentLength: 250,
                    commentError: 'Comment cannot be more than 250 characters'
                });
            } else {
                this.setState({
                    [name]: value,
                    commentLength: length,
                    commentError: ''
                });
            }
        } else {
            this.setState({ [name]: value });
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.handleCreateRecord();
    };

    handleCreateRecord = async () => {
        const userId = JSON.parse(localStorage.getItem('userInfo'))._id;
        const { company, positionType, receivedInterview, jobTitle, dateApplied, applicationLink, comment } = this.state;
        const recordData = {
            company,
            type: positionType,
            jobTitle,
            date: dateApplied,
            receivedInterview: receivedInterview === 'YES',
            websiteLink: applicationLink,
            comment: comment || '',
            click: 1,
            appliedBy: [userId]
        };

        try {
            await createRecord(recordData);
            alert("Thank you! Your record has been saved.");
            window.location.href = '/MainPage';
        } catch (error) {
            console.error('Error creating record:', error);
            alert("Whoops, something is wrong.");
        }
    };

    render() {
        const { comment, commentError } = this.state;

        return (
            <div className="application-form-container">
                <form className="application-form" onSubmit={this.handleSubmit}>
                    <h2>Add Your Application</h2>
                    <label>Company<span>*</span></label>
                    <input
                        type="text"
                        name="company"
                        value={this.state.company}
                        onChange={this.handleChange}
                    />
                    <div className='line'>
                        <div>
                            <label>PositionType<span>*</span></label>
                            <select
                                name="positionType"
                                value={this.state.positionType}
                                onChange={this.handleChange}
                            >
                                <option value="">Type of Position</option>
                                <option value="Intern">Intern</option>
                                <option value="Part-Time">Part-Time</option>
                                <option value="Full-Time">Full-Time</option>
                                <option value="Coop">Coop</option>
                            </select>
                        </div>
                        <div>
                            <label>Received Interview?</label>
                            <select
                                name="receivedInterview"
                                value={this.state.receivedInterview}
                                onChange={this.handleChange}
                            >
                                <option value="NO">No</option>
                                <option value="YES">Yes</option>
                            </select>
                        </div>
                    </div>
                    <label>Job Title<span>*</span></label>
                    <input
                        type="text"
                        name="jobTitle"
                        value={this.state.jobTitle}
                        onChange={this.handleChange}
                    />
                    <label>Date<span>*</span></label>
                    <input
                        type="date"
                        id="date-applied"
                        name="dateApplied"
                        value={this.state.dateApplied}
                        onChange={this.handleChange}
                    />
                    <label>Application Link<span>*</span></label>
                    <input
                        type="url"
                        name="applicationLink"
                        value={this.state.applicationLink}
                        onChange={this.handleChange}
                    />
                    <label>Comment</label>
                    <textarea
                        name="comment"
                        value={this.state.comment}
                        onChange={this.handleChange}
                    />
                    <div className="comment-info">
                        <span>{comment.length}/250</span>
                        {commentError && <span className="error-message">{commentError}</span>}
                    </div>
                    <button type="submit" className="submit-button">Submit Application</button>
                </form>
            </div>
        );
    }
}

export default ApplicationForm;
