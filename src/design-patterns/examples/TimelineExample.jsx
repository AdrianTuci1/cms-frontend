import React, { useState, useEffect } from 'react';
import TimelineService from '../../api/services/TimelineService.js';

/**
 * Timeline Example Component
 * Demonstrates how to use the timeline service with single endpoint pattern
 * and X-Resource-Type header
 */
const TimelineExample = () => {
  const [timelineData, setTimelineData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '2025-08-18',
    endDate: '2025-08-26'
  });

  const timelineService = new TimelineService();

  /**
   * Fetch timeline data using the single endpoint pattern
   */
  const fetchTimeline = async () => {
    try {
      setLoading(true);
      setError(null);

      // Example: GET /api/resources/b1-loc1/date-range/?startDate=2025-08-18&endDate=2025-08-26
      // Headers: X-Resource-Type: timeline
      const data = await timelineService.getTimeline({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        // Additional optional parameters
        status: 'scheduled',
        clientId: 'optional-client-id',
        serviceId: 'optional-service-id',
        medicId: 'optional-medic-id'
      });

      setTimelineData(data);
      console.log('Timeline data fetched successfully:', data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new timeline entry
   */
  const createTimelineEntry = async () => {
    try {
      setLoading(true);
      setError(null);

      const newEntry = {
        clientId: 'client-123',
        medicId: 'medic-456',
        serviceId: 'service-789',
        appointmentDate: '2025-08-20T10:00:00Z',
        duration: 60,
        notes: 'Consultație de rutină',
        status: 'scheduled'
      };

      // Example: POST /api/resources/b1-loc1
      // Headers: X-Resource-Type: timeline
      // Body: { clientId: 'client-123', medicId: 'medic-456', ... }
      const result = await timelineService.createTimelineEntry(newEntry);

      console.log('Timeline entry created successfully:', result);
      
      // Refresh timeline data
      await fetchTimeline();
    } catch (err) {
      setError(err.message);
      console.error('Error creating timeline entry:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a timeline entry
   */
  const updateTimelineEntry = async (entryId) => {
    try {
      setLoading(true);
      setError(null);

      const updatedData = {
        status: 'completed',
        notes: 'Consultație finalizată cu succes'
      };

      // Example: PUT /api/resources/b1-loc1
      // Headers: X-Resource-Type: timeline
      // Body: { status: 'completed', notes: '...', id: 'entry-id' }
      const result = await timelineService.updateTimelineEntry(entryId, updatedData);

      console.log('Timeline entry updated successfully:', result);
      
      // Refresh timeline data
      await fetchTimeline();
    } catch (err) {
      setError(err.message);
      console.error('Error updating timeline entry:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a timeline entry
   */
  const deleteTimelineEntry = async (entryId) => {
    try {
      setLoading(true);
      setError(null);

      // Example: DELETE /api/resources/b1-loc1
      // Headers: X-Resource-Type: timeline
      // Body: { id: 'entry-id' }
      const result = await timelineService.deleteTimelineEntry(entryId);

      console.log('Timeline entry deleted successfully:', result);
      
      // Refresh timeline data
      await fetchTimeline();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting timeline entry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch timeline data on component mount
    fetchTimeline();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Timeline Service Example</h1>
      <p>This example demonstrates how to use the timeline service with the single endpoint pattern.</p>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h3>API Endpoint Pattern</h3>
        <code>
          GET /api/resources/b1-loc1/date-range/?resourceType=timeline&startDate=2025-08-18&endDate=2025-08-26
        </code>
        <br />
        <strong>Headers:</strong> X-Resource-Type: timeline
        <br />
        <strong>Note:</strong> Business ID și Location ID sunt în URL, nu ca headers
      </div>

      {/* Date Range Controls */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Date Range</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label>
            Start Date:
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              style={{ marginLeft: '5px', padding: '5px' }}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              style={{ marginLeft: '5px', padding: '5px' }}
            />
          </label>
          <button 
            onClick={fetchTimeline}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {loading ? 'Loading...' : 'Fetch Timeline'}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Timeline Actions</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={createTimelineEntry}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Create Entry
          </button>
          <button 
            onClick={() => updateTimelineEntry('example-entry-id')}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Update Entry
          </button>
          <button 
            onClick={() => deleteTimelineEntry('example-entry-id')}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Delete Entry
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', border: '1px solid #f5c6cb' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Timeline Data Display */}
      <div>
        <h3>Timeline Data</h3>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading timeline data...</div>
        ) : timelineData ? (
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '4px', 
            overflow: 'auto', 
            maxHeight: '400px',
            border: '1px solid #dee2e6'
          }}>
            {JSON.stringify(timelineData, null, 2)}
          </pre>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
            No timeline data available. Click "Fetch Timeline" to load data.
          </div>
        )}
      </div>

      {/* Request Details */}
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
        <h3>Request Details</h3>
        <p><strong>Business ID:</strong> {localStorage.getItem('businessId') || 'Not set'} (din localStorage)</p>
        <p><strong>Location ID:</strong> {localStorage.getItem('locationId') || 'Not set'} (din localStorage)</p>
        <p><strong>Endpoint:</strong> /api/resources/{localStorage.getItem('businessId') || 'b1'}-{localStorage.getItem('locationId') || 'loc1'}/date-range/</p>
        <p><strong>Resource Type:</strong> timeline</p>
        <p><strong>Required Headers:</strong> X-Resource-Type: timeline</p>
        <p><strong>Note:</strong> Business ID și Location ID sunt obținute din localStorage (setate în LocationsPage)</p>
      </div>
    </div>
  );
};

export default TimelineExample;
