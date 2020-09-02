const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path')
const YAML = require('json-to-pretty-yaml');
const  _isObject = require ("lodash.isobject");
const  _forIn = require ("lodash.forin");
// load .env file config
require('dotenv').config();

/**
 * Helper used to edit yaml sam file
 * and fix zip origin by compatibility
 * between framework and sam file
 */

function retroCompatibilitySam(obj) {
    _forIn(obj, function(value, key) {
      // Add mappings objects to Resources
      if(key === 'Resources' && !obj[key].hasOwnProperty("APIBasePathMapping")) {
        obj[key]["APIBasePathMapping"]= {
             "Type": "AWS::ApiGateway::BasePathMapping",
             "Properties": {
                "BasePath": "order-gateway",
                "DomainName": `{{resolve:ssm:/${process.env.STAGE}/domain-name:1}}`,
                "RestApiId": "!Ref 'API'",
                "Stage": "staging"
             }
          };
      }
      if (_isObject(value)) {
        // To API responses, add quotes on index 200
        if (key === 'responses' && obj[key].hasOwnProperty(200)) {
          console.log('found 200! ');
          const resp200 = obj[key]['200'];
          //aux
          delete obj[key]['200'];
          //reuse object
          obj[key]["\'200\'"] = resp200;
        }
        // Asociate API key on APIBasePathMapping
        if (obj[key]['Type'] !== undefined && obj[key]['Type'] === 'AWS::Serverless::Api') {
            console.log('Api found in:', key);
            Slordertasdsa
            obj["APIBasePathMapping"]["Properties"]["RestApiId"] = {Ref: key};
            obj["APIBasePathMapping"]["Properties"]["Stage"] = {Ref: key+'.Stage'};

        }
        // Change Name format
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
    let fileContents = fs.readFileSync('dist/sam-template.yml');
    let data = yaml.safeLoad(fileContents);
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