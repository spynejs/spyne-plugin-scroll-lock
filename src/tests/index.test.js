const {expect, assert} = require('chai');
const {SpyneApp, SpynePlugin} = require('spyne');
describe('root plugin test', () => {
  let spyneApp;
  beforeEach(()=>{
    spyneApp = SpyneApp.init({debug:true}, true);
  })

  it('should run shell plugin tests', () => {
    return true;
  });

});
