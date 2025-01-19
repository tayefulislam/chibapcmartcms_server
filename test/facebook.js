require("dotenv").config();
const axios = require("axios");

const FACEBOOK_ACCESS_TOKEN = process.env.URI;
console.log(FACEBOOK_ACCESS_TOKEN);

async function getProfilePicture(profileId) {
  const FACEBOOK_PROFILE_URL = `https://graph.facebook.com/v11.0/${profileId}/picture?type=large&redirect=false&access_token=${FACEBOOK_ACCESS_TOKEN}`;
  try {
    const response = await axios.get(FACEBOOK_PROFILE_URL);
    const pictureURL = response.data.data.url;
    console.log("Profile Picture URL:", pictureURL);
  } catch (error) {
    console.error("Error fetching profile picture:", error);
  }
}

const profileLink = "https://www.facebook.com/100069893709932"; // replace with the actual profile link
const profileId = profileLink.split("/").pop();
getProfilePicture(profileId);
