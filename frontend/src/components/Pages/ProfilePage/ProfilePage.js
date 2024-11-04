import React, { useEffect, useState } from 'react';
import { getRecordsByUser, deleteRecord } from '../../../connector'; // Import the functions to get and delete records
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './ProfilePage.css';
import LinkButton from '../../Button/LinkButton/LinkButton';
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

    const [columnDefs] = useState([
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
            width: 120,
            tooltipField: "comment", 
        },
        { headerName: "Click", field: "click", sortable: true, width: 90 },
        {
            headerName: "Actions",
            field: "actions",
            width: 150,
            cellRenderer: ActionCellRenderer, // Referencing the custom renderer
        },
    ]);

    useEffect(() => {
        const fetchUserRecords = async () => {
            const userId = JSON.parse(localStorage.getItem('userInfo'))._id; // Get user ID from localStorage
            try {
                const data = await getRecordsByUser(userId);
                // console.log("userId: ", userId)
                setRecords(data);
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
        <h1>My Applications</h1>
        <div className="profile-table-container">
            <div className="profile-table">
            <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
                {records.length === 0 ? (
                    <div>No records found</div>
                ) : (
                    <AgGridReact
                        rowData={records}
                        columnDefs={columnDefs}
                        tooltipShowDelay={0}
                    />
                )}
                </div>
            </div>
        </div>
    </div>
);
};

export default ProfilePage;
