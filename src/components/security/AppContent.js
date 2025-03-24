import * as React from 'react';
import AuthContent from "./AuthContent";
import {request, setAuthToken} from "../../axios_helper";
import LoginForm from '../login/LoginForm';
import Buttons from '../login/Buttons';
import WelcomeContent from "../login/WelcomeContent";
import MessagesContent from './MessagesContent';
import styles from './AppContent.module.css';

export default class AppContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            componentToShow: "welcome",
            errorMessage: "",
            successMessage: "",
            userDetails: null,
            isAuthenticated: false
        };
    }

    login = () => {
        this.setState({
            componentToShow: "login",
            errorMessage: "",
            successMessage: ""
        });
    };

    logout = () => {
        setAuthToken(null);
        sessionStorage.removeItem('userDetails');
        this.setState({
            componentToShow: "welcome",
            isAuthenticated: false,
            successMessage: "Wylogowano pomyślnie",
            userDetails: null
        });
    };

    onLogin = (e, username, password) => {
        e.preventDefault();
        request("POST", "/api/auth/login", {
            login: username,
            password: password
        }).then((response) => {
            setAuthToken(response.data.token);
            return request("GET", "/api/user/details");
        }).then((userDetailsResponse) => {
            const userData = userDetailsResponse.data;
            sessionStorage.setItem('userDetails', JSON.stringify(userData));
            this.setState({
                componentToShow: "messages",
                userDetails: userData,
                isAuthenticated: true,
                successMessage: "Zalogowano pomyślnie"
            });
        }).catch((error) => {
            this.setState({
                componentToShow: "welcome",
                errorMessage: "Błąd logowania: " + (error.response?.data?.message || "Nieprawidłowe dane")
            });
        });
    };

    onRegister = (e, firstName, lastName, username, password) => {
        e.preventDefault();
        request("POST", "/api/auth/register", {
            firstName,
            lastName,
            login: username,
            password
        }).then((response) => {
            setAuthToken(response.data.token);
            this.setState({
                componentToShow: "messages",
                successMessage: "Rejestracja zakończona sukcesem"
            });
        }).catch((error) => {
            this.setState({
                componentToShow: "welcome",
                errorMessage: "Błąd rejestracji: " + (error.response?.data?.message || "Spróbuj ponownie")
            });
        });
    };

    render() {
        const { componentToShow, errorMessage, successMessage, userDetails, isAuthenticated } = this.state;

        return (
            <div className={styles.appContainer}>
                <Buttons
                    login={this.login}
                    logout={this.logout}
                    isAuthenticated={isAuthenticated}
                />

                {errorMessage && (
                    <div className={styles.errorMessage}>
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className={styles.successMessage}>
                        {successMessage}
                    </div>
                )}

                {componentToShow === "welcome" && <WelcomeContent />}
                {componentToShow === "login" && (
                    <LoginForm
                        onLogin={this.onLogin}
                        onRegister={this.onRegister}
                    />
                )}
                {componentToShow === "messages" && (
                    <>
                        <MessagesContent userDetails={userDetails} />
                        <AuthContent actionType={isAuthenticated ? "login" : "register"} />
                    </>
                )}
            </div>
        );
    }
}