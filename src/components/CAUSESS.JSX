import "../styles/Causes.css";
import widowsImg from "../assets/widows.jpg";
import childrenImg from "../assets/children.jpg";
import specialNeedsImg from "../assets/special-needs.jpg";
import elderlyImg from "../assets/elderly.jpg";
import Reveal from "./Reveal";

const causes = [
  {
    image: widowsImg,
    title: "Widows",
    text: "Support & Empowerment"
  },
  {
    image: childrenImg,
    title: "Children",
    text: "Orphanage Support & Child Welfare"
  },
  {
    image: specialNeedsImg,
    title: "Special Needs",
    text: "Awareness & Support"
  },
  {
    image: elderlyImg,
    title: "Elderly People",
    text: "Care & Community Support"
  }
];

const Causes = () => {
  return (
    <section className="causes section" id="causes">
      <div className="container">
        <Reveal className="causes-header">
          <span className="section-label">OUR CAUSE</span>
          <h2>Who We Support</h2>
          <p>
            Our programs focus on people and communities who need support the
            most.
          </p>
        </Reveal>

        <div className="causes-grid">
          {causes.map((cause, index) => (
            <Reveal key={cause.title}>
              <article
                className="cause-card"
                style={{
                  transitionDelay: `${index * 0.1}s`
                }}
              >
                <img src={cause.image} alt={cause.title} />

                <div className="cause-card-content">
                  <h3>{cause.title}</h3>
                  <p>{cause.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Causes;