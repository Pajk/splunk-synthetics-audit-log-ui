# Splunk Synthetics Audit Log UI

This is a web application for interacting with the Splunk Synthetics Audit Log API. The application allows users to query and retrieve audit logs from Splunk Synthetic Monitoring, providing a user-friendly interface for filtering and viewing audit data.

## Features

- Query audit logs using various filters such as time range, resource type, user ID, and more.
- View responses in a structured JSON format.

## API Reference

For detailed information about the API, refer to the official [Splunk Observability API documentation](https://dev.splunk.com/observability/reference).

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Pajk/splunk-synthetics-audit-log-ui.git
   ```
2. Navigate to the project directory:
   ```bash
   cd splunk-synthetics-audit-log-ui
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

### Build

Build the application for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

### Deployment

Deploy the application to GitHub Pages:

```bash
npm run deploy
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
