import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';

interface Filing {
  id: string;
  companyName: string;
  formType: string;
  filingDate: string;
  documentUrl: string;
}

interface FilingDetailProps {
  filing: Filing;
}

const FilingDetail: React.FC<FilingDetailProps> = ({ filing }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{filing.companyName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Form Type</p>
            <p>{filing.formType}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Filing Date</p>
            <p>{new Date(filing.filingDate).toLocaleDateString()}</p>
          </div>
          <Button 
            onClick={() => window.open(filing.documentUrl, '_blank')}
            className="w-full"
          >
            View Document <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilingDetail;
