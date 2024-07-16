export class Tooltip {
  holder;
  anchor;

  constructor(holder, anchor) {
    this.holder = holder;
    this.anchor = anchor;
  }

  updatePosition() {
    const { top, left } = Tooltip.getCursorCoordinates(this.anchor);
    this.holder.style.top = `${top + 10}px`;
    this.holder.style.left = `${left - 10}px`;
  }

  static getCursorCoordinates(anchor) {
    const div = Tooltip.makeDummyDiv(anchor);
    const span = document.createElement('span');
    span.textContent = '|';
    div.appendChild(span);

    const { offsetTop, offsetLeft } = span;
    document.body.removeChild(div);

    const rect = anchor.getBoundingClientRect();
    const style = getComputedStyle(anchor);
    const paddingTop = parseFloat(style.paddingTop);
    const paddingLeft = parseFloat(style.paddingLeft);
    const borderTopWidth = parseFloat(style.borderTopWidth);
    const borderLeftWidth = parseFloat(style.borderLeftWidth);

    return {
      top:
        rect.top +
        window.scrollY +
        offsetTop -
        anchor.scrollTop +
        paddingTop +
        borderTopWidth,
      left:
        rect.left +
        window.scrollX +
        offsetLeft -
        anchor.scrollLeft +
        paddingLeft +
        borderLeftWidth,
    };
  }

  static makeDummyDiv(anchor) {
    const val = anchor.value;
    const cursorPointer = anchor.selectionStart;

    const div = document.createElement('div');
    const style = getComputedStyle(anchor);

    [
      'width',
      'boxSizing',
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
      'marginTop',
      'marginRight',
      'marginBottom',
      'marginLeft',
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
