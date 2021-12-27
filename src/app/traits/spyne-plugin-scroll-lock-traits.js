import {SpyneTrait, SpyneAppProperties} from 'spyne';
import {prop, compose, lte, pick, defaultTo, forEachObjIndexed} from 'ramda';

export class SpynePluginScrollLockTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'pluginScrollLock$';
    super(context, traitPrefix);

  }

  static pluginScrollLock$InitGlobalProps() {
    const scrollLockMargin = 0;
    document.documentElement.style.setProperty('--scroll-lock-margin',
        `-${scrollLockMargin}px`);
    document.documentElement.style.setProperty('--scroll-lock-padding',
        `${scrollLockMargin}px`);
    document.documentElement.style.setProperty('--scroll-lock-width',
        `calc(100% + ${scrollLockMargin}px`);
  }

  static pluginScrollLock$InitScrollProps(props = this.props) {
    props['scrollLocked'] = false;
    props['addScrollbarProxy'] = false;
    props['defaultScrollState'] = SpynePluginScrollLockTraits.pluginScrollLock$GetDefaultScrollState(
        props.el);
    return props;
  }

  static pluginScrollLock$GetDefaultScrollState(el = this.props.el) {

    const defaultStateObj = SpynePluginScrollLockTraits.pluginScrollLock$GetAttrs(
        el, ['position', 'overflow', 'top']);
    defaultStateObj['x'] = window.scrollX;
    defaultStateObj['y'] = window.scrollY;

    return defaultStateObj;
  }

  static pluginScrollLock$GetAttrs(el = this.props.el, attrsArr) {
    return pick(attrsArr, window.getComputedStyle(el));
  }

  static pluginScrollLock$SetWindowScroll(x, y) {
    window.scrollTo(x, y);
  }

  static pluginScrollLock$SetScrollLockProperties(
      position, overflow, top, el = this.props.el) {
    const setStyle = (val, key) => el.style[key] = val;
    forEachObjIndexed(setStyle, {position, overflow, top});
  }

  static pluginScrollLock$ScrollIntoView(el, scrollIntoViewOpts = {}) {
    const elIsNodeFn = compose(lte(0), defaultTo(-1), prop('nodeType'));
    const defaultOpts = {behavior: 'auto', block: 'nearest'};

    if (elIsNodeFn(el)) {
      const opts = Object.assign(defaultOpts, scrollIntoViewOpts);

      if (this.props.scrollLocked) {
        this.pluginScrollLock$DisableBodyScroll();
        el.scrollIntoView(opts);
        this.pluginScrollLock$EnableBodyScroll();
      } else {
        el.scrollIntoView(opts);
      }
    } else {
      console.warn(
          `Spyne Plugin Warning: the element, ${el} is not valid in "scrollLockScrollIntoView".`);
    }
  }

  static pluginScrollLock$EnableBodyScroll(props = this.props) {
    if (this.props.scrollLocked === true) {
      return;
    }
    this.props.defaultScrollState = this.pluginScrollLock$GetDefaultScrollState();
    const {y} = this.props.defaultScrollState;
    const bodyTopPos = `${y * -1}px`;
    this.props.scrollLocked = true;
    this.pluginScrollLock$SetScrollLockProperties('fixed', 'hidden',
        bodyTopPos);
  }

  static pluginScrollLock$DisableBodyScroll() {
    this.props.scrollLocked = false;
    const {position, overflow, top, x, y} = this.props.defaultScrollState;
    //console.log('DISABLED body scroll ', this.props.defaultScrollState)
    this.pluginScrollLock$SetScrollLockProperties(position, overflow, top);
    SpynePluginScrollLockTraits.pluginScrollLock$SetWindowScroll(x, y);

  }

  /*
  *
  *  ====================
  *  THIS SECTION IS FOR NON SCROLLING METHODS
  *  ====================
  *
  *
  * */

  static pluginScrollLock$CheckForMainWindowScrollListener() {
    const windowConfig = SpyneAppProperties.getChannelConfig('WINDOW');
    const {listenForScroll} = windowConfig;
    if (listenForScroll !== true) {
      console.warn(
          `SpynePluginScrollLock warning: Initial Configuration for WINDOW Channel requires "listenForScroll" property to be true. Config: `,
          windowConfig);
    }
  }

  static pluginScrollLock$SendScrollEventToWindowChannel(el) {
    const action = 'CHANNEL_WINDOW_SET_ELEMENT_TO_SCROLL_EVENT';
    this.sendInfoToChannel('CHANNEL_WINDOW', {el, action}, action);

  }

  static pluginScrollLock$CheckForScrollLockMarginAdjust(
      el, addScrollbarProxy = false) {
    const channelName = 'CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK';
    const action = 'CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_CHECK_MARGIN_ADJUST_EVENT';
    this.sendInfoToChannel(channelName, {action, el, addScrollbarProxy}, action,
        el);

  }

  static pluginScrollLock$SendScrollLockInfoToChannel(
      el, enableScrollLock = true, addScrollbarProxy = false) {

    const channelName = 'CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK';
    const ACTION_VAL = enableScrollLock ? 'ENABLE' : 'DISABLE';
    const action = 'CHANNEL_SPYNE_PLUGIN_SCROLL_LOCK_INIT_EVENT';
    const onFrame = () => {
      this.sendInfoToChannel(channelName,
          {action, enableScrollLock, addScrollbarProxy, el}, action, el);
      if (enableScrollLock && el) {
        this.pluginScrollLock$SendScrollEventToWindowChannel(el);
      }
    };

    onFrame();

  }

}
