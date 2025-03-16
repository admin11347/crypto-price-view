import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    fetch('/api/cryptos')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch crypto data');
        }
        return response.json();
      })
      .then((data) => {
        setCryptos(data.cryptos);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting based on sortConfig
  const sortedCryptos = [...cryptos].sort((a, b) => {
    if (sortConfig.key) {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      } else {
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
      }
    }
    return 0;
  });

  // Filter cryptocurrencies based on search term
  const filteredCryptos = sortedCryptos.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading cryptocurrency data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="app">
      <h1>Top 20 Cryptocurrencies</h1>
      <input
        type="text"
        placeholder="Search cryptocurrency..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <table className="crypto-table">
        <thead>
          <tr>
            <th>Name</th>
            <th onClick={() => handleSort('price')} className="sortable">
              Price (USD) {sortConfig.key === 'price' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('marketCap')} className="sortable">
              Market Cap {sortConfig.key === 'marketCap' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
            <th onClick={() => handleSort('volume24h')} className="sortable">
              24h Volume {sortConfig.key === 'volume24h' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCryptos.map((crypto) => (
            <tr key={crypto.id}>
              <td>{crypto.name}</td>
              <td>${crypto.price.toLocaleString()}</td>
              <td>${crypto.marketCap.toLocaleString()}</td>
              <td>${crypto.volume24h.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
