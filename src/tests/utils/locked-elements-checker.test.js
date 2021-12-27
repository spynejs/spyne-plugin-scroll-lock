const {expect, assert} = require('chai');
const {pageEl} = require('../mocks/dom-els');
const {LockedElementsChecker} = require('../../app/utils/locked-elements-checker');
const {SpyneApp} = require('spyne');
const R = require('ramda');

describe('should test methods of locked elements checker', () => {

  const elIsDomElementFn = R.compose(R.lte(0), R.defaultTo(-1), R.prop('nodeType'));

  beforeEach(async()=>{
    document.body.insertAdjacentHTML('beforeend', pageEl);
  })

  describe('it should test create selector methods ', ()=>{
    const scrollLockIdRE = /^(\[data-scroll-lock-id="\w+"\])$/;

      it('locked elements checker should exists', async() => {
        const constructorName = "LockedElementsChecker";
        expect(constructorName).to.equal(constructorName);

      });

      it('should convert document.body to selector', async()=>{
        const el = document.body;
        const selObj = LockedElementsChecker.getSelectorFromEl(el);
        const isDomEl = LockedElementsChecker.selectorIsDomElement(selObj);
        expect(selObj).to.equal('body');
        expect(isDomEl).to.be.true;

      })

      it('should convert element to selector with data-vsid', async()=>{
        const el = document.querySelector('#vuipjus');
        const selObj = LockedElementsChecker.getSelectorFromEl(el);
        const isDomEl = LockedElementsChecker.selectorIsDomElement(selObj);
        expect(selObj).matches(scrollLockIdRE);
        expect(isDomEl).to.be.true;
      })


      it('should convert element to selector with id', async()=>{
        const el = document.querySelector('#lcnuvki');
        const selObj = LockedElementsChecker.getSelectorFromEl(el);
        const isDomEl = LockedElementsChecker.selectorIsDomElement(selObj);
        expect(selObj).matches(scrollLockIdRE);
        expect(isDomEl).to.be.true;

      })

      it('should convert element to selector with class', async()=>{
        const el = document.body.querySelector('.expanded-content-holder');
        const selObj = LockedElementsChecker.getSelectorFromEl(el);
        const isDomEl = LockedElementsChecker.selectorIsDomElement(selObj);
        expect(selObj).matches(scrollLockIdRE);
        expect(isDomEl).to.be.true;
      })


      it('should return false for el that does not exisg in dom', async()=>{
        const domEl = document.createElement('picture');
        domEl.id = 'foo';
        const selObj = LockedElementsChecker.getSelectorFromEl(domEl);
        const isDomEl = LockedElementsChecker.selectorIsDomElement(selObj);
        expect(selObj).matches(scrollLockIdRE);
        expect(isDomEl).to.be.false;
      })

  });

  describe('it should test compare el methods ', ()=>{

   it('should confirm that body el exists', async()=>{
      const el = document.body;
      const selObj = LockedElementsChecker.getSelectorFromEl(el);
      const elIsLockable = LockedElementsChecker.checkIfElIsLocked(selObj);
      expect(elIsLockable).to.be.true;
    })

     it('should add and confirm element with data-vsid', async()=>{
      const el = document.querySelector('#vuipjus');
      const selObj = LockedElementsChecker.getSelectorFromEl(el);
       const elIsLockable = LockedElementsChecker.checkIfElIsLocked(selObj);
       const isDomEl = LockedElementsChecker.selectorIsDomElement(selObj);
       LockedElementsChecker.addLockableElement(selObj);
       const elIsLockableAfterAdd = LockedElementsChecker.checkIfElIsLocked(selObj);
      expect(elIsLockable).to.be.false;
      expect(elIsLockableAfterAdd).to.be.true;
    })

    it('should add and confirm element with id', async()=>{
      const el = document.querySelector('#lcnuvki');
      const selObj = LockedElementsChecker.getSelectorFromEl(el);
      LockedElementsChecker.addLockableElement(el);
      const elIsLockableAfterAddWithEl = LockedElementsChecker.checkIfElIsLocked(el);
      const elIsLockableAfterAddWithSel = LockedElementsChecker.checkIfElIsLocked(selObj);
      expect(elIsLockableAfterAddWithEl).to.be.true;
      expect(elIsLockableAfterAddWithSel).to.be.true;
    })

    it('should add and confirm element with class', async()=>{
      const el = document.body.querySelector('.expanded-content-holder');
      const selObj = LockedElementsChecker.getSelectorFromEl(el);
      LockedElementsChecker.addLockableElement(el);
      const elIsLockableAfterAddWithEl = LockedElementsChecker.checkIfElIsLocked(el);
      const elIsLockableAfterAddWithSel = LockedElementsChecker.checkIfElIsLocked(selObj);
      expect(elIsLockableAfterAddWithEl).to.be.true;
      expect(elIsLockableAfterAddWithSel).to.be.true;
    })

    it('should return false for el that does not exist in dom', async()=>{
      const domEl = document.createElement('picture');
      domEl.id = 'foo';
      const selObj = LockedElementsChecker.getSelectorFromEl(domEl);
      const isDomEl = LockedElementsChecker.selectorIsDomElement(selObj);
      LockedElementsChecker.addLockableElement(domEl, true);
      const elIsLockableAfterAddWithEl = LockedElementsChecker.checkIfElIsLocked(domEl);
      const elIsLockableAfterAddWithSel = LockedElementsChecker.checkIfElIsLocked(selObj);
      expect(elIsLockableAfterAddWithEl).to.be.false;
      expect(elIsLockableAfterAddWithSel).to.be.false;
    })

  });

  describe('it should test remove el methods ', ()=>{

    it('should not allow body to be removed', async()=>{
      const el = document.body;
      const selObj = LockedElementsChecker.getSelectorFromEl(el);
     const removeBodyEl =  LockedElementsChecker.removeLockableElement(selObj, true);
      expect(removeBodyEl).to.be.false;
    })

    it('should remove and confirm element with data-vsid', async()=>{
      const el = document.querySelector('#vuipjus');
      const selObj = LockedElementsChecker.getSelectorFromEl(el);
      const removeDataVsid =  LockedElementsChecker.removeLockableElement(selObj);
      expect(removeDataVsid).to.be.true;
    })

    it('should remove and confirm element with id', async()=>{
      const el = document.querySelector('#lcnuvki');
      const selObj = LockedElementsChecker.getSelectorFromEl(el);
      const removeDataVsid =  LockedElementsChecker.removeLockableElement(selObj);
      expect(removeDataVsid).to.be.true;
    })

    it('should remove and confirm element with class', async()=>{
      const el = document.body.querySelector('.expanded-content-holder');
      const selObj = LockedElementsChecker.getSelectorFromEl(el);
      const removeDataVsid =  LockedElementsChecker.removeLockableElement(selObj);
      expect(removeDataVsid).to.be.true;

    })

    it('should return false for el that does not exist for removal in dom', async()=>{
      const domEl = document.createElement('picture');
      domEl.id = 'foo';
      const selObj = LockedElementsChecker.getSelectorFromEl(domEl);
      const isDomEl = LockedElementsChecker.selectorIsDomElement(selObj);
      LockedElementsChecker.addLockableElement(domEl, true);
      const removeDataVsid =  LockedElementsChecker.removeLockableElement(selObj, true);
      expect(removeDataVsid).to.be.false;

    })

  });




});


