import React from "react";
import AppRoutes from "./src/routes/AppRoutes";
import {AppStateProvider} from "./src/context/AppState";

function App() {
  return (
    <AppStateProvider>
      <AppRoutes />
    </AppStateProvider>
  );
}

export default App;
