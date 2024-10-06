import React, { Component } from 'react';
import { createRecord } from '../../../connector.js';
import * as XLSX from 'xlsx';
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
            commentError: '',
            batchRecords: [] // Stores records from the uploaded file
        };
    }

    componentDidMount() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById("date-applied").setAttribute("max", today);
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
        const { company, positionType, receivedInterview, jobTitle, dateApplied, applicationLink, comment } = this.state;

        const recordData = {
            company,
            type: positionType,
            jobTitle,
            date: dateApplied,
            receivedInterview: receivedInterview === 'YES',
            websiteLink: applicationLink,
            comment: comment || '',
            click: 1
        };

        try {
            const response = await createRecord(recordData);
            alert("Thank you! Your record has been saved.");
            console.log('Record created:', response);
            window.location.href = '/MainPage';
        } catch (error) {
            console.error('Error creating record:', error);
            alert("Whoops, something is wrong.");
        }
    };

    handleFileUpload = (e) => {
        const file = e.target.files[0];
        this.readFile(file); // Automatically read the file as soon as it’s uploaded
    };

    readFile = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            this.setState({ batchRecords: jsonData });
        };
        reader.readAsArrayBuffer(file);
    };

    handleBatchSubmit = async () => {
        const { batchRecords } = this.state;

        // URL validation function
        const isValidURL = (url) => {
            try {
                new URL(url);
                return true;
            } catch (_) {
                return false;
            }
        };

        for (const record of batchRecords) {
            // Handle date conversion for each record
            let validDate;
            if (typeof record.date === 'number') {
                // Excel serial date to JS date conversion
                validDate = new Date((record.date - (25567 + 2)) * 86400 * 1000).toISOString().split('T')[0];
            } else if (record.date) {
                // If it's a standard date string, parse it normally
                validDate = new Date(record.date).toISOString().split('T')[0];
            } else {
                validDate = 'Unknown Date'; // Handle missing date case
            }

            // Default receivedInterview to 'NO' if not provided
            const receivedInterview = record.receivedInterview && record.receivedInterview.toLowerCase() === 'yes';

            // Check if application link is valid, skip if not
            const applicationLink = record['Application Link'];
            if (!applicationLink || !isValidURL(applicationLink)) {
                console.log('Skipping record due to invalid or missing application link:', record);
                continue; // Skip this record
            }

            const recordData = {
                company: record.Company || 'Unknown Company',
                type: record.type || 'Unknown Type',
                jobTitle: record['Job Title'] || 'Unknown Job Title',
                date: validDate,
                receivedInterview: receivedInterview || false, // Default to 'NO' (false) if not provided
                websiteLink: applicationLink, 
                comment: record.comment || '',
                click: 1
            };

            try {
                if (recordData.company !== 'Unknown Company' && recordData.type !== 'Unknown Type') {
                    await createRecord(recordData);
                } else {
                    console.log('Skipping record due to missing fields:', recordData);
                }
            } catch (error) {
                console.error('Error uploading record:', error);
                alert(`Error uploading record: ${record.company}`);
            }
        }

        alert('Batch upload complete.');
        window.location.href = '/MainPage';
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
                            <label>Received Interview?<span>*</span></label>
                            <select
                                name="receivedInterview"
                                value={this.state.receivedInterview}
                                onChange={this.handleChange}
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

                <div className="batch-upload-container">
                    <h2>Batch Upload Applications</h2>
                    <input type="file" accept=".xlsx" onChange={this.handleFileUpload} />
                    <button className="batch-submit-button" onClick={this.handleBatchSubmit}>Submit Batch</button>
                </div>
            </div>
        );
    }
}

export default ApplicationForm;
