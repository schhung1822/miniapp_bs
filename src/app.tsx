import React from 'react';
import { App, Box, SnackbarProvider, Text, ZMPRouter } from 'zmp-ui';
import { Route, Routes } from 'react-router-dom';

import Header from '@/components/Header';
import { PATHS } from '@/constants/paths';
import HomePage from '@/pages/HomePage';

const AppRoutes: React.FC = () => {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <Header variant="logo" />
      <div className="min-h-0 flex-1">
        <Routes>
          <Route path={PATHS.HOME} element={<HomePage />} />
          <Route
            path="*"
            element={
              <Box p={4}>
                <Text>Page Not Found</Text>
              </Box>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

const MyApp: React.FC = () => {
  return (
    <App>
      <SnackbarProvider>
        <ZMPRouter>
          <AppRoutes />
        </ZMPRouter>
      </SnackbarProvider>
    </App>
  );
};

export default MyApp;
