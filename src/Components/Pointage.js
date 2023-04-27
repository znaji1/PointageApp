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
  const [numPointe, setNumPointe] = useState("");
  console.log(numPointe);
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
      setLoading(true);
      const response = await fetch("http://localhost:5000/getDossiersPoint");
      const dataDe = await response.json();
      setDataDe(dataDe);
      setNewData(dataDe);
      setLoading(false);
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
  useEffect(() => {
    fetch("http://localhost:5000/getDossierNonPointe")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.log(error))
      .finally(setLoading(false));
  }, []);
  useEffect(() => {
    fetch("http://localhost:5000/getNumAffaires")
      .then((response) => response.json())
      .then((numPointe) => setNumPointe(numPointe))
      .catch((error) => console.log(error))
      .finally(setLoading(false));
  }, []);

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

  const [datePointage, setDatePointage] = useState(
    new Date().toISOString().substr(0, 10)
  );

  const handleDateChange = (event) => {
    setDatePointage(event.target.value);
  };

  let affaireNumber = "";
  for (let i = 0; i < data.length; i++) {
    affaireNumber += data[i].numAffaire;
  }

  const handleNumContenaurKeyDown = (event) => {
    if (event.key === "Tab" && numAffaire) {
      for (let i = 0; i < numPointe.length; i++) {
        if (numPointe[i].numAffaire === numAffaire) {
          break;
        }
      }
      if (!affaireNumber.includes(numAffaire)) {
        showError(`Dossier déjà pointé ou inccorect `);
      } else {
        showSuccess(`Dossier pointé avec succès`);
        postData();
        handleInputBlur();
        loadData();
      }
    }
  };

  return (
    <div className="container-1">
      <div className="nav">
        <a href="./consultation">
          <BsFillArrowLeftCircleFill
            style={{ color: "rgba(122,29,40,255", marginBottom: "30pc" }}
            size={30}
          />
        </a>
      </div>
      <div style={{ marginRight: 67, textAlign: "center" }}></div>

      <div ref={navRef} style={{ marginTop: "-20pc", marginBottom: "3pc" }}>
        <FormGroup>
          <Col>
            <div>
              {" "}
              <Label className="control-label">Numero de Conteneur:</Label>
            </div>
            <Input
              name="numContenaur"
              id="numContenaur"
              className="form-control p-2 border-top-0"
              //value={numContenaur}
              onChange={(event) => setNumContenaur(event.target.value)}
              onBlur={handleInputBlur}
              style={{ width: "12pc", height: "27px" }}
            />
          </Col>
        </FormGroup>

        <FormGroup>
          <div>
            {" "}
            <Label className="control-label">Numero d'affaire :</Label>
          </div>
          <Input
            id="numAffaire"
            name="numAffaire"
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
        </FormGroup>

        <FormGroup>
          <div>
            {" "}
            {/* <Label className="control-label" >Date de pointage :</Label> */}
          </div>
          <Input
            name="datePointage"
            id="datePointage"
            className="form-control p-2 border-top-0"
            format="MM/dd/yyyy"
            type="date"
            variant="outlined"
            required
            value={datePointage}
            onChange={handleDateChange}
            readOnly={true}
            hidden
          />
        </FormGroup>
      </div>

      <div className="container-2">
        <Grid
          container
          spacing={2}
          style={{ marginLeft: "-307px", width: "78pc" }}
        >
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
                pageSizeOptions={[5]}
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
                pageSizeOptions={[5]}
                disableRowSelectionOnClick
              />
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Pointage;
