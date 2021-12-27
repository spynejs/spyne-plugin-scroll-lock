const {expect, assert} = require('chai');
import {SpynePluginScrollLockTraits} from 'traits/spyne-plugin-scroll-lock-traits';

describe('should test scroll lock traits', () => {
  it('should test if scroll lock trait exists', () => {
    expect(SpynePluginScrollLockTraits).to.exist;
  });

  it('should return single property from element',()=>{
    const topPropArr = ['position'];
    const el = document.body;
    const {position} = SpynePluginScrollLockTraits.pluginScrollLock$GetAttrs(el, topPropArr)
    expect(position).to.equal('static')
  })

  it('should return multiple properties from element', ()=>{
    const attributesArr = ['top', 'overflow', 'position'];
    const el = document.body;
    const attrsObj = SpynePluginScrollLockTraits.pluginScrollLock$GetAttrs(el, attributesArr);
    return expect(attrsObj).to.be.an('object');

  })

  it('should get default state props ',()=>{
    const defaultStateProps = SpynePluginScrollLockTraits.pluginScrollLock$GetDefaultScrollState(document.body);
    const defaultBodyProps = {position: 'static', overflow: 'visible', top: 'auto', x: 0, y: 0};
    expect(defaultStateProps).to.deep.equal(defaultBodyProps);


  })


});
