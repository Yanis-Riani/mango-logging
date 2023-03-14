import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [logs, setLogs] = useState([]);

  async function fetchLogs() {
    try {
      const response = await axios.get('/api/ingest');
      setLogs(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, []);

  async function handleIngest(event) {
    event.preventDefault();
    const data = {
      // Remplacez ces champs avec les données que vous voulez ingérer
      type: 'info',
      message: 'Un évènement a été créé',
    };
    try {
      await axios.post('/api/ingest', data);
      await fetchLogs();
    } catch (error) {
      console.error(error);
    }
  }

  function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    };
    return new Intl.DateTimeFormat('fr-FR', options).format(dateTime);
  }

  const sortedLogs = [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div>
      <style>
        {`
          body {
            font-family: Arial, sans-serif;
          }

          h1 {
            font-size: 2em;
            margin-bottom: 1em;
          }

          ul {
            list-style: none;
            padding: 0;
          }

          li {
            margin-bottom: 1em;
          }

          details {
            border: 1px solid #ccc;
            padding: 0.5em;
          }

          summary {
            font-weight: bold;
            cursor: pointer;
          }

          pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: monospace;
            font-size: 0.9em;
          }
        `}
      </style>
      <h1>Logs</h1>
      <button onClick={handleIngest}>Create log</button>
      <ul>
        {sortedLogs.map((log) => (
          <li key={log._id}>
            <details>
              <summary>{log.type} - {formatDateTime(log.timestamp)}</summary>
              <pre>{log.message}</pre>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
