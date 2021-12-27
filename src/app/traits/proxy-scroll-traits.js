import {SpyneTrait} from 'spyne';

export class ProxyScrollbarTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'proxyBar$';
    super(context, traitPrefix);

  }

  static proxyBar$CheckToAddScrollBar() {
    var winHeight = window.innerHeight;
    var bodyHeight = document.body.offsetHeight;
    return bodyHeight > winHeight;
  }

}
