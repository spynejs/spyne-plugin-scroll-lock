import {SpyneTrait} from 'spyne';
import {isNil, isEmpty, either} from 'ramda';

export class UtilTraits extends SpyneTrait {

  constructor(context) {
    let traitPrefix = 'util$';
    super(context, traitPrefix);

  }

  static util$CamelToSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  }

  static util$SnakeToCamelCase(str) {
    if (str.indexOf('-') < 0) {
      return str;
    }

    return str.toLowerCase().replace(/-(.)/g, function(match, group1) {
      return group1.toUpperCase();
    });
  }

  static util$GetTemplate(name, filesArr) {
    const cache = {};
    const importAll = (r) => r.keys().forEach(key => cache[key] = r(key));
    importAll(filesArr);
    let file = cache[`./${name}.page.tmpl.html`];
    return file !== undefined ? file : cache[`./page.tmpl.html`];
  }

  static util$Exists(item) {
    return !either(isNil, isEmpty)(item);
  }

}
