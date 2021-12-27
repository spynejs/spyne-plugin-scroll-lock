import {ViewStream} from 'spyne';
import {SpynePluginScrollLockTraits} from '../traits/spyne-plugin-scroll-lock-traits';
import {SpynePluginScrollElementTraits} from '../traits/spyne-plugin-scroll-element-traits';

export class BodyScrollElement extends ViewStream {

  constructor(props = {}) {
    props = SpynePluginScrollLockTraits.pluginScrollLock$InitScrollProps(props);
    props.traits = [SpynePluginScrollLockTraits];
    super(props);

  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_ENABLE_LOCK_EVENT', 'onEnableScrollLock'],
      ['CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_DISABLE_LOCK_EVENT', 'onDisableScrollLock'],
    ];
  }

  onEnableScrollLock(e) {
    const {payload} = e;
    const {addScrollbarProxy} = payload;
    this.props.addScrollbarProxy = addScrollbarProxy;
    this.pluginScrollLock$EnableBodyScroll();
  }

  onDisableScrollLock() {
    this.props.addScrollbarProxy = false;
    const srcElement = this.props.el;
    this.pluginScrollLock$DisableBodyScroll();
    SpynePluginScrollElementTraits.plugin$ScrollEl$CheckForScrollAdjust({srcElement});
  }

  broadcastEvents() {
    // return nexted array(s)
    return [];
  }

  onRendered() {
    this.pluginScrollLock$CheckForMainWindowScrollListener();
    this.addChannel('CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK');
  }

}
