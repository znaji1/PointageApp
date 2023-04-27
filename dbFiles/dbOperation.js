const config = require("./dbConfig");
sql = require("mssql");

async function getUsers() {
  try {
    let pool = await sql.connect(config);
    let res = await pool.request().query("SELECT * FROM dbo.users");
    return res.recordsets;
  } catch (error) {
    console.log(error);
  }
}
async function getDossiers() {
  try {
    let pool = await sql.connect(config);
    let res = await pool
      .request()
      .query("SELECT * FROM dbo.Dossier where Etat='Pointe'");
    return res.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getFunctions() {
  try {
    let pool = await sql.connect(config);
    let res = await pool
      .request()
      .query("SELECT * FROM dbo.Dossier where datePointage is null");
    return res.recordsets;
  } catch (error) {
    console.log(error);
  }
}
async function getNumAffairesVides() {
  try {
    let pool = await sql.connect(config);
    let res = await pool.request().query("SELECT numAffaire FROM dbo.Dossier");
    return res.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getDossiersPoint() {
  try {
    let pool = await sql.connect(config);
    let res = await pool
      .request()
      .query(
        "SELECT * FROM dbo.Dossier where datePointage is not null ORDER BY idPoint DESC "
      );
    return res.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getNumAffaires() {
  try {
    let pool = await sql.connect(config);
    let res = await pool
      .request()
      .query("SELECT numAffaire FROM dbo.Dossier where Etat='Pointe'");
    return res.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function getDossieByNumCon(numContenaur) {
  try {
    let pool = await sql.connect(config);
    let res = await pool
      .request()
      .input("numContenaur", sql.Int, numContenaur) // <-- use parameterized query
      .query("SELECT * FROM dbo.Dossier WHERE numContenaur = @numContenaur");
    return res.recordsets;
  } catch (error) {
    console.log(error);
  }
}

async function updateData(data, numAffaire, numContenaur) {
  try {
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input("numContenaur", sql.VarChar(50), numContenaur)
      .input("utilisateur", sql.VarChar(50), data.utilisateur)
      .input("datePointage", sql.DateTime, data.datePointage)
      .input("numAffaire", sql.VarChar(50), numAffaire)
      .input("Etat", sql.VarChar(50), data.Etat)
      .query(
        "UPDATE dbo.Dossier SET Etat='Pointe',numContenaur = @numContenaur, utilisateur = @utilisateur, datePointage = @datePointage WHERE numAffaire = @numAffaire AND datePointage IS NULL"
      );
    return result.recordset;
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  getUsers,
  getDossiers,
  getNumAffaires,
  getDossieByNumCon,
  updateData,
  getDossiersPoint,
  getFunctions,
  getNumAffairesVides,
};
