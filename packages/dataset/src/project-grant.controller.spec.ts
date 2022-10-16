import * as fs from 'fs';
import { ProjectGrantController } from './project-grant.controller'; //'@bounty-granter-eth/dataset';

import Logger from './utils/logger.winston'

const logger = Logger.child({ class: 'ProjectGrantController-SPEC' });

describe('Test the load of  a Project Grant from YAML', () => {
    it("Should load sample YAML file and cast to ProjectGrantData", async function() {
        const pgControl: ProjectGrantController = new ProjectGrantController();
        let fileContents = fs.readFileSync('samples/grants/project-grant.ref-sample-1.yml', 'utf8');
        logger.debug("Loaded obj:\n"+ fileContents);
        let pgControlRes = await pgControl.loadYaml(fileContents);
        logger.debug("Final project grant: "+ JSON.stringify(pgControlRes));
    });
});