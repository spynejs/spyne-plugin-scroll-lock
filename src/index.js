const css = require('./scss/main.scss');
import {MainView} from 'components/main-view';
import {ChannelModal} from 'channels/channel-modal';
const {SpyneApp} = require('spyne');
import {SpynePluginScrollLock} from './app/spyne-plugin-scroll-lock';

const config = {
  debug:true,
  channels: {
    WINDOW: {
      listenForScroll: true
    }
  }
}

const scrollLockPluginConfig = {
    proxyScrollbarMode: 'auto',
}

SpyneApp.init(config);
new SpynePluginScrollLock(scrollLockPluginConfig);
SpyneApp.registerChannel(new ChannelModal());
new MainView().appendToDom(document.body);
