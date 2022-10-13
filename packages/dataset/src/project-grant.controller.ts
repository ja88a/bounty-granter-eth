import 'reflect-metadata';
import { validateOrReject, ValidatorOptions } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import * as yaml from 'js-yaml';
import { ProjectGrantData } from './data/project-grant.data';
import logger from './utils/logger.winston';

export const VALID_OPT: ValidatorOptions = {
    skipMissingProperties: false,
    forbidUnknownValues: true, // TODO PROD enforce IO validation
    whitelist: true,
    forbidNonWhitelisted: true,
    //groups: string[],
    dismissDefaultMessages: false,
    validationError: {
        target: true,
        value: true,
    },
    stopAtFirstError: true
};

export enum EConfigRunMode {
    PROD = 'prod',
    DEV = 'dev',
    default = PROD,
}

export class ProjectGrantController {
    /** Dedicated logger */
    private readonly logger = logger.child({ class: ProjectGrantController.name });

    /** 
     * Default constructor 
     */
    constructor() { }

    /**
     * Load a Project Grant from a YAML content
     * @param content yaml raw content
     * @returns 
     */
    async loadYaml(content: string): Promise<ProjectGrantData> {
        const projectGrantRaw = yaml.load(content, { json: true });
        const projectGrant: ProjectGrantData = plainToInstance(ProjectGrantData, projectGrantRaw);
        await validateOrReject(projectGrant, VALID_OPT)
            .catch(error => {
                throw new Error("Import of project grant from YAML failed", {cause: error});
            });
        return projectGrant;
    }

}

