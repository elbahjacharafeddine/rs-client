import React, { useEffect, useState, useRef } from "react";
import Publication from "./Publication";

import $ from 'jquery';
import 'datatables';

const Publications = ({ author, setAuthor, platform, isFin }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const tableRef = useRef(null);
  const [listPublications, setListPublications] = useState([])
  
  useEffect(() => {
    setListPublications(author.publications)
    if (tableRef.current) {
      try {
        $(tableRef.current).DataTable();
      } catch (error) {
        console.error('Error initializing DataTable:', error);
      }
    }
    console.log(listPublications);
    console.log(author.publications);
    const interval = setInterval(() => {
      if (currentIndex < author.publications.length) {
        const publicationsTmp = [...author.publications];
        publicationsTmp[currentIndex] = {
          ...publicationsTmp[currentIndex],
          searchedFor: true,
        };
        setAuthor((prevAuthor) => ({
          ...prevAuthor,
          publications: publicationsTmp,
        }));
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }, 30);

    return () => {
     
      clearInterval(interval);
    };

    

  }, [currentIndex, author.publications, setAuthor]);

  const updatePublication = (index, publication) => {
    const i = author.publications.map(p => p.title).indexOf(publication.title);
    let tempPublications = author.publications;
    tempPublications[i] = publication;
    setAuthor(() => ({
      ...author,
      publications: tempPublications,
    }));
  };



  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table card-table table-vcenter text-nowrap " >
          <thead>
            <tr>
              <th>Titre</th>
              <th className="text-center">Année</th>
              <th className="text-center">Citée</th>
              <th className="text-center">IF</th>
              <th className="text-center">SJR</th>
              <th className="text-center">
                Récupération <br /> des données
              </th>
            </tr>
          </thead>
          <tbody>
            {author.publications &&
              author.publications
                .sort((a, b) => b.title - a.title)
                .map((publication, index) => (
                  <Publication
                    index={index}
                    platform={platform}
                    key={index}
                    publication={publication}
                    updatePublication={updatePublication}
                    author={author}
                    isFin={isFin}
                  />
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Publications;
