export const exportToPDF = (organizationChart) => {
    // Créez une nouvelle instance du document PDF
    const doc = new jsPDF(); // ou new pdfMake.createPdf()
  
    // Générez le contenu de votre organigramme en tant que texte ou image
    const chartContent = organizationChart.generateContent();
  
    // Ajoutez le contenu à votre document PDF
    doc.text(chartContent, 10, 10); // ou doc.addImage(chartContent, 'PNG', 10, 10, 200, 150)
  
    // Téléchargez le document PDF
    doc.save('organigramme.pdf');
  };
  