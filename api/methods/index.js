import axios from "axios";

const { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } = require("plaid");
const moment = require("moment");
const client = createPlaidClient();

// Configures and Creates a Plaid API client using environment variables. 
// Hard-coded to Plaid Version 2020-09-14. 
function createPlaidClient() {
  try {
    const configuration = new Configuration({
      basePath: PlaidEnvironments["development"],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
          'PLAID-SECRET': process.env.PLAID_SECRET, 
          'Plaid-Version': '2020-09-14',
        }
      }
    });
    const client = new PlaidApi(configuration);
    return client;
  } catch(error) {
    return error;
  }
}

export const getUserToken = async (req, res, next) => {

  const { body } = req;
  const { userId } = body; 

  if (!userId) {
    res.status(400).send({ error: `userId field is required.` });
  } else {
    const data = {
      client_id: process.env.LINK_MONEY_CLIENT_ID, // Issued from the Link Money API Developer Portal
      client_secret: process.env.LINK_MONEY_CLIENT_SECRET, // Issued from the Link Money API Developer Portal
      audience: "https://link-money-api/",
      grant_type: "client_credentials",
      organization: "switchkit", // a test organization name for this demo. Do not alter this - doing so will interfere with your token's permissions and ability to load the proper Yodlee Fastlink OB configuration.
      user_id: userId
    }

    try { 
      const response = await axios.post(process.env.LINK_MONEY_AUTHENTICATION_URL, data);
      const { data: tokenData } = response;
      res.status(200).send(tokenData);
    } catch(error) {
      res.status(500).send({ error });
    } 
  }
}

// exchanges a public token for a item-specific access_token. This runs after the Plaid Link successfully connects an account.
export const exchangeForPublicToken = async (req, res, next) => {
  const { body } = req;
  const { public_token } = body;
  if (!public_token) {
    res.status(400).send({ error: "`public_token` field missing." });
  } else {

    try {
      const response = await client.itemPublicTokenExchange({
        public_token,
      });

      const { data } = response;
      const { item_id, access_token } = data; 
      res.status(200).send({ item_id, access_token });

    } catch(error) {
      res.status(500).send({ error });
    }
  }
}

// gets accounts manually from Plaid using an item-specific access token.
export const getAccounts = async (req, res, next) => {
  try {
    const { body } = req;
    const { access_token } = body; 
    const accountsResponse = await client.accountsGet({
      access_token
    });

    res.status(200).send(accountsResponse.data);
    
  } catch (error) {
    res.status(500).send({ error });
  }
}

// Retrieves a max of 250 transactions within a 30 days from call time, using an item-specific access token.
export const getTransactions = async (req, res, next) => {
  try {
    const { body } = req;
    const { access_token } = body;
    const { start_date, end_date } = getThirtyDayTimeBracket();
    const transactionsResponse = await client.transactionsGet({
      access_token,
      start_date,
      end_date,     
      options: {
        count: 250,
        offset: 0,
      }
    
    });
    res.status(200).send(transactionsResponse.data);
  } catch (error) {
    res.status(500).send({ error });
  }
}

// Helper function: Gets YYYY-MM-DD formatted date brackets for the last 30 days.
function getThirtyDayTimeBracket() {
  const now = moment();
  const today = now.format("YYYY-MM-DD");
  const thirtyDaysAgo = now.subtract(30, 'days').format("YYYY-MM-DD");

  return { start_date: thirtyDaysAgo, end_date: today };
}