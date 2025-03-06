import React from "react";
import {Card, Col, Row} from "react-bootstrap";
import styles from "./Home.module.css";

function Home() {
    return(
        <div className="wrapper">
        <div className="content">
             <div className={styles.ImageContainer}>
            <img src="https://picsum.photos/id/859/1200/800" alt="Main" />
        </div>
            <Row className={styles.Row}>
                <Col className={styles.Col}>
                    <Card className={styles.Card}>

                        <Card.Body>
                            <Card.Title className={styles.CardTitle}>
                                Login
                            </Card.Title>
                            <Card.Text className={styles.CardText}>
                                Logujesz się przy pomocy nazwy i hasła. Program sam wyloguje użytkownika po 5 godzinach.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className={styles.CardFooter}> Ważne: Podaj adminstartorwi, który cykl wypożyczenia: dobowy(24h), czy kalendarzowy(dzień), będziesz używał</Card.Footer>
                    </Card>

                    <Card className={styles.Card}>
                        <Card.Body>
                            <Card.Title className={styles.CardTitle}>
                                Klient
                            </Card.Title>
                            <Card.Text className={styles.CardText}>Możesz dodać i usunąć klienta. Wyszukujemy klienta po nazwisku.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className={styles.CardFooter}> Wskazówka: Wyświetla się tylko ostatnio dodany klient. </Card.Footer>
                    </Card>
                </Col>

                <Col className={styles.Col}>
                    <Card className={styles.Card}>
                        <Card.Body>
                            <Card.Title className={styles.CardTitle}>
                                Aktualne wypożyczenia
                            </Card.Title>
                            <Card.Text className={styles.CardText}>
                                Tutaj zrobisz zwrot wypożyczeń. Zaznacz Wypożyczenie do zwrotu.
                                Naciśnij *Zatwierdź Zwroty*. program przekieruje Cię do Aktualnych zwrotów.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className={styles.CardFooter}>Wskazówka: Możesz tutaj wydrukować Umowę Wypożyczenia.
                            </Card.Footer>
                    </Card>
                </Col>
                <Col className={styles.Col}>
                    <Card className={styles.Card}>
                        <Card.Body>
                            <Card.Title className={styles.CardTitle}>
                                Akualne zwroty
                            </Card.Title>
                            <Card.Text className={styles.CardText}>
                                Tutaj wyświetlają się aktualne zwroty, tzn. z 60 ostatnich minut. Możesz podliczyć należność i przyjąć wpłatę od klienta.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className={styles.CardFooter}>Wskazówka: Możesz z tego miejsca wydrukować potwierdzenie zwrotu dla klienta.
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
                                Możesz dodać dowolna ilość rowerów, oraz je usuwać z bazy danych.
                                Zastosowano logikę stanów magazynowych, czyli jeśli rower jest wypożyczony, to jest niedostępny do wypożyczneia.
                                Wybierz rower i wejdź w Detale roweru w celu Wypożyczenia.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className={styles.CardFooter}>Wskazówka: </Card.Footer>
                    </Card>
                </Col>
                <Col className={styles.Col}>
                    <Card className={styles.Card}>
                        <Card.Body>
                            <Card.Title className={styles.CardTitle}>
                                Detale roweru
                            </Card.Title>
                            <Card.Text className={styles.CardText}>
                              Wybierz z listy nazwisko klienta i kliknij Wypożyczenie.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer className={styles.CardFooter}>Wskazówka: </Card.Footer>
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
                                Kolejne raporty to: Utworzone wypożyczenia w dniu, Zwrócone wypożyczenia w dniu.
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