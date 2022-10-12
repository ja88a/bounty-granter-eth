import { expect, assert } from 'chai';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as RLP from 'rlp';
import { decode, encode } from 'cbor-x';

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

describe('Test yaml to json to RLP', () => {
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

    it("Should encode [and dump] the JSON content to RLP [file ./build/samples/" + SOURCE_DEFAULT + "_dump.rlp.bin]", async function () {
        let dataJsonRaw =  loadYaml();
        let rlpOut: Uint8Array = RLP.encode(JSON.stringify(dataJsonRaw));
        // if (DUMP_LOG_OUTPUT)
        //     console.log("\n### YAML to CBOR\n", cborB);
        if (DUMP_FILE_OUTPUT)
            fs.writeFileSync('./build/samples/' + SOURCE_DEFAULT + '_dump.rlp.bin', rlpOut);
        expect(rlpOut).to.not.be.null;
    });

    it("Should encode [and dump] the CBOR content to RLP [file ./build/samples/" + SOURCE_DEFAULT + "_dump.cbor.rlp.bin]", async function () {
        let dataJsonRaw =  loadYaml();
        let cborxB: Buffer = encode(dataJsonRaw);
        let rlpOut: Uint8Array = RLP.encode(cborxB);
        // if (DUMP_LOG_OUTPUT)
        //     console.log("\n### YAML to CBOR\n", cborB);
        if (DUMP_FILE_OUTPUT)
            fs.writeFileSync('./build/samples/' + SOURCE_DEFAULT + '_dump.cbor.rlp.bin', rlpOut);
        expect(rlpOut).to.not.be.null;
    });
});

export { };