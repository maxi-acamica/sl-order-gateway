const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path')
const YAML = require('json-to-pretty-yaml');
const  _isObject = require ("lodash.isobject");
const  _forIn = require ("lodash.forin");

/**
 * Helper used to edit yaml sam file
 * and fix zip origin by compatibility
 * between framework and sam file
 */

function omitDeep(obj) {
    _forIn(obj, function(value, key) {
      if (_isObject(value)) {
        if (key === 'responses' && obj[key].hasOwnProperty('200')) {
          console.log('found 200! ');
          delete obj[key];
        }
        omitDeep(value);
      } else if (key === 'CodeUri') {
          console.log('found!');
        delete obj[key];
      } else if (typeof value === 'string' && value.includes("'")) {
        obj[key] = value.replace(/'/g,'')
      } 
    });
  }

try {
    let fileContents = fs.readFileSync('dist/sam-template.yml', 'utf8');
    let data = yaml.safeLoad(fileContents);
    //console.log(data);
    // get real path
    basePath = path.resolve(__dirname + '/../');
    console.log(basePath);
    // update json object
    omitDeep(data);

    // convert to string object
    const stringData = YAML.stringify(data);
    console.log(stringData);
    
    // try to save as yml
    fs.writeFile(basePath+'/dist/sam-template.yml', stringData, () => {return true});

    console.log('sam Yml fiel updated successfully');
} catch (e) {
    console.error(e);
}