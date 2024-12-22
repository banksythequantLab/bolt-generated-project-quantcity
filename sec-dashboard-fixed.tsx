import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { ArrowUpDown, RefreshCw } from 'lucide-react';

const SECDashboard = () => {
  const [filings, setFilings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchFilings();
  }, [filter]);

  const fetchFilings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sec/filings' + (filter !== 'all' ? `?type=${filter}` : ''));
      const data = await response.json();
      setFilings(data);
    } catch (error) {
      console.error('Failed to fetch filings:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>SEC Filings Monitor</CardTitle>
        <button 
          onClick={fetchFilings}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </CardHeader>
      
      <CardContent>
        <div className="mb-4">
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

        {loading ? (
          <div className="flex justify-center p-4">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center space-x-1">
                    <span>Symbol</span>
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>Filing Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Sentiment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filings.map((filing) => (
                <TableRow key={`${filing.symbol}-${filing.timestamp}`}>
                  <TableCell className="font-medium">{filing.symbol}</TableCell>
                  <TableCell>{filing.filing_type}</TableCell>
                  <TableCell>{formatDate(filing.timestamp)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded ${
                      filing.sentiment_score > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {filing.sentiment_score.toFixed(2)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default SECDashboard;