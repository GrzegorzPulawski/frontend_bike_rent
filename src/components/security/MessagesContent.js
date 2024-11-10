import React from 'react';

const MessagesContent = ({ userDetails }) => {
    return (
        <div>
            <h1>Witaj, {userDetails.firstName}!</h1>
            {/* Możesz dodać inne dane, które chcesz wyświetlić */}
        </div>
    );
};

export default MessagesContent;
