const METHODS = {
  post: 'post',
};

const HEADERS = {
  json: { 'Content-Type': 'application/json' },
  'x-www-form-urlencoded': {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

export async function fetchServer(
  url,
  httpMethod,
  contentType,
  body,
  errorMessage,
) {
  const init = {
    method: METHODS[httpMethod],
    headers: HEADERS[contentType],
    body,
  };

  try {
    return await fetch(url, init);
  } catch (error) {
    console.error('Error:', errorMessage);
    throw error;
  }
}
