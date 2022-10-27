import { expect, assert } from 'chai';
import * as fs from 'fs';
import * as cbor from 'cbor';
import { decode, encode } from 'cbor-x';

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
      // eslint-disable-next-line @typescript-eslint/no-empty-function
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
    'Should encode [and dump] the JSON content to CBOR-X [file ./build/samples/' +
      SOURCE_DEFAULT +
      '_dump.cborx.bin]',
    async function () {
      const dataJsonRaw = loadYaml();
      //const cbor = require('cbor');
      const cborB: Buffer = encode(dataJsonRaw);
      // if (DUMP_LOG_OUTPUT)
      //     console.log("\n### YAML to CBOR\n", cborB);
      if (DUMP_FILE_OUTPUT)
        fs.writeFileSync(
          './build/samples/' + SOURCE_DEFAULT + '_dump.cborx.bin',
          cborB,
        );
      expect(cborB).to.not.be.null;
    },
  );

  it(
    'Should decode the CBOR-X content to JSON content [and dump file ./build/samples/' +
      SOURCE_DEFAULT +
      '_dump.cborx.json]',
    async function () {
      const dataJsonRaw = loadYaml();
      //const cbor = require('cbor');
      const cborB: Buffer = encode(dataJsonRaw);
      const decoded = decode(cborB);
      if (DUMP_LOG_OUTPUT)
        console.log('\n### CBOR-X to JSON\n', JSON.stringify(decoded));
      assert(
        JSON.stringify(dataJsonRaw) === JSON.stringify(decoded),
        'CBOR-X Output JSON differs from input one',
      );
      if (DUMP_FILE_OUTPUT)
        fs.writeFileSync(
          './build/samples/' + SOURCE_DEFAULT + '_dump.cborx.json',
          JSON.stringify(decoded),
        );
    },
  );

  it('Should test encoding & decoding times of CBOR & CBOR-X', async function () {
    const dataJsonRaw = loadYaml();

    const startEncodeCborX = new Date().getTime();
    const cborxB: Buffer = encode(dataJsonRaw);
    const endEncodeCborX = new Date().getTime();
    console.log('CBOR-X Encoding time: ', endEncodeCborX - startEncodeCborX);

    const startEncodeCbor = new Date().getTime();
    const cborB: Buffer = cbor.encodeOne(dataJsonRaw);
    const endEncodeCbor = new Date().getTime();
    console.log('CBOR Encoding time: ', endEncodeCbor - startEncodeCbor);

    const startDecodeCborX = new Date().getTime();
    const decodedX = decode(cborxB);
    const endDecodeCborX = new Date().getTime();
    console.log('CBOR-X Decoding time: ', endDecodeCborX - startDecodeCborX);

    const startDecodeCbor = new Date().getTime();
    const decoded = cbor.decodeAllSync(cborB)[0];
    const endDecodeCbor = new Date().getTime();
    console.log('CBOR Decoding time: ', endDecodeCbor - startDecodeCbor);
  });
});

export {};
