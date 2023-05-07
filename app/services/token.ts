/**
 * @file Token
 * @module service.token

 */

import storage from "./storage";

const TOKEN_STORAGE_KEY = "auth";
const TOKEN_BIRTH_TIME = "token_birth_time";
const TOKEN_EXPIRES_IN = "token_expires_in";

export const getToken = async () => {
  return await storage.get("token");
};

export const setToken = async (
  token: string,
  expires_in: number
): Promise<void> => {
  await storage.set(TOKEN_STORAGE_KEY, token);
  await storage.set(TOKEN_EXPIRES_IN, String(expires_in));
  await storage.set(TOKEN_BIRTH_TIME, String(+new Date() / 1000));
};

export const removeToken = async () => {
  await storage.remove(TOKEN_STORAGE_KEY);
  await storage.remove(TOKEN_EXPIRES_IN);
  await storage.remove(TOKEN_BIRTH_TIME);
};

export const isTokenValid = async () => {
  const token = await getToken();
  const tokenIsOk = token?.split(".").length === 3;
  return tokenIsOk;
};

const token = {
  getToken,
  setToken,
  removeToken,
  isTokenValid,
};

export default token;
