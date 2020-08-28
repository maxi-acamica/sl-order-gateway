const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path')
const YAML = require('json-to-pretty-yaml');

/**
 * Helper used to edit yaml sam file
 * and fix zip origin by compatibility
 * between framework and sam file
 */

try {
    let fileContents = fs.readFileSync('sam-template.yml', 'utf8');
    let data = yaml.safeLoad(fileContents);
    // update json object
    data.Resources[0].Properties.CodeUri = "./dist/queue_order.zip";
    // convert to string object
    const stringData = YAML.stringify(data);
    // try to save as yml
    fs.writeFile('sam-template-edited.yml', stringData, () => {return true});

    console.log('sam Yml fiel updated successfully');
} catch (e) {
    console.error(e);
}