import "@fontsource/quicksand/300.css";
import "@fontsource/quicksand/400.css";
import "@fontsource/quicksand/500.css";
import "@fontsource/quicksand/600.css";
import "@fontsource/quicksand/700.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import theme from "./theme";
import { ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	// <React.StrictMode>

	<ThemeProvider theme={theme}>
		<BrowserRouter>
			<SnackbarProvider>
				<App />
			</SnackbarProvider>
		</BrowserRouter>
	</ThemeProvider>
	// </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
