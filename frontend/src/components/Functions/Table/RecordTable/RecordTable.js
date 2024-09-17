import React, { Component } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './RecordTable.css';
import { getRecords } from '../../../../connector.js';
import LinkButton from '../../../Button/LinkButton/LinkButton';

class RecordTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            columnDefs: [
                { headerName: "Company", field: "company", sortable: true, filter: true, width: 230 },
                { headerName: "Type", field: "type", sortable: true, filter: true, width: 130 },
                { headerName: "Job Title", field: "jobTitle", sortable: true, filter: true, width: 230 },
                { 
                    headerName: "Date", 
                    field: "date", 
                    sortable: true, 
                    filter: true, 
                    width: 120,
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
                { headerName: "Interview", field: "receivedInterview", sortable: true, filter: true, width: 110 },
                { 
                    headerName: "Link", 
                    field: "websiteLink", 
                    width: 95,
                    cellRenderer: LinkButton
                },
                { headerName: "Comment", field: "comment", sortable: true, filter: true, width: 100 },
                { headerName: "Click", field: "click", sortable: true, filter: true, width: 80 },
            ]
        };
    }

    componentDidMount() {
        this.loadRecords();
    }

    loadRecords = async () => {
        try {
            const records = await getRecords();
            this.setState({ records });
        } catch (error) {
            console.error("Error loading records:", error);
        }
    };

    render() {
        return (
            <div className="body">
                <div className="RecordPageContainer ag-theme-alpine" style={{ height: 500, width: '100%' }}>
                    {this.state.records.length === 0 ? (
                        <div>No records found</div>
                    ) : (
                        <AgGridReact
                            rowData={this.state.records}
                            columnDefs={this.state.columnDefs}
                            defaultColDef={this.state.defaultColDef}
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default RecordTable;
