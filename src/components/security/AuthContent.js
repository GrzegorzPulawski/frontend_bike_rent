import React from "react";

import { request } from '../../axios_helper';

export default class AuthContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",  // Dodajemy zmienną do przechowywania komunikatu
        };
    }

    componentDidMount() {
        // Pobieramy komunikat na podstawie typu akcji (login lub register)
        const { actionType } = this.props;  // Oczekujemy, że props.actionType będzie 'login' lub 'register'

        if (actionType) {
            request("GET", `/messages?type=${actionType}`)
                .then((response) => {
                    this.setState({ message: response.data });
                })
                .catch((error) => {
                    console.error("Błąd podczas pobierania wiadomości:", error);
                    this.setState({ message: "Wystąpił problem z pobraniem komunikatu." });
                });
        }
    }

    render() {
        return (
            <div className="row justify-around-l">
                <div className="col-4">
                    <div className="card">
                        {/* Wyświetlamy komunikat */}
                        {this.state.message && <p>{this.state.message}</p>}
                    </div>
                </div>
            </div>
        );
    }
}
