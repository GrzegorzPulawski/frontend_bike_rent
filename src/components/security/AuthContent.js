import React from "react";
import { request } from '../../axios_helper';
import styles from './AuthContent.module.css';

export default class AuthContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            isLoading: true,
            error: null
        };
    }

    componentDidMount() {
        const { actionType } = this.props;

        if (actionType) {
            this.setState({ isLoading: true });
            request("GET", `/messages?type=${actionType}`)
                .then((response) => {
                    this.setState({
                        message: response.data,
                        isLoading: false,
                        error: null
                    });
                })
                .catch((error) => {
                    console.error("Error fetching message:", error);
                    this.setState({
                        message: this.getDefaultMessage(actionType),
                        isLoading: false,
                        error: error.message
                    });
                });
        }
    }

    getDefaultMessage(actionType) {
        const messages = {
            login: "Zalogowano pomyślnie! Możesz teraz korzystać z aplikacji.",
            register: "Rejestracja zakończona sukcesem! Możesz się teraz zalogować.",
            default: "Operacja zakończona pomyślnie."
        };
        return messages[actionType] || messages.default;
    }

    render() {
        const { message, isLoading, error } = this.state;

        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    {isLoading ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.spinner}></div>
                            <p>Ładowanie wiadomości...</p>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className={styles.errorAlert}>
                                    <span>⚠️</span> {error}
                                </div>
                            )}
                            <p className={styles.message}>
                                {message}
                                {this.props.actionType === 'login' && (
                                    <span className={styles.welcomeEmoji}> 👋</span>
                                )}
                            </p>
                        </>
                    )}
                </div>
            </div>
        );
    }
}
