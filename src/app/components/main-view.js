import {ViewStream} from 'spyne';
import {ScrollLockUIContainer} from 'components/ui/scroll-lock-ui-container';

export class MainView extends ViewStream {

  constructor(props = {}) {
    props.id='spyne-plugin-scroll-lock-preview';
    props.tagName = 'main';
    props.template = require('./templates/main-view.tmpl.html');
    super(props);
  }

  addActionListeners() {
    // return nexted array(s)
    return [];
  }


  broadcastEvents() {
    // return nexted array(s)
    return [
    ];
  }

  
  onRendered() {
    this.appendView(new ScrollLockUIContainer());
  }

}
