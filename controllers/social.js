import axios from 'axios';

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

export const facebookLoginHandler = async (req, res) => {
  const appAccessToken = await getAppAccessToken();
  const scopes = await debugToken(appAccessToken, req.params.facebooktoken);
  console.log({ scopes });
  res.json({ scopes });
};

const getAppAccessToken = async () => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}`
    );
    const { access_token } = response.data;
    return access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
  }
};

const debugToken = async (appAccessToken, token) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v11.0/debug_token?input_token=${token}&access_token=${appAccessToken}`
    );
    const { data } = response.data;
    const scopes = data.scopes;
    return scopes;
  } catch (error) {
    console.error('Error fetching token information:', error);
  }
};
