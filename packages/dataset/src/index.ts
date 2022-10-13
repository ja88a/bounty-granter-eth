import * as fs from 'fs';
import * as yaml from 'js-yaml';


try {
    let fileContents = fs.readFileSync('./samples/grants/dmnemo-backup.yaml', 'utf8');
    let data = yaml.load(fileContents);

    console.log(data);
} catch (e) {
    console.log(e);
}

export * from './data/index';
export { ProjectGrantController } from './project-grant.controller';