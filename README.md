# SEC Filings Dashboard

A React-based dashboard for viewing and analyzing SEC filings data.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file with:
```
VITE_CLICKHOUSE_HOST=your_clickhouse_host
VITE_CLICKHOUSE_USER=your_username
VITE_CLICKHOUSE_PASSWORD=your_password
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Features

- Real-time SEC filings data
- Interactive filing details view
- Responsive design with Tailwind CSS
- Integration with ClickHouse database
- Error handling and loading states

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Query
- ClickHouse
- Bootstrap

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

3. Configure your server environment variables

4. Set up the ClickHouse database connection

## License

MIT
