import React, { useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { MdControlPoint } from "react-icons/md";
import "./Navbar.css";
import DocLogo from "../../src/Images/DocLogo.png";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Row, Col } from "reactstrap";
import { BiSearchAlt } from "react-icons/bi";

function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearchInputChange(event) {
    setSearchQuery(event.target.value);
  }
  function handleSearch() {
    // Do something when search button is clicked
  }
  const navigate = useNavigate();
  const navRef = useRef();
  // const [searchQuery, setSearchQuery] = useState("");
  function MyCustomButton() {
    navigate("/pointage");
  }
  // const handleSearchInputChange = (event) => {
  //   setSearchQuery(event.target.value);
  // };

  return (
    <div className="container">
      <img
        src={DocLogo}
        alt="DocLogo"
        style={{ width: 120, height: 110 }}
        size={40}
      />

      <nav ref={navRef}>
        <div>
          <TextField
            name="numAffaire"
            label="N. d'affaire"
            variant="outlined"
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
            // value={searchQuery}
            // onChange={handleSearchInputChange}
          />

          <TextField
            id="numContenaur"
            name="numContenaur"
            label="N. de Conteneur"
            variant="outlined"
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
            label="Date de Pointage"
            format="MM/dd/yyyy"
            type="date"
            variant="outlined"
            required
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
            style={{ color: "rgba(122,29,40,255" }}
            onClick={handleSearchInputChange}
          >
            <BiSearchAlt size={34} />
          </Button>
        </Col>
        <Button
          type="button"
          onClick={MyCustomButton}
          style={{ color: "rgba(122,29,40,255" }}
        >
          <MdControlPoint style={{ paddingLeft: "3px" }} /> Pointage
        </Button>
      </nav>
    </div>
  );
}

export default Navbar;
