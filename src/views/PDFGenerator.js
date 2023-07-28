import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { OrganizationChart } from 'primereact/organizationchart';
import jsPDF from 'jspdf';

const PDFGenerator = ({ organigrammeData }) => {
  const chartRef = useRef(null);

  const generatePDF = async () => {
    const pdf = new jsPDF();

    const chartHeight = chartRef.current.scrollHeight;
    const a4Height = 841.89;
    const numPages = Math.ceil(chartHeight / a4Height);

    for (let i = 0; i < numPages; i++) {
      const canvas = await html2canvas(chartRef.current, {
        scrollY: -i * a4Height,
        backgroundColor: 'white',
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      if (i !== 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }

    pdf.save('download.pdf');
  };
  const nodeTemplate = (node) => {
    if (node.type === 'person') {
        return (
            <div className="flex flex-column">
                <div className="flex flex-column align-items-center">
                    <img alt={node.data.name} src={node.data.avatar} className="mb-3 w-3rem h-3rem" />
                    <span className="font-bold mb-2">{node.data.name}</span>
                    <span>{node.data.title}</span><br />
                    <span>{node.label}</span>
                </div>
            </div>
        );
    }

    return node.label;
};

  return (
    <div>
      {/* Composant de l'organigramme */}
      <OrganizationChart ref={chartRef} value={organigrammeData} nodeTemplate={nodeTemplate} />
    </div>
  );
};

export default PDFGenerator;
export { generatePDF };
