import * as React from "react";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "./Table.css";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

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

export default function DataTable(props) {
  const [rows, setRows] = useState([]);
  const rowsWithId = rows.map((row, index) => ({ id: index + 1, ...row }));
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

  const filteredRows = rows.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value
          .toString()
          .toLowerCase()
          .includes(props.searchQuery.toLowerCase())
    )
  );

  return (
    <div>
      <div style={{ height: 400, width: "100%" }}>
        <Button
          onClick={handleExport}
          className="btn mr-1"
          style={{ color: "rgba(122,29,40,255" }}
        >
          Export to Excel
        </Button>
        <Button
          type="file"
          onClick={readExcelFile}
          className="btn mr-1"
          style={{ color: "rgba(122,29,40,255" }}
        >
          Import from Excel
        </Button>
        <DataGrid
          searchQuery={props.searchQuery}
          rows={filteredRows}
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
      </div>
    </div>
  );
}
