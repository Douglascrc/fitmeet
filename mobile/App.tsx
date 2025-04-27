import React from 'react';
import AppRoutes from './src/routes/AppRoutes';
import {AppProvider} from './src/context/AppState';

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
