import React from 'react'
import './Footer.css'
import youtube_icon from '../../assets/youtube_icon.png'
import twitter_icon from '../../assets/twitter_icon.png'
import instagram_icon from '../../assets/instagram_icon.png'
import facebook_icon from '../../assets/facebook_icon.png'

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-container">
        <div className="footer-social">
          <a href="https://www.facebook.com/netflixus" aria-label="Facebook">
            <img src={facebook_icon} alt="" />
          </a>
          <a href="https://www.instagram.com/Netflix/#" aria-label="Instagram">
            <img src={instagram_icon} alt="" />
          </a>
          <a href="https://x.com/netflix" aria-label="Twitter">
            <img src={twitter_icon} alt="" />
          </a>
          <a href="https://www.youtube.com/user/NewOnNetflix" aria-label="YouTube">
            <img src={youtube_icon} alt="" />
          </a>
        </div>
      </div>
      <div className="footer-links">
        <ul>
          <li>Audio Description</li>
          <li>Help Center</li>
          <li>Gift Cards</li>
          <li>Media Center</li>
          <li>Investor Relations</li>
          <li>Jobs</li>
          <li>Netflix Shop</li>
          <li>Terms of Use</li>
          <li>Privacy</li>
          <li>Legal Notices</li>
          <li>Cookie Preferences</li>
          <li>Corporate Information</li>
          <li>Contact Us</li>
          <li>Do Not Sell or Share My Personal Information</li>
        </ul>
      </div>
      <p className='footer-copyright'>
        © 1997-2025 Netflix, Inc.</p>
    </div>
  )
}

export default Footer
