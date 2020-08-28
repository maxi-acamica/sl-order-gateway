const fs = require('fs');
const YAML = require('json-to-pretty-yaml');

const json = require('../dist/cloudformation-template-update-stack.json');

const data = YAML.stringify(json);

fs.writeFile('template-generated.yaml', data, () => {return true});