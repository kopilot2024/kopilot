import { AutoCompleteSettings } from './autoCompleteSettings.js';
import { CursorBox } from './components/cursorBox.js';
import { EditTextarea } from './editTextarea.js';

const textarea = document.getElementById('edit-textarea');

const cursorBox = new CursorBox(
  document.getElementById('cursor-box'),
  textarea,
);

const autoCompleteSettings = new AutoCompleteSettings(cursorBox);

const editTextarea = new EditTextarea(textarea, autoCompleteSettings);

const endingChoice = document.getElementById('ending-choice');
endingChoice.addEventListener('change', (event) =>
  editTextarea.changeEndingType(event.target.value),
);
