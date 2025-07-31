export const fetchCryptoList = async (start = 0, limit = 50) => {
  try {
    const response = await fetch(
      `https://api.coinlore.net/api/tickers/?start=${start}&limit=${limit}`
    );
    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const fetchCryptoDetails = async (id) => {
  try {
    const response = await fetch(
      `https://api.coinlore.net/api/ticker/?id=${id}`
    );
    const json = await response.json();
    return json[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};