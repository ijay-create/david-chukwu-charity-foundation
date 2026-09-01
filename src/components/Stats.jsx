import { useEffect, useRef, useState } from "react";
import "../styles/Stats.css";

const PeopleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M3 20c0-3.2 2.6-5.5 6-5.5s6 2.3 6 5.5M15 14.5c3.1-.2 5.5 1.8 6 4.5" />
  </svg>
);

const NetworkIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="5" r="2.5" />
    <circle cx="5" cy="18" r="2.5" />
    <circle cx="19" cy="18" r="2.5" />
    <path d="M12 7.5v4M10.5 12.5 6.5 16M13.5 12.5l4 3.5" />
  </svg>
);

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.8 8.7c0 5-8.8 10.2-8.8 10.2S3.2 13.7 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z" />
  </svg>
);

const stats = [
  {
    icon: PeopleIcon,
    number: 412,
    text: "Lives Supported"
  },
  {
    icon: NetworkIcon,
    number: 13,
    text: "Communities Reached"
  },
  {
    icon: HeartIcon,
    number: 7,
    text: "Outreach Programs"
  },
  {
    icon: PeopleIcon,
    number: 38,
    text: "Volunteers"
  }
];

const CountUp = ({ target }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const ref = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
          setCount(0);

          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
        }
      },
      {
        threshold: 0.35
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    let startTime = null;

    const duration = 1800;

    const animate = (currentTime) => {
      if (!startTime) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      // Smooth ease-out animation
      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(
        easedProgress * target
      );

      setCount(currentValue);

      if (progress < 1) {
        animationRef.current =
          requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    setCount(0);

    animationRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );
      }
    };
  }, [isVisible, target]);

  return (
    <strong ref={ref}>
      {count}+
    </strong>
  );
};

const Stats = () => {
  return (
    <section className="stats" id="impact">

      <div className="container stats-container">

        {/* INTRO */}

        <div className="stats-intro">

          <PeopleIcon />

          <div>
            <span>Together, We Can</span>

            <strong>
              Make a Difference
            </strong>
          </div>

        </div>

        {/* STATISTICS */}

        <div className="stats-grid">

          {stats.map(
            ({ icon: Icon, number, text }) => (
              <div
                className="stat-item"
                key={text}
              >

                <Icon />

                <CountUp
                  target={number}
                />

                <span>
                  {text}
                </span>

              </div>
            )
          )}

        </div>

      </div>

    </section>
  );
};

export default Stats;