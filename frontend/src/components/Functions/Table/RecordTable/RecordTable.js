import React, { Component } from "react";
import AgGridTable from '../AgGridTable/AgGridTable';
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
                { 
                    headerName: "Company", 
                    field: "company", 
                    sortable: true, 
                    filter: true, 
                    flex: 1.7 
                },
                { 
                    headerName: "Type", 
                    field: "type", 
                    sortable: true, 
                    filter: true, 
                    flex: 1.2
                },
                { 
                    headerName: "Job Title", 
                    field: "jobTitle", 
                    sortable: true, 
                    filter: true, 
                    flex: 3,
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
                    flex: 1.5,
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
                { 
                    headerName: "Interviewed", 
                    field: "receivedInterview", 
                    sortable: true, 
                    flex: 2 
                },
                { 
                    headerName: "Link", 
                    field: "websiteLink", 
                    flex: 1,
                    cellRenderer: LinkButton
                }
            ]
        };
    }

    componentDidMount() {
        this.loadRecords();
    }
    loadRecords = async () => {
        let attempts = 0; 
        const maxAttempts = 10; 
        const delay = 3000;
    
        const fetchRecords = async () => {
            try {
                const records = await getRecords();
                if (records.length > 0) {
                    const updatedRecords = records.map(record => ({
                        ...record,
                        isApplied: localStorage.getItem(`appliedStatus-${record._id}`) === 'true' || record.isApplied,
                    }));
                    this.setState({ records: updatedRecords });
                    return true; 
                }
                throw new Error("No records found");
            } catch (error) {
                console.error(`Attempt ${attempts + 1}: Error loading records:`, error);
                return false;
            }
        };
    
        while (attempts < maxAttempts) {
            const success = await fetchRecords();
            if (success) break; // Exit loop if data is successfully loaded
            attempts++;
            if (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, delay)); // Wait before next attempt
            }
        }
    
        if (attempts === maxAttempts) {
            console.error("Max attempts reached. Failed to load records.");
        }
    };
    

    getFilteredRecords = () => {
        const { records, filterOption } = this.state;
        return records.filter(record => {
            if (filterOption === 'applied') return record.isApplied;
            if (filterOption === 'notApplied') return !record.isApplied;
            return true; // Default: show all
        });
    };
    
    refreshTable = () => {
        this.loadRecords(); // Reload records when called
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
                        <div className="table-record-error">No records found</div>
                    ) : (
                        <AgGridTable
                            rowData={filteredRecords}
                            columnDefs={this.state.columnDefs.map(col => ({
                                ...col,
                                cellRendererFramework: col.field === "websiteLink" ? (params) => (
                                    <LinkButton
                                        data={params.data} // Pass the row data to LinkButton
                                        refreshTable={this.refreshTable}
                                        value={params.data.websiteLink} // Extract the websiteLink field
                                    />
                                ) : null,
                            }))}
                            defaultColDef={{ sortable: true, resizable: true }}
                            domLayout="autoHeight"
                        />
                    )}
                </div>
            </div>
        );
    }
}

export default RecordTable;
<div data-ref="eWrapper" class="ag-wrapper ag-picker-field-wrapper ag-picker-expanded ag-has-popup-positioned-under" tabindex="0" aria-expanded="true" role="combobox" aria-controls="ag-select-list-102" aria-label="Page Size">
    <div data-ref="eDisplayField" class="ag-picker-field-display" id="ag-101-display"></div>
    <div data-ref="eIcon" class="ag-picker-field-icon" aria-hidden="true"><span class="ag-icon ag-icon-small-down" unselectable="on" role="presentation"></span></div>
</div>