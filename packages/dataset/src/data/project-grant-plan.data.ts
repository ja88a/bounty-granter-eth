import {
    Length,
    IsEnum,
    IsDefined,
    IsOptional,
    ArrayMaxSize,
    IsNumber,
    IsString,
    IsInt,
    ArrayMinSize,
    IsArray,
    ArrayUnique,
} from 'class-validator';
import { EConditionMix as EPgConditionMix } from './project-grant-condition.data';

/**
 * Outcome of a project grant activity
 */
export class PgOutcome {
    /** 
     * Outcome ID 
     * @example 1
     */
    @IsDefined()
    @IsNumber()
    @IsInt()
    // @IsPositive()
    id!: number;

    /** 
     * Outcome name 
     * @example 'Expected outcome #1 of activity #2'
     */
    @IsDefined()
    @IsString()
    @Length(3, 50)
    name!: string;

    /** 
     * Token transfers related to the outcome result
     * @example [2, 5]
     * @see PgTransfer
     */
    @IsDefined()
    @IsArray()
    @IsInt({ each: true })
    @ArrayUnique()
    transfer!: number[];

    /** 
     * Payment sharing model, its ID
     * @example 1
     * @see PgTransferShare
     */
    @IsDefined()
    @IsInt()
    share!: number;

    /**
     * List of conditions impacting the transfer ratio
     * @example [1,4]
     * @see {@link PgCondition}
     */
    @IsDefined()
    @IsArray()
    @ArrayMaxSize(10)
    @ArrayUnique()
    @IsInt({ each: true })
    condition!: number[]

    /**
     * Method used to compute the final transfer amount when several conditions are defined
     * @example 0
     * @see {@link EPgConditionMix}
     */
    @IsDefined()
    @IsEnum(EPgConditionMix)
    condition_mix!: EPgConditionMix;
}

/**
 * Project grant Activity definition
 */
export class PgActivity {
    /** 
     * Activity ID 
     * @example 1
     */
    @IsDefined()
    @IsNumber()
    @IsInt()
    // @IsPositive()
    id!: number;

    /** 
     * Activity name 
     * @example 'Awesome activity title #101'
     */
    @IsDefined()
    @IsString()
    @Length(3, 50)
    name!: string;

    /** 
     * Reference to external documents depicting the activity 
     * @example ["https://github.com/scrtlabs/Grants/issues/70", "https://forum.scrt.network/t/ccbl-crowdfunding-platform/6262"]
     */
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(5)
    @Length(8, 120, { each: true })
    @ArrayUnique()
    doc?: string[];

    /**
     * Activity outcomes, their ID
     * @example [0,2]
     */
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @IsInt({ each: true })
    @ArrayUnique()
    outcome?: number[];
}

/**
 * A group of project grant activities
 */
export class PgActivityGroup {
    /** 
     * Activity Group ID 
     * @example 1
     */
    @IsDefined()
    @IsNumber()
    @IsInt()
    // @IsPositive()
    id!: number;

    /** 
     * Activity Group name 
     * @example 'Best plan ever #101'
     */
    @IsDefined()
    @IsString()
    @Length(3, 50)
    name!: string;

    /**
     * Optional project phase number associated to the group of activities
     * @example 1
     */
    @IsOptional()
    @IsNumber()
    @IsInt()
    // @IsPositive()
    phase?: number;

    /** 
     * Activities composing the group
     */
    @IsDefined()
    @IsArray()
    @ArrayMinSize(0)
    @ArrayMaxSize(20)
    @IsInt({ each: true })
    @ArrayUnique()
    activity!: number[]
}

/**
 * Project grant execution Plan
 */
export class PgPlan {
    /** 
     * Plan ID 
     * @example 1
     */
    @IsDefined()
    @IsNumber()
    @IsInt()
    // @IsPositive()
    id!: number;

    /** 
     * Plan name 
     * @example 'Best plan ever #101'
     */
    @IsDefined()
    @IsString()
    @Length(3, 50)
    name!: string;

    /** 
     * Groups of activities defining the plan 
     */
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(10)
    @IsInt({ each: true })
    @ArrayUnique()
    group?: number[];
}