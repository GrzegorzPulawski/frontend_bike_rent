import React from "react";
import {Card, Col, Row} from "react-bootstrap";
import styles from "./Home.module.css";

function Home() {
    return(
        <div className="wrapper">
        <div className="content">
             <div className={styles.ImageContainer}>
            <img src="https://picsum.photos/id/1036/1200/800" alt="Main" />
        </div>
            <Row className={styles.Row}>
                <Col className={styles.Col}>
                    <Card className={styles.Card}>

                        <Card.Body>
                            <Card.Title className={styles.CardTitle}>
                                Login
                            </Card.Title>
                            <Card.Text className={styles.CardText}>
                                Logujesz się przy pomocy nazwy i hasła. Program sam wyloguje użytkownika po 1 godzinie.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className={styles.CardFooter}> Ważne: Podaj adminstartorwi, który cykl wypożyczenia: dobowy(24h), czy kalendarzowy(dzień), będziesz używał</Card.Footer>
                    </Card>

                    <Card className={styles.Card}>
                        <Card.Body>
                            <Card.Title className={styles.CardTitle}>
                                Klient
                            </Card.Title>
                            <Card.Text className={styles.CardText}>
                                Nowo dodany klient będzie Ci się wyświetlał na początku listy.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className={styles.CardFooter}> Ważne: Pamiętaj aby wprowadzić nazwisko klienta. Pożniej wyszukujemy po nazwisku</Card.Footer>
                    </Card>
                </Col>
                <Col className={styles.Col}>
                    <Card className={styles.Card}>
                        <Card.Body>
                            <Card.Title className={styles.CardTitle}>
                                Wypożycz
                            </Card.Title>
                            <Card.Text className={styles.CardText}>
                                Wybierz klienta z rozwijanej listy. Dodany klient będzie na górze listy.
                                Zaznacz sprzęt który chcesz wypożyczyć i *Zatwierdż*.
                                Program wyświetli Listę wypożyczeń.       .
                                Zaznacz wypożyczenia na podstawie którego wydrukujesz umowę z klientem.
                                Wciśnij *Wyrukuj Umowę*.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className={styles.CardFooter}> Wskazówka: Możesz jednocześnie zaznaczyć dowolną ilość sprzętu który chcesz wypożyczyć dla jednego klienta </Card.Footer>
                    </Card>
                </Col>
                <Col className={styles.Col}>
                    <Card className={styles.Card}>
                        <Card.Body>
                            <Card.Title className={styles.CardTitle}>
                                Lista wypożyczeń
                            </Card.Title>
                            <Card.Text className={styles.CardText}>
                                Tutaj zrobisz zwrot wypożyczeń. Zaznacz Wypożyczenia do zwrotu.
                                Naciśnij *Zatwierdź Zwroty*. program przekieruje Cię do Aktualnych zwrotów.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className={styles.CardFooter}>Wskazówka: Możesz zrobić zwrot wielu zaznaczonych wypożyczeń jednocześnie.
                            </Card.Footer>
                    </Card>
                </Col>
                <Col className={styles.Col}>
                    <Card className={styles.Card}>
                        <Card.Body>
                            <Card.Title className={styles.CardTitle}>
                                Akualne zawroty
                            </Card.Title>
                            <Card.Text className={styles.CardText}>
                                Tutaj wyświetlają się aktualne zwroty, tzn. z 15 ostatnich minut. Możesz podliczyć należność i przyjąć wpłatę od klienta.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className={styles.CardFooter}>Wskazówka: 15 minut;-)
                        </Card.Footer>
                    </Card>
                </Col>
                <Col className={styles.Col}>
                    <Card className={styles.Card}>
                        <Card.Body>
                            <Card.Title className={styles.CardTitle}>
                                Sprzęt
                            </Card.Title>
                            <Card.Text className={styles.CardText}>
                                Możesz dodać dowolna ilość kompletów, oraz je usuwać z bazy danych.
                                Logika wypożyczenie polega na wielokrotnym wypożyczeniu tego samego zestawu.
                                Tak powiniśmy tworzyć nazwy zestawu aby było wiadomo o co chodzi, np. Buty snowbordowe lub Narty dorosły.
                                Cena może zawierać grosze, np. 45,50.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className={styles.CardFooter}>Wskazówka: Stwórz Narty dorosły1, Narty dorosły2, itd.
                            Myślę że do 4, aby do jednego klienta jednorazowo, tworząc umowę, przypisać 4 komplety</Card.Footer>
                    </Card>
                </Col>
                <Col className={styles.Col}>
                    <Card className={styles.Card}>
                        <Card.Body>
                            <Card.Title className={styles.CardTitle}>
                                Raporty
                            </Card.Title>
                            <Card.Text className={styles.CardText}>
                                Dostępny jest raport dzienny przychodów. Pamiętaj, że klient płaci, gdy zdaje sprzęt.
                                Wprowadż datę, dla której system ma wygenerować raport.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className={styles.CardFooter}>Ważne: System nalicza opłaty za wypożyczenie w czasie kalendarzowym(dzień) lub 24 godzinnym.
                            Podaj adminstratorowi, który system wybierasz.
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </div>
            {/* Stopka z informacją */}
            <footer className={styles.footer}>
                <p>Program napisała firma Mandragora. Kontakt: Grzegorz 502 109 609</p>
            </footer>
        </div>

    )
}
export default Home;