import React, { useEffect, useState } from 'react';
import { getProfileByUserId, deleteRecord } from '../../../connector'; // Import the functions to get and delete records
import AgGridTable from '../../Functions/Table/AgGridTable/AgGridTable';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleEdit = (id) => {
        // Navigate to the edit page, passing the record ID
        navigate(`/edit/${id}`);
    };

    const handleDelete = async (id) => {
        // Ask for confirmation before deleting
        const confirmDelete = window.confirm('Are you sure you want to delete this record?');
        if (confirmDelete) {
            try {
                await deleteRecord(id); // Call the delete function
                setRecords(records.filter(record => record._id !== id)); // Update the state
                alert('Record deleted successfully');
                window.location.reload();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleOpenLink = async (websiteLink) => {
        if (websiteLink) {
            window.open(websiteLink, '_blank');
        } else {
            alert('No valid URL provided');
        }
    };
    
    const ActionCellRenderer = (params) => {
        return (
            <div className="action-buttons-container">
                <button className="edit-button" onClick={() => handleEdit(params.data._id)}>
                    Edit
                </button>
                <button className="delete-button" onClick={() => handleDelete(params.data._id)}>
                    Delete
                </button>
            </div>
        );
    };

    const WebsiteLinkCellRenderer = (params) => {
        return (
            <div className="action-buttons-container">
                <button className="link-button" onClick={() => handleOpenLink(params.data.websiteLink)}>
                    Link
                </button>
            </div>
        );
    };

    const [columnDefs] = useState([
        { headerName: "Company", field: "company", sortable: true, filter: true, flex: 2 },
        { headerName: "Type", field: "type", sortable: true, filter: true, flex: 1 },
        { 
            headerName: "Job Title", 
            field: "jobTitle", 
            sortable: true, 
            filter: true, 
            flex: 1.5,
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
            field: "appliedDate", 
            sortable: true, 
            flex: 1.3,
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
            headerName: "Website",
            field: "websiteLink",
            flex: 1,
            cellRenderer: WebsiteLinkCellRenderer,
        },
        {
            headerName: "Actions",
            field: "actions",
            flex: 1,
            cellRenderer: ActionCellRenderer, // Referencing the custom renderer
        },
    ]);

    useEffect(() => {
        const fetchUserRecords = async () => {
            const userId = JSON.parse(localStorage.getItem('userInfo'))._id; // Get user ID from localStorage
            try {
                const data = await getProfileByUserId(userId);
                setRecords(data.appliedRecords);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchUserRecords();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

return (
    <div className="profile-page">
        <h1>Applied Application</h1>
        <div className="profile-table-container">
            <div className="profile-table">
            <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
                {records.length === 0 ? (
                    <div className='profile-record-error'>No records found</div>
                ) : (
                    <AgGridTable
                        rowData={records}
                        columnDefs={columnDefs}
                        defaultColDef={{ sortable: true, resizable: true }}
                        domLayout="autoHeight"
                    />
                )}
                </div>
            </div>
        </div>
    </div>
);
};

export default ProfilePage;
