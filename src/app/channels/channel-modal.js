import {Channel, ChannelPayloadFilter} from 'spyne';

export class ChannelModal extends Channel {

  constructor(name, props = {}) {
    name = 'CHANNEL_MODAL';
    props.sendCachedPayload = false;
    super(name, props);
  }

  onRegistered() {
    const modalBtnFilter = new ChannelPayloadFilter({
      eventType: 'modal',
    });

    const ui$ = this.getChannel('CHANNEL_UI', modalBtnFilter);
    ui$.subscribe(this.onModalEvent.bind(this));

  }

  onModalEvent(e) {
    const {srcElement, payload} = e;
    const {eventType, openModal, contentType, animate} = payload;
    const action = openModal === 'true'
        ? 'CHANNEL_MODAL_OPEN_MODAL_EVENT'
        : 'CHANNEL_MODAL_CLOSE_MODAL_EVENT';
    this.sendChannelPayload(action,
        {action, eventType, openModal, animate, contentType}, srcElement);
  }

  addRegisteredActions() {
    return [
      'CHANNEL_MODAL_OPEN_MODAL_EVENT',
      'CHANNEL_MODAL_CLOSE_MODAL_EVENT',
    ];
  }

  onViewStreamInfo(obj) {
    let data = obj.props();
  }

  onSendPayload(actionStr, payload = {}) {
    const action = this.channelActions[actionStr];
    const srcElement = {};
    const event = undefined;
    this.sendChannelPayload(action, payload, srcElement, event);
  }

}
