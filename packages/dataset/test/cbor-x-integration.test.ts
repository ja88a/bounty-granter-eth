import { expect, assert } from 'chai';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as cbor from 'cbor';
import { decode, encode } from 'cbor-x';

import { DUMP_FILE_OUTPUT, DUMP_LOG_OUTPUT, SOURCE_DEFAULT } from './testing.commons';

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

    it("Should encode [and dump] the JSON content to CBOR-X [file ./build/samples/" + SOURCE_DEFAULT + "_dump.cborx.bin]", async function () {
        let dataJsonRaw =  loadYaml();
        //const cbor = require('cbor');
        let cborB: Buffer = encode(dataJsonRaw);
        // if (DUMP_LOG_OUTPUT)
        //     console.log("\n### YAML to CBOR\n", cborB);
        if (DUMP_FILE_OUTPUT)
            fs.writeFileSync('./build/samples/' + SOURCE_DEFAULT + '_dump.cborx.bin', cborB);
        expect(cborB).to.not.be.null;
    });
    
    it("Should decode the CBOR-X content to JSON content [and dump file ./build/samples/" + SOURCE_DEFAULT + "_dump.cborx.json]", async function () {
        let dataJsonRaw =  loadYaml();
        //const cbor = require('cbor');
        let cborB: Buffer = encode(dataJsonRaw);        
        let decoded = decode(cborB);
        if (DUMP_LOG_OUTPUT)
            console.log("\n### CBOR-X to JSON\n", JSON.stringify(decoded));
        assert(JSON.stringify(dataJsonRaw) === JSON.stringify(decoded), "CBOR-X Output JSON differs from input one");
        if (DUMP_FILE_OUTPUT)
            fs.writeFileSync('./build/samples/' + SOURCE_DEFAULT + '_dump.cborx.json', JSON.stringify(decoded));
       
    });

    it("Should test encoding & decoding times of CBOR & CBOR-X", async function () {
        let dataJsonRaw =  loadYaml();
        
        let startEncodeCborX = new Date().getTime();
        let cborxB: Buffer = encode(dataJsonRaw);
        let endEncodeCborX = new Date().getTime();
        console.log("CBOR-X Encoding time: ", (endEncodeCborX-startEncodeCborX));
        
        let startEncodeCbor = new Date().getTime();
        let cborB: Buffer = cbor.encodeOne(dataJsonRaw);  
        let endEncodeCbor = new Date().getTime();     
        console.log("CBOR Encoding time: ", (endEncodeCbor-startEncodeCbor));
 
        let startDecodeCborX = new Date().getTime();
        let decodedX = decode(cborxB);
        let endDecodeCborX = new Date().getTime();    
        console.log("CBOR-X Decoding time: ", (endDecodeCborX-startDecodeCborX));

        let startDecodeCbor = new Date().getTime();
        let decoded = cbor.decodeAllSync(cborB)[0];
        let endDecodeCbor = new Date().getTime();     
        console.log("CBOR Decoding time: ", (endDecodeCbor-startDecodeCbor));
    });

});

export { };