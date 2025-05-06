import React from "react";
import AppRoutes from "./src/routes/AppRoutes";
import {AppStateProvider} from "./src/context/AppState";
import Toast from "react-native-toast-message";

function App() {
  return (
    <AppStateProvider>
      <AppRoutes />
      <Toast autoHide={true} visibilityTime={2000} />
    </AppStateProvider>
  );
}

export default App;
