import React, { Component } from 'react';
import { createRecord } from '../../../connector';
import * as XLSX from 'xlsx';
import './BatchUpload.css';

class BatchUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            batchRecords: [], // Stores records from the uploaded file
            skippedRecords: [], // Stores skipped records and reasons
            isLoading: false, // Controls the loading state
            showHelp: false, // Controls the help overlay visibility
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
            console.warn('Unsupported file format. Please upload an Excel, CSV, or JSON file.');
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
                console.warn('Error: The uploaded Excel file is empty.');
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
            const headers = rows.shift();
            const jsonData = rows.map(row => {
                return headers.reduce((acc, header, index) => {
                    acc[header.trim()] = row[index]?.trim() || '';
                    return acc;
                }, {});
            });

            if (jsonData.length === 0) {
                console.warn('Error: The uploaded CSV file is empty.');
                return;
            }

            this.setState({ batchRecords: jsonData });
        };
        reader.readAsText(file);
    };

    readJSONFile = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const jsonData = JSON.parse(event.target.result);

                if (!Array.isArray(jsonData) || jsonData.length === 0) {
                    console.warn('Error: The uploaded JSON file is empty or invalid.');
                    return;
                }

                this.setState({ batchRecords: jsonData });
            } catch (error) {
                console.warn('Error: Invalid JSON file format.');
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

    retry = async (fn, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === retries - 1) throw error;
            }
        }
    };

    delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    handleBatchSubmit = async () => {
        this.setState({ isLoading: true });
        const { batchRecords } = this.state;
        const skippedRecords = [];
        const batchSize = 1;
        const delayTime = 1500;
        let successfulUploads = 0;

        if (batchRecords.length === 0) {
            console.warn('Error: No records to upload. Please check your file.');
            this.setState({ isLoading: false });
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

        for (let i = 0; i < batchRecords.length; i += batchSize) {
            const batch = batchRecords.slice(i, i + batchSize);

            const uploadPromises = batch.map(async (record) => {
                const recordData = this.mapFields(record);

                if (!isValidURL(recordData.websiteLink)) {
                    skippedRecords.push({ record, reason: 'Invalid or missing application link' });
                    return null;
                }

                try {
                    return await this.retry(() => createRecord(recordData));
                } catch (error) {
                    skippedRecords.push({ record: recordData, reason: `Error uploading record: ${error.message}` });
                    return null;
                }
            });

            const results = await Promise.all(uploadPromises);
            successfulUploads += results.filter(result => result !== null).length;

            if (i + batchSize < batchRecords.length) {
                await this.delay(delayTime);
            }
        }

        this.setState({ skippedRecords, isLoading: false });
        console.warn('Skipped Records:', skippedRecords);
        alert(`Batch upload complete. Successfully uploaded ${successfulUploads} records.`);
        window.location.href = '/MainPage';
    };

    render() {
        const { isLoading, showHelp } = this.state;

        return (
            <div className="batch-upload-container">
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                        <p>Uploading records, please wait...</p>
                    </div>
                )}
                {showHelp && (
                    <div className="help-overlay" onClick={() => this.setState({ showHelp: false })}>
                        <div className="help-content" onClick={(e) => e.stopPropagation()}>
                            <h3>How to Use</h3>
                            <p>You can upload files in the following formats:</p>
                            <ul>
                                <li>Excel (.xlsx, .xls)</li>
                                <li>CSV (.csv)</li>
                                <li>JSON (.json)</li>
                            </ul>
                            <p>
                                Ensure your file contains column headers: <strong>Company</strong>,{' '}
                                <strong>Job Title</strong>, <strong>Type</strong>, <strong>Website</strong>, and{' '}
                                <strong>Comment</strong>.
                            </p>
                            <p><strong>Steps to Upload:</strong></p>
                            <ol>
                                <li>Click the "Choose File" button to select a supported file from your computer.</li>
                                <li>Ensure the file contains valid and complete data.</li>
                                <li>Click the "Submit Batch" button to start uploading records.</li>
                            </ol>

                            <button onClick={() => this.setState({ showHelp: false })}>Close</button>
                        </div>
                    </div>
                )}
                <div className="header">
                    <h2>Batch Upload Application</h2>
                    <button
                        className="help-icon"
                        onClick={() => this.setState({ showHelp: true })}
                    >
                        ?
                    </button>
                </div>
                <input type="file" onChange={this.handleFileUpload} disabled={isLoading} />
                <button className="batch-submit-button" onClick={this.handleBatchSubmit} disabled={isLoading}>
                    Submit Batch
                </button>
            </div>
        );
    }
}


export default BatchUpload;
