/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect, useCallback } from "react";
import { AppContext } from "../../../context/AppContext";
import Loader from "../../components/Loader";

const Publication = ({
  author,
  publication,
  updatePublication,
  index,
  platform,
  isFin,
}) => {
  const { ApiServices, alertService } = useContext(AppContext);
  const { pushAlert } = alertService;
  const { scraperService } = ApiServices;

  const [noResultFound, setNoResultFound] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getJournalDataa = async () => {
    if (publication.searchedFor) return;

    const journalName = publication.source
      ? publication.source
      : publication.extraInformation && publication.extraInformation["Journal"]
        ? publication.extraInformation["Journal"]
        : null;

    if (!journalName || !publication.year || publication.year.trim() === "") {
      console.log("No data");
      updatePublication(index, {
        ...publication,
        searchedFor: true,
      });
      return;
    }
    setIsLoading(true);

    try {
      console.log("jouranlName : ", journalName);

      const journalNameQuery = journalName.replace("/", "").replace("\\", "");

      const response = await scraperService.getJournalData(
        journalNameQuery,
        publication.year
      );
      if (response.data.error || response.data.status === 404) {
        setNoResultFound(true);
        updatePublication(index, {
          ...publication,
          searchedFor: true,
        });
      } else {
        setIsFetched(true);
        updatePublication(index, {
          ...publication,
          IF: response.data.journal["IF"],
          SJR: response.data.journal["SJR"],
          searchedFor: true,
        });
      }
    } catch (e) {
      updatePublication(index, {
        ...publication,
        searchedFor: true,
      });
      pushAlert({
        message:
          "Incapable d'obtenir les données de la publication" +
          publication.title,
      });
    }

    setIsLoading(false);
  };

  // useEffect(() => {
  //   let isMounted = true;
  //   if (!publication.IF && !publication.SJR && !publication.searchedFor)
  //     setTimeout(() => {
  //       if (isMounted) getJournalData();
  //     }, index * 2000 + 2000);

  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  const getJournalData = async () => {
    setIsLoading(true)

    // const ws = new WebSocket('ws://localhost:2000');
     const ws = new WebSocket('wss://rs-scraper-elbahja.onrender.com/'); // Remplacez l'URL en conséquence

    const journalName = publication.source
      ? publication.source
      : publication.extraInformation && publication.extraInformation["Journal"]
        ? publication.extraInformation["Journal"]
        : null;

    const journalNameQuery = journalName.replace("/", "").replace("\\", "");
    const year = publication.year

    try {
      ws.onopen = () => {
        console.log('WebSocket connection opened in publication react js');
        const paramts = {
          journalName: journalNameQuery,
          year:year
        };
        ws.send(JSON.stringify(paramts));
      }
    }
    catch (error) {
      console.log("error Publication Year" + error);
    }

    ws.onmessage = (event) => {
      try {
        const receivedData = JSON.parse(event.data);
      console.log(receivedData.SJR);
      setIsFetched(true);
        updatePublication(index, {
          ...publication,
          // IF: receivedData.SJR,
          SJR: receivedData.SJR,
          searchedFor: true,
        });
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false)
        setIsFetched(false)
      }
      
    }
    

  }

  useEffect(() => {
    // getJournalData()
  }, []);

  const fetchedButton = (
    <button disabled={!isFin}
      className="btn  btn-sm m-3 btn-outline-secondary "
      onClick={getJournalData}
    >
      récupérer
    </button>
  );
  return (
    <tr style={{ whiteSpace: "break-spaces " }} key={publication.title}>
      <td style={{ width: "60%" }}>
        {publication.title}
        {publication.authors && (
          <small
            style={{ whiteSpace: "break-spaces " }}
            className="d-block text-muted text-truncate mt-n1"
          >
            {publication.authors.join(", ")}
          </small>
        )}

        {publication.source && (
          <small
            style={{ whiteSpace: "break-spaces " }}
            className="d-block text-muted text-truncate mt-n1"
          >
            {publication.source}
          </small>
        )}

        {publication.extraInformation &&
          publication.extraInformation["Conference"] && (
            <small
              style={{ whiteSpace: "break-spaces " }}
              className="d-block text-muted text-truncate mt-n1"
            >
              {publication.extraInformation["Conference"]}
            </small>
          )}

        {publication.extraInformation &&
          publication.extraInformation["Journal"] && (
            <small
              style={{ whiteSpace: "break-spaces " }}
              className="d-block text-muted text-truncate mt-n1"
            >
              {publication.extraInformation["Journal"]}
            </small>
          )}
      </td>
      <td className="text-center">{publication.year ?? ""}</td>
      <td className="text-center">
        {publication.citation ? publication.citation.replace("*", "") : ""}
      </td>
      <td className="text-center">
        {publication.IF ?? " "}
        {isLoading && <Loader size="25" />}
      </td>
      <td className="text-center">
        {publication.SJR ?? " "}
        {isLoading && <Loader size="25" />}
      </td>
      <td className="text-center">
        {noResultFound && " "}
        {fetchedButton}
      </td>
    </tr>
  );
};

export default Publication;
