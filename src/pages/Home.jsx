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
    hero: {
      eyebrow: "Bringing Hope,",
      title: "Support and Change",
      description:
        "At David Chukwu Charity Foundation, we are committed to touching lives, restoring dignity, and creating opportunities for vulnerable individuals within our communities.",
      primaryButtonText: "DONATE NOW",
      secondaryButtonText: "LEARN MORE",
      image: "",
    },

    about: {
      eyebrow: "WHO WE ARE",
      title: "Building Stronger Communities Together",
      description:
        "We believe every person deserves the opportunity to live a better life.",
      buttonText: "LEARN MORE",
      image: "",
    },

    causes: {
      eyebrow: "OUR CAUSE",
      title: "Who We Support",
      description:
        "Our programs focus on people and communities who need support the most.",
      items: [],
    },

    stats: {
      livesSupported: 412,
      communitiesReached: 13,
      outreachPrograms: 7,
      volunteers: 38,
    },

    featured: {
      eyebrow: "FEATURED INITIATIVE",
      title: "Supporting Those Who Need Us Most",
      description:
        "We run various programs that directly impact lives - from providing essential items and education support to empowerment and community development.",
      buttonText: "VIEW OUR IMPACT →",
      image: "",
    },

    cta: {
      eyebrow: "MAKE A DIFFERENCE",
      title: "Your Support Can Change a Life",
      description:
        "Whether through giving, volunteering or partnership, you can help us extend hope and support to more people.",
      buttonText: "DONATE NOW",
      image: "",
    },
  },
};

/*
|--------------------------------------------------------------------------
| MERGE HOMEPAGE SETTINGS
|--------------------------------------------------------------------------
|
| Server settings override the defaults while preserving any fields that
| may not yet exist in MongoDB.
|
|--------------------------------------------------------------------------
*/

const mergeHomepageSettings = (
  previousHomepage,
  serverHomepage
) => {
  if (!serverHomepage) {
    return previousHomepage;
  }

  return {
    ...previousHomepage,
    ...serverHomepage,

    hero: {
      ...previousHomepage.hero,
      ...serverHomepage.hero,
    },

    about: {
      ...previousHomepage.about,
      ...serverHomepage.about,
    },

    causes: {
      ...previousHomepage.causes,
      ...serverHomepage.causes,

      items: Array.isArray(
        serverHomepage.causes?.items
      )
        ? serverHomepage.causes.items
        : previousHomepage.causes.items,
    },

    stats: {
      ...previousHomepage.stats,
      ...serverHomepage.stats,
    },

    featured: {
      ...previousHomepage.featured,
      ...serverHomepage.featured,
    },

    cta: {
      ...previousHomepage.cta,
      ...serverHomepage.cta,
    },
  };
};

/*
|--------------------------------------------------------------------------
| HOME
|--------------------------------------------------------------------------
*/

const Home = () => {
  /*
  |--------------------------------------------------------------------------
  | DONATION MODAL
  |--------------------------------------------------------------------------
  */

  const [
    isDonationOpen,
    setIsDonationOpen,
  ] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | HOMEPAGE SETTINGS
  |--------------------------------------------------------------------------
  */

  const [settings, setSettings] =
    useState(defaultSettings);

  const [
    loadingSettings,
    setLoadingSettings,
  ] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | LOAD PUBLIC HOMEPAGE SETTINGS
  |--------------------------------------------------------------------------
  |
  | Public settings come from MongoDB through:
  |
  | GET /api/settings
  |
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const response =
          await API.get("/settings");

        console.log(
          "PUBLIC SETTINGS RESPONSE:",
          response.data
        );

        /*
        |--------------------------------------------------------------------------
        | MAKE SURE COMPONENT IS STILL MOUNTED
        |--------------------------------------------------------------------------
        */

        if (!mounted) {
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | VALIDATE RESPONSE
        |--------------------------------------------------------------------------
        */

        if (
          !response.data?.success ||
          !response.data?.settings
        ) {
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | SERVER SETTINGS
        |--------------------------------------------------------------------------
        */

        const serverSettings =
          response.data.settings;

        /*
        |--------------------------------------------------------------------------
        | MERGE SERVER DATA WITH DEFAULTS
        |--------------------------------------------------------------------------
        */

        setSettings((previous) => ({
          ...previous,

          homepage:
            mergeHomepageSettings(
              previous.homepage,
              serverSettings.homepage
            ),
        }));
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
  | OPEN DONATION MODAL
  |--------------------------------------------------------------------------
  */

  const openDonation = () => {
    setIsDonationOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | CLOSE DONATION MODAL
  |--------------------------------------------------------------------------
  */

  const closeDonation = () => {
    setIsDonationOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | HOMEPAGE DATA
  |--------------------------------------------------------------------------
  */

  const homepage =
    settings?.homepage ||
    defaultSettings.homepage;

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
  | RENDER HOMEPAGE
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