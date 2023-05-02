import React, { useState, useRef } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import DocLogo from "../../src/Images/DocLogo.png";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { showError, showSuccess } from "../Components/Notifications";

const ForgetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const theme = createTheme();
  const navRef = useRef();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/reset-password",
        { email }
      );
      showSuccess(response.data.message);
    } catch (error) {
      showError(error.response.data.message);
    }
  };

  return (
    <div ref={navRef}>
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

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="userName"
                label="Email Address"
                name="userName"
                autoComplete="userName"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{ color: "white", backgroundColor: "red" }}
              >
                Reset password
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default ForgetPasswordForm;
