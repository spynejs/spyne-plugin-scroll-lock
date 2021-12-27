import {ViewStream} from 'spyne';
import {ProxyScrollbarTraits} from '../traits/proxy-scroll-traits';

export class ProxyScrollbar extends ViewStream {

  constructor(props = {}) {
    props.id = 'proxy-scrollbar';
    props.traits = ProxyScrollbarTraits;
    props.class = 'reveal';
    super(props);
  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_ENABLE_LOCK_EVENT', 'onEnableScroll'],
      ['CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_DISABLE_LOCK_EVENT', 'onDisableScroll'],
      ['CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_SET_PROXY_SCROLLBAR_EVENT', 'onSetVisibility'],
    ];
  }

  onSetVisibility(e) {
    const {payload} = e;
    const {proxyVisible} = payload;
    this.props.el$.toggleClass('reveal', proxyVisible);
  }

  onDisableScroll() {
    this.props.el$.removeClass('reveal');
  }

  onEnableScroll(e) {
    const {payload} = e;
    const {addScrollbarProxy} = payload;
    this.props.el$.toggleClass('reveal', addScrollbarProxy);
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.addChannel('CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK');
  }

}
