import React from 'react';
import './LinkButton.css'


const LinkButton = (props) => {
    const handleClick = () => {
        window.open(props.value, '_blank');
    };

    return (
        <button onClick={handleClick} className="apply-button">
            Apply
        </button>
    );
};

export default LinkButton;
