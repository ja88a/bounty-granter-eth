import { Type } from 'class-transformer';
import {
    Length,
    IsEnum,
    IsDefined,
    IsEthereumAddress,
    IsOptional,
    Max,
    ValidateIf,
    ValidateNested,
    Min,
    IsPositive,
    ArrayMaxSize,
    IsDateString,
    IsNumber,
    IsString,
    IsInt,
    ArrayMinSize,
    IsArray,
    ValidatorConstraint,
    ValidationArguments,
    ValidatorConstraintInterface,
    isEthereumAddress,
    Validate,
    ArrayUnique,
} from 'class-validator';
import { IsEthAddressArray } from './project-grant.data';



export enum EPgChain {
    ETH = 0,
    OPTIMISM = 2,
    POLYGON = 1,
    default = OPTIMISM
}

export enum EPgTokenType {
    ERC20 = 0,
    ERC721 = 100,
    ERC1555 = 200,
    default = ERC20
}

export class PgToken {
    id!: number;

    @IsDefined()
    @IsEthereumAddress()
    contract!: string;

    @IsDefined()
    @IsEnum(EPgTokenType)
    type: EPgTokenType = EPgTokenType.default;

    @IsOptional()
    @IsEnum(EPgChain)
    chain?: EPgChain = EPgChain.default;

    @ValidateIf(o => o.type == EPgTokenType.ERC721)
    @IsDefined()
    @IsString()
    @Length(1,70)
    tokenId?: string;
}


/**
 * Expenses supported statuses
 */
export enum EExpenseStatus {
    OPEN = 0,
    CLOSED = 20,
    default = OPEN
}

/**
 * Expense (executors' retribution) related to the completion of an activity outcome 
 */
export class PgExpense {
    /** Internal ID of the expense 
     * @example 3
    */
    @IsDefined()
    @IsNumber()
    @IsInt()
    id!: number;

    /** Expense status
     * @example 0
     */
    @IsDefined()
    @IsEnum(EExpenseStatus)
    status!: EExpenseStatus;

    /** Expense amount 
     * @example 99.92
    */
    @IsDefined()
    @IsNumber()
    @IsPositive()
    amount!: number;

    /** ID of the token to use for paying the expense 
     * @example 1
     * @see PgToken
    */
    token!: number;

    /**  */
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(20)
    @Length(10, 100)
    @ArrayUnique()
    tx?: string[];
}

/**
 * List of supported computations when mixing different conditions
 */
export enum EConditionMix {
    /** 
     * Method 'everything ok' or 'all or nothing'. 
     * All conditions must be met.
     * Example usage: all conditions must be a majority of yes vote */
    REQUIRE_AND = 0,

    /** 
     * Method 'weighted average'. Each condition output ratio of the expense has a corresponding weight to compute an average 
     */
    AVERAGE_WEIGHTED = 1,

    /** Default method */
    default = AVERAGE_WEIGHTED
}

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
     * Related expense ID 
     * @example 2
     */
    @IsDefined()
    @IsInt()
    expense!: number;

    /** 
     * Payment sharing model, its ID
     * @example 1
     */
    @IsDefined()
    @IsInt()
    share!: number;

    /**
     * List of conditions impacting the expense ratio
     * @example [1,4]
     */
    @IsDefined()
    @IsArray()
    @ArrayMaxSize(10)
    @ArrayUnique()
    @IsInt({ each: true })
    condition!: number[]

    /**
     * Method used to compute the final expense amount when several conditions are defined
     * @example 0
     */
    @IsDefined()
    @IsEnum(EConditionMix)
    condition_mix!: EConditionMix;
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