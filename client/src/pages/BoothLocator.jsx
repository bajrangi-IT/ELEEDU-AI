import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Navigation, Phone, AlertCircle } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '12px'
};

const center = {
  lat: 28.6139,
  lng: 77.2090
};

const BoothLocator = () => {
  const [search, setSearch] = useState('');
  const [map, setMap] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  });

  const mockBooths = [
    { id: 1, name: 'St. Mary School Polling Center', address: '123 Main St, Central District', dist: '0.5 km', position: { lat: 28.6145, lng: 77.2100 } },
    { id: 2, name: 'Community Hall Block B', address: '45 Park Avenue, West Side', dist: '1.2 km', position: { lat: 28.6120, lng: 77.2080 } },
    { id: 3, name: 'Government Library Hall', address: 'City Center, Sector 4', dist: '2.8 km', position: { lat: 28.6160, lng: 77.2150 } }
  ];

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <div className="locator-container animate-fade-in">
      <div className="search-sidebar glass-morphism">
        <h2>Find Polling Booth</h2>
        <div className="search-bar">
          <Search size={20} className="search-icon" aria-hidden="true" />
          <input 
            type="text" 
            placeholder="Enter pincode or area..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search for polling booth"
          />
        </div>

        <div className="booth-list" role="list">
          {mockBooths.map(booth => (
            <motion.div 
              key={booth.id} 
              className="booth-item"
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              role="listitem"
            >
              <div className="booth-info">
                <h4>{booth.name}</h4>
                <p><MapPin size={14} aria-hidden="true" /> {booth.address}</p>
                <span className="distance">{booth.dist} away</span>
              </div>
              <div className="booth-actions">
                <button className="icon-btn-small" aria-label={`Navigate to ${booth.name}`}><Navigation size={16} /></button>
                <button className="icon-btn-small" aria-label={`Call ${booth.name}`}><Phone size={16} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="map-view glass-morphism">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {mockBooths.map(booth => (
              <Marker key={booth.id} position={booth.position} title={booth.name} />
            ))}
          </GoogleMap>
        ) : loadError ? (
          <div className="map-placeholder error">
            <AlertCircle size={48} color="#ef4444" />
            <p>Error Loading Maps</p>
            <span>Please check your VITE_GOOGLE_MAPS_API_KEY.</span>
          </div>
        ) : (
          <div className="map-placeholder">
            <MapPin size={48} color="var(--primary)" className="animate-pulse" />
            <p>Loading Interactive Map...</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .locator-container {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 20px;
          height: calc(100vh - 180px);
          padding: 20px 0;
        }

        .search-sidebar {
          padding: 25px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow-y: auto;
        }

        .search-bar {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon { position: absolute; left: 12px; color: var(--text-muted); }

        .search-bar input {
          width: 100%;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 12px 12px 12px 40px;
          color: white;
          outline: none;
        }

        .booth-list { display: flex; flex-direction: column; gap: 10px; }

        .booth-item {
          padding: 15px;
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .booth-info h4 { font-size: 1rem; margin-bottom: 5px; }
        .booth-info p { font-size: 0.8rem; color: var(--text-muted); display: flex; align-items: center; gap: 5px; }
        .distance { font-size: 0.75rem; color: var(--primary); font-weight: 600; }

        .icon-btn-small {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--glass);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 5px;
        }

        .map-view {
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.2);
        }

        .map-placeholder {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          color: var(--text-muted);
        }

        .map-placeholder p { font-size: 1.5rem; color: var(--text-main); font-weight: 600; }

        @media (max-width: 900px) {
          .locator-container {
            grid-template-columns: 1fr;
          }
          .map-view { height: 300px; order: -1; }
        }
      `}</style>
    </div>
  );
};

export default BoothLocator;
