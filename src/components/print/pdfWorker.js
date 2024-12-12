import jsPDF from 'jspdf';
import moment from 'moment-timezone';

export const generatePdf = (recentlyReturned, selectedItems) => {
    const doc = new jsPDF();

    doc.addFont('fonts/Roboto-Medium.ttf', 'Roboto-Medium', 'normal');
    doc.setFont('Roboto-Medium');
    doc.setFontSize(12);

    let verticalPosition = 10; // Starting from the top
    const marginX = 10;        // Left margin
    const marginY = 0;         // Top margin
    const confirmationHeight = 65; // Height per confirmation
    let totalSum = 0; // Total sum for the selected items

    recentlyReturned.forEach((item) => {
        if (selectedItems.includes(item.idRenting)) {
            doc.text(`Potwierdzenie przyjecia zwrotu sprzętu Nr: ${item.idRenting}`, marginX, verticalPosition + 10);
            doc.text(`Imię: ${item.firstName}`, marginX, verticalPosition + 20);
            doc.text(`Nazwisko: ${item.lastName}`, marginX, verticalPosition + 25);
            doc.text(`Data wypożyczenia: ${moment.utc(item.dateRenting).tz('Europe/Warsaw').format('DD/MM/YY HH:mm')}`, marginX, verticalPosition + 30);
            doc.text(`Sprzęt: ${item.nameEquipment}`, marginX, verticalPosition + 35);
            doc.text(`Data zwrotu: ${item.dateOfReturn ? moment.utc(item.dateOfReturn).tz('Europe/Warsaw').format('DD/MM/YY HH:mm') : 'Wynajem w toku'}`, marginX, verticalPosition + 40);
            doc.text(`Cena: ${item.priceEquipment}`, marginX, verticalPosition + 45);
            doc.text(`Ilość dni: ${item.daysOfRental}`, marginX, verticalPosition + 50);
            doc.text(`Cena całkowita: ${item.priceOfDuration}`, marginX, verticalPosition + 55);
            doc.text('Sprzęt przyjęto bez zastrzeżeń', marginX, verticalPosition + 60);

            totalSum += item.priceOfDuration;
            verticalPosition += confirmationHeight;

            if (verticalPosition > doc.internal.pageSize.height - marginY) {
                doc.addPage();
                verticalPosition = marginY;
            }
        }
    });

    verticalPosition += 5;
    doc.setFontSize(14);
    doc.text(`Suma: ${totalSum.toFixed(2)} zł`, marginX, verticalPosition);

    doc.save(`confirmations_return_${Date.now()}.pdf`);
};