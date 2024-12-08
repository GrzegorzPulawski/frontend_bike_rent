import React from 'react';

const MessagesContent = ({ userDetails }) => {
    return (
        <div>
            <h1>Witaj, {userDetails.firstName}!</h1>
            <h4>Zalogowano poprawnie</h4>
        </div>
    );
};

export default MessagesContent;
