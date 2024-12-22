import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SECDashboard from './components/20241222_QuantCity_SEC_Dashboard_v1.0';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <SECDashboard />
      </div>
    </QueryClientProvider>
  );
}

export default App;
