import * as yaml from 'js-yaml';
import * as fs from 'fs';

export const SOURCE_V1 = 'grants/project-grant.ref-sample-1';
export const SOURCE_DEFAULT = SOURCE_V1;

export const DUMP_LOG_OUTPUT = false;
export const DUMP_FILE_OUTPUT = true;

export const buf2hex = (x: Buffer): string => '0x' + x.toString('hex');

export const loadYaml = (yamlFileNameNoExt?: string) => {
  let filePath = './samples/' + SOURCE_DEFAULT + '.yaml';
  if (yamlFileNameNoExt) filePath = './samples/' + yamlFileNameNoExt + '.yaml';
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContents);
};
