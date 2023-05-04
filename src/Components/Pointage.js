import React, { useState, useEffect, useRef } from "react";
import "./Pointage.css";
import { Col, FormGroup, Label, Input } from "reactstrap";
import { DataGrid } from "@mui/x-data-grid";
import "./Table.css";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
// import { MdControlPointDuplicate } from "react-icons/md";
import { showError, showSuccess, showInfo } from "../Components/Notifications";
import Grid from "@mui/material/Grid";
import axios from "axios";
import Duchette from "../Images/duchette.png";
import DocLogo from "../../src/Images/DocLogo.png";
const columns = [
  { field: "numAffaire", headerName: "N. d'affaire", width: 130 },
  {
    field: "numContenaur",
    headerName: "N. de Conteneur",
    width: 150,
    valueGetter: ({ value }) => value || "N/A",
  },
  {
    field: "utilisateur",
    headerName: "L'utilisateur",
    width: 150,
    valueGetter: ({ value }) => value || "N/A",
  },

  { field: "Etat", headerName: "État", width: 150 },
];

function Pointage() {
  // const [affaire, setAffaire] = useState([]);
  const [data, setData] = useState([]);
  const [dataDe, setDataDe] = useState([]);
  const navRef = useRef();
  const [numContenaur, setNumContenaur] = useState("");
  const [numAffaire, setNumAffaire] = useState("");
  const [loading, setLoading] = useState(true);
  const [newData, setNewData] = useState([]);
  const [datePointage, setDatePointage] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const postData = async () => {
    const savedUsername = localStorage.getItem("userName");
    const data = {
      numContenaur: numContenaur,
      numAffaire: numAffaire,
      datePointage: datePointage,
      utilisateur: savedUsername,
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/dossierpointe/${numAffaire}/${numContenaur}`,
        data
      );
      setDataDe((prevData) => [prevData, ...newData]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/getDossiersPoint");
      const dataDe = await response.json();
      setDataDe(dataDe);
      setNewData(dataDe);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNumContenaurChange = async () => {
    // setLoading(true);
    const response = await fetch(
      `http://localhost:5000/getDossier/${numContenaur}`
    );

    const json = await response.json();
    setDataDe(Array.isArray(json[0]) ? json[0] : []);
    // setLoading(false);
  };

  const handleInputBlur = () => {
    handleNumContenaurChange();
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/getDossierNonPointe");
      const data = await response.json();
      setData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNumContenaurKeyDown = async (event) => {
    if (event.key === "Tab" && numAffaire) {
      const dossierDejaPointe = dataDe.some((d) => d.numAffaire === numAffaire);
      if (dossierDejaPointe) {
        showError("Dossier déjà pointé ou incorrect");
        return;
      }
      try {
        await postData();
        await loadData();
        setNumAffaire("");
        fetchData();
        showSuccess("Dossier pointé avec succès");
      } catch (error) {
        console.error(error);
        showError("Erreur lors de l'enregistrement du pointage");
      }
    }
  };

  return (
    <div>
      <br></br>
      <div
        style={{
          marginLeft: "26pc",
          marginBottom: -27,
          color: "rgba(208,4,60,255)",
          fontStyle: "Franklin Gothic Medium",
          fontSize: 35,
          fontFamily: "Signika",
          fontWeight: 900,
        }}
      >
        - Pointage des dossiers -{" "}
      </div>
      <div>
        <a href="/consultation">
          <img
            src={DocLogo}
            alt="DocLogo"
            style={{ height: 89, right: "3pc", paddingLeft: "2pc" }}
            size={40}
          />
        </a>
      </div>
      <div className="container-1">
        <img
          src={Duchette}
          alt="Duchette"
          style={{
            position: "absolute",
            top: 26,
            left: "67pc",
            width: 152,
          }}
        />

        <div className="nav" style={{ marginInline: "-26pc" }}>
          <a href="./consultation">
            <BsFillArrowLeftCircleFill
              style={{ color: "rgba(208,4,60,255)", marginBottom: "30pc" }}
              size={30}
            />
          </a>
        </div>

        <div
          ref={navRef}
          style={{
            marginTop: "-34pc",
            display: "flex",
            alignItems: "center",
            marginLeft: "48pc",
          }}
        >
          <div className="span2" style={{ marginRight: "1pc" }}>
            <div>
              <Label
                className="control-label"
                style={{ color: "rgba(95,92,89,255)", fontWeight: "bold" }}
              >
                Numero de Conteneur :
              </Label>
            </div>
            <Input
              name="numContenaur"
              id="numContenaur"
              className="form-control p-2 border-top-0"
              value={numContenaur}
              onChange={(e) => setNumContenaur(e.target.value)}
              onBlur={handleInputBlur}
              onKeyDown={handleNumContenaurKeyDown}
              style={{ width: "12pc", height: "27px" }}
            />
          </div>

          <div className="span2">
            <div>
              <Label
                className="control-label"
                style={{ color: "rgba(95,92,89,255)", fontWeight: "bold" }}
              >
                Numero d'affaire :
              </Label>
            </div>
            <Input
              id="numAffaire"
              name="numAffaire"
              value={numAffaire}
              onChange={(event) => setNumAffaire(event.target.value)}
              className="form-control p-2 border-top-0"
              style={{ width: "12pc", height: "27px" }}
              // onBlur={postData}
              onKeyDown={handleNumContenaurKeyDown}
            >
              {/* <option value=""></option>

  {affaire.map((option) => (
    <option key={option.value}>{option.numAffaire}</option>
  ))} */}
            </Input>
          </div>
        </div>
      </div>
      <div className="container-2">
        <Grid container spacing={2} className="grid-container">
          <Grid item xs={6}>
            {loading ? (
              <p>Loading data...</p>
            ) : (
              <DataGrid
                rows={data.map((row, index) => ({ id: index + 1, ...row }))}
                columns={columns}
                pageSize={2}
                checkboxSelection
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                disableRowSelectionOnClick
              />
            )}
          </Grid>

          <Grid item xs={6}>
            {loading ? (
              <p>Loading data...</p>
            ) : (
              <DataGrid
                rows={dataDe.map((row, index) => ({ id: index + 1, ...row }))}
                loading={loading}
                columns={columns}
                pageSize={2}
                checkboxSelection
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
              />
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Pointage;
