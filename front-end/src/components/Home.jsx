import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Fullscreen Fixed Background */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundImage: `url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1950&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(60%)',
            zIndex: -1,
          }}
        />

        {/* Overlay Content */}
        <div
          style={{
            zIndex: 2,
            color: 'white',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '0 1rem',
            fontFamily: `'Outfit', sans-serif`,
            textShadow: '2px 2px 10px rgba(0,0,0,0.6)',
          }}
        >
          <h1 className="display-2 fw-bold" style={{ fontWeight: 600 }}>
            zomato
          </h1>
          <p className="fs-4">Discover the best food & drinks in your city</p>
          <Link
            to="/restaurants"
            className="btn btn-danger btn-lg mt-4 px-4 py-2 shadow"
            style={{
                borderRadius: '30px',
                fontWeight: '600',
                fontSize: '1.1rem',
                letterSpacing: '0.5px',
            }}
            >
            Explore Restaurants 
            </Link>

        </div>
      </div>

    </div>
  );
};

export default Home;
