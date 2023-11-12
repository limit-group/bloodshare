import { useEffect } from "react";
import { SnackbarProvider } from "notistack";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import "bootstrap-icons/font/bootstrap-icons.css";
import Head from "next/head";
import { createTheme, ThemeProvider } from "@mui/material";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#fc7d7b",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        autoHideDuration={1000}
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Head>
          <title>BloodShare</title>
        </Head>
        <Component {...pageProps} />
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default MyApp;
