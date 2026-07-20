import { OAuth2Client } from "google-auth-library";
import axios from "axios";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface GoogleUserInfo {
  email: string;
  name: string;
  picture?: string;
  providerId: string;
}

export interface FacebookUserInfo {
  email: string;
  name: string;
  picture?: string;
  providerId: string;
}

export const verifyGoogleToken = async (idToken: string): Promise<GoogleUserInfo> => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error("Invalid Google token");
  }

  return {
    email: payload.email!,
    name: payload.name || "",
    picture: payload.picture,
    providerId: payload.sub,
  };
};

export const verifyFacebookToken = async (accessToken: string): Promise<FacebookUserInfo> => {
  const response = await axios.get(
    `https://graph.facebook.com/me?fields=id,name,email,picture.width(200)&access_token=${accessToken}`
  );

  const { id, name, email, picture } = response.data;

  if (!email) {
    throw new Error("Facebook account does not have an email. Please use another login method.");
  }

  return {
    email,
    name: name || "",
    picture: picture?.data?.url,
    providerId: id,
  };
};
