import { AutoCompleteSettings } from './autoComplete/autoCompleteSettings.js';
import { CursorBox } from './components/cursorBox.js';
import { FeedbackPopup } from './components/feedbackPopup.js';
import { Textarea } from './components/textarea.js';
import { WritingTool } from './components/writingTool.js';
import { showSetting } from './longSentence/popup.js';

const textareaHolder = document.getElementById('textarea');

const cursorBox = new CursorBox(
  document.getElementById('cursor-box'),
  textareaHolder,
);

const writingTool = new WritingTool(
  document.getElementById('writing-tool'),
  textareaHolder,
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

const feedbackBtn = document.getElementById('feedback-btn');

const feedbackPopup = new FeedbackPopup(
  document.getElementById('feedback-popup'),
  document.getElementById('overlay'),
);

feedbackBtn.addEventListener('click', () => {
  feedbackPopup.show();
});

const setting = document.getElementById('longsentence-setting');
setting.addEventListener('click', (event) => showSetting(event));
