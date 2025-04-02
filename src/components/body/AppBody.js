import React from "react";
import classes from "./AppBody.module.css";
import {  Route, Routes} from "react-router-dom";
import Home from "../home/Home";
import EquipmentList from "../equipment/EquipmentList";
import FormEquipment from "../equipment/FormEquipment";
import ClientList from "../client/ClientList";
import FormClient from "../client/FormClient";
import RentingList from "../renting/RentingList";
import ReturnRenting from "../renting/ReturnRenting";
import EquipmentDelete from "../equipment/EquipmentDelete";
import DailyRevenueReport from "../reports/DailyRevenueReport";
import DeleteClient from "../client/DeleteClient";
import AppContent from "../security/AppContent";
import UserList from "../users/UserList";
import PrintAgreements from "../renting/PrintAgreements";
import ShowCurrentlyReturned from "../renting/ShowCurrentlyReturned";
import Reports from "../reports/Reports";
import ShowDailyReturned from "../reports/ShowDailyReturned";
import DailyRentedReport from "../reports/DailyRentedReport";
import EquipmentDetails from "../equipment/EquipmentDetails";
import BarcodeGenerator from "../BarcodeScanner/BarcodeGenerator";
import BarcodePrint from "../BarcodeScanner/BarcodePrint";



const AppBody = () => {

    return(
        <div className={classes.AppBody}>
            <Routes>
                <Route path={"/"} element={<Home/>}></Route>
                <Route path={"/list"} element={<EquipmentList/>}> </Route>
                <Route path={"/clientlist"} element={<ClientList/>}> </Route>
                <Route path={"/formequipment"} element={<FormEquipment/>}></Route>
                <Route path={"/formClient"} element={<FormClient/>}></Route>
                <Route path={"/rentingList"} element={<RentingList/>}></Route>
                <Route path={"/returnRenting"} element={<ReturnRenting/>}></Route>
                <Route path={"/equipmentDelete"} element={<EquipmentDelete/>}></Route>
                <Route path={"/daily-report"} element={<DailyRevenueReport/>}></Route>
                <Route path={"/deleteClient"} element={<DeleteClient/>}></Route>
                <Route path={"/newlogin"} element={<AppContent/>}></Route>
                <Route path={"/user-list"} element={<UserList/>}></Route>
                <Route path="/printAgreements" element={<PrintAgreements />} />
                <Route path="/show-currently-returned" element={<ShowCurrentlyReturned />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/show-daily-returned" element={<ShowDailyReturned />} />
                <Route path="/daily-rented-report" element={<DailyRentedReport />} />
                <Route path="/equipment-details/:id" element={<EquipmentDetails />} />
                <Route path={"/barcode"} element={<BarcodePrint/>} />
            </Routes>
        </div>
    );
}
export default AppBody;