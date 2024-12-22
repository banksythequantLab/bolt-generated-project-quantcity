// App.tsx
import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const queryClient = new QueryClient();

interface Filing {
  id: string;
  companyName: string;
  ticker: string;
  formType: string;
  filingDate: string;
  sentiment: number;
}

function SECFilingsApp() {
  const [filings, setFilings] = useState<Filing[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Initial data load
    fetchFilings();
  }, []);

  const fetchFilings = async () => {
    try {
      const response = await fetch('/api/sec/filings');
      const data = await response.json();
      setFilings(data);
    } catch (error) {
      console.error('Error fetching filings:', error);
    }
  };

  const filterFilings = (filing: Filing) => {
    if (filter === 'all') return true;
    return filing.formType === filter;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">SEC Filings Dashboard</CardTitle>
          <CardDescription>
            Monitor and analyze SEC filings with sentiment analysis
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Filings</SelectItem>
                <SelectItem value="10-K">10-K</SelectItem>
                <SelectItem value="10-Q">10-Q</SelectItem>
                <SelectItem value="8-K">8-K</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Form Type</TableHead>
                  <TableHead>Filing Date</TableHead>
                  <TableHead>Sentiment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filings.filter(filterFilings).map((filing) => (
                  <TableRow key={filing.id}>
                    <TableCell>{filing.companyName}</TableCell>
                    <TableCell>{filing.ticker}</TableCell>
                    <TableCell>{filing.formType}</TableCell>
                    <TableCell>
                      {new Date(filing.filingDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 rounded ${
                          filing.sentiment > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {filing.sentiment.toFixed(2)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SECFilingsApp />
    </QueryClientProvider>
  );
}

export default App;
