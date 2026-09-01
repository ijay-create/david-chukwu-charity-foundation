import { useState } from "react";

import Hero from "../components/Hero";
import About from "../components/About";
import Causes from "../components/Causes";
import Stats from "../components/Stats";
import Featured from "../components/Featured";
import CTA from "../components/CTA";
import DonationModal from "../components/DonationModal";

const Home = () => {
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  const openDonation = () => {
    setIsDonationOpen(true);
  };

  const closeDonation = () => {
    setIsDonationOpen(false);
  };

  return (
    <>
      <main>
        <Hero onDonateClick={openDonation} />

        <About />

        <Causes />

        <Stats />

        <Featured />

        <CTA
          onDonateClick={openDonation}
        />
      </main>

      {isDonationOpen && (
        <DonationModal
          onClose={closeDonation}
        />
      )}
    </>
  );
};

export default Home;