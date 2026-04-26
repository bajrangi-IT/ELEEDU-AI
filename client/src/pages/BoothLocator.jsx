import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Navigation, Phone } from 'lucide-react';

const BoothLocator = () => {
  const [search, setSearch] = useState('');
  
  const mockBooths = [
    { id: 1, name: 'St. Mary School Polling Center', address: '123 Main St, Central District', dist: '0.5 km' },
    { id: 2, name: 'Community Hall Block B', address: '45 Park Avenue, West Side', dist: '1.2 km' },
    { id: 3, name: 'Government Library Hall', address: 'City Center, Sector 4', dist: '2.8 km' }
  ];

  return (
    <div className="locator-container animate-fade-in">
      <div className="search-sidebar glass-morphism">
        <h2>Find Polling Booth</h2>
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Enter pincode or area..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="booth-list">
          {mockBooths.map(booth => (
            <motion.div 
              key={booth.id} 
              className="booth-item"
              whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <div className="booth-info">
                <h4>{booth.name}</h4>
                <p><MapPin size={14} /> {booth.address}</p>
                <span className="distance">{booth.dist} away</span>
              </div>
              <div className="booth-actions">
                <button className="icon-btn-small"><Navigation size={16} /></button>
                <button className="icon-btn-small"><Phone size={16} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="map-view glass-morphism">
        <div className="map-placeholder">
          <MapPin size={48} color="var(--primary)" />
          <p>Google Maps Integration</p>
          <span>Real-time location and directions will be displayed here.</span>
        </div>
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
