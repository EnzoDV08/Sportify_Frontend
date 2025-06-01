import { Link } from 'react-router-dom';
import '../Style/Home.css';
import logo from '../assets/Icons/SportifyLogo.svg';
import paddleImg from '../assets/paddle-court.png';
import HostedByBearded from '../Components/HostedByBearded';
import TopPerformers from '../Components/TopPerformers';
import EventsNearby from '../Components/EventsNearby';

const Home = () => {
  return (
    <div className="home-page">
      {/* HERO BANNER */}
      <section className="hero-banner">
        <div className="hero-left">
          <img src={logo} alt="Sportify Logo" className="hero-logo" />
          <h1 className="hero-title">WELCOME TO <span>SPORTIFY</span></h1>
          <p className="hero-subtext">
            Your all-in-one sports companion. Join events, climb the leader boards, and unlock achievements.
          </p>
          <div className="hero-buttons">
        <Link to="/add-event" className="btn btn-get-started">⚡ Get Started</Link>
        <Link to="/events" className="btn btn-explore">🏆 Explore Events</Link>
          </div>
        </div>
        <div className="hero-right">
          <div
            className="hero-image"
            style={{ backgroundImage: `url(${paddleImg})` }}
          ></div>
        </div>
      </section>

      {/* HOSTED BY BEARDED */}
      <HostedByBearded />

      <TopPerformers />

      <EventsNearby />
    </div>
  );
};

export default Home;






