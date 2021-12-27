import {ViewStream, DomElement, ChannelPayloadFilter} from 'spyne';
import {ModalView} from 'components/ui/modal-view';
import {CardContentView} from 'components/ui/card-content-view';

export class ScrollLockUIContainer extends ViewStream {

  constructor(props = {}) {
    props.id = 'scroll-lock-ui-container';
    props.template = require('./templates/ui-container.tmpl.html');
    super(props);
  }

  addActionListeners() {
    // return nexted array(s)
    return [
      ['CHANNEL_MODAL_.*EVENT', 'onModalEvent'],

    ];
  }

  onModalEvent(e) {
    const {action, srcElement, payload} = e;
    const {contentType, animate} = payload;
    const openModal = action === 'CHANNEL_MODAL_OPEN_MODAL_EVENT';
    this.props.el$('#scroll-item-container').
        toggleClass('open-modal', openModal);
    if (openModal) {
      this.props.el$('button').setActiveItem('selected', srcElement.el);
      this.openModalWindow(contentType, animate);
    } else {
      this.props.el$('button').removeClass('selected');
    }

  }

  openModalWindow(modalType, animate = false) {
    const ScrollItemClass = modalType === 'modal' ? ModalView : CardContentView;
    this.appendView(new ScrollItemClass({modalType, animate}),
        '#scroll-item-container');
  }

  broadcastEvents() {
    return [
      ['button', 'click'],
    ];
  }

  onRendered() {
    this.addChannel('CHANNEL_MODAL');

  }

}
