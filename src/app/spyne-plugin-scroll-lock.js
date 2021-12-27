const css =  require('../scss/spyne-plugin-scroll-lock.scss');
import {SpynePlugin, SpyneApp} from 'spyne';
import {is} from 'ramda';
import {ChannelSpynePluginScrollLock} from './channels/channel-spyne-plugin-scroll-lock';
import {BodyScrollElement} from './components/body-scroll-element';
import {SpynePluginScrollLockTraits} from './traits/spyne-plugin-scroll-lock-traits';
import {ProxyScrollbar} from './components/proxy-scrollbar';

class SpynePluginScrollLock extends SpynePlugin{

    constructor(props={}) {
      props['name'] = "SpynePluginScrollLock";
      super(props);
    }

    defaultConfig(){
      return  {
        lockedEl: document.body,
        pluginMethods: {
          enableScroll: this.enableScroll.bind(this),
          enableScrollLock: this.enableScrollLock.bind(this),
          disableScrollLock: this.disableScrollLock.bind(this),
          scrollIntoView: this.scrollIntoView.bind(this),
          updateScrollMarginAdjust: this.onCheckScrollLockMarginAdjust.bind(this)
        }
      }
    }

    onCheckScrollLockMarginAdjust(el){
        this.checkScrollLockMarginAdjuster(el);
    }

    scrollIntoView(el, opts={}){
      this.scrollLockScrollIntoView(el, opts);
    }

    enableScrollLock(el, addScrollbarProxy=false){
      this.sendScrolLockInfoToChannel(el, true, addScrollbarProxy);
    }

    disableScrollLock(el){
      this.sendScrolLockInfoToChannel(el, false, false);
    }

    enableScroll(){
      return this.enableScrollTestVal;
    }


    onRegistered() {
      SpynePluginScrollLockTraits.pluginScrollLock$InitGlobalProps();
      SpyneApp.registerChannel(new ChannelSpynePluginScrollLock());
    }

    onRender() {
      const {config} = this.props;
      const {lockedEl} = config;
      const mainScrollElement = is(String, lockedEl) ? document.querySelector(lockedEl) : lockedEl;

     this.props.bodyScrollEl = new BodyScrollElement({
       el: mainScrollElement
     });
      this.props.proxyScrollbar = new ProxyScrollbar().appendToDom(this.props.parentEl);

     this.checkScrollLockMarginAdjuster = SpynePluginScrollLockTraits.pluginScrollLock$CheckForScrollLockMarginAdjust.bind(this.props.bodyScrollEl);

     this.scrollLockScrollIntoView = SpynePluginScrollLockTraits.pluginScrollLock$ScrollIntoView.bind(this.props.bodyScrollEl);

     this.sendScrolLockInfoToChannel =  SpynePluginScrollLockTraits.pluginScrollLock$SendScrollLockInfoToChannel.bind(this.props.bodyScrollEl);

    }

}

export{SpynePluginScrollLock}
