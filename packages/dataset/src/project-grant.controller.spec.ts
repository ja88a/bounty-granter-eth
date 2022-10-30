import 'reflect-metadata';
import { assert } from 'chai';
import { plainToInstance } from 'class-transformer';
import { ValidationError, validateOrReject } from 'class-validator';
import * as fs from 'fs';
import { ProjectGrant } from './data/project-grant.data';
import { ProjectGrantController } from './project-grant.controller';
import { VALID_OPT } from './utils/config';

import Logger from './utils/logger';
import { fail } from 'assert';

const logger = Logger.child({ label: 'ProjectGrantController-SPEC' });

const PG_YAML_FILE1 = 'samples/grants/project-grant.ref-sample-1.yml';

describe('Test the load of  a Project Grant from YAML', () => {
  it('Should load sample YAML file and cast to ProjectGrantData', async function () {
    //const pgControl: ProjectGrantController = new ProjectGrantController();
    const fileContent = fs.readFileSync(PG_YAML_FILE1, 'utf8');
    const projectGrant: ProjectGrant = plainToInstance(
      ProjectGrant,
      fileContent /* , { enableImplicitConversion: true } */,
    );

    await validateOrReject(projectGrant, VALID_OPT).catch((error) => {
      logger.warn('Project grant Validation from YAML input fails\n' + error);
      //this.logger.info("Project grant Validation from YAML input fails\n" + error.toString());
      throw new Error(
        'Project grant Validation from input YAML fails\n' + error,
      );
    });
    logger.debug('Final project grant: ' + JSON.stringify(projectGrant));
    assert.exists(projectGrant);
    //assert.exists(projectGrant.project);
    //assert.exists(projectGrant.project?.name, "Project Grant definition not correctly loaded");
  });

  it('Should load sample YAML file and cast to ProjectGrantData', async function () {
    const pgControl: ProjectGrantController = new ProjectGrantController();
    const fileContent = fs.readFileSync(PG_YAML_FILE1, 'utf8');

    let pgRes: {
      projectGrant: ProjectGrant;
      validationErrors?: ValidationError[] | undefined;
    };
    try {
      pgRes = await pgControl.loadYaml(fileContent, true);
    } catch (error) {
      fail(
        "Errors met while loading the PG yaml input '" +
          PG_YAML_FILE1 +
          "'\n" +
          error +
          '\nLoaded yaml:\n' +
          fileContent,
      );
    }

    const projectGrant = pgRes.projectGrant;
    assert.exists(projectGrant);

    //assert.exists(projectGrant.project);
    assert.exists(
      projectGrant.project?.name,
      'Project Grant definition not correctly loaded',
    );

    const validationErrors = pgRes.validationErrors;
    assert.exists(validationErrors);
    const errors: string[] = [];
    if (validationErrors && validationErrors.length > 0) {
      validationErrors.map((ve) => {
        errors.push(ve.toString());
        if (ve.children) {
          ve.children.map((cve) => {
            errors.push('\n' + cve.toString());
          });
        }
      });
    }
    if (errors.length > 0) logger.error(errors);
    assert.equal(
      validationErrors?.length,
      0,
      "No validation errors should be found on loaded PG '" + PG_YAML_FILE1 + "'",
    );
    logger.debug('Final project grant: ' + JSON.stringify(pgRes.projectGrant));
  });
});
