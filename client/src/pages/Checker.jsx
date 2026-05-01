import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ChevronRight, Info } from 'lucide-react';
import axios from 'axios';

const Checker = () => {
  const [formData, setFormData] = useState({
    age: '',
    isCitizen: true,
    residencyPeriod: '',
    hasVoterId: false
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    
    try {
      const response = await axios.post('/api/check-eligibility', {
        age: parseInt(formData.age),
        isCitizen: formData.isCitizen,
        residencyPeriod: parseInt(formData.residencyPeriod)
      });
      
      setResult({
        ...response.data,
        nextSteps: response.data.isEligible 
          ? ['Register on the national portal', 'Find your polling booth', 'Check upcoming election dates']
          : ['Register once you turn 18', 'Apply for citizenship if applicable', 'Wait for residency requirement']
      });
    } catch (error) {
      console.error('Eligibility Check Error:', error);
      setResult({
        isEligible: false,
        reasons: ['Unable to verify at this moment. Please try again later.'],
        nextSteps: []
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checker-container animate-fade-in">
      <div className="checker-card glass-morphism" role="main">
        <h2>Voter Eligibility Checker</h2>
        <p className="subtitle" id="checker-desc">Answer a few questions to see if you can vote in the next election.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>How old are you?</label>
            <input 
              type="number" 
              required 
              min="0"
              max="120"
              placeholder="Enter your age"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Are you a citizen?</label>
            <div className="radio-group">
              <button 
                type="button" 
                className={formData.isCitizen ? 'active' : ''}
                onClick={() => setFormData({...formData, isCitizen: true})}
              >Yes</button>
              <button 
                type="button" 
                className={!formData.isCitizen ? 'active' : ''}
                onClick={() => setFormData({...formData, isCitizen: false})}
              >No</button>
            </div>
          </div>

          <div className="form-group">
            <label>How many months have you lived in your current constituency?</label>
            <input 
              type="number" 
              required 
              min="0"
              placeholder="e.g. 12"
              value={formData.residencyPeriod}
              onChange={(e) => setFormData({...formData, residencyPeriod: e.target.value})}
            />
          </div>

          <button type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? 'Processing...' : 'Check My Status'}
          </button>
        </form>

        {result && (
          <motion.div 
            className={`result-box ${result.isEligible ? 'success' : 'failure'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
          >
            <div className="result-header">
              {result.isEligible ? <CheckCircle size={32} /> : <XCircle size={32} />}
              <h3>{result.isEligible ? 'Eligible to Vote' : 'Not Eligible Yet'}</h3>
            </div>
            
            <ul className="reasons-list">
              {result.reasons.map((r, i) => (
                <li key={i}><Info size={16} /> {r}</li>
              ))}
            </ul>

            <div className="next-steps">
              <h4>Next Steps:</h4>
              {result.nextSteps.map((step, i) => (
                <div key={i} className="step-item">
                  <ChevronRight size={16} /> {step}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .checker-container {
          display: flex;
          justify-content: center;
          padding: 40px 0;
        }

        .checker-card {
          width: 100%;
          max-width: 600px;
          padding: 40px;
        }

        h2 { margin-bottom: 10px; font-size: 1.8rem; }
        .subtitle { color: var(--text-muted); margin-bottom: 30px; }

        form { display: flex; flex-direction: column; gap: 20px; }

        .form-group { display: flex; flex-direction: column; gap: 10px; }

        .form-group label { font-weight: 500; font-size: 0.95rem; }

        input {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 12px 16px;
          color: white;
          outline: none;
        }

        .radio-group { display: flex; gap: 10px; }
        .radio-group button {
          flex: 1;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
        }
        .radio-group button.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .full-width { width: 100%; justify-content: center; margin-top: 10px; }

        .result-box {
          margin-top: 30px;
          padding: 25px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.03);
        }

        .result-box.success { border: 1px solid #10b981; }
        .result-box.failure { border: 1px solid #ef4444; }

        .result-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .success .result-header { color: #10b981; }
        .failure .result-header { color: #ef4444; }

        .reasons-list {
          list-style: none;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .reasons-list li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
        }

        .next-steps h4 { margin-bottom: 10px; font-size: 1rem; color: var(--primary); }
        .step-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 5px;
        }
      `}</style>
    </div>
  );
};

export default Checker;
