const DonationAccount = require("../models/DonationAccount");

/*
|--------------------------------------------------------------------------
| CONSTANTS
|--------------------------------------------------------------------------
*/

const MAX_ACCOUNTS = 2;


/*
|--------------------------------------------------------------------------
| HELPER
|--------------------------------------------------------------------------
*/

const getNextAvailableSlot = async () => {
  const accounts = await DonationAccount.find(
    {},
    { order: 1 }
  ).lean();

  const usedSlots = accounts.map(
    (account) => Number(account.order)
  );

  if (!usedSlots.includes(1)) {
    return 1;
  }

  if (!usedSlots.includes(2)) {
    return 2;
  }

  return null;
};


/*
|--------------------------------------------------------------------------
| GET ACTIVE DONATION ACCOUNTS
|--------------------------------------------------------------------------
|
| PUBLIC ENDPOINT
|
| Only active accounts are returned.
|
*/

const getDonationAccounts = async (req, res) => {
  try {
    const accounts = await DonationAccount.find({
      active: true,
      order: {
        $in: [1, 2],
      },
    })
      .sort({
        order: 1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      data: accounts,
    });

  } catch (error) {

    console.error(
      "GET DONATION ACCOUNTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch donation accounts.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET ALL DONATION ACCOUNTS
|--------------------------------------------------------------------------
|
| ADMIN ENDPOINT
|
*/

const getAllDonationAccounts = async (req, res) => {
  try {

    const accounts =
      await DonationAccount.find()
        .sort({
          order: 1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      data: accounts,
    });

  } catch (error) {

    console.error(
      "GET ALL DONATION ACCOUNTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch donation accounts.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| CREATE DONATION ACCOUNT
|--------------------------------------------------------------------------
|
| The backend automatically chooses Account 1 or Account 2.
|
*/

const createDonationAccount = async (req, res) => {
  try {

    const {
      bank,
      name,
      number,
      active,
      order,
    } = req.body;


    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    if (!bank || !name || !number) {

      return res.status(400).json({
        success: false,
        message:
          "Bank name, account name and account number are required.",
      });
    }


    const cleanBank =
      String(bank).trim();

    const cleanName =
      String(name).trim();

    const cleanNumber =
      String(number).trim();


    if (!/^\d{10}$/.test(cleanNumber)) {

      return res.status(400).json({
        success: false,
        message:
          "Account number must contain exactly 10 digits.",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | DETERMINE ACCOUNT SLOT
    |--------------------------------------------------------------------------
    |
    | If order is supplied, use it.
    |
    | Otherwise automatically find the
    | first available slot.
    |
    */

    let accountOrder =
      Number(order);


    if (
      accountOrder !== 1 &&
      accountOrder !== 2
    ) {

      accountOrder =
        await getNextAvailableSlot();

    }


    /*
    |--------------------------------------------------------------------------
    | BOTH SLOTS ALREADY USED
    |--------------------------------------------------------------------------
    */

    if (
      accountOrder !== 1 &&
      accountOrder !== 2
    ) {

      return res.status(409).json({
        success: false,
        message:
          "Both donation account slots are already configured.",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | CHECK SLOT
    |--------------------------------------------------------------------------
    */

    const existingAccount =
      await DonationAccount.findOne({
        order: accountOrder,
      });


    if (existingAccount) {

      return res.status(409).json({
        success: false,
        message:
          `Account ${accountOrder} is already configured. Please edit the existing account.`,
      });
    }


    /*
    |--------------------------------------------------------------------------
    | CREATE
    |--------------------------------------------------------------------------
    */

    const account =
      await DonationAccount.create({
        bank: cleanBank,

        name: cleanName,

        number: cleanNumber,

        active:
          typeof active === "boolean"
            ? active
            : true,

        order: accountOrder,
      });


    return res.status(201).json({
      success: true,

      message:
        `Account ${accountOrder} created successfully.`,

      data: account,
    });

  } catch (error) {

    console.error(
      "CREATE DONATION ACCOUNT ERROR:",
      error
    );


    /*
    |--------------------------------------------------------------------------
    | DUPLICATE SLOT
    |--------------------------------------------------------------------------
    */

    if (error.code === 11000) {

      return res.status(409).json({
        success: false,
        message:
          "That donation account slot is already configured.",
      });
    }


    return res.status(500).json({
      success: false,
      message:
        "Unable to create donation account.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE DONATION ACCOUNT
|--------------------------------------------------------------------------
*/

const updateDonationAccount = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const {
      bank,
      name,
      number,
      active,
      order,
    } = req.body;


    const account =
      await DonationAccount.findById(id);


    if (!account) {

      return res.status(404).json({
        success: false,
        message:
          "Donation account not found.",
      });
    }


    /*
    |--------------------------------------------------------------------------
    | BANK
    |--------------------------------------------------------------------------
    */

    if (bank !== undefined) {

      const cleanBank =
        String(bank).trim();

      if (!cleanBank) {

        return res.status(400).json({
          success: false,
          message:
            "Bank name cannot be empty.",
        });
      }

      account.bank = cleanBank;
    }


    /*
    |--------------------------------------------------------------------------
    | ACCOUNT NAME
    |--------------------------------------------------------------------------
    */

    if (name !== undefined) {

      const cleanName =
        String(name).trim();

      if (!cleanName) {

        return res.status(400).json({
          success: false,
          message:
            "Account name cannot be empty.",
        });
      }

      account.name = cleanName;
    }


    /*
    |--------------------------------------------------------------------------
    | ACCOUNT NUMBER
    |--------------------------------------------------------------------------
    */

    if (number !== undefined) {

      const cleanNumber =
        String(number).trim();

      if (!/^\d{10}$/.test(cleanNumber)) {

        return res.status(400).json({
          success: false,
          message:
            "Account number must contain exactly 10 digits.",
        });
      }

      account.number = cleanNumber;
    }


    /*
    |--------------------------------------------------------------------------
    | ACTIVE
    |--------------------------------------------------------------------------
    */

    if (active !== undefined) {

      account.active =
        Boolean(active);

    }


    /*
    |--------------------------------------------------------------------------
    | ORDER
    |--------------------------------------------------------------------------
    */

    if (order !== undefined) {

      const newOrder =
        Number(order);


      if (
        newOrder !== 1 &&
        newOrder !== 2
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Account slot must be either 1 or 2.",
        });
      }


      /*
      |----------------------------------------------------------------------
      | CHECK IF ANOTHER ACCOUNT ALREADY USES SLOT
      |----------------------------------------------------------------------
      */

      const duplicate =
        await DonationAccount.findOne({
          order: newOrder,
          _id: {
            $ne: account._id,
          },
        });


      if (duplicate) {

        return res.status(409).json({
          success: false,
          message:
            `Account ${newOrder} is already configured.`,
        });
      }


      account.order =
        newOrder;
    }


    await account.save();


    return res.status(200).json({
      success: true,

      message:
        `Account ${account.order} updated successfully.`,

      data: account,
    });

  } catch (error) {

    console.error(
      "UPDATE DONATION ACCOUNT ERROR:",
      error
    );


    if (error.code === 11000) {

      return res.status(409).json({
        success: false,
        message:
          "That account slot is already being used.",
      });
    }


    return res.status(500).json({
      success: false,
      message:
        "Unable to update donation account.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| DELETE DONATION ACCOUNT
|--------------------------------------------------------------------------
*/

const deleteDonationAccount = async (
  req,
  res
) => {

  try {

    const { id } = req.params;


    const account =
      await DonationAccount.findByIdAndDelete(id);


    if (!account) {

      return res.status(404).json({
        success: false,
        message:
          "Donation account not found.",
      });
    }


    return res.status(200).json({
      success: true,

      message:
        `Account ${account.order} deleted successfully.`,
    });

  } catch (error) {

    console.error(
      "DELETE DONATION ACCOUNT ERROR:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        "Unable to delete donation account.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {

  getDonationAccounts,

  getAllDonationAccounts,

  createDonationAccount,

  updateDonationAccount,

  deleteDonationAccount,

};