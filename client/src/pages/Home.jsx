import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, CheckCircle, Info, MapPin, Calendar, Globe } from 'lucide-react';

const Home = () => {
  const features = [
    { icon: <MessageSquare />, title: 'Smart Assistant', desc: 'Real-time election guidance.', link: '/assistant', color: 'var(--primary)' },
    { icon: <CheckCircle />, title: 'Eligibility Checker', desc: 'Check if you are ready to vote.', link: '/checker', color: 'var(--secondary)' },
    { icon: <Info />, title: 'Election Flow', desc: 'Visual step-by-step process.', link: '/explainer', color: 'var(--accent)' },
    { icon: <MapPin />, title: 'Booth Locator', desc: 'Find your nearest polling station.', link: '/locator', color: '#10b981' },
  ];

  return (
    <div className="home-page animate-fade-in">
      <header className="hero-section">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your Intelligent <span>Election Companion</span>
        </motion.h1>
        <p>Stay informed, check your eligibility, and participate in democracy with ease.</p>
      </header>

      <section className="features-grid">
        {features.map((f, i) => (
          <motion.div 
            key={i} 
            className="feature-card glass-morphism"
            whileHover={{ y: -10, borderColor: f.color }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="feature-icon" style={{ backgroundColor: `${f.color}22`, color: f.color }}>
              {f.icon}
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <a href={f.link} className="feature-link">Explore →</a>
          </motion.div>
        ))}
      </section>

      <section className="stats-section glass-morphism">
        <div className="stat-item">
          <Globe className="stat-icon" />
          <div>
            <h4>Multilingual</h4>
            <p>Support for 12+ languages</p>
          </div>
        </div>
        <div className="stat-item">
          <Calendar className="stat-icon" />
          <div>
            <h4>Stay Updated</h4>
            <p>Sync election dates to your calendar</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-page {
          display: flex;
          flex-direction: column;
          gap: 40px;
          padding: 20px 0;
        }

        .hero-section {
          text-align: center;
          padding: 60px 20px;
        }

        .hero-section h1 {
          font-size: 3.5rem;
          margin-bottom: 20px;
          line-height: 1.1;
        }

        .hero-section span {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-section p {
          font-size: 1.2rem;
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
        }

        .feature-card {
          padding: 30px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          transition: var(--transition);
        }

        .feature-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-card h3 {
          font-size: 1.5rem;
        }

        .feature-card p {
          color: var(--text-muted);
        }

        .feature-link {
          text-decoration: none;
          color: var(--primary);
          font-weight: 600;
          margin-top: auto;
        }

        .stats-section {
          display: flex;
          justify-content: space-around;
          padding: 40px;
          flex-wrap: wrap;
          gap: 30px;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          color: var(--secondary);
        }

        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
