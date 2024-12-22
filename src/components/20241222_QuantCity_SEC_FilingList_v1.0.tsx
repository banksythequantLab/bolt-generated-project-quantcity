import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface Filing {
  id: string;
  companyName: string;
  formType: string;
  filingDate: string;
  documentUrl: string;
}

interface FilingListProps {
  filings: Filing[];
  onSelectFiling: (filing: Filing) => void;
}

const FilingList: React.FC<FilingListProps> = ({ filings, onSelectFiling }) => {
  return (
    <div className="border rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Form Type</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filings.map((filing) => (
            <TableRow 
              key={filing.id}
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => onSelectFiling(filing)}
            >
              <TableCell>{filing.companyName}</TableCell>
              <TableCell>{filing.formType}</TableCell>
              <TableCell>{new Date(filing.filingDate).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FilingList;
