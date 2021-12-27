import {SpyneTrait} from 'spyne';
import {compose, defaultTo, path} from 'ramda';
import {LockedElementsChecker} from '../utils/locked-elements-checker';

export class SpynePluginScrollElementTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'plugin$ScrollEl$';
    super(context, traitPrefix);
  }

  static plugin$ScrollEl$CheckForScrollAdjust(e) {
    const {srcElement} = e;
    const isScrollLockEl = LockedElementsChecker.checkIfElIsLocked(srcElement);
    const addScrollbarProxy = compose(defaultTo(false),
        path(['props', 'addScrollbarProxy']))(this);
    let scrollLockMargin = 0;
    const getScrollLockMargin = (el) => {
      const {offsetWidth, clientWidth} = el;
      const margin = offsetWidth - clientWidth;
      return margin >= 0 ? margin : scrollLockMargin;
    };

    const onSetProxyVisible = (proxyBool) => {
      const proxyScrollbarEl = document.getElementById('proxy-scrollbar');
      proxyScrollbarEl.classList.toggle('reveal', proxyBool);
    };

    const updateScrollLockMargin = () => {
      scrollLockMargin = getScrollLockMargin(srcElement);
      let proxyVisible = false;
      if (addScrollbarProxy === true && scrollLockMargin === 0) {
        const proxyEl = document.getElementById('proxy-scrollbar');
        scrollLockMargin = getScrollLockMargin(proxyEl);
        proxyVisible = true;
      }

      onSetProxyVisible(proxyVisible);
      document.documentElement.style.setProperty('--scroll-lock-margin', `-${scrollLockMargin}px`);
      document.documentElement.style.setProperty('--scroll-lock-padding', `${scrollLockMargin}px`);
      document.documentElement.style.setProperty('--scroll-lock-width', `calc(100% + ${scrollLockMargin}px`);
    };

    if (isScrollLockEl || addScrollbarProxy === true) {
      requestAnimationFrame(updateScrollLockMargin);
    }

  }

  static plugin$ScrollEl$AddScrollEl(el, props = this.props) {
    LockedElementsChecker.addLockableElement(el);
  }

  static plugin$ScrollEl$RemoveScrollEl(el, props = this.props) {
    LockedElementsChecker.removeLockableElement(el);
  }

}
