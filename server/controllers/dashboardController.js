const Donation = require("../models/Donation");
const ContactMessage = require("../models/ContactMessage");
const GalleryItem = require("../models/GalleryItem");
const Outreach = require("../models/Outreach");

/*
|--------------------------------------------------------------------------
| GET DASHBOARD STATS
|--------------------------------------------------------------------------
| GET /api/dashboard/stats
|--------------------------------------------------------------------------
*/

const getDashboardStats = async (req, res) => {
  try {
    const [
      donations,
      unreadMessages,
      galleryItems,
      activePrograms
    ] = await Promise.all([
      Donation.find()
        .sort({ date: -1 })
        .lean(),

      ContactMessage.countDocuments({
        status: "Unread"
      }),

      GalleryItem.countDocuments(),

      Outreach.countDocuments({
        status: "Active"
      })
    ]);

    /*
    |--------------------------------------------------------------------------
    | DONATION STATISTICS
    |--------------------------------------------------------------------------
    */

    const totalDonations = donations.reduce(
      (total, donation) => {
        return total + Number(donation.amount || 0);
      },
      0
    );

    const completedDonations = donations.filter(
      (donation) =>
        donation.status === "Completed"
    ).length;

    const pendingDonations = donations.filter(
      (donation) =>
        donation.status === "Pending"
    ).length;

    const failedDonations = donations.filter(
      (donation) =>
        donation.status === "Failed"
    ).length;

    /*
    |--------------------------------------------------------------------------
    | RECENT DONATIONS
    |--------------------------------------------------------------------------
    */

    const recentDonations =
      donations.slice(0, 5).map((donation) => ({
        id: donation._id,
        reference:
          donation.reference || "N/A",
        donorName:
          donation.donorName,
        amount:
          Number(donation.amount || 0),
        currency:
          donation.currency || "GBP",
        status:
          donation.status,
        date:
          donation.date || donation.createdAt
      }));

    /*
    |--------------------------------------------------------------------------
    | RECENT CONTACT MESSAGES
    |--------------------------------------------------------------------------
    */

    const recentMessages =
      await ContactMessage.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "name email subject message type status createdAt"
        )
        .lean();

    /*
    |--------------------------------------------------------------------------
    | RESPONSE
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,

      stats: {
        totalDonations,
        donationCount:
          donations.length,

        completedDonations,
        pendingDonations,
        failedDonations,

        unreadMessages,

        galleryItems,

        activePrograms,

        activeVolunteers: 0
      },

      recentDonations,

      recentMessages
    });
  } catch (error) {
    console.error(
      "Dashboard stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load dashboard statistics."
    });
  }
};

module.exports = {
  getDashboardStats
};