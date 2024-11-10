import React from "react";
import classes from "./AppHeader.module.css";
import {Link} from "react-router-dom";


export default  class AppHeader extends React.Component {

    render() {

        return (
            <div className={classes.AppHeader}>
                <div className={classes.HeaderLeft}>
                    <Link to={"/user-list"}>
                        <div className={classes.HeaderTitle}>Smart Ski Rent</div>
                    </Link>
                </div>
                <div className={classes.HeaderRight}>
                    <Link to={"/newlogin"}>
                        <div>Login</div>
                    </Link>

                    <Link to={"/"}>
                        <div>Home</div>
                    </Link>
                    <Link to={"/clientlist"}>
                        <div>Klient</div>
                    </Link>
                    <Link to={"/renting"}>
                        <div>Wypożycz</div>
                    </Link>
                    <Link to={"/list"}>
                        <div>Sprzęt</div>
                    </Link>
                    <Link to={"/dailyReport"}>
                        <div>Raporty</div>
                    </Link>
                </div>
            </div>
        );
    };
}

