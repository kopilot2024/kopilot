const parseSentence = (sentence) => {
  // 여기서 API 호출한 문장으로 바꾸기
  return "바뀐 문장.";
}

const changePage = (span, textarea, output) => {
  const longSentence = span.innerText;
  const parsedText = parseSentence(longSentence);

  const textInSpan = output.innerHTML.replace(/<span.*?<\/span>/g, parsedText);
  textarea.value = textInSpan;
  output.innerText = textInSpan;
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
  }
  output.innerHTML = outputContent.replace(/\n/g, '<br>');

  const tag = document.querySelectorAll('.highlight');
  tag.forEach(span => {
    span.addEventListener('click', () => {
      console.log("clicked!")
      span.innerText = changePage(span, textarea, output);
    });

    span.addEventListener("mouseenter", () => {
      span.classList.add("tooltip")
      span.setAttribute('data-tooltip', parseSentence("line"));
      console.log("마우스 올림");
    });

    span.addEventListener("mouseleave", () => {
      console.log("마우스 내림");
    });
  });
}