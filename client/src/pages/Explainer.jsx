import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, FileText, Fingerprint, Box, BarChart3, CheckCircle2 } from 'lucide-react';

const steps = [
  { 
    id: 1, 
    title: 'Registration', 
    desc: 'Register as a voter on the official portal or through form 6.',
    icon: <UserCheck size={32} />,
    color: '#6366f1'
  },
  { 
    id: 2, 
    title: 'Identity Verification', 
    desc: 'Verify your name in the electoral roll and locate your polling booth.',
    icon: <FileText size={32} />,
    color: '#ec4899'
  },
  { 
    id: 3, 
    title: 'Election Day', 
    desc: 'Visit the booth with a valid ID card like Aadhaar or EPIC.',
    icon: <Fingerprint size={32} />,
    color: '#f59e0b'
  },
  { 
    id: 4, 
    title: 'Casting Vote', 
    desc: 'Press the button on the EVM next to your chosen candidate.',
    icon: <Box size={32} />,
    color: '#10b981'
  },
  { 
    id: 5, 
    title: 'Counting', 
    desc: 'Votes are counted securely at specialized centers.',
    icon: <BarChart3 size={32} />,
    color: '#8b5cf6'
  },
  { 
    id: 6, 
    title: 'Results', 
    desc: 'Winners are declared and the democratic process completes.',
    icon: <CheckCircle2 size={32} />,
    color: '#06b6d4'
  }
];

const Explainer = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="explainer-container animate-fade-in">
      <header className="explainer-header">
        <h1>Understanding the <span>Election Process</span></h1>
        <p>A step-by-step guide to how your vote makes a difference.</p>
      </header>

      <div className="flow-visualizer">
        <div className="steps-timeline">
          {steps.map((step, index) => (
            <div key={step.id} className="timeline-node">
              <motion.button
                className={`node-button ${index <= activeStep ? 'active' : ''}`}
                style={{ '--accent': step.color }}
                onClick={() => setActiveStep(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {step.icon}
              </motion.button>
              <div className={`node-line ${index < steps.length - 1 && index < activeStep ? 'active' : ''}`}></div>
            </div>
          ))}
        </div>

        <div className="step-content-wrapper">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeStep}
              className="step-card glass-morphism"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="step-badge" style={{ backgroundColor: steps[activeStep].color }}>
                Step {steps[activeStep].id}
              </div>
              <h2>{steps[activeStep].title}</h2>
              <p>{steps[activeStep].desc}</p>
              
              <div className="navigation-buttons">
                <button 
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="btn-secondary"
                >Previous</button>
                <button 
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="btn-primary"
                >Next Step</button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .explainer-container {
          padding: 40px 0;
          display: flex;
          flex-direction: column;
          gap: 50px;
          align-items: center;
        }

        .explainer-header { text-align: center; }
        .explainer-header h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .explainer-header span { color: var(--primary); }
        .explainer-header p { color: var(--text-muted); }

        .flow-visualizer {
          width: 100%;
          max-width: 1000px;
          display: flex;
          flex-direction: column;
          gap: 60px;
        }

        .steps-timeline {
          display: flex;
          justify-content: space-between;
          position: relative;
          padding: 0 40px;
        }

        .timeline-node {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .timeline-node:last-child { flex: 0; }

        .node-button {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--glass);
          border: 2px solid var(--glass-border);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: var(--transition);
        }

        .node-button.active {
          background: var(--accent);
          color: white;
          border-color: white;
          box-shadow: 0 0 20px var(--accent);
        }

        .node-line {
          height: 4px;
          background: var(--glass-border);
          flex: 1;
          margin: 0 -2px;
          z-index: 1;
        }

        .node-line.active { background: var(--primary); }

        .step-content-wrapper {
          display: flex;
          justify-content: center;
        }

        .step-card {
          width: 100%;
          max-width: 600px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: center;
          align-items: center;
        }

        .step-badge {
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          color: white;
        }

        .step-card h2 { font-size: 2rem; }
        .step-card p { font-size: 1.1rem; color: var(--text-muted); }

        .navigation-buttons {
          display: flex;
          gap: 20px;
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .steps-timeline {
            flex-direction: column;
            align-items: center;
            gap: 20px;
          }
          .node-line {
            width: 4px;
            height: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Explainer;
