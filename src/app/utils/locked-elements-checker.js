import {
  find,
  path,
  compose,
  lte,
  without,
  is,
  contains,
  defaultTo,
  prop,
} from 'ramda';
import {SpyneAppProperties} from 'spyne';

let _lockedElementsArr = ['body'];

class LockedElementsCheckerClass {

  constructor(props = {}) {
    /*
    *  GET SELECTOR FROM ELEMENT
    *  ADD EL SELECTOR TO QUEUE
    *  CHECK IF EL ID EXISTS
    *  REMOVE EL IF NOT EXISTING ON STAGE
    */
    props.debug = props.debug || SpyneAppProperties.debug;
    this.props = props;
    this.elIsDomElement = LockedElementsCheckerClass.elIsDomElement.bind(this);
    this.selectorIsDomElement = LockedElementsCheckerClass.selectorIsDomElement.bind(this);
    this.getSelectorFromEl = LockedElementsCheckerClass.getSelectorFromEl.bind(this);
  }

  static createId() {
    const num = () => Math.random().
        toString(36).
        replace(/\d/gm, '').
        substring(1, 8);
    return num();
  }

  static getScrollLockId(el) {
    const hasScrollLockId = el && el.dataset!==undefined && el.dataset.hasOwnProperty('scrollLockId');
    if (hasScrollLockId === false) {
      el.dataset['scrollLockId'] = LockedElementsCheckerClass.createId();
    }
    return el.dataset.scrollLockId;
  }

  addLockableElement(el, testMode = false) {
    // IF EL IS A STRING, CONVERT TO DOCUMENT ELEMENT TO PROPERLY FORMAT SELECTOR
    const elToCheck = is(String, el) ? document.body.querySelector(el) : el;
    const selObj = LockedElementsChecker.getSelectorFromEl(elToCheck);
    const isValidDomEl = LockedElementsChecker.selectorIsDomElement(selObj);
    const elHasNotBeenLocked = LockedElementsChecker.checkIfElIsLocked(selObj) === false;
    if (selObj && isValidDomEl && elHasNotBeenLocked) {
      elToCheck.dataset['scrollLockId'] = LockedElementsCheckerClass.getScrollLockId(elToCheck);
      _lockedElementsArr.push(selObj);
      //console.log('locked element arr after add is ',_lockedElementsArr);
      return selObj;
    } else if (this.props.debug && testMode === false) {
      console.warn(
          `Spyne Plugin Warning: The element, ${selObj} is not valid: ${JSON.stringify(
              {selObj, isValidDomEl, elHasNotBeenLocked})}`);
    }
    return false;
  }

  removeLockableElement(el, testMode = false) {
    const elToCheck = is(String, el) ? document.querySelector(el) : el;
    const selObj = LockedElementsChecker.getSelectorFromEl(elToCheck);
    const elHasBeenLocked = LockedElementsChecker.checkIfElIsLocked(selObj);
    const isNotBody = document.querySelector(selObj) ? document.querySelector(
        selObj).isEqualNode(document.body) === false : false;

    if (selObj && elHasBeenLocked && isNotBody) {
      _lockedElementsArr = without([selObj], _lockedElementsArr);
      return true;
    } else if (this.props.debug && testMode === false) {

    }
    return false;

  }

  checkIfElIsLocked(elStr) {
    const selector = is(String, elStr)
        ? elStr
        : LockedElementsChecker.getSelectorFromEl(elStr);
    return contains(selector, _lockedElementsArr);
  }

  gc() {

  }

  static elIsDomElement(el) {
    return compose(lte(0), defaultTo(-1), prop('nodeType'))(el);

  }

  static selectorIsDomElement(sel) {
    const isValidSelector = /(body|data|#|\.)/g.test(sel);
    const el = document.querySelector(sel);
    const isDomEl = LockedElementsChecker.elIsDomElement(el);
    const elExists = el ? document.body.contains(el) : false;
    return isValidSelector && isDomEl && elExists;

  }

  static getSelectorFromEl(el) {

    const elIsDomElement = LockedElementsChecker.elIsDomElement(el);

    if (elIsDomElement === false) {
      return false;
    }
    const body = document.body.isEqualNode(el) ? 'body' : '';

    const getDataVsidSelector = (str) => str ? `[data-vsid="${str}"]` : '';
    const getDataScrollLockSelector = (str) => str
        ? `[data-scroll-lock-id="${str}"]`
        : '';

    let dataVsid = compose(getDataVsidSelector, path(['dataset', 'vsid']))(el);
    let scrollLockId = compose(getDataScrollLockSelector,
        LockedElementsCheckerClass.getScrollLockId)(el);

    const id = el.id ? '#' + el.id : '';
    let className = el.className ? '.' + String(el.classList[0]).replace(/\s+/gm, '.') : '';
    const isNotEmpty = str => String(str).length > 1;
    return compose(defaultTo(''), find(isNotEmpty))([body, scrollLockId, dataVsid, id, className]);
  }

}

let LockedElementsChecker = new LockedElementsCheckerClass();
export {LockedElementsChecker};
