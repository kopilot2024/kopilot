import { CriteriaItems, CriteriaValue } from '../types/feedback';

const CriteriaLabel: Record<CriteriaValue, string> = {
  TONE: '어조',
  PURPOSE: '목적',
};

export const Criteria: Record<CriteriaValue, CriteriaItems[]> = {
  TONE: [
    { value: 'FORMAL', label: '공식적' },
    { value: 'INFORMAL', label: '비공식적' },
  ],
  PURPOSE: [
    { value: 'RESUME', label: '자소서' },
    { value: 'EMAIL', label: '이메일' },
    { value: 'BLOG', label: '블로그' },
  ],
};

interface FeedbackCriteria {
  value: CriteriaValue;
  label: string;
  items: CriteriaItems[];
}

export const FEEDBACK_CRITERIA: FeedbackCriteria[] = Object.entries(
  Criteria,
).map(([key, items]) => ({
  value: key as CriteriaValue,
  label: CriteriaLabel[key as CriteriaValue],
  items,
}));
