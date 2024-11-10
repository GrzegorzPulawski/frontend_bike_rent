import React, { useEffect, useState } from 'react';
import {request} from "../../axios_helper";

const UserList = () => {
    // State do przechowywania listy użytkowników
    const [users, setUsers] = useState([]);

    // Funkcja do pobrania danych z backendu
    const fetchUsers = async () => {
        try {
            const response = await request('get', '/api/user/all');
            setUsers(response.data);
        } catch (error) {
            console.error('Błąd podczas pobierania użytkowników:', error);
        }
    };

    // Pobieranie danych po pierwszym renderze komponentu
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <h2>Lista Użytkowników</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Imię</th>
                    <th>Nazwisko</th>
                    <th>Login</th>
                    <th>Rola</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.login}</td>
                        <td>{user.role}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
