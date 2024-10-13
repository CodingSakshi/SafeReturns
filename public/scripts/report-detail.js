// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('download-button');

    downloadButton.addEventListener('click', () => {
        // Import jsPDF from the CDN
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Add content to the PDF
        doc.text('Report Detail', 10, 10);
        doc.text(`Full Name: ${report.fullname}`, 10, 20);
        doc.text(`Status: ${report.personStatus}`, 10, 30);
        doc.text(`Age: ${report.age}`, 10, 40);
        doc.text(`Gender: ${report.gender}`, 10, 50);
        doc.text(`Additional Details: ${report.additionalDetails}`, 10, 60);
        doc.text(`Email: ${report.email}`, 10, 70);
        doc.text(`Contact Number: ${report.contactNumber}`, 10, 80);
        doc.text(`Permanent Address: ${report.permanentAddress}`, 10, 90);

        // Save the PDF
        doc.save('report.pdf');
    });
});
