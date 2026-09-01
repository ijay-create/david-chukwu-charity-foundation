import { useEffect, useState } from "react";

import Hero from "../components/Hero";
import About from "../components/About";
import Causes from "../components/Causes";
import Stats from "../components/Stats";
import Featured from "../components/Featured";
import CTA from "../components/CTA";
import DonationModal from "../components/DonationModal";
import Newsletter from "../components/Newsletter";

import API from "../api/axios";

/*
|--------------------------------------------------------------------------
| DEFAULT HOMEPAGE SETTINGS
|--------------------------------------------------------------------------
*/

const defaultSettings = {
  homepage: {
    /*
    |--------------------------------------------------------------------------
    | HERO
    |--------------------------------------------------------------------------
    */

    hero: {
      eyebrow: "Bringing Hope,",
      title: "Support and Change",
      description:
        "At David Chukwu Charity Foundation, we are committed to touching lives, restoring dignity, and creating opportunities for vulnerable individuals within our communities.",
      primaryButtonText: "DONATE NOW",
      secondaryButtonText: "LEARN MORE",
      image: ""
    },

    /*
    |--------------------------------------------------------------------------
    | ABOUT
    |--------------------------------------------------------------------------
    */

    about: {
      eyebrow: "WHO WE ARE",
      title: "Building Stronger Communities Together",
      description:
        "We believe every person deserves the opportunity to live a better life.",
      buttonText: "LEARN MORE",
      image: ""
    },

    /*
    |--------------------------------------------------------------------------
    | CAUSES
    |--------------------------------------------------------------------------
    */

    causes: {
      eyebrow: "OUR CAUSE",
      title: "Who We Support",
      description:
        "Our programs focus on people and communities who need support the most."
    },

    /*
    |--------------------------------------------------------------------------
    | STATS
    |--------------------------------------------------------------------------
    */

    stats: {
      livesSupported: 412,
      communitiesReached: 13,
      outreachPrograms: 7,
      volunteers: 38
    },

    /*
    |--------------------------------------------------------------------------
    | FEATURED
    |--------------------------------------------------------------------------
    */

    featured: {
      eyebrow: "FEATURED INITIATIVE",
      title: "Supporting Those Who Need Us Most",
      description:
        "We run various programs that directly impact lives - from providing essential items and education support to empowerment and community development.",
      buttonText: "VIEW OUR IMPACT →",
      image: ""
    },

    /*
    |--------------------------------------------------------------------------
    | CTA
    |--------------------------------------------------------------------------
    */

    cta: {
      eyebrow: "MAKE A DIFFERENCE",
      title: "Your Support Can Change a Life",
      description:
        "Whether through giving, volunteering or partnership, you can help us extend hope and support to more people.",
      buttonText: "DONATE NOW"
    }
  }
};

/*
|--------------------------------------------------------------------------
| HOME
|--------------------------------------------------------------------------
*/

const Home = () => {
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  const [settings, setSettings] = useState(
    defaultSettings
  );

  const [loadingSettings, setLoadingSettings] =
    useState(true);

  /*
  |--------------------------------------------------------------------------
  | LOAD SETTINGS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const response = await API.get("/settings");

        if (
          mounted &&
          response.data?.success &&
          response.data?.settings
        ) {
          const serverSettings =
            response.data.settings;

          setSettings((previous) => ({
            ...previous,

            /*
            |--------------------------------------------------------------------------
            | HOMEPAGE
            |--------------------------------------------------------------------------
            */

            homepage: {
              ...previous.homepage,
              ...serverSettings.homepage,

              /*
              |--------------------------------------------------------------------------
              | HERO
              |--------------------------------------------------------------------------
              */

              hero: {
                ...previous.homepage.hero,
                ...serverSettings.homepage?.hero
              },

              /*
              |--------------------------------------------------------------------------
              | ABOUT
              |--------------------------------------------------------------------------
              */

              about: {
                ...previous.homepage.about,
                ...serverSettings.homepage?.about
              },

              /*
              |--------------------------------------------------------------------------
              | CAUSES
              |--------------------------------------------------------------------------
              */

              causes: {
                ...previous.homepage.causes,
                ...serverSettings.homepage?.causes
              },

              /*
              |--------------------------------------------------------------------------
              | STATS
              |--------------------------------------------------------------------------
              */

              stats: {
                ...previous.homepage.stats,
                ...serverSettings.homepage?.stats
              },

              /*
              |--------------------------------------------------------------------------
              | FEATURED
              |--------------------------------------------------------------------------
              */

              featured: {
                ...previous.homepage.featured,
                ...serverSettings.homepage?.featured
              },

              /*
              |--------------------------------------------------------------------------
              | CTA
              |--------------------------------------------------------------------------
              */

              cta: {
                ...previous.homepage.cta,
                ...serverSettings.homepage?.cta
              }
            }
          }));
        }
      } catch (error) {
        console.error(
          "LOAD PUBLIC SETTINGS ERROR:",
          error
        );
      } finally {
        if (mounted) {
          setLoadingSettings(false);
        }
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | DONATION MODAL
  |--------------------------------------------------------------------------
  */

  const openDonation = () => {
    setIsDonationOpen(true);
  };

  const closeDonation = () => {
    setIsDonationOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | HOMEPAGE SETTINGS
  |--------------------------------------------------------------------------
  */

  const homepage = settings.homepage;

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loadingSettings) {
    return (
      <main className="home-loading">
        <span>Loading...</span>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <>
      <main>

        {/* =========================================================
            HERO
        ========================================================= */}

        <Hero
          settings={homepage.hero}
          onDonateClick={openDonation}
        />

        {/* =========================================================
            ABOUT
        ========================================================= */}

        <About
          settings={homepage.about}
        />

        {/* =========================================================
            CAUSES
        ========================================================= */}

        <Causes
          settings={homepage.causes}
        />

        {/* =========================================================
            STATS
        ========================================================= */}

        <Stats
          settings={homepage.stats}
        />

        {/* =========================================================
            FEATURED
        ========================================================= */}

        <Featured
          settings={homepage.featured}
        />

        {/* =========================================================
            CTA
        ========================================================= */}

        <CTA
          settings={homepage.cta}
          onDonateClick={openDonation}
        />

        {/* =========================================================
            NEWSLETTER
        ========================================================= */}

        <Newsletter />

      </main>

      {/* =========================================================
          DONATION MODAL
      ========================================================= */}

      {isDonationOpen && (
        <DonationModal
          onClose={closeDonation}
        />
      )}
    </>
  );
};

export default Home;