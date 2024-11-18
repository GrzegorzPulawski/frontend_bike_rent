import React from "react";
import classes from "./AppBody.module.css";
import {  Route, Routes} from "react-router-dom";
import Home from "../home/Home";
import EquipmentList from "../equipment/EquipmentList";
import FormEquipment from "../equipment/FormEquipment";
import ClientList from "../client/ClientList";
import FormClient from "../client/FormClient";
import Renting from "../renting/Renting";
import RentingList from "../renting/RentingList";
import ReturnRenting from "../renting/ReturnRenting";
import RentalAgreement from "../renting/RentalAgreement";
import EquipmentDelete from "../equipment/EquipmentDelete";
import DailyRevenueReport from "../reports/DailyRevenueReport";
import DeleteClient from "../client/DeleteClient";
import AppContent from "../security/AppContent";
import UserList from "../users/UserList";

const AppBody = () => {

    return(
        <div className={classes.AppBody}>
            <Routes>
                <Route path={"/"} element={<Home/>}></Route>
                <Route path={"/list"} element={<EquipmentList/>}> </Route>
                <Route path={"/clientlist"} element={<ClientList/>}> </Route>
                <Route path={"/formequipment"} element={<FormEquipment/>}></Route>
                <Route path={"/formClient"} element={<FormClient/>}></Route>
                <Route path={"/renting"} element={<Renting/>}></Route>
                <Route path={"/rentingList"} element={<RentingList/>}></Route>
                <Route path={"/returnRenting"} element={<ReturnRenting/>}></Route>
                <Route path={"/rentalAgreement"} element={<RentalAgreement/>}></Route>
                <Route path={"/equipmentDelete"} element={<EquipmentDelete/>}></Route>
                <Route path={"/dailyReport"} element={<DailyRevenueReport/>}></Route>
                <Route path={"/deleteClient"} element={<DeleteClient/>}></Route>
                <Route path={"/newlogin"} element={<AppContent/>}></Route>
                <Route path={"/user-list"} element={<UserList/>}></Route>
            </Routes>
        </div>
    );
}
export default AppBody;