import React from 'react';
export default  class WelcomeContent extends  React.Component {
    render() {
        return (
            <div className="row justify-content-md-center">
                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                    <h1 className="display-4">Witamy w naszym programie</h1>
                        <h4>Przeczytaj instrukcję, która się znajduję w zakładce Home</h4>
                        <div>Wersja testowa!</div>
                        <div> Docelowo dodawać użytkowników będzie mógł tylko administrator. Sprzęt bedzie mógł dodawać tylko kierownik</div>
                    </div>
                </div>
            </div>
        )
    }
}