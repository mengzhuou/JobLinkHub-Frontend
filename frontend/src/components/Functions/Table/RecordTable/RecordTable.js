import React, { Component } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './RecordTable.css';
import { getRecords } from '../../../../connector.js';
import LinkButton from '../../../Button/LinkButton/LinkButton.js';

class RecordTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            filterOption: 'all',
            columnDefs: [
                { headerName: "Company", field: "company", sortable: true, filter: true, width: 230 },
                { headerName: "Type", field: "type", sortable: true, filter: true, width: 130 },
                { 
                    headerName: "Job Title", 
                    field: "jobTitle", 
                    sortable: true, 
                    filter: true, 
                    width: 200,
                    tooltipField: "jobTitle",
                    valueFormatter: (params) => {
                        if (params.value) {
                            return params.value.replace(/\w\S*/g, (txt) => {
                                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                            });
                        } else {
                            return '';
                        }
                    }
                },
                { 
                    headerName: "Date", 
                    field: "date", 
                    sortable: true, 
                    filter: true, 
                    width: 120,
                    sort: 'desc',
                    valueFormatter: (params) => {
                        if (!params.value) {
                            return 'No Date Provided';
                        }
                        
                        const date = new Date(params.value);
                        
                        if (!isNaN(date.getTime())) {
                            return date.toISOString().split('T')[0]; 
                        } else {
                            return 'Invalid Date';
                        }
                    }
                },
                { headerName: "Interview", field: "receivedInterview", sortable: true, filter: true, width: 120 },
                { 
                    headerName: "Link", 
                    field: "websiteLink", 
                    width: 95,
                    cellRenderer: LinkButton
                },
                { 
                    headerName: "Comment", 
                    field: "comment", 
                    sortable: true, 
                    width: 100,
                    tooltipField: "comment", 
                },
                { headerName: "Click", field: "click", sortable: true, width: 90 },
            ]
        };
    }

    componentDidMount() {
        this.loadRecords();
    }

    loadRecords = async () => {
        try {
            const records = await getRecords();
            const updatedRecords = records.map(record => {
                const appliedStatus = localStorage.getItem(`appliedStatus-${record._id}`);
                return {
                    ...record,
                    applied: appliedStatus === 'true'
                };
            });
            this.setState({ records: updatedRecords });
        } catch (error) {
            console.error("Error loading records:", error);
        }
    };

    getFilteredRecords = () => {
        const { records, filterOption } = this.state;
        if (filterOption === 'applied') {
            return records.filter(record => record.applied);
        } else if (filterOption === 'notApplied') {
            return records.filter(record => !record.applied);
        } else {
            return records;
        }
    };

    handleFilterChange = (event) => {
        this.setState({ filterOption: event.target.value });
    };

    render() {
        const filteredRecords = this.getFilteredRecords();

        return (
            <div className="body">
                <div className="filter-container">
                    <label>Filter: </label>
                    <select onChange={this.handleFilterChange} value={this.state.filterOption}>
                        <option value="all">All</option>
                        <option value="applied">Applied</option>
                        <option value="notApplied">Not Applied</option>
                    </select>
                </div>

                <div className="RecordPageContainer ag-theme-alpine" style={{ height: 500, width: '100%' }}>
                    {filteredRecords.length === 0 ? (
                        <div>No records found</div>
                    ) : (
                        <AgGridReact
                            rowData={filteredRecords}
                            columnDefs={this.state.columnDefs}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default RecordTable;
