const fs = require('fs');
const YAML = require('json-to-pretty-yaml');
const yaml = require('js-yaml');
//Get template from dist
const jsonTemplate = require('../dist/cloudformation-template-update-stack.json');

try {
    const GITHASH = process.argv.slice(2);
    console.log(GITHASH);
    //get template after aws package
    let fileContents = fs.readFileSync('packaged-template.yml', 'utf8');
    let dataTemplatePackaged = yaml.safeLoad(fileContents);
    // update json object
    const codeUri = dataTemplatePackaged.Resources[0].Properties.CodeUri;
    
    const splited = codeUri.split('/');
    //const splited = codeUri.split('/');
    const hash = splited.pop();
    const bucket = splited.pop();
    
    jsonTemplate.Resources.QueueUnderscoreorderLambdaFunction.Properties.Code = {S3Bucket: bucket, S3Key: hash};

    // convert to string object
    const stringDataTemplate = YAML.stringify(jsonTemplate);
    //Aca se guarda el hash yel bucket que se obtienen de templatePackaged
    const nameTemplate = GTIHASH+'.yml';
    fs.writeFile(nameTemplate, stringDataTemplate, () => {return true});
} catch (e){
    console.error(e);
}