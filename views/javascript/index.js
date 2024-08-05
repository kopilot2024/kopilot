import { AutoCompleteSettings } from './autoComplete/autoCompleteSettings.js';
import { BaseSlide } from './components/baseSlide.js';
import { CursorBox } from './components/cursorBox.js';
import { FeedbackPopup } from './components/feedbackPopup.js';
import { Textarea } from './components/textarea.js';
import { WritingTool } from './components/writingTool.js';
import { showSetting } from './longSentence/popup.js';
import { DomManager } from './utils/domManager.js';

const textareaHolder = document.getElementById('textarea');

const cursorBox = new CursorBox(
  document.getElementById('cursor-box'),
  textareaHolder,
);

const output = document.getElementById('output');
const highlightContainer = document.getElementById('highlight-container');

const writingTool = new WritingTool(
  document.getElementById('writing-tool'),
  textareaHolder,
  highlightContainer,
);

const autoCompleteSettings = new AutoCompleteSettings(cursorBox);

const textarea = new Textarea(
  textareaHolder,
  autoCompleteSettings,
  writingTool,
);

const endingChoice = document.getElementById('ending-choice');
endingChoice.addEventListener('change', (event) =>
  textarea.changeEndingType(event.target.value),
);

const feedbackFloatingBtn = document.getElementById('feedback-floating-btn');
const feedbackSlide = new BaseSlide(document.getElementById('feedback-slide'));
const feedbackBtn = document.getElementById('feedback-btn');

const overlay = document.getElementById('overlay');

const feedbackPopup = new FeedbackPopup(
  document.getElementById('feedback-popup'),
  overlay,
);

feedbackFloatingBtn.addEventListener('click', () => {
  feedbackSlide.toggle();
  DomManager.toggleElements(overlay);
});

feedbackBtn.addEventListener('click', () => {
  const text = document.getElementById('textarea').value;
  if (text.length > 2000) {
    alert('2000자 이상이면 피드백할 수 없습니다.');
  } else if (text.length < 300) {
    alert('300자 미만이면 피드백할 수 없습니다.');
  } else {
    feedbackPopup.show();
  }
});

const setting = document.getElementById('longsentence-setting');
setting.addEventListener('click', (event) => showSetting(event));

textareaHolder.addEventListener('scroll', () => {
  DomManager.syncElements(textareaHolder, highlightContainer);
  DomManager.syncElements(textareaHolder, output);
});

output.addEventListener('scroll', () => {
  DomManager.syncElements(output, textareaHolder);
  DomManager.syncElements(output, highlightContainer);
});
