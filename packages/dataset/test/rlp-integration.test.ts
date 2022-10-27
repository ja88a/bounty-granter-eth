import { expect } from 'chai';
import * as RLP from 'rlp';
import { encode } from 'cbor-x';
import * as fs from 'fs';

import { DUMP_FILE_OUTPUT, loadYaml, SOURCE_DEFAULT } from './testing.commons';

describe('Test yaml to json to RLP', () => {
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
    'Should encode [and dump] the JSON content to RLP [file ./build/samples/' +
      SOURCE_DEFAULT +
      '_dump.rlp.bin]',
    async function () {
      const dataJsonRaw = loadYaml();
      const rlpOut: Uint8Array = RLP.encode(JSON.stringify(dataJsonRaw));
      // if (DUMP_LOG_OUTPUT)
      //     console.log("\n### YAML to CBOR\n", cborB);
      if (DUMP_FILE_OUTPUT)
        fs.writeFileSync(
          './build/samples/' + SOURCE_DEFAULT + '_dump.rlp.bin',
          rlpOut,
        );
      expect(rlpOut).to.not.be.null;
    },
  );

  it(
    'Should encode [and dump] the CBOR content to RLP [file ./build/samples/' +
      SOURCE_DEFAULT +
      '_dump.cbor.rlp.bin]',
    async function () {
      const dataJsonRaw = loadYaml();
      const cborxB: Buffer = encode(dataJsonRaw);
      const rlpOut: Uint8Array = RLP.encode(cborxB);
      // if (DUMP_LOG_OUTPUT)
      //     console.log("\n### YAML to CBOR\n", cborB);
      if (DUMP_FILE_OUTPUT)
        fs.writeFileSync(
          './build/samples/' + SOURCE_DEFAULT + '_dump.cbor.rlp.bin',
          rlpOut,
        );
      expect(rlpOut).to.not.be.null;
    },
  );
});

export {};
