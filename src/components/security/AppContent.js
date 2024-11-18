import * as React from 'react';
import AuthContent from "./AuthContent";
import {request, setAuthToken, isUserInRole} from "../../axios_helper";
import LoginForm from '../login/LoginForm'
import Buttons from '../login/Buttons'
import WelcomeContent from "./WelcomeContent";
import MessagesContent from './MessagesContent';

export default class AppContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            componentToShow: "welcome",
            errorMessage: "",
            logoutMessage: "",
            userDetails: { firstName: ' ' }
        };
    };

    login = () => {
        this.setState({componentToShow: "login", errorMessage: "" });
    };
    logout = () => {
        this.setState({componentToShow: "welcome",
        logoutMessage: "Wylogowano użytkownika"});

        setAuthToken(null);
    };
    showMessages = () => {
        this.setState({ componentToShow: "messages" });
    };
    onLogin = (e, username, password) => {
        e.preventDefault();
        request("POST", "/api/auth/login", {login: username, password: password}
        ).then((response)=> {

            setAuthToken(response.data.token);

           request("GET", "/api/user/details")
            .then ((userDetailsResponse) => {
                const userData = userDetailsResponse.data;

            sessionStorage.setItem('userDetails', JSON.stringify(userData));

            this.setState({componentToShow: "messages",
                userDetails: userData});

        }).catch((error)=> {
            this.setState({componentToShow: "welcome"})
        });
    })
            .catch((error) => {
                console.error('Login failed:', error);
                this.setState({ componentToShow: "welcome" });
            });
    };

    onRegister = (e, firstName, lastName, username, password) => {
        e.preventDefault();
        if (!isUserInRole('DEVEL')) {
            this.setState({ errorMessage: "Brak dostępu: tylko deweloperzy mogą rejestrować nowych użytkowników." });
            return; // Zatrzymaj proces rejestracji
        }

        request("POST", "/api/auth/register", {
            firstName: firstName,
            lastName: lastName,
            login: username,
            password: password}
        ).then((response)=> {
            console.log("Registration successful, token received:", response.data.token);
            this.setState({componentToShow: "messages"})
            setAuthToken(response.data.token);
        }).catch((error)=> {
            console.error("Registration error:", error);
            this.setState({componentToShow: "welcome", errorMessage:"Błąd w rejestracji"})
        });
    };

    render() {
        return (
            <div>
                <Buttons login={this.login} logout={this.logout}/>
                {this.state.errorMessage && <p style={{ color: "red" }}>{this.state.errorMessage}</p>}
                {this.state.logoutMessage && <p style={{ color: "green" }}>{this.state.logoutMessage}</p>}
                {this.state.componentToShow === "welcome" && <WelcomeContent/>}
                {this.state.componentToShow === "messages" && (<AuthContent actionType="login" />
                ) && <MessagesContent userDetails={this.state.userDetails} />}
                {this.state.componentToShow === "login" && <LoginForm onLogin={this.onLogin} onRegister={this.onRegister}/>}

            </div>
        )
    }
}