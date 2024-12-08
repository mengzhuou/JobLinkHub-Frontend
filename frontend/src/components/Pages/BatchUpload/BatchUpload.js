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
        if (!file) return;

        const fileType = file.name.split('.').pop().toLowerCase();
        if (['xlsx', 'xls'].includes(fileType)) {
            this.readExcelFile(file);
        } else if (fileType === 'csv') {
            this.readCSVFile(file);
        } else if (fileType === 'json') {
            this.readJSONFile(file);
        } else {
            alert('Unsupported file format. Please upload an Excel, CSV, or JSON file.');
        }
    };

    readExcelFile = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            if (jsonData.length === 0) {
                alert('Error: The uploaded Excel file is empty.');
                return;
            }

            this.setState({ batchRecords: jsonData });
        };
        reader.readAsArrayBuffer(file);
    };

    readCSVFile = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const rows = text.split('\n').map(row => row.split(','));
            const headers = rows.shift(); // Assume the first row contains column names
            const jsonData = rows.map(row => {
                return headers.reduce((acc, header, index) => {
                    acc[header.trim()] = row[index]?.trim() || ''; // Use empty string for missing fields
                    return acc;
                }, {});
            });
    
            // Fill missing fields with default values, similar to Excel logic
            const normalizedData = jsonData.map(record => ({
                Company: record['Company'] || 'Unknown Company',
                Type: record['Type'] || 'Unknown Type',
                'Job Title': record['Job Title'] || 'Unknown Job Title',
                'Date Applied': record['Date Applied'] || 'Unknown Date',
                Interview: record['Interview'] || 'No', // Default empty Interview to 'No'
                Website: record['Website'] || '',
                Comment: record['Comment'] || '',
            }));
    
            if (normalizedData.length === 0) {
                alert('Error: The uploaded CSV file is empty.');
                return;
            }
    
            this.setState({ batchRecords: normalizedData });
        };
        reader.readAsText(file);
    };
    

    readJSONFile = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const jsonData = JSON.parse(event.target.result);

                if (!Array.isArray(jsonData) || jsonData.length === 0) {
                    alert('Error: The uploaded JSON file is empty or invalid.');
                    return;
                }

                this.setState({ batchRecords: jsonData });
            } catch (error) {
                alert('Error: Invalid JSON file format.');
            }
        };
        reader.readAsText(file);
    };

    parseDate = (value) => {
        if (!value) return null;
        if (typeof value === 'number') {
            return new Date((value - (25567 + 2)) * 86400 * 1000).toISOString().split('T')[0];
        }
        return new Date(value).toISOString().split('T')[0];
    };

    mapFields = (record) => ({
        company: record['Company'] || 'Unknown Company',
        type: record['Type'] || 'Unknown Type',
        jobTitle: record['Job Title'] || 'Unknown Job Title',
        appliedDate: this.parseDate(record['Date Applied']) || 'Unknown Date',
        receivedInterview: record['Interview'] && record['Interview'].toLowerCase() === 'yes',
        websiteLink: record['Website'] || '',
        comment: record['Comment'] || '',
        click: 1,
    });

    handleBatchSubmit = async () => {
        const { batchRecords } = this.state;

        if (batchRecords.length === 0) {
            alert("Error: No records to upload. Please check your file.");
            return;
        }

        const isValidURL = (url) => {
            try {
                new URL(url);
                return true;
            } catch (_) {
                return false;
            }
        };

        for (const record of batchRecords) {
            const recordData = this.mapFields(record);

            if (!isValidURL(recordData.websiteLink)) {
                console.warn('Skipping record due to invalid or missing application link:', record);
                continue;
            }

            try {
                if (recordData.company !== 'Unknown Company' && recordData.type !== 'Unknown Type') {
                    await createRecord(recordData);
                } else {
                    console.warn('Skipping record due to missing fields:', recordData);
                }
            } catch (error) {
                console.error('Error uploading record:', error);
                alert(`Error uploading record for company: ${recordData.company}`);
            }
        }

        alert('Batch upload complete.');
        window.location.href = '/MainPage';
    };

    render() {
        return (
            <div className="batch-upload-container">
                <h2>Batch Upload Applications</h2>
                <input type="file" onChange={this.handleFileUpload} />
                <button className="batch-submit-button" onClick={this.handleBatchSubmit}>Submit Batch</button>
            </div>
        );
    }
}

export default BatchUpload;
