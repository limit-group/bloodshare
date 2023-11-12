import * as SecureStore from "expo-secure-store";

const getValue = async (key) => {
  const token = await SecureStore.getItemAsync(key);
  return token;
};

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

module.exports = { getValue, save };
