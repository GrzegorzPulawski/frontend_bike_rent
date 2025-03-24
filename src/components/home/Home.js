import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import styles from "./Home.module.css";

function Home() {
    const features = [
        {
            title: "Login",
            text: "Logujesz się przy pomocy nazwy i hasła. Program sam wyloguje użytkownika po 5 godzinach.",
            footer: "Ważne: Podaj administratorowi, który cykl wypożyczenia: dobowy(24h), czy kalendarzowy(dzień), będziesz używał"
        },
        {
            title: "Klient",
            text: "Możesz dodać i usunąć klienta. Wyszukujemy klienta po nazwisku.",
            footer: "Wskazówka: Wyświetla się tylko ostatnio dodany klient."
        },
        {
            title: "Aktualne wypożyczenia",
            text: "Tutaj zrobisz zwrot wypożyczeń. Zaznacz Wypożyczenie do zwrotu. Naciśnij *Zatwierdź Zwroty*. Program przekieruje Cię do Aktualnych zwrotów.",
            footer: "Wskazówka: Możesz tutaj wydrukować Umowę Wypożyczenia."
        },
        {
            title: "Aktualne zwroty",
            text: "Tutaj wyświetlają się aktualne zwroty, tzn. z ostatnich 2 godzin. Możesz podliczyć należność i przyjąć wpłatę od klienta.",
            footer: "Wskazówka: Możesz z tego miejsca wydrukować potwierdzenie zwrotu dla klienta."
        },
        {
            title: "Sprzęt",
            text: "Możesz dodać dowolną ilość rowerów, oraz je usuwać z bazy danych. Zastosowano logikę stanów magazynowych - jeśli rower jest wypożyczony, jest niedostępny do wypożyczenia. Wybierz rower i wejdź w Detale roweru w celu Wypożyczenia.",
            footer: "Wskazówka: Jest dostępne wyszukiwanie sprzętu po numerze ramy."
        },
        {
            title: "Detale roweru",
            text: "Wybierz z listy nazwisko klienta i kliknij Wypożyczenie.",
            footer: "Wskazówka: "
        },
        {
            title: "Raporty",
            text: "Dostępny jest raport dzienny przychodów. Pamiętaj, że klient płaci, gdy zdaje sprzęt. Kolejne raporty to: Utworzone wypożyczenia w dniu, Zwrócone wypożyczenia w dniu.",
            footer: "Ważne: System nalicza opłaty za wypożyczenie w czasie kalendarzowym(dzień) lub 24 godzinnym. Podaj administratorowi, który system wybierasz."
        }
    ];

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <div className={styles.imageContainer}>
                    <img
                        src="https://picsum.photos/id/859/800/600"
                        alt="Main"
                        className={styles.mainImage}
                    />
                </div>

                <Row className={styles.cardRow}>
                    {features.map((feature, index) => (
                        <Col key={index} md={6} lg={4} className={styles.cardCol}>
                            <Card className={styles.featureCard}>
                                <Card.Body>
                                    <Card.Title className={styles.cardTitle}>
                                        {feature.title}
                                    </Card.Title>
                                    <Card.Text className={styles.cardText}>
                                        {feature.text}
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer className={styles.cardFooter}>
                                    {feature.footer}
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            <footer className={styles.footer}>
                <p>Program napisała firma Mandragora. Kontakt: Grzegorz 502 109 609</p>
            </footer>
        </div>
    );
}

export default Home;