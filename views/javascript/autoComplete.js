import { AutoCompleteSettings } from './autoComplete/autoCompleteSettings.js';
import { CursorBox } from './components/cursorBox.js';
import { Textarea } from './components/textarea.js';

const textareaHolder = document.getElementById('textarea');

const cursorBox = new CursorBox(
  document.getElementById('cursor-box'),
  textareaHolder,
);

const autoCompleteSettings = new AutoCompleteSettings(cursorBox);

const textarea = new Textarea(textareaHolder, autoCompleteSettings);

const endingChoice = document.getElementById('ending-choice');
endingChoice.addEventListener('change', (event) =>
  textarea.changeEndingType(event.target.value),
);
