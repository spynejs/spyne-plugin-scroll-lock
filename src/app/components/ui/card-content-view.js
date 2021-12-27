import {ViewStream, DomElement, SpyneApp} from 'spyne';

export class CardContentView extends ViewStream {

  constructor(props = {}) {
    props.class = props.animate === 'true'
        ? 'card-view start-anim'
        : 'card-view';
    props.template = require('./templates/card-content-view.tmpl.html');
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_MODAL_.*_EVENT', 'onModalCloseEvent'],
    ];
  }

  onModalCloseEvent(e) {
    const {contentType} = e.payload;
    if (contentType !== 'card') {
      SpyneApp.pluginsFn.disableScrollLock(this.props.el);
    }
    this.disposeViewStream();
  }

  broadcastEvents() {
    // return nexted array(s)
    return [
      ['button.btn-close', 'click'],
    ];
  }

  onRendered() {
    const addScrollbarProxy = false;
    SpyneApp.pluginsFn.enableScrollLock(this.props.el, addScrollbarProxy);

    const testAddScrollbar = () => {
      if (this.props.animate === 'true') {
        this.props.el$.addClass('animated');
      }

      SpyneApp.pluginsFn.updateScrollMarginAdjust(this.props.el);
    };
    this.setTimeout(testAddScrollbar, 1000);

    document.body.style.cssText = 'position:fixed; overflow:hidden;';
    this.addChannel('CHANNEL_MODAL');

  }

}
