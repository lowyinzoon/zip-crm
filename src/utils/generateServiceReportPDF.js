import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../assets/ZipPestLogo.png'; // Use your local logo asset

export const generateServiceReportPDF = async (jobData) => {
  const doc = new jsPDF();

  // Header: Logo + Title
  const img = new Image();
  img.src = logo;
  doc.addImage(img, 'PNG', 10, 10, 30, 30);
  doc.setFontSize(12);
  doc.text('Form H', 10, 50);
  doc.setFontSize(16);
  doc.text('Service Report (Record of Pesticides Usage)', 10, 60);
  doc.setFontSize(10);
  doc.text(`Report No: ${jobData.reportId || 'N/A'}`, 150, 50);

  // Section A
  doc.setFontSize(12);
  doc.text('Section A: Customer & Service Details', 10, 70);
  autoTable(doc, {
    startY: 75,
    body: [
      ['Customer Name', jobData.customer],
      ['Address', jobData.address],
      ['PIC Name', jobData.picName || 'N/A'],
      ['Contact No.', jobData.contact || 'N/A'],
      ['Service Type', jobData.service],
      ['Pest Covered', jobData.pest],
      ['Service Frequency', jobData.frequency || 'N/A']
    ],
  });

  // Section B
  doc.text('Section B: Pesticide Usage', 10, doc.lastAutoTable.finalY + 10);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    head: [['Active Ingredient', 'Trade Name', 'Class', 'Method', 'Area Applied', 'Total Qty (L/Kg)']],
    body: jobData.chemicals || [],
  });

  // Label Statement
  doc.text('Label Precautionary Statement:', 10, doc.lastAutoTable.finalY + 10);
  doc.setFontSize(10);
  doc.text(
    `Kelas 1A - Beracun Amat Bisa\nKelas 1B - Beracun Bisa\nKelas II - Beracun\nKelas III - Merbahaya\nKelas IV\nJauhkan Daripada Makanan & Kanak-Kanak`,
    10,
    doc.lastAutoTable.finalY + 15
  );

  // Section C
  doc.setFontSize(12);
  doc.text('Section C: Pest Status', 10, doc.lastAutoTable.finalY + 45);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 50,
    head: [['Pest', 'Level', 'Location Found', 'Remarks']],
    body: jobData.pestStatus || [],
  });

  // Section D
  doc.text("Section D: Applicator's Info", 10, doc.lastAutoTable.finalY + 10);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    body: [
      ['Signature', jobData.applicatorSignature || 'Signed'],
      ['Name', jobData.applicator],
      ['License No.', jobData.license || 'N/A'],
      ['Treatment Date', jobData.date],
      ['Time In', jobData.timeIn],
      ['Time Out', jobData.timeOut]
    ]
  });

  // Section E
  doc.text("Section E: Customer Acknowledgement", 10, doc.lastAutoTable.finalY + 10);
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    body: [
      ['Acknowledgement', 'I acknowledge receipt of the above report.'],
      ['Signature', '______________'],
      ['Stamp', '______________'],
      ['Name', jobData.customer],
      ['Date', jobData.date]
    ]
  });

  return doc.output('blob');
}; 