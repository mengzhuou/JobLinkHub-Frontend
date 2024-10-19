import React, { Component } from 'react';
import { createRecord } from '../../../connector';
import * as XLSX from 'xlsx';
import './BatchUpload.css';

class BatchUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            batchRecords: [] // Stores records from the uploaded file
        };
    }

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

        const isValidURL = (url) => {
            try {
                new URL(url);
                return true;
            } catch (_) {
                return false;
            }
        };

        for (const record of batchRecords) {
            let validDate;
            if (typeof record.date === 'number') {
                validDate = new Date((record.date - (25567 + 2)) * 86400 * 1000).toISOString().split('T')[0];
            } else if (record.date) {
                validDate = new Date(record.date).toISOString().split('T')[0];
            } else {
                validDate = 'Unknown Date';
            }

            const receivedInterview = record.receivedInterview && record.receivedInterview.toLowerCase() === 'yes';

            const applicationLink = record['Application Link'];
            if (!applicationLink || !isValidURL(applicationLink)) {
                console.log('Skipping record due to invalid or missing application link:', record);
                continue;
            }

            const recordData = {
                company: record.Company || 'Unknown Company',
                type: record.type || 'Unknown Type',
                jobTitle: record['Job Title'] || 'Unknown Job Title',
                date: validDate,
                receivedInterview: receivedInterview || false,
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
        return (
            <div className="batch-upload-container">
                <h2>Batch Upload Applications</h2>
                <input type="file" accept=".xlsx" onChange={this.handleFileUpload} />
                <button className="batch-submit-button" onClick={this.handleBatchSubmit}>Submit Batch</button>
            </div>
        );
    }
}

export default BatchUpload;
