import React, { useState } from 'react';
import { useQuery } from 'react-query';
import FilingList from './20241222_QuantCity_SEC_FilingList_v1.0';
import FilingDetail from './20241222_QuantCity_SEC_FilingDetail_v1.0';
import { Button } from './ui/button';

interface Filing {
  id: string;
  companyName: string;
  formType: string;
  filingDate: string;
  documentUrl: string;
}

const SECDashboard: React.FC = () => {
  const [selectedFiling, setSelectedFiling] = useState<Filing | null>(null);

  const { data: filings, isLoading, error } = useQuery<Filing[]>(
    'filings',
    async () => {
      const response = await fetch('/api/filings');
      if (!response.ok) {
        throw new Error('Failed to fetch filings');
      }
      return response.json();
    }
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 mb-4">Error loading filings</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">SEC Filings Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FilingList 
          filings={filings || []} 
          onSelectFiling={setSelectedFiling} 
        />
        {selectedFiling && (
          <FilingDetail filing={selectedFiling} />
        )}
      </div>
    </div>
  );
};

export default SECDashboard;
