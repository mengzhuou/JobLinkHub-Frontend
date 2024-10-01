import React from 'react';
import './LinkButton.css';
import { countRecord } from '../../../connector';

const LinkButton = (props) => {
    const handleClick = async () => {
        try {
            // Increment the click count in the database
            await countRecord(props.data._id, { click: props.data.click + 1 });
            
            // Open the website link in a new tab
            window.open(props.value, '_blank');
            window.location.reload();
            // Optionally, you can refresh the table here or let the parent handle it
            props.refreshTable();
        } catch (error) {
            console.error("Error updating click count:", error);
        }
    };

    return (
        <button onClick={handleClick} className="apply-button">
            Apply
        </button>
    );
};

export default LinkButton;
