import { expect } from 'chai';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

import {
  DUMP_FILE_OUTPUT,
  DUMP_LOG_OUTPUT,
  loadYaml,
  SOURCE_DEFAULT,
} from './testing.commons';

// before((done) => {
//     fs.mkdir('./build/samples/grants', { recursive: true }, () => { });
//     setTimeout(done, 500);
// });

describe('Test yaml to json to yaml', () => {
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
    'Should dump the JSON to file ./build/samples/' +
      SOURCE_DEFAULT +
      '_dump.json',
    async function () {
      const dataJsonRaw = loadYaml();
      if (DUMP_LOG_OUTPUT) console.log('\n### YAML to JSON\n', dataJsonRaw);
      if (DUMP_FILE_OUTPUT)
        fs.writeFileSync(
          './build/samples/' + SOURCE_DEFAULT + '_dump.json',
          JSON.stringify(dataJsonRaw),
        );
    },
  );

  it(
    'Should dump back to a correct YAML file ./build/samples/' +
      SOURCE_DEFAULT +
      '_dump.yaml',
    async function () {
      const dataJsonRaw = loadYaml();
      const dataYaml: string = yaml.dump(dataJsonRaw, {
        styles: {
          '!!null': 'lowercase', // dump null as `null`
        },
        sortKeys: false, // sort object keys
        condenseFlow: true,
        noArrayIndent: false,
        noCompatMode: true,
      });
      if (DUMP_LOG_OUTPUT) console.log('\n\n### Back to YAML\n\n' + dataYaml);
      if (DUMP_FILE_OUTPUT)
        fs.writeFileSync(
          './build/samples/' + SOURCE_DEFAULT + '_dump.yaml',
          dataYaml,
        );
    },
  );
});

export {};
