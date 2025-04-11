import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import ReactJson from 'react-json-view';

const App = () => {
  const [apiBaseUrl, setApiBaseUrl] = useState('https://api.us1.signalfx.com/v2/synthetics');
  const [authToken, setAuthToken] = useState(() => sessionStorage.getItem('authToken') || '');
  const [parameters, setParameters] = useState({});
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    sessionStorage.setItem('authToken', authToken);
  }, [authToken]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParameters((prev) => ({ ...prev, [name]: value }));
  };

  const sendRequest = async () => {
    if (!authToken) {
      setError('Authentication token is required.');
      return;
    }
    setError('');
    try {
      const queryParams = new URLSearchParams(parameters).toString();
      const url = `${apiBaseUrl}/audits?${queryParams}`;
      const res = await fetch(url, {
        headers: {
          'X-SF-TOKEN': authToken,
          'Content-Type': 'application/json',
        },
      });
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        setResponse(json);
      } catch {
        setResponse(text);
      }
    } catch (error) {
      setResponse({ error: error.message });
    }
  };

  const renderTooltip = (description) => (
    <span className="tooltip-container">
      <span className="question-mark">?</span>
      <span className="tooltip">{description}</span>
    </span>
  );

  return (
    <div className="App">
      <h1>Splunk Synthetics Audit Log</h1>
      <div className="form-group">
        <label>API Base URL:</label>
        <input
          type="text"
          value={apiBaseUrl}
          onChange={(e) => setApiBaseUrl(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Token:</label>
        <input
          type="password"
          value={authToken}
          onChange={(e) => setAuthToken(e.target.value)}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="form-group">
        <label htmlFor="timeFrom">Time From:</label>
        <input
          id="timeFrom"
          type="date"
          name="timeFrom"
          value={parameters.timeFrom || ''}
          onChange={handleInputChange}
        />
        {renderTooltip('Filter audits from this time (inclusive)')}
      </div>
      <div className="form-group">
        <label htmlFor="timeTo">Time To:</label>
        <input
          id="timeTo"
          type="date"
          name="timeTo"
          value={parameters.timeTo || ''}
          onChange={handleInputChange}
        />
        {renderTooltip('Filter audits up to this time (inclusive)')}
      </div>
      <div className="form-group">
        <label htmlFor="resourceType">Resource Type:</label>
        <select
          id="resourceType"
          name="resourceType"
          onChange={handleInputChange}
          defaultValue=""
        >
          <option value="">Select resource type</option>
          <option value="Test::Browser">Browser test</option>
          <option value="Test::Api">API test</option>
          <option value="Test::Http">HTTP test</option>
          <option value="Test::Port">Port test</option>
          <option value="DowntimeConfiguration">Downtime configuration</option>
          <option value="Mfa::Totp">MFA TOTP</option>
          <option value="PrivateLocation">Private location</option>
          <option value="RunnerToken">Runner token</option>
          <option value="Variable::Secret">Secret variable</option>
          <option value="Variable::PlainText">Plain text variable</option>
        </select>
        {renderTooltip('Filter by resource type')}
      </div>
      <div className="form-group">
        <label htmlFor="resourceId">Resource ID:</label>
        <input
          id="resourceId"
          type="text"
          name="resourceId"
          onChange={handleInputChange}
        />
        {renderTooltip('Filter by resource ID')}
      </div>
      <div className="form-group">
        <label htmlFor="userId">User ID:</label>
        <input
          id="userId"
          type="text"
          name="userId"
          onChange={handleInputChange}
        />
        {renderTooltip('ID of the user who performed the action')}
      </div>
      <div className="form-group">
        <label htmlFor="requestUuid">Request UUID:</label>
        <input
          id="requestUuid"
          type="text"
          name="requestUuid"
          onChange={handleInputChange}
        />
        {renderTooltip('Unique ID of the request to the API')}
      </div>
      <div className="form-group">
        <label htmlFor="associatedType">Associated Type:</label>
        <select
          id="associatedType"
          name="associatedType"
          onChange={handleInputChange}
          defaultValue=""
        >
          <option value="">Select associated type</option>
          <option value="PrivateLocation">Private location</option>
        </select>
        {renderTooltip('Filter by associated resource type')}
      </div>
      <div className="form-group">
        <label htmlFor="associatedId">Associated ID:</label>
        <input
          id="associatedId"
          type="text"
          name="associatedId"
          onChange={handleInputChange}
        />
        {renderTooltip('Filter by associated resource ID')}
      </div>
      <div className="form-group">
        <label htmlFor="page">Page:</label>
        <input
          id="page"
          type="number"
          name="page"
          min="1"
          max="500"
          value={parameters.page || ''}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (value >= 1 && value <= 500) {
              handleInputChange(e);
            } else {
              e.target.value = parameters.page || ''; 
            }
          }}
        />
        {renderTooltip('Page to return (must be betwen 1 and 500)')}
      </div>
      <div className="form-group">
        <label htmlFor="perPage">Per Page:</label>
        <input
          id="perPage"
          type="number"
          name="perPage"
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (value >= 1 && value <= 500) {
              handleInputChange(e);
            } else {
              e.target.value = parameters.page || '';
            }
          }}
        />
        {renderTooltip('Number of items per page (must be betwen 1 and 500)')}
      </div>
      <div className="form-group">
        <label htmlFor="sortDirection">Sort Direction:</label>
        <select id="sortDirection" name="sortDirection" onChange={handleInputChange} defaultValue="desc">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        {renderTooltip('Sort direction for the results')}
      </div>
      <button onClick={sendRequest}>Send Request</button>
      <div className="response">
        <h2>Response:</h2>
        {response ? (
          typeof response === 'string' ? (
            <pre>{response}</pre> // Display raw text if not JSON
          ) : (
            <ReactJson 
              src={response} 
              theme="rjv-default" 
              collapsed={false} 
              enableClipboard={true} 
              displayDataTypes={false} // Disable showing data types
            />
          )
        ) : (
          <p>No response yet</p>
        )}
      </div>
    </div>
  );
};

export default App;
