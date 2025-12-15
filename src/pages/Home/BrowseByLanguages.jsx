import React from 'react'
import './Home.css'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

const BrowseByLanguages = () => {
  return (
    <div className="home">
      <Navbar />
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '1.5rem',
          color: '#fff',
          maxWidth: '600px',
          lineHeight: '1.6'
        }}>
          <p style={{ marginBottom: '1rem', fontSize: '2rem', fontWeight: 'bold' }}>
            Coming Soon...
          </p>
          <p style={{ opacity: 0.8 }}>
            Currently we only have English sub-titles available.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default BrowseByLanguages
    