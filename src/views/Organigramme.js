import React from 'react';
import { OrganizationChart } from 'primereact/organizationchart';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import { AppContext } from '../context/AppContext';
import PageHeader from './components/PageHeader';
import { useState, useCallback, useEffect, useContext, useRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import styleOrganigramme from '../views/styleOrganigramme.css'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const Organigramme = () => {
    const { user, ApiServices, UserHelper } = useContext(AppContext);
    const { laboratoryService } = ApiServices;

    const [isLoading, setIsLoading] = useState(true);
    const [nodes, setNodes] = useState([]);

    // data pour chef de laboratoire
    const [dataChefLab, setDataChefLab] = useState("");
    //fin

    //data pour les chefs d'equipes
    const [dataChefsEquipes, setDataChefsEquipes] = useState([]);
    //data pour les membres d'equipes
    const [dataMembres, setDataMembres] = useState([])

    // fonction pour le mappage
    const childernDataMembres = (listMembres, item) => {
        return listMembres
            .filter((e) => e.stpid === item.stpid && e.id != item.id)
            .map((e) => {
                return {
                    label: 'Membre',
                    type: 'person',
                    className: 'p-person',
                    expanded: true,
                    data: { name: e.name, avatar: e.img },
                };
            });
    };

    const childrenData = dataChefsEquipes.map((item) => {
        return {
            label: item.title,
            type: 'person',
            className: 'p-person',
            expanded: true,
            data: { name: item.name, avatar: item.img },
            children: childernDataMembres(dataMembres, item),
        };
    });

    const updateNodes = useCallback(async () => {
        let orgChartNodes;
        orgChartNodes = await laboratoryService.getNodesForOrgChart();
        console.log(orgChartNodes.data[0]);
        setDataChefLab(orgChartNodes.data[0])
        console.log(orgChartNodes.data);

        orgChartNodes.data.forEach(element => {
            if (element.name && element.tags) {
                // console.log(element.name +" " +element.id);
                orgChartNodes.data.forEach(e => {
                    if (e.stpid === element.id && e.title) {
                        console.log(e.name + "chef de " + element.name);
                        e.title = e.title + " " + element.name
                        setDataChefsEquipes((x) => [...x, e])
                    }
                })
            }
        });

        setNodes(orgChartNodes.data);
        setDataMembres(orgChartNodes.data)
        setIsLoading(false);
    }, [laboratoryService]);

    useEffect(() => {
        updateNodes();
    }, [updateNodes]);

    const datta = [
        {
            label: dataChefLab.title,
            type: 'person',
            className: 'p-person',
            expanded: true,
            data: { name: dataChefLab.name, avatar: dataChefLab.img },
            children: childrenData
        }]

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

    const chartRef = useRef(null);

    const handlePrint = () => {
        const chartWrapper = chartRef.current;
      
        // Convertir le contenu de la charte en une image base64 avec l'option useCORS
        html2canvas(chartWrapper, { useCORS: true }).then((canvas) => {
          const chartImage = canvas.toDataURL('image/png');
      
          // Créer un nouveau document PDF
          const doc = new jsPDF();
          const width = doc.internal.pageSize.getWidth();
          const height = doc.internal.pageSize.getHeight();
      
          // Ajouter le titre avec la date actuelle décalée à gauche
          const title = 'Organigramme de Laboratoire LTI';
          const currentDate = new Date().toLocaleDateString('fr-FR');
          const titleWithDate = `${title} - ${currentDate}`;
          const titleX = 10;
          const titleY = 20;
          const dateX = titleX + doc.getStringUnitWidth(titleWithDate) * doc.internal.getFontSize();
          const dateY = titleY;
          doc.setFontSize(16);
          doc.text(titleWithDate, titleX, titleY);
          doc.text(currentDate, dateX, dateY);
      
          // Ajouter l'image à votre document PDF
          doc.addImage(chartImage, 'PNG', 0, 30, width, 100);
      
          // Enregistrer le document PDF
          doc.save('arborescence.pdf');
        });
      };
      
      





    return (
        <>
            <div className="page-header">
                <PageHeader
                    title={`Organigramme de laboratoire ${UserHelper.userHeadedLaboratories(
                        user
                    )}`}
                />
            </div>
            {!isLoading ?
                <div className="organigramme-container">
                    <button className='btn btn-primary' onClick={handlePrint}>Imprimer</button>
                    <div className="chart-wrapper" ref={chartRef}>
                        <OrganizationChart value={datta} nodeTemplate={nodeTemplate} className="chart-container" />
                    </div>
                </div>
                :
                <>
                    <p>L'organigramme se charge ...</p>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <CircularProgress />
                    </Box>
                </>
            }
        </>
    );
};

export default Organigramme;
