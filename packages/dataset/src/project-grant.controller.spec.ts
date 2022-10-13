import * as fs from 'fs';
import { ProjectGrantController } from './project-grant.controller'; //'@bounty-granter-eth/dataset';

import Logger from './utils/logger.winston'

const logger = Logger.child({ class: 'ProjectGrantControllerSpec' });

describe('Test the load of  a Project Grant from YAML', () => {
    it("Should load sample YAML file and cast to ProjectGrantData", async function() {
        const pgControl: ProjectGrantController = new ProjectGrantController();
        logger.info("Log my info");
        logger.warn("Log my warn with obj: "+ pgControl);
        let fileContents = fs.readFileSync('samples/grants/dmnemo-backup_v2_id.yaml', 'utf8');
        pgControl.loadYaml(fileContents);
    });
});