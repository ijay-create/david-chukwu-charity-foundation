require("dotenv").config();

const mongoose = require("mongoose");

const DonationAccount = require("./models/DonationAccount");


/*
|--------------------------------------------------------------------------
| DONATION ACCOUNT CONFIGURATION
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Replace the placeholder values below with the foundation's
| REAL banking information.
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| ACCOUNT 1
|--------------------------------------------------------------------------
|
| Account 1 already exists in your database.
| These values are ONLY used if Account 1 does not exist.
|
*/

const ACCOUNT_1 = {
  bank: "YOUR REAL ACCOUNT 1 BANK",
  name: "David Chukwu Charity Foundation",
  number: "YOUR_REAL_10_DIGIT_ACCOUNT_1_NUMBER",
  active: true,
  order: 1,
};


/*
|--------------------------------------------------------------------------
| ACCOUNT 2
|--------------------------------------------------------------------------
|
| THIS IS THE ACCOUNT THAT IS CURRENTLY MISSING.
|
| Replace the three values below with the real information.
|
*/

const ACCOUNT_2 = {
  bank: "YOUR REAL ACCOUNT 2 BANK",
  name: "David Chukwu Charity Foundation",
  number: "YOUR_REAL_10_DIGIT_ACCOUNT_2_NUMBER",
  active: true,
  order: 2,
};


/*
|--------------------------------------------------------------------------
| VALIDATE ACCOUNT CONFIGURATION
|--------------------------------------------------------------------------
*/

const validateAccount = (
  account,
  accountNumber
) => {

  if (
    !account.bank ||
    account.bank.includes("YOUR REAL")
  ) {

    throw new Error(
      `Account ${accountNumber}: Please enter the real bank name.`
    );

  }


  if (
    !account.name ||
    account.name.trim().length === 0
  ) {

    throw new Error(
      `Account ${accountNumber}: Account name is required.`
    );

  }


  if (
    !/^\d{10}$/.test(
      account.number
    )
  ) {

    throw new Error(
      `Account ${accountNumber}: Account number must contain exactly 10 digits.`
    );

  }


  if (
    account.order !== accountNumber
  ) {

    throw new Error(
      `Account ${accountNumber}: Invalid account slot.`
    );

  }

};


/*
|--------------------------------------------------------------------------
| SEED DONATION ACCOUNTS
|--------------------------------------------------------------------------
*/

const seedDonationAccounts = async () => {

  try {

    /*
    |--------------------------------------------------------------------------
    | VALIDATE ENVIRONMENT
    |--------------------------------------------------------------------------
    */

    if (!process.env.MONGO_URI) {

      throw new Error(
        "MONGO_URI is missing from your .env file."
      );

    }


    /*
    |--------------------------------------------------------------------------
    | VALIDATE ACCOUNT 1
    |--------------------------------------------------------------------------
    */

    validateAccount(
      ACCOUNT_1,
      1
    );


    /*
    |--------------------------------------------------------------------------
    | VALIDATE ACCOUNT 2
    |--------------------------------------------------------------------------
    */

    validateAccount(
      ACCOUNT_2,
      2
    );


    /*
    |--------------------------------------------------------------------------
    | CONNECT TO MONGODB
    |--------------------------------------------------------------------------
    */

    console.log(
      "\nConnecting to MongoDB..."
    );


    await mongoose.connect(
      process.env.MONGO_URI
    );


    console.log(
      "MongoDB connected successfully."
    );


    /*
    |--------------------------------------------------------------------------
    | ACCOUNT 1
    |--------------------------------------------------------------------------
    */

    let account1 =
      await DonationAccount.findOne({
        order: 1,
      });


    if (!account1) {

      account1 =
        await DonationAccount.create(
          ACCOUNT_1
        );


      console.log(
        "✓ Account 1 created successfully."
      );

    } else {

      console.log(
        "✓ Account 1 already exists."
      );

    }


    /*
    |--------------------------------------------------------------------------
    | ACCOUNT 2
    |--------------------------------------------------------------------------
    |
    | THIS IS THE IMPORTANT PART.
    |
    | If Account 2 does not exist, it is automatically created.
    |
    */

    let account2 =
      await DonationAccount.findOne({
        order: 2,
      });


    if (!account2) {

      account2 =
        await DonationAccount.create(
          ACCOUNT_2
        );


      console.log(
        "✓ Account 2 created successfully."
      );

    } else {

      console.log(
        "✓ Account 2 already exists."
      );

    }


    /*
    |--------------------------------------------------------------------------
    | VERIFY DATABASE
    |--------------------------------------------------------------------------
    */

    const accounts =
      await DonationAccount.find({
        order: {
          $in: [1, 2],
        },
      })
        .sort({
          order: 1,
        });


    /*
    |--------------------------------------------------------------------------
    | DISPLAY RESULTS
    |--------------------------------------------------------------------------
    */

    console.log(
      "\n========================================"
    );

    console.log(
      "DONATION ACCOUNTS"
    );

    console.log(
      "========================================"
    );


    accounts.forEach(
      (account) => {

        console.log(
          `\nACCOUNT ${account.order}`
        );

        console.log(
          `Bank: ${account.bank}`
        );

        console.log(
          `Name: ${account.name}`
        );

        console.log(
          `Number: ${account.number}`
        );

        console.log(
          `Active: ${account.active}`
        );

        console.log(
          `Order: ${account.order}`
        );

      }
    );


    /*
    |--------------------------------------------------------------------------
    | VERIFY BOTH ACCOUNTS EXIST
    |--------------------------------------------------------------------------
    */

    const account1Exists =
      accounts.some(
        (account) =>
          Number(account.order) === 1
      );


    const account2Exists =
      accounts.some(
        (account) =>
          Number(account.order) === 2
      );


    console.log(
      "\n========================================"
    );


    if (
      account1Exists &&
      account2Exists
    ) {

      console.log(
        "✓ BOTH DONATION ACCOUNTS ARE CONFIGURED."
      );

      console.log(
        "✓ ACCOUNT 1 → order 1"
      );

      console.log(
        "✓ ACCOUNT 2 → order 2"
      );

    } else {

      console.log(
        "⚠ DONATION ACCOUNT CONFIGURATION IS INCOMPLETE."
      );

    }


    console.log(
      "========================================\n"
    );


    /*
    |--------------------------------------------------------------------------
    | DISCONNECT
    |--------------------------------------------------------------------------
    */

    await mongoose.disconnect();


    console.log(
      "MongoDB disconnected."
    );


    process.exit(0);

  } catch (error) {

    console.error(
      "\n========================================"
    );

    console.error(
      "DONATION ACCOUNT SEED ERROR"
    );

    console.error(
      "========================================"
    );

    console.error(
      error.message
    );


    /*
    |--------------------------------------------------------------------------
    | DISCONNECT SAFELY
    |--------------------------------------------------------------------------
    */

    if (
      mongoose.connection.readyState !== 0
    ) {

      await mongoose.disconnect();

    }


    process.exit(1);
  }
};


/*
|--------------------------------------------------------------------------
| RUN SEED
|--------------------------------------------------------------------------
*/

seedDonationAccounts();