export class Tooltip {
  holder;
  anchor;

  constructor(holder, anchor) {
    this.holder = holder;
    this.anchor = anchor;
  }

  updatePosition() {
    const { top, left } = Tooltip.getCursorCoordinates(this.anchor);
    this.holder.style.top = `${top + 20}px`; // TODO 임의의 숫자
    this.holder.style.left = `${left}px`;
  }

  static getCursorCoordinates(anchor) {
    const div = Tooltip.makeDummyDiv(anchor);
    const span = document.createElement('span');
    span.textContent = '|';
    div.appendChild(span);

    const { offsetTop, offsetLeft } = span;
    document.body.removeChild(div);

    const rect = anchor.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY + offsetTop - anchor.scrollTop,
      left: rect.left + window.scrollX + offsetLeft - anchor.scrollLeft,
    };
  }

  static makeDummyDiv(anchor) {
    const val = anchor.value;
    const cursorPointer = anchor.selectionStart;

    const div = document.createElement('div');
    const style = getComputedStyle(anchor);

    [
      'fontFamily',
      'fontSize',
      'fontWeight',
      'fontStyle',
      'letterSpacing',
      'textTransform',
      'textAlign',
      'whiteSpace',
      'wordWrap',
      'lineHeight',
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
      'borderTopWidth',
      'borderRightWidth',
      'borderBottomWidth',
      'borderLeftWidth',
    ].forEach((prop) => {
      div.style[prop] = style[prop];
    });
    div.style.position = 'absolute';
    div.style.whiteSpace = 'pre-wrap';
    div.style.visibility = 'hidden';

    div.textContent = val.substring(0, cursorPointer);

    document.body.appendChild(div);
    return div;
  }
}
