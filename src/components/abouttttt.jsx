import "../styles/About.css";
import aboutImg from "../assets/about-img.jpg";
import Reveal from "./Reveal";

const About = () => {
  return (
    <section className="about section" id="about">
      <div className="container about-container">
        <Reveal className="about-image">
          <img src={aboutImg} alt="Woman embracing a child" />
        </Reveal>

        <Reveal className="about-content">
          <span className="section-label">WHO ARE WE</span>
          <h2>Compassion in Action</h2>

          <p>
            David Chukwu Charity Foundation was established with passion to
            bring hope, support, and positive change to vulnerable members of
            society.
          </p>

          <p>
            We believe every person deserves dignity, care, and the opportunity
            to thrive regardless of their circumstances.
          </p>

          <a href="#causes" className="dark-outline-btn">
            ABOUT OUR FOUNDATION →
          </a>
        </Reveal>
      </div>
    </section>
  );
};

export default About;