import axios from "axios";
import moment from "moment";

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

// Retrieves a max of 250 transactions within a 30 days from call time, using an item-specific access token.
export const getTransactions = async (req, res, next) => {
  // parse the request for the Item ID
  const { body } = req;
  const { accessToken } = body;

  const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  const endDate = moment().format('YYYY-MM-DD');

  const data = {
    start_date: startDate,
    end_date: endDate,
    options: {
      count: 250,
      offset: 0,
    },
  }

  const callConfig = { 
    method: "POST",
    url: `${process.env.LINK_MONEY_API_BASE_URL}/v1/plaid/transactions/get`,
    headers: {
      'Content-Type': "application/json",
      Authorization: "Bearer " + accessToken
    },
    data
  }

  try {
    const transactionsResponse = await axios(callConfig);
    res.send(transactionsResponse.data)
  } catch(error) {
    res.status(400)
  }
}

export const getItemToken = async (req, res, next) => {

  const { body } = req;
  const { itemId } = body; 

  if (!itemId) {
    res.status(400).send({ error: `itemId field is required.` });
  } else {
    const data = {
      client_id: process.env.LINK_MONEY_CLIENT_ID, // Issued from the Link Money API Developer Portal
      client_secret: process.env.LINK_MONEY_CLIENT_SECRET, // Issued from the Link Money API Developer Portal
      audience: "https://link-money-api/",
      grant_type: "client_credentials",
      organization: "switchkit", // a test organization name for this demo. Do not alter this - doing so will interfere with your token's permissions and ability to load the proper Yodlee Fastlink OB configuration.
      item_id: itemId
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
