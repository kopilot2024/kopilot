import { FeedbackPopup } from './components/feedbackPopup.js';

const feedbackBtn = document.getElementById('feedback-btn');

const feedbackPopup = new FeedbackPopup(
  document.getElementById('feedback-popup'),
  document.getElementById('overlay'),
);

feedbackBtn.addEventListener('click', () => {
  feedbackPopup.show();
});
