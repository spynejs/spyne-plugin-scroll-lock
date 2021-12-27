import {ViewStream, SpyneApp} from 'spyne';

export class ModalView extends ViewStream {

  constructor(props = {}) {
    props.class = 'main-scroll-content content modal-content shadow-sm shadow p-3 mb-5 bg-white rounded';
    props.template = require('./templates/modal-view.tmpl.html');
    super(props);
  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_MODAL_.*_EVENT', 'onModalCloseEvent'],
      ['CHANNEL_UI_CLICK_EVENT', 'onScrollIntoView', '.scroll-into-view'],
    ];
  }

  onScrollIntoView(e) {
    const sel = '.spyne-plugin-scroll-clock-img';
    const imgEl = document.querySelector(sel);
    SpyneApp.pluginsFn.scrollIntoView(imgEl);
  }

  onModalCloseEvent(e) {
    const {action} = e;
    if (action !== 'C1HANNEL_MODAL_CLOSE_MODAL_EVENT') {
      SpyneApp.pluginsFn.disableScrollLock(this.props.el);
    }
    this.disposeViewStream();
  }

  broadcastEvents() {
    // return nexted array(s)
    return [
      ['button', 'click'],
    ];
  }

  onRendered() {

    SpyneApp.pluginsFn.enableScrollLock(this.props.el);
    const onUpdateScrollMargin = () => SpyneApp.pluginsFn.updateScrollMarginAdjust(
        this.props.el);
    this.setTimeout(onUpdateScrollMargin, 1000);

    this.addChannel('CHANNEL_MODAL');
    this.addChannel('CHANNEL_UI');
  }

}
