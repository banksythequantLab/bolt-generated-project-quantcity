import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { secDataService } from '../services/20241222_QuantCity_SEC_DataService_v1.0';
import { format } from 'date-fns';

export const SECDashboard = () => {
  const [filter, setFilter] = useState('all');
  
  const { data: filings, isLoading } = useQuery({
    queryKey: ['filings', filter],
    queryFn: () => secDataService.getFilings({
      type: filter === 'all' ? undefined : filter
    })
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SEC Filings Monitor</h1>
        <div className="flex gap-4 mb-4">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Filings</option>
            <option value="10-K">10-K</option>
            <option value="10-Q">10-Q</option>
            <option value="8-K">8-K</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Filing Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sentiment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filings?.map((filing) => (
                <tr key={`${filing.symbol}-${filing.timestamp}`}>
                  <td className="px-6 py-4 whitespace-nowrap">{filing.symbol}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{filing.filing_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(filing.timestamp), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded ${
                      filing.sentiment_score > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {filing.sentiment_score.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SECDashboard;