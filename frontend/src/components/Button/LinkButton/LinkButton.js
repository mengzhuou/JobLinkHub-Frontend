import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import './LinkButton.css';
import { countRecord, updateApplicationStatus, getApplicationStatus } from '../../../connector';

const LinkButton = (props) => {
    const [buttonText, setButtonText] = useState('Apply');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchStatus = async () => {
            const cachedStatus = localStorage.getItem(`appliedStatus-${props.data._id}`);
            if (cachedStatus !== null) {
                setButtonText(cachedStatus === 'true' ? 'Applied' : 'Apply');
                return;
            }
            
            try {
                const response = await getApplicationStatus(props.data._id);
                const status = response.appliedStatus;
                setButtonText(status ? 'Applied' : 'Apply');
                localStorage.setItem(`appliedStatus-${props.data._id}`, status ? 'true' : 'false');
            } catch (error) {
                console.error("Error fetching application status:", error);
            }
        };
        fetchStatus();
    }, [props.data._id]);
   
    const handleClick = () => {
        window.open(props.value, '_blank');
        setShowModal(true);
    };
    
    const handleYes = async () => {
        setButtonText("Applied");
        localStorage.setItem(`appliedStatus-${props.data._id}`, 'true');
        await updateApplicationStatus(props.data._id, true);
        try {
            await countRecord(props.data._id, { click: props.data.click + 1 }); // Increment click count only if "Yes"
        } catch (error) {
            console.error("Error updating click count:", error);
        }
        setShowModal(false);
        if (props.refreshTable) {
            props.refreshTable();
        }
        window.location.reload();
    };
    
    const handleNo = async () => {
        setButtonText("Apply");
        localStorage.setItem(`appliedStatus-${props.data._id}`, 'false');
        await updateApplicationStatus(props.data._id, false);
        setShowModal(false);
        window.location.reload();
    };
    

    return (
        <div>
            <button 
                onClick={handleClick} 
                className={`apply-button ${buttonText === 'Applied' ? 'applied' : ''}`}
                // disabled={buttonText === 'Applied'}
            >
                {buttonText}
            </button>

            {/* Modal Code */}
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
