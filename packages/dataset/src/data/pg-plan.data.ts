import {
    Length,
    IsEnum,
    IsDefined,
    IsEthereumAddress,
    IsOptional,
    ValidateIf,
    IsPositive,
    ArrayMaxSize,
    IsNumber,
    IsString,
    IsInt,
    ArrayMinSize,
    IsArray,
    Validate,
    ArrayUnique,
} from 'class-validator';
import { IsEthAddressArray } from './project-grant.data';

/**
 * Types of supported sharing models for token transfers
 */
export enum EPgTransferShareType {
    /** Sharing model 'map listed actor to a custom percentage' */
    MAP_PERCENT = 0,
    /** Sharing model 'every listed actor get the same percentage' */
    EQUI_PERCENT = 1,
    /** Default sharing model */
    default = MAP_PERCENT
}

/** 
 * Sharing model for transfering tokens among recipients (PG actors)
 */
export class PgTransferShare {
    /** 
     * Internal **ID** of the sharing model 
     * @example 0
     */
    @IsDefined()
    @IsNumber()
    @IsInt()
    id!: number;

    /**
     * Sharing model type
     * @example 0
     * @see EPgTransferShareType
     */
    @IsDefined()
    @IsEnum(EPgTransferShareType)
    type: EPgTransferShareType = EPgTransferShareType.default;

    /** 
     * IDs of recipient actors 
     * @example ['0x5aC89...', '0x29D8E...'] 
     * @see {@link PgActor}
     */
    @IsDefined()
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(30)
    @Validate(IsEthAddressArray)
    @ArrayUnique()
    actor!: string[];

    /** 
     * Respective share of each listed actor
     * @example [33.34, 66.66] 
     */
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(30)
    @IsPositive({ each: true })
    share?: number[];
}

/**
 * Blockchain codes
 */
export enum EPgChain {
    ETH = 0,
    OPTIMISM = 20,
    POLYGON = 10,
    default = OPTIMISM
}

/**
 * Transferrable token types
 */
export enum EPgTokenType {
    ERC20 = 0,
    ERC721 = 100,
    ERC1555 = 200,
    default = ERC20
}

/**
 * Token info
 */
export class PgToken {
    /** Internal **ID** of the token 
     * @example 0
    */
    @IsDefined()
    @IsNumber()
    @IsInt()
    id!: number;

    /** Token contract address on-chain 
     * @example '0x4654eAAbF458961351aEB54564654'
    */
    @IsDefined()
    @IsEthereumAddress()
    contract!: string;

    /** Type of ERC token
     * @example 0
     * @see EPgTokenType
     */
    @IsDefined()
    @IsEnum(EPgTokenType)
    type: EPgTokenType = EPgTokenType.default;

    /** Blockchain code where tokens are available 
     * @example 20
     * @see EPgChain
    */
    @IsOptional()
    @IsEnum(EPgChain)
    chain?: EPgChain = EPgChain.default;

    /** Specification of the token ID for ERC721 and ERC1555
     * @example 'erc721-101'
     */
    @ValidateIf(o => o.type == EPgTokenType.ERC721)
    @IsDefined()
    @IsString()
    @Length(1, 80)
    tokenId?: string;
}

/**
 * Transfers supported statuses
 * @default ETransferStatus.default
 * @see PgTransfer
 */
export enum ETransferStatus {
    /** Status `open`. Tokens transfer is claimable. */
    OPEN = 0,
    /** Status `closed`. Token transfer settled or locked. */
    CLOSED = 20,
    /** Default status */
    default = OPEN
}

/**
 * Planned tokens transfer to recipients related to the completion of an activity outcome 
 */
export class PgTransfer {
    /** Internal **ID** of the transfer 
     * @example 3
    */
    @IsDefined()
    @IsNumber()
    @IsInt()
    id!: number;

    /** Transfer status
     * @example 0
     * @see ETransferStatus
     */
    @IsDefined()
    @IsEnum(ETransferStatus)
    status!: ETransferStatus;

    /** Max total **amount** of token to transfer
     * @example 99.92
     * @example 1
    */
    @IsDefined()
    @IsNumber()
    @IsPositive()
    amount!: number;

    /** ID of the **token** to be sent
     * @example 1
     * @see PgToken
    */
    @IsDefined()
    @IsNumber()
    @IsInt()
    token!: number;

    /** On-chain **transactions** related to that tranfer
     * @example ['0xb753ef33ffc29c8bf14aa6aa9908b4469e8dd2f43e52a9f6be81344f25469fc9']
     */
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(20)
    @Length(10, 100, { each: true })
    @ArrayUnique()
    tx?: string[];
}

/**
 * List of supported computations when mixing different conditions
 */
export enum EConditionMix {
    /** 
     * Method 'everything ok', a.k.a. 'all or nothing'. 
     * All conditions must be met and have a positive max result.
     * 
     * Good for binary output common to all conditions, such as (0 || 1) or (0 || 100)
     * Example usage: all conditions must result in a majority of yes votes 
     */
    REQUIRE_AND = 0,

    /** 
     * Method 'weighted average'. 
     * Each condition output,e.g. ratio of the outcome transfer, has 
     * a corresponding weight to compute an average.
     * 
     * Example usage 1: Average of all percents, all conditions having the same weight
     * 
     * Example usage 2: Result of the second condition; over 2, is made twice more impactful on the 
     * agreed transfer amount, weights are respectively set to [1, 2]
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
     * @see PgCondition
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