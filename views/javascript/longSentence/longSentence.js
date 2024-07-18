const parseSentence = (sentence) => {
  // 여기서 클로바 API 호출
  return sentence+" 에서 바뀐 문장";
}

const changePage = (span, textarea, output) => {
  const parsedText = span.dataset.tooltip; 
  const textNode = document.createTextNode(parsedText);
  span.parentNode.replaceChild(textNode, span);
  textarea.value = output.innerText;
}

const setEvent = () => {
  const tag = document.querySelectorAll('.highlight');
  tag.forEach(span => {
    span.addEventListener('click', () => {
      console.log("clicked!")
      span.innerText = changePage(span, textarea, output);
    });

    span.addEventListener("mouseenter", () => {
      span.classList.add("tooltip")
      span.setAttribute('data-tooltip', parseSentence(span.innerText));
      console.log("마우스 올림");
    });

    span.addEventListener("mouseleave", () => {
      console.log("마우스 내림");
    });
  });
}

const checkLength = () => {
  const textarea = document.getElementById("textarea");
  const output = document.getElementById("output");

  const text = textarea.value;
  const sentences = text.match(/[^\.!\?]+[\.!\?]+|[^\.!\?]+$/g);
  let outputContent = '';
  if (sentences) {
    output.innerHTML = '';

    sentences.forEach(sentence => {
      if (sentence.length >= 15) {
        sentence = '<span class="highlight">' + sentence + '</span>'
      }
      outputContent += sentence;
    });

    output.innerHTML = outputContent.replace(/\n/g, '<br>');
    setEvent()
  }
}