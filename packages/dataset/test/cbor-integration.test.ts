import { expect, assert } from 'chai';
import * as fs from 'fs';
import * as cbor from 'cbor';

import {
  DUMP_FILE_OUTPUT,
  DUMP_LOG_OUTPUT,
  loadYaml,
  SOURCE_DEFAULT,
} from './testing.commons';

describe('Test yaml to json to CBOR', () => {
  it('Should create a build dir ./build/samples/grants', async function () {
    if (DUMP_FILE_OUTPUT) {
      fs.mkdir('./build/samples/grants', { recursive: true }, () => {});
      setTimeout(() => {}, 1000);
    }
  });

  it(
    'Should load the sample YAML file ./samples/' + SOURCE_DEFAULT + '.yaml',
    async function () {
      const dataJsonRaw = loadYaml();
      expect(dataJsonRaw).to.not.be.null;
    },
  );

  it(
    'Should encode [and dump] the JSON content to CBOR [file ./build/samples/' +
      SOURCE_DEFAULT +
      '_dump.cbor.bin]',
    async function () {
      const dataJsonRaw = loadYaml();
      //const cbor = require('cbor');
      const cborB: Buffer = cbor.encodeOne(dataJsonRaw);
      // if (DUMP_LOG_OUTPUT)
      //     console.log("\n### YAML to CBOR\n", cborB);
      if (DUMP_FILE_OUTPUT)
        fs.writeFileSync(
          './build/samples/' + SOURCE_DEFAULT + '_dump.cbor.bin',
          cborB,
        );
      expect(cborB).to.not.be.null;
    },
  );

  it(
    'Should decode the CBOR content to JSON content to CBOR [and dump file ./build/samples/' +
      SOURCE_DEFAULT +
      '_dump.cbor.json]',
    async function () {
      const dataJsonRaw = loadYaml();
      //const cbor = require('cbor');
      const cborB: Buffer = cbor.encodeOne(dataJsonRaw);
      const decoded = cbor.decodeAllSync(cborB)[0];
      if (DUMP_LOG_OUTPUT)
        console.log('\n### CBOR to JSON\n', JSON.stringify(decoded));
      assert(
        JSON.stringify(dataJsonRaw) === JSON.stringify(decoded),
        'CBOR Output JSON differs from input one',
      );
      if (DUMP_FILE_OUTPUT)
        fs.writeFileSync(
          './build/samples/' + SOURCE_DEFAULT + '_dump.cbor.json',
          JSON.stringify(decoded),
        );
    },
  );
});

export {};
