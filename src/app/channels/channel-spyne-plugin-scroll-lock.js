import {Channel, ChannelPayloadFilter} from 'spyne';
import {SpynePluginScrollElementTraits} from '../traits/spyne-plugin-scroll-element-traits';
import {path} from 'ramda';

export class ChannelSpynePluginScrollLock extends Channel {

  constructor(name, props = {}) {
    name = 'CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK';
    props.sendCachedPayload = false;
    props.traits = [SpynePluginScrollElementTraits];
    props.scrollLocked = false;
    props.addScrollbarProxy = false;
    props.lockedElementsArr = [];
    super(name, props);
  }

  onRegistered() {

    const windowActionsArr = [
      'CHANNEL_WINDOW_ORIENTATION_EVENT',
      'CHANNEL_WINDOW_RESIZE_EVENT',
      'CHANNEL_WINDOW_SCROLL_ELEMENT_ADDED_EVENT',
    ];

    const checkForAction = a => windowActionsArr.indexOf(a) >= 0;
    const scrollPayloadFilter = new ChannelPayloadFilter({
      action: checkForAction,
    });

    const win$ = this.getChannel('CHANNEL_WINDOW', scrollPayloadFilter);
    win$.subscribe(this.onWindowEvent.bind(this));

  }

  onWindowEvent(e) {
    this.plugin$ScrollEl$CheckForScrollAdjust(e);
  }

  onSetLock(e) {

  }

  sendScrollLockEvent(el, enableScrollLock) {

  }

  onInitLockEvent(e) {
    const {payload} = e;
    const {enableScrollLock, addScrollbarProxy, el} = payload;
    this.props.addScrollbarProxy = addScrollbarProxy === true ||
        addScrollbarProxy === 'true';

    this.props.scrollLocked = enableScrollLock === true || enableScrollLock ===
        'true';

    if (el !== undefined) {
      const fn = this.props.scrollLocked
          ? this.plugin$ScrollEl$AddScrollEl
          : this.plugin$ScrollEl$RemoveScrollEl;
      fn(el);

    }

    const action = enableScrollLock
        ? 'CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_ENABLE_LOCK_EVENT'
        : 'CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_DISABLE_LOCK_EVENT';

    this.sendChannelPayload(action,
        {action, enableScrollLock, addScrollbarProxy}, el);

  }

  onSetProxyVisible(proxyVisible = true) {
    const action = 'CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_SET_PROXY_SCROLLBAR_EVENT';
    this.sendChannelPayload(action, {proxyVisible});
  }

  onCheckAdjustMargin(e) {
    const {payload} = e;
    const {addScrollbarProxy} = payload;
    this.props.addScrollbarProxy = addScrollbarProxy;
    const srcElement = path(['payload', 'el'], e);
    const scrollLockMargin = this.plugin$ScrollEl$CheckForScrollAdjust(
        {srcElement});
    const action = 'CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_MARGIN_CHECKED_EVENT';
    this.onSetProxyVisible(addScrollbarProxy);
  }

  addRegisteredActions() {
    return [
      'CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_ENABLE_LOCK_EVENT',
      'CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_DISABLE_LOCK_EVENT',
      ['CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_INIT_EVENT', 'onInitLockEvent'],
      [
        'CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_CHECK_MARGIN_ADJUST_EVENT',
        'onCheckAdjustMargin'],
      ['CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_SET_LOCK', 'onSetLock'],
      'CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_SET_PROXY_SCROLLBAR_EVENT',
      [
        'CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_UPDATE_PROXY_SCROLLBAR_EVENT',
        'onSetProxyVisible'],
    ];
  }

  onViewStreamInfo() {

  }

}
