import { expect, assert } from 'chai';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as cbor from 'cbor';

const SOURCE_V1 = 'grants/dmnemo-backup_v1_full';
const SOURCE_V2 = 'grants/dmnemo-backup_v2_id';
const SOURCE_DEFAULT = SOURCE_V2;

const DUMP_LOG_OUTPUT = true;
const DUMP_FILE_OUTPUT = true;

function loadYaml(yamlFileNameNoExt?: string) {
    let filePath = './samples/' + SOURCE_DEFAULT + '.yaml';
    if (yamlFileNameNoExt)
        filePath = './samples/' + yamlFileNameNoExt + '.yaml'
    let fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents);
}

describe('Test yaml to json to CBOR', () => {
    it("Should create a build dir ./build/samples/grants", async function () {
        if (DUMP_FILE_OUTPUT) {
            fs.mkdir('./build/samples/grants', { recursive: true }, () => { });
            setTimeout(() => { }, 1000);
        }
    });

    it("Should load the sample YAML file ./samples/" + SOURCE_DEFAULT + ".yaml", async function () {
        let dataJsonRaw = loadYaml();
        expect(dataJsonRaw).to.not.be.null;
    });

    it("Should encode [and dump] the JSON content to CBOR [file ./build/samples/" + SOURCE_DEFAULT + "_dump.cbor.bin]", async function () {
        let dataJsonRaw =  loadYaml();
        //const cbor = require('cbor');
        let cborB: Buffer = cbor.encodeOne(dataJsonRaw);
        // if (DUMP_LOG_OUTPUT)
        //     console.log("\n### YAML to CBOR\n", cborB);
        if (DUMP_FILE_OUTPUT)
            fs.writeFileSync('./build/samples/' + SOURCE_DEFAULT + '_dump.cbor.bin', cborB);
        expect(cborB).to.not.be.null;
    });
    
    it("Should decode the CBOR content to JSON content to CBOR [and dump file ./build/samples/" + SOURCE_DEFAULT + "_dump.cbor.json]", async function () {
        let dataJsonRaw =  loadYaml();
        //const cbor = require('cbor');
        let cborB: Buffer = cbor.encodeOne(dataJsonRaw);        
        let decoded = cbor.decodeAllSync(cborB)[0];
        if (DUMP_LOG_OUTPUT)
            console.log("\n### CBOR to JSON\n", JSON.stringify(decoded));
        assert(JSON.stringify(dataJsonRaw) === JSON.stringify(decoded), "CBOR Output JSON differs from input one");
        if (DUMP_FILE_OUTPUT)
            fs.writeFileSync('./build/samples/' + SOURCE_DEFAULT + '_dump.cbor.json', JSON.stringify(decoded));
       
    });
});

export { };