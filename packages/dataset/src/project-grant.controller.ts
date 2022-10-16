import 'reflect-metadata';
import { validateOrReject } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import * as yaml from 'js-yaml';
import { ProjectGrant } from './data/project-grant.data';
import Logger from './utils/logger.winston';
import { VALID_OPT } from './utils/config';

export class ProjectGrantController {
    /** Dedicated logger */
    private readonly logger = Logger.child({ class: ProjectGrantController.name });

    /** 
     * Default constructor 
     */
    constructor() { }

    /**
     * Load a Project Grant from a YAML description
     * 
     * @param content YAML raw content
     * @return {ProjectGrant} Instantiated project grant from the input definition
     */
    async loadYaml(content: string): Promise<ProjectGrant> {
        const projectGrantRaw = yaml.load(content, { json: true });
        const projectGrant: ProjectGrant = plainToInstance(ProjectGrant, projectGrantRaw);
        //this.logger.info("Project Grant name: " + projectGrant.project.name);
        await validateOrReject(projectGrant, VALID_OPT)
            .catch(error => {
                this.logger.error("Project grant Validation from YAML input fails\n" + error);
                throw new Error("Project grant Validation from input YAML fails", {cause: error});
            });
        return projectGrant;
    }

    /**
     * Validate a project grant and provide fields & values validation errors if any
     * @param projectGrant 
     * @return 
     */
    async validatePG(projectGrant: ProjectGrant) {
        await validateOrReject(projectGrant, VALID_OPT)
        .catch(error => {
            throw new Error("Project grant Validation fails", {cause: error});
        });

        // TODO @todo prevent from having 2 actors with the same address when validating a PG, except for the role proposer

    }

}

