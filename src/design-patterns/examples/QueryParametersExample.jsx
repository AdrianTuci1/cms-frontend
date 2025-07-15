/**
 * Query Parameters Example - Demonstrates flexible search, filtering, and pagination
 */

import React, { useState, useEffect } from 'react';
import { useDataSync } from '../hooks/useDataSync.js';

const QueryParametersExample = () => {
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedBusinessType, setSelectedBusinessType] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedStatus, selectedBusinessType, sortBy, sortOrder]);

  // Use data sync with query parameters
  const { 
    data, 
    loading, 
    error,
    getSupportedQueryParams,
    buildSearchQuery
  } = useDataSync('clients', {
    search: debouncedSearch,
    filters: {
      status: selectedStatus,
      businessType: selectedBusinessType
    },
    sortBy,
    sortOrder,
    page: currentPage,
    limit: 20
  });

  // Get supported parameters for this resource
  const supportedParams = getSupportedQueryParams();

  // Example of building search query manually
  const searchQuery = buildSearchQuery(debouncedSearch);

  if (loading && !data) {
    return <div className="loading">Loading clients...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  return (
    <div className="query-example">
      <h2>Clients with Advanced Search & Filtering</h2>
      
      {/* Search and Filter Controls */}
      <div className="controls">
        <div className="search-section">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="search-input"
          />
          {searchTerm && (
            <small>Search query: {JSON.stringify(searchQuery)}</small>
          )}
        </div>

        <div className="filters-section">
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>

          <select 
            value={selectedBusinessType}
            onChange={(e) => setSelectedBusinessType(e.target.value)}
          >
            <option value="">All Business Types</option>
            <option value="dental">Dental</option>
            <option value="gym">Gym</option>
            <option value="hotel">Hotel</option>
          </select>

          <select 
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
          >
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="email-asc">Email A-Z</option>
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="lastVisit-desc">Recent Visits</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Found {data?.length || 0} clients
          {debouncedSearch && ` matching "${debouncedSearch}"`}
          {selectedStatus && ` with status "${selectedStatus}"`}
          {selectedBusinessType && ` for "${selectedBusinessType}" business`}
        </p>
        <p>
          Sorted by {sortBy} ({sortOrder === 'asc' ? 'ascending' : 'descending'}) 
          - Page {currentPage}
        </p>
      </div>

      {/* Results List */}
      <div className="results-list">
        {data && data.length > 0 ? (
          data.map((client) => (
            <div key={client.id} className="client-card">
              <h3>{client.name}</h3>
              <p>Email: {client.email}</p>
              <p>Phone: {client.phone}</p>
              <p>Status: <span className={`status ${client.status}`}>{client.status}</span></p>
              <p>Business Type: {client.businessType}</p>
              {client.lastVisit && <p>Last Visit: {new Date(client.lastVisit).toLocaleDateString()}</p>}
            </div>
          ))
        ) : (
          <p>No clients found matching your criteria.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={!data || data.length < 20}
        >
          Next
        </button>
      </div>

      {/* Debug Information */}
      <details className="debug-info">
        <summary>Debug Information</summary>
        <div>
          <h4>Supported Query Parameters:</h4>
          <pre>{JSON.stringify(supportedParams, null, 2)}</pre>
          
          <h4>Current Query:</h4>
          <pre>{JSON.stringify({
            search: debouncedSearch,
            filters: {
              status: selectedStatus,
              businessType: selectedBusinessType
            },
            sortBy,
            sortOrder,
            page: currentPage,
            limit: 20
          }, null, 2)}</pre>
        </div>
      </details>
    </div>
  );
};

// Example for Timeline with Date Range
export const TimelineQueryExample = () => {
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-01-31');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, loading, error } = useDataSync('timeline', {
    startDate,
    endDate,
    search: searchTerm,
    filters: {
      status: selectedStatus
    },
    sortBy: 'date',
    sortOrder: 'asc'
  });

  if (loading) return <div>Loading timeline...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="timeline-query-example">
      <h2>Timeline with Date Range & Search</h2>
      
      <div className="controls">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search treatments or clients..."
        />
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="timeline-results">
        {data?.reservations?.length > 0 ? (
          data.reservations.map((appointment) => (
            <div key={appointment.id} className="appointment-card">
              <h3>{appointment.displayTreatment}</h3>
              <p>Client: {appointment.clientName}</p>
              <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
              <p>Status: {appointment.status}</p>
              {appointment.medicName && <p>Doctor: {appointment.medicName}</p>}
            </div>
          ))
        ) : (
          <p>No appointments found for the selected period.</p>
        )}
      </div>
    </div>
  );
};

export default QueryParametersExample; 