import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import { MoralisProvider } from "react-moralis";
import App from "./App";

const Application = () => {
  return (
    <MoralisProvider
      appId={process.env.REACT_APP_MORALIS_APPLICATION_ID}
      serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL}
    >
      <App />
    </MoralisProvider>
  );
};

ReactDOM.render(
  <StrictMode>
    <Application />,
  </StrictMode>,
  document.getElementById("root"),
);
