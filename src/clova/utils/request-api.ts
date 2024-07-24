import axios from 'axios';

export async function requestPost(
  url: string,
  data: any,
  headers: any,
): Promise<any> {
  try {
    return await axios.post(url, data, { headers: headers });
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
    throw new Error(`Failed to request '${url}'`);
  }
}
