const express = require("express");
const app = express();
const sql = require("./dbFiles/dbOperation"); // Import the dbOperation module
const cors = require("cors");
const API_PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add the extended option to express.urlencoded()

app.use(cors());

app.get("/getUsers", function(req, res) {
  sql.getUsers().then((result) => {
    res.json(result[0]);
  });
});
app.get("/getDossier", function(req, res) {
  sql.getDossiers().then((result) => {
    res.json(result[0]);
  });
});
app.get("/getDossierNonPointe", function(req, res) {
  sql.getFunctions().then((result) => {
    res.json(result[0]);
  });
});
app.get("/getDossiersPoint", function(req, res) {
  sql.getDossiersPoint().then((result) => {
    res.json(result[0]);
  });
});

app.get("/getNumAffaires", (req, res) => {
  sql.getNumAffaires().then((result) => {
    res.json(result[0]);
  });
});

app.get("/getDossier/:numContenaur", async (req, res) => {
  const numContenaur = req.params.numContenaur.toString();
  const containerData = await sql.getDossieByNumCon(numContenaur);
  res.send(containerData);
});

app.get("/getNumAffaireVides", function(req, res) {
  sql.getNumAffairesVides().then((result) => {
    res.json(result[0]);
  });
});

app.post("/dossierpointe/:numAffaire/:numContenaur", async (req, res) => {
  try {
    const data = {
      datePointage: req.body.datePointage,
      utilisateur: req.body.utilisateur,
      Etat: req.body.Etat,
    };
    const numContenaur = req.params.numContenaur;
    const numAffaire = req.params.numAffaire;
    const result = await sql.updateData(data, numAffaire, numContenaur);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// your API routes go here

app.listen(API_PORT, () => console.log(`listening on port${API_PORT}`));
