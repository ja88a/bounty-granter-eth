
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
import { IsEthAddressArray } from './data-validation.utils';

/**
 * Types of supported sharing models for transfering assets among actors
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
     * @see {@link EPgTransferShareType}
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
 * Blockchain network codes
 */
export enum EPgChain {
    /** Ethereum L1 */
    ETH = 0,
    /** Optimism.  Ethereum L2 ZK */
    OPTIMISM = 20,
    /** Polygon.  Ethereum L2 side chain */
    POLYGON = 10,
    /** Default blockchain network */
    default = OPTIMISM
}

/**
 * Transferrable token types
 */
export enum EPgTokenType {
    /** Standard fungible token */
    ERC20 = 0,
    /** Standard non-fungible token */
    ERC721 = 100,
    /** Standard non-fungible multi-token token */
    ERC1555 = 200,
    /** Default token standard */
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
 * Planned assets transfer to recipients related to the completion of an activity outcome 
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
     * @see {@link ETransferStatus}
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
     * @see {@link PgToken}
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