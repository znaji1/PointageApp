import { useEffect, useState, useRef } from "react";
import { MdControlPoint } from "react-icons/md";
import "./Navbar.css";
import DocLogo from "../../src/Images/DocLogo.png";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Row, Col } from "reactstrap";
import { BiSearchAlt } from "react-icons/bi";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./Table.css";
import { saveAs } from "file-saver";
import { Typography } from "@mui/material";
import ExcelJS from "exceljs";
import moment from "moment";
import Excel from "../Images/excel.png";
import Duchette from "../Images/duchette.png";

function Consultasion() {
  const columns = [
    { field: "numAffaire", headerName: "N. d'affaire", width: 130 },
    {
      field: "numContenaur",
      headerName: "N. de Conteneur",
      width: 150,
    },
    {
      field: "utilisateur",
      headerName: "L'utilisateur",
      width: 150,
    },
    {
      field: "datePointage",
      headerName: "Date de Pointage",
      width: 150,
      type: "date",
      valueGetter: ({ value }) => value && new Date(value),
    },
    { field: "Etat", headerName: "État", width: 150 },
  ];

  const [rows, setRows] = useState([]);
  const rowsWithId = rows.map((row, index) => ({ id: index + 1, ...row }));

  const [datePointageInput, setDatePointageInput] = useState("");
  const [numAffaireInput, setNumAffaireInput] = useState("");
  const [numContenaurInput, setNumContenaurInput] = useState("");
  const [utilisateurInput, setUtilisateurInput] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const navigate = useNavigate();
  const navRef = useRef();

  const handleSearchButtonClick = () => {
    let filteredRows = rowsWithId;
    if (datePointageInput) {
      filteredRows = filteredRows.filter((row) => {
        const datePointage =
          moment(row.datePointage).format("MM/DD/YYYY") ===
          moment(datePointageInput).format("MM/DD/YYYY");
        return datePointage;
      });
    }
    filteredRows = filteredRows.filter((row) => {
      const numAffaire =
        typeof row.numAffaire !== "string"
          ? row.numAffaire.toString()
          : row.numAffaire;
      const numContenaur =
        typeof row.numContenaur !== "string"
          ? row.numContenaur.toString()
          : row.numContenaur;
      const utilisateur =
        typeof row.utilisateur !== "string"
          ? row.utilisateur.toString()
          : row.utilisateur;
      return (
        numAffaire.includes(numAffaireInput) &&
        numContenaur.includes(numContenaurInput) &&
        utilisateur.includes(utilisateurInput)
      );
    });
    if (filteredRows.length === 0) {
      setRows([]);
    } else {
      setFilteredRows(filteredRows);
    }
  };

  const handleChageNumAffaire = (value) => {
    setNumAffaireInput(value);
  };

  const handleChageNumContenaur = (value) => {
    setNumContenaurInput(value);
  };

  const handleChageUtilisateurInput = (value) => {
    setUtilisateurInput(value);
  };

  const handleChageDateInput = (value) => {
    setDatePointageInput(value);
  };

  function MyCustomButton() {
    navigate("/pointage");
  }

  const fileName = "Sheet";
  const handleExport = () => {
    const workbook = new ExcelJS.Workbook(); // Create a new workbook
    const worksheet = workbook.addWorksheet("Sheet1"); // Add a new worksheet
    const columns = Object.keys(rowsWithId[0]).map((key) => ({
      header: key,
      key: key,
    })); // Extract column headers
    worksheet.columns = columns; // Set column headers
    worksheet.addRows(rowsWithId); // Add data rows
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `${fileName}.xlsx`
      ); // Download the file
    });
  };
  async function readExcelFile(file) {
    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();

    const promise = new Promise((resolve, reject) => {
      reader.onerror = () => {
        reader.abort();
        reject(new DOMException("Error reading file"));
      };

      reader.onload = async () => {
        try {
          await workbook.xlsx.load(reader.result);
          const worksheet = workbook.getWorksheet(1);
          const rows = worksheet.getSheetValues();
          const columns = rows[0].map((column) => {
            return { field: column, headerName: column };
          });
          const dataRows = rows.slice(1).map((row, index) => {
            const dataRow = { id: index };
            columns.forEach((column, index) => {
              dataRow[column.field] = row[index];
            });
            return dataRow;
          });
          resolve(dataRows);
        } catch (err) {
          reject(err);
        }
      };
    });

    reader.readAsArrayBuffer(file);
    return promise;
  }

  useEffect(() => {
    fetch("http://localhost:5000/getDossier")
      .then((response) => response.json())
      .then((data) => setRows(data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <div
        style={{
          marginLeft: "32pc",
          marginBottom: -24,
          color: "#7a1d28",
          fontStyle: "Franklin Gothic Medium",
          fontSize: 20,
        }}
      >
        - Traitement des dossiers -{" "}
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

        <Button
          type="button"
          onClick={MyCustomButton}
          style={{
            color: "rgba(122,29,40,255)",
            marginLeft: "70pc",
            fontSize: "large",
            marginTop: "-7pc",
          }}
        >
          <img
            src={Duchette}
            alt="Duchette"
            style={{
              position: "absolute",
              top: 10,
              width: 29,
              left: -25,
            }}
          />
          Pointage
        </Button>
        <div className="container" style={{ marginLeft: 217, marginTop: -31 }}>
          <nav ref={navRef}>
            <div>
              <TextField
                id="numAffaire"
                name="numAffaire"
                label="N. d'affaire"
                variant="outlined"
                value={numAffaireInput}
                onChange={(e) => handleChageNumAffaire(e.target.value)}
                InputProps={{
                  style: {
                    width: "170px",
                    height: "49px",
                    marginLeft: "0",
                    marginRight: "22px",
                    paddingBottom: 0,
                    marginTop: 0,
                    fontWeight: 500,
                  },
                }}
              />

              <TextField
                id="numContenaur"
                name="numContenaur"
                label="N. de Conteneur"
                variant="outlined"
                value={numContenaurInput}
                onChange={(e) => handleChageNumContenaur(e.target.value)}
                InputProps={{
                  style: {
                    width: "170px",
                    height: "49px",
                    marginLeft: "0",
                    marginRight: "22px",
                    paddingBottom: 0,
                    marginTop: 0,
                    fontWeight: 500,
                  },
                }}
              />

              <TextField
                id="utilisateur"
                name="utilisateur"
                label="L'utilisateur"
                variant="outlined"
                value={utilisateurInput}
                onChange={(e) => handleChageUtilisateurInput(e.target.value)}
                InputProps={{
                  style: {
                    width: "170px",
                    height: "49px",
                    marginLeft: "0",
                    marginRight: "22px",
                    paddingBottom: 0,
                    marginTop: 0,
                    fontWeight: 500,
                  },
                }}
              />

              <TextField
                id="datePointage"
                name="datePointage"
                type="date"
                value={datePointageInput}
                onChange={(event) => handleChageDateInput(event.target.value)}
                InputProps={{
                  style: {
                    width: "90%",
                    height: "49px",
                    marginLeft: "0",
                    marginRight: "28px",
                    paddingBottom: 0,
                    marginTop: 0,
                    fontWeight: 500,
                  },
                }}
              />
            </div>
            <Col>
              <Button
                type="button"
                className="btn  mr-1"
                style={{ color: "rgba(122,29,40,255)" }}
                onClick={handleSearchButtonClick}
              >
                <BiSearchAlt size={34} />
              </Button>
            </Col>
          </nav>
        </div>
      </div>
      <div>
        <div style={{ height: 400, width: "100%" }}>
          <Button
            onClick={handleExport}
            className="btn mr-1"
            style={{ color: "rgba(122,29,40,255" }}
          >
            Export to Excel
          </Button>
          <img
            src={Excel}
            alt="excel"
            style={{
              position: "absolute",
              top: 184,
              width: 19,
            }}
          />

          {/* <Button
            type="file"
            onClick={readExcelFile}
            className="btn mr-1"
            style={{ color: "rgba(122,29,40,255" }}
          >
            Import from Excel
          </Button> */}
          <DataGrid
            rows={filteredRows.length > 0 ? filteredRows : rowsWithId}
            columns={columns}
            pageSize={filteredRows.length > 0 ? filteredRows.length : 5}
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
        </div>
      </div>
    </div>
  );
}

export default Consultasion;
