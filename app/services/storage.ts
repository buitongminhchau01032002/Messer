/**
 * @file Local storage
 * @module service.storage

 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const get = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== undefined) {
      // value previously stored
      return value;
    }
  } catch (e) {
    console.log(e);
    // error reading value
    return undefined;
  }
};
export const set = async (key: string, data: string) => {
  try {
    return await AsyncStorage.setItem(key, data);
  } catch (e) {
    // saving error
    console.log(e);
    return undefined;
  }
};
export const remove = async (key: string) => {
  try {
    return await AsyncStorage.removeItem(key);
  } catch (e) {
    // removing error
    console.log(e);
    return undefined;
  }
};

export const setJSON = async (key: string, data: any) => {
  try {
    return await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // saving error
    console.log(e);
    return undefined;
  }
};
export const getJSON = async <T = any>(
  key: string,
): Promise<Awaited<T> | undefined> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != undefined ? JSON.parse(jsonValue) : undefined;
  } catch (e) {
    // error reading value
    console.log(e);
    return undefined;
  }
};
export const getAllKey = async (): Promise<readonly string[] | undefined> => {
  try {
    const result = await AsyncStorage.getAllKeys();
    return result;
  } catch (e) {
    // error reading value
    console.log(e);
    return undefined;
  }
};
export const clear = async () => {
  await AsyncStorage.clear().then(() => console.log('Cleared'));
};

const storage = {
  get,
  set,
  remove,
  setJSON,
  getJSON,
  getAllKey,
  clear,
};

export default storage;
