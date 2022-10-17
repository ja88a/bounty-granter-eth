import 'reflect-metadata';
import { validate, validateOrReject, validateSync, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import * as yaml from 'js-yaml';

import Logger from './utils/logger.winston';
import { VALID_OPT } from './utils/config';

import { ProjectGrant } from './data/project-grant.data';

export class ProjectGrantController {
    /** Dedicated logger */
    private readonly logger = Logger.child({ class: ProjectGrantController.name });

    /** 
     * Default constructor 
     */
    constructor() { }

    /**
     * Load a Project Grant from a YAML 1.2 textual description
     * 
     * @param content The YAML raw content @example version: 1\nstatus: 0
     * @param validate Validate or not the loaded Project Grant definition (default: `true`)
     * @return { ProjectGrant, ValidationError[] } Instantiated project grant from the input definition and potential validation errors
     */
    async loadYaml(content: string, validate: boolean = true)
        : Promise<{ projectGrant: ProjectGrant, validationErrors: ValidationError[] }> {
        const pgRaw = yaml.load(content, { json: false });
        const pg: ProjectGrant = plainToInstance(ProjectGrant, pgRaw);
        this.logger.info("Yaml Project Grant definition loaded. name: '" + pg.project.name + "'");

        let validationErr: ValidationError[] = [];
        if (validate)
            validationErr = await this.validatePG(pg);

        return {
            projectGrant: pg,
            validationErrors: validationErr
        }
    }

    /**
     * Validate a project grant and provide fields & values validation errors if any
     * @param projectGrant 
     * @return 
     */
    async validatePG(projectGrant: ProjectGrant): Promise<ValidationError[]> {
        // await validateOrReject(pg, VALID_OPT)
        //     .catch(error => {
        //         throw new Error("Project grant Validation fails", {cause: error});
        //     });
        const validationErr: ValidationError[] = await validate(projectGrant, VALID_OPT)
            .catch(error => {
                throw new Error("Fail to validate PG definition", { cause: error });
            });
        return validationErr;

        // TODO @todo prevent from having 2 actors with the same address when validating a PG, except for the role proposer

    }

}

