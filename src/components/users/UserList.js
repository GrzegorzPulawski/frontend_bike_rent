import React, { useEffect, useState } from 'react';
import {request, isUserInRole} from "../../axios_helper";


const UserList = () => {
    // State do przechowywania listy użytkowników
    const [users, setUsers] = useState([]);
    const[hasAccess, setHasAccess]= useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Sprawdzaj rolę bezpośrednio
        if (isUserInRole('DEVEL')) {
            setHasAccess(true); // Użytkownik ma dostęp
            fetchUsers(); // Wywołaj funkcję do pobrania użytkowników
        } else {
            setHasAccess(false);
            setErrorMessage("Brak dostępu do listy użytkowników."); // Ustaw komunikat o błędzie
        }
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await request('GET', '/api/user/all');
            setUsers(response.data);
        } catch (error) {
            console.error('Błąd podczas pobierania użytkowników:', error);
        }
    };
    if (!hasAccess) {
        return <div>{errorMessage}</div>; // Wyświetlanie komunikatu o błędzie
    }


    return (
        <div>
            <h2>Lista Użytkowników</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nazwa firmy</th>
                    <th>Nip firmy</th>
                    <th>Login</th>
                    <th>Rola</th>
                    <th>Czas wypo kalendarzowy</th>
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
                        <td>{user.calendar ? "Tak" : "Nie"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
