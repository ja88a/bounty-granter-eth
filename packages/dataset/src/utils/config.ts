import { ValidatorOptions } from 'class-validator';

// TODO PROD enforce IO validation
/**
 * Imported Data validation options
 */
export const VALID_OPT: ValidatorOptions = {
  skipMissingProperties: false,
  forbidUnknownValues: true, // PROD set valid_opts forbidUnknownValues to `true`
  whitelist: true, // PROD set valid_opts whilelist to `true`
  forbidNonWhitelisted: true,
  //groups: string[],
  dismissDefaultMessages: false,
  validationError: {
    target: true,
    value: true,
  },
  stopAtFirstError: false,
};

/**
 * Supported run modes
 */
export enum EConfigRunMode {
  PROD = 'prod',
  DEV = 'dev',
  default = PROD,
}
