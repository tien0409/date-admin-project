import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { AuthProvider } from "./auth-context/auth.context";

import { SoftUIControllerProvider } from "context";
import { Toaster } from "react-hot-toast";
import { ConfirmProvider } from "material-ui-confirm";

let user = localStorage.getItem("user");
user = JSON.parse(user);

ReactDOM.render(
  <BrowserRouter>
    <SoftUIControllerProvider>
      <ConfirmProvider>
        <AuthProvider userData={user}>
          <Toaster position={"top-right"} />
          <App />
        </AuthProvider>
      </ConfirmProvider>
    </SoftUIControllerProvider>
  </BrowserRouter>,
  document.getElementById("root"),
);
