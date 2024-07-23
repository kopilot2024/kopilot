import { showSuggestion } from './popup.js';

export const parseSentence = async (sentence) => {
  const url = 'http://localhost:3000/clova/parsed-line';
  const data = {
    text: sentence,
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.text();
};

export const changePage = (span, textarea, output) => {
  const parsedText = span.dataset.tooltip;
  const textNode = document.createTextNode(parsedText);
  span.parentNode.replaceChild(textNode, span);
  textarea.value = output.innerText;
};

const setEvent = () => {
  const tag = document.querySelectorAll('.highlight.yellow');
  tag.forEach((span) => {
    span.addEventListener('click', (event) => {
      showSuggestion(event, span);
    });
  });
};

export const checkLength = () => {
  const textarea = document.getElementById('textarea');
  const output = document.getElementById('output');

  const text = textarea.value;
  const sentences = text.match(/[^\.!\?]+[\.!\?]+|[^\.!\?]+$/g);
  let outputContent = '';
  if (sentences) {
    sentences.forEach((sentence) => {
      if (sentence.length >= 100) {
        sentence = '<span class="highlight yellow">' + sentence + '</span>';
      }
      outputContent += sentence;
    });

    output.innerHTML = outputContent.replace(/\n/g, '<br>');
    setEvent();
  }
};
