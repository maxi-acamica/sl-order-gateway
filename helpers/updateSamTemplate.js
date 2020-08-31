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

function retroCompatibilitySam(obj) {
    _forIn(obj, function(value, key) {
      if (_isObject(value)) {
        if (key === 'responses' && obj[key].hasOwnProperty(200)) {
          console.log('found 200! ');
          const resp200 = obj[key]['200'];
          //aux
          delete obj[key]['200'];
          //reuse object
          obj[key]["\'200\'"] = resp200;
        }

        if (obj[key].hasOwnProperty('Type') && obj[key]['Type'] !== undefined && obj[key]['Type'] === 'AWS::Serverless::Function') {
          console.log('function: '+ key);
          const toDashLower = key.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
          obj[key]['Properties']['FunctionName'] = toDashLower; 
        }
        retroCompatibilitySam(value);
      } else if (key === 'CodeUri') {
          console.log('found!');
          delete obj[key];
      } 
    });
  }

try {   

    let fileContents = fs.readFileSync('dist/sam-template.yml', 'utf-8');
    let data = yaml.safeLoad(fileContents);
    //console.log(data);
    // get real path
    basePath = path.resolve(__dirname + '/../');
    console.log(basePath);
    // update json object
    retroCompatibilitySam(data);

    // convert to string object
    const stringData = YAML.stringify(data);
    console.log(stringData);
    // try to save as yml
    fs.writeFile(basePath+'/dist/sam-template.yml', stringData, () => {return true});

    console.log('sam Yml fiel updated successfully');
} catch (e) {
    console.error(e);
}