import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import './LinkButton.css';
import { countRecord, createRecordByRecordId } from '../../../connector';
import { useNavigate } from 'react-router-dom';

const LinkButton = (props) => {
    const [buttonText, setButtonText] = useState('Apply');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const status = props.data.isApplied;
                setButtonText(status ? 'Applied' : 'Apply');
                localStorage.setItem(`appliedStatus-${props.data._id}`, status ? 'true' : 'false');
            } catch (error) {
                console.error("Error fetching application status:", error);
            }
        };
        fetchStatus();
    }, [props.data]);
    const navigate = useNavigate();

    const handleClick = () => {
        window.open(props.value, '_blank');
        setShowModal(true);
    };
    
    const handleYes = async () => {
        setButtonText("Applied");
        const newRecord = await createRecordByRecordId(props.data._id);
        navigate(`/edit/${newRecord.newRecordId}`);

        try {
            await countRecord(props.data._id, { click: props.data.click + 1 });
        } catch (error) {
            console.error("Error updating click count:", error);
        }
        setShowModal(false);
        if (props.refreshTable) {
            props.refreshTable(); // Refresh the records in the table
        }
    };
    
    const handleNo = async () => {
        setButtonText("Apply");
        localStorage.setItem(`appliedStatus-${props.data._id}`, 'false');
        // await updateApplicationStatus(props.data._id, false);
        setShowModal(false);
        if (props.refreshTable) {
            props.refreshTable(); // Refresh the records in the table
        }
    };    
    

    return (
        <div>
            <button 
                onClick={handleClick} 
                className={`apply-button ${buttonText === 'Applied' ? 'applied' : ''}`}
                disabled={buttonText === 'Applied'}
            >
                {buttonText}
            </button>

            {showModal && ReactDOM.createPortal(
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>Did you apply for this job?</p>
                        <button onClick={handleYes} className="yes-button">Yes</button>
                        <button onClick={handleNo} className="no-button">No</button>
                    </div>
                </div>,
                document.body 
            )}
        </div>
    );
};

export default LinkButton;
