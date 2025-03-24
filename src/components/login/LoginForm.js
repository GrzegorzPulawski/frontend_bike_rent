import * as React from 'react';
import styles from "./LoginForm.module.css";

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: "login",
            firstName: "",
            lastName: "",
            login: "",
            password: "",
            errors: {}
        };
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
            errors: {
                ...this.state.errors,
                [name]: null
            }
        });
    };

    validateForm = () => {
        const { active, firstName, lastName, login, password } = this.state;
        const errors = {};

        if (!login.trim()) errors.login = "Login jest wymagany";
        if (!password.trim()) errors.password = "Hasło jest wymagane";

        if (active === "register") {
            if (!firstName.trim()) errors.firstName = "Imię jest wymagane";
            if (!lastName.trim()) errors.lastName = "Nazwisko jest wymagane";
            if (password.length < 6) errors.password = "Hasło musi mieć minimum 6 znaków";
        }

        this.setState({ errors });
        return Object.keys(errors).length === 0;
    };

    handleSubmit = (e) => {
        e.preventDefault();

        if (!this.validateForm()) return;

        const { active, firstName, lastName, login, password } = this.state;
        const { onLogin, onRegister } = this.props;

        if (active === "login") {
            onLogin(e, login, password);
        } else {
            onRegister(e, firstName, lastName, login, password);
        }
    };

    renderFormField = (id, name, label, type = "text") => {
        return (
            <div className={styles.formOutline}>
                <input
                    type={type}
                    id={id}
                    name={name}
                    className={`${styles.formControl} ${this.state.errors[name] ? styles.error : ""}`}
                    value={this.state[name]}
                    onChange={this.handleChange}
                />
                <label className={styles.formLabel} htmlFor={id}>
                    {label}
                </label>
                {this.state.errors[name] && (
                    <div className={styles.errorMessage}>
                        {this.state.errors[name]}
                    </div>
                )}
            </div>
        );
    };

    render() {
        const { active } = this.state;

        return (
            <div className={styles.row}>
                <div className={styles.col4}>
                    <ul className={styles.nav} role="tablist">
                        <li className={styles.navItem} role="presentation">
                            <button
                                className={`${styles.navLink} ${active === "login" ? styles.active : ""}`}
                                onClick={() => this.setState({ active: "login", errors: {} })}
                            >
                                Logowanie
                            </button>
                        </li>
                        <li className={styles.navItem} role="presentation">
                            <button
                                className={`${styles.navLink} ${active === "register" ? styles.active : ""}`}
                                onClick={() => this.setState({ active: "register", errors: {} })}
                            >
                                Rejestracja
                            </button>
                        </li>
                    </ul>

                    <div className={styles.tabContent}>
                        {active === "login" ? (
                            <form onSubmit={this.handleSubmit}>
                                {this.renderFormField("loginName", "login", "Nazwa użytkownika")}
                                {this.renderFormField("loginPassword", "password", "Hasło", "password")}
                                <button type="submit" className={styles.btnPrimary}>
                                    Zaloguj się
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={this.handleSubmit}>
                                {this.renderFormField("firstName", "firstName", "Imię")}
                                {this.renderFormField("lastName", "lastName", "Nazwisko")}
                                {this.renderFormField("registerLogin", "login", "Login")}
                                {this.renderFormField("registerPassword", "password", "Hasło", "password")}
                                <button type="submit" className={styles.btnPrimary}>
                                    Zarejestruj się
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}