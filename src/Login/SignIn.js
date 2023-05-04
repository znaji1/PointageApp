import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import DocLogo from "../../src/Images/DocLogo.png";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../Components/Notifications";
import axios from "axios";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://doc-archives.com/">
        Doc-Archives
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

function SignIn() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/getUsers")
      .then((response) => response.json())
      .then((users) => {
        const user = users.find(
          (user) => user.userName === userName && user.password === password
        );
        if (user) {
          showSuccess("Bienvenue");
          navigate("/consultation");
          localStorage.setItem("userName", userName);
        } else {
          showError("Incorrect username or password");
        }
      });
  };

  function getCurrentDate(separator = "-") {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    console.log(
      `${year}${separator}${
        month < 10 ? `0${month}` : `${month}`
      }${separator}${date}`
    );
  }
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={DocLogo} alt="DocLogo" style={{ height: 110 }} />

          <Box component="form" onSubmit={login} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="userName"
              label="Email Address"
              name="userName"
              autoComplete="userName"
              autoFocus
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              // onClick={login}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{ color: "white", backgroundColor: "red" }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  href="/forgetPass"
                  variant="body2"
                  style={{ color: "black" }}
                >
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
export default SignIn;
