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
    let fileContents = fs.readFileSync('templates/sam-template.yml', 'utf8');
    let data = yaml.safeLoad(fileContents);
    console.log(data);
    
    // update json object
    if (data.Resources[0] !== undefined)
    {
        data.Resources[0].Properties.CodeUri = "./dist/queue_order.zip";
        console.log(data.Resources[0].Properties);
    } else {
        console.log(data.Resources.Properties);
        data.Resources.Properties.CodeUri = "./dist/queue_order.zip";
    }
    // convert to string object
    const stringData = YAML.stringify(data);
    // try to save as yml
    fs.writeFile('templates/sam-template-edited.yml', stringData, () => {return true});

    console.log('sam Yml fiel updated successfully');
} catch (e) {
    console.error(e);
}