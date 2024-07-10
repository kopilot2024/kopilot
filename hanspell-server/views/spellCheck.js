async function spellCheck(sentence) {
  const URL = 'http://localhost:3000/';
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({sentence}),
    });

    return await response.json();
  } catch (error) {
    console.error('Error during spell check:', error);
    throw error;
  }
}