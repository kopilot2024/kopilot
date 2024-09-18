import axios from 'axios';

export async function axiosPost(
  url: string,
  data: any,
  headers: any,
): Promise<any> {
  try {
    return await axios.post(url, data, { headers: headers });
  } catch (err: unknown) {
    throw new Error(`axios 요청에 실패했습니다. '${url}'`);
  }
}

export async function fetchPost(
  url: string,
  data: any,
  headers: any,
): Promise<any> {
  try {
    return await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });
  } catch (err: unknown) {
    throw new Error(`fetch 요청에 실패했습니다. '${url}'`);
  }
}
