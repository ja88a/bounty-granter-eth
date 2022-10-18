import { Type } from 'class-transformer';
import {
  Length,
  IsEnum,
  IsDefined,
  IsEthereumAddress,
  IsOptional,
  Max,
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
  Validate,
  ArrayUnique,
} from 'class-validator';
import { IsEthAddressArray } from './data-validation.utils';

/**
 * Project Grant related NFT info and references
 */
export class PgNFT {
  /** 
   * NFT Collection address 0x 
   * @example 0x09e930B4FEB47cA86236c8961B8B1e23e514ec3F
   */
  @IsDefined()
  @IsEthereumAddress()
  collection!: string;

  /** 
   * NFT Token ID inside the Collection 
   * @example 'a101'
   */
  @IsDefined()
  @IsString()
  @Length(1, 255)
  tokenId!: string;

  /**
   * Optional CIDv1 of actual project grant definition stored on IPFS.
   *  
   * The actual token URI loaded from the on-chain NFT data.
   * @example "kerkreidgvpkjawlxz6sffxzwgooowe5yt7i6wsyg236mfoks77nywkapdt"
   */
  @IsOptional()
  @IsString()
  @Length(5, 255)
  tokenUri?: string;
}

/**
 * Project definition for which a grant is defined
 */
export class PgProject {
  /** 
   * Project short name 
   * @example "Stop the rise of authoritarian regimes and social crises"
   */
  @IsDefined()
  @IsString()
  @Length(5, 30)
  name!: string;

  /** 
   * Reference to external documents depicting the project initiative 
   * @example ["https://github.com/scrtlabs/Grants/issues/70", "https://forum.scrt.network/t/ccbl-crowdfunding-platform/6262"]
   */
  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @Length(8, 120, { each: true })
  doc!: string[];

  /** 
   * Project long textual description 
   * @example Long description of a kick-ass initiative
   */
  @IsOptional()
  @IsString()
  @Length(20, 512)
  desc?: string;
}

/**
 * Project Grant Organization
 */
export class PgOrganization {
  /** 
   * DAO address owning/responsible for the project grant
   * @example '0x09e930B4FEB47cA86236c8961B8B1e23e514ec3F'
   */
  @IsDefined()
  @IsEthereumAddress()
  dao!: string;

  /**
   * sub-DAO / committee addresses responsible for the project grant
   * @example ['0xB866Ee8a2396ab82cD0489be87D9692F057c9c29']
   */
  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @Validate(IsEthAddressArray)
  committee!: string[];

  /**
   * sub-DAO, Group or individual account address having administration privileges over the project grant
   * @example '0xc61Ec858c3bf3068e80fBd5654BaE47f4181dE8C'
   */
  @IsDefined()
  @IsEthereumAddress()
  admin!: string;
}

/**
 * Supported actor roles for managing a project grant definition and execution
 */
export enum EPgActorRole {
  /** Role 'proposer'. Initiator or editor of the project grant definition */
  PROPOSER = 0,
  /** Role 'investor'. Initiator or editor of the project grant definition */
  INVESTOR = 100,
  /** Role 'executor'. Handler of the project execution */
  EXECUTOR = 200,
  /** Role 'reviewer'. Reviewer of the project's outcomes */
  REVIEWER = 300,
  /** Default role */
  default = PROPOSER
}

/**
 * Actor in the project grant
 * 
 * Can consist in multiple individuals and|or groups representing 
 * each required roles (enumerated in `EPgActorRole`) for managing the project grant.
 */
export class PgActor {
  /**
   * Actor name
   * @example "Jet Black"
   */
  @IsDefined()
  @IsString()
  @Length(3, 20)
  name!: string;

  /** 
   * Role of the actor.
   * 
   * Only one per actor is actually supported, i.e. roles cannot be 
   * cumulated to prevent from CoI.
   * @example 200
   */
  @IsDefined()
  @IsEnum(EPgActorRole)
  role!: EPgActorRole;

  /**
   * Account address
   * @example "0x0E4716Dd910adeB96D9A82E2a7780261E3D9476D"
   */
  @IsDefined()
  @IsEthereumAddress()
  address!: string;

  /** 
   * ENS address name
   * @example srenault.com
   * @see [ENS site](https://app.ens.domains/)
   */
  @IsOptional()
  @IsString()
  @Length(4, 20)
  ens?: string;

  /** 
   * Optional default share for a stakeholder 
   * 
   * Expressed by a percentage [0, 100]
   * @example 20
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  share?: number;
}

/**
 * Type of change recorded on the project grant definition
 */
export enum EPgChangeType {
  /** Change of type 'creation' of the proposal definition */
  CREATE = 0,
  /** Change of type 'update' of the project grant defition */
  UPDATE = 100,
  /** Change of type 'on-chain contract updated' of the project grant definition contract */
  CONTRACT_UPD = 200,
  /** Project Grant definition lock. To freeze/prevent from any further changes, except unlocking it */
  LOCK = 300,
  /** Project Grant definition unlocking action. To resume and enable further changes */
  UNLOCK = 400,
  /** Change of type 'close' of the project grant. Termination of any further execution / processing, dead end. */
  CLOSE = 500,
  /** Default change type */
  default = UPDATE
}

/**
 * Information about previous definition version & definition
 */
export class EPgChangePrevious {
  /**
   * Previous version number of the project grant definition that this change has replaced
   * @example 2
   */
  @IsInt()
  @IsPositive()
  version!: number;

  /** 
   * Previous CIDv1 of the project grant definition that this change has replaced 
   * @example 'bafkreidgvpkjawlxz6sffxzwgooowe5yt7i6wsyg236mfoks77nywkptdq'
   * @see [IPFS Docs CIDv1](https://docs.ipfs.tech/concepts/content-addressing/#version-1-v1)
  */
  @IsDefined()
  @IsString()
  cid!: string;
}


/**
 * Change event that lead to a change of the project grant definition
 */
export class PgHistoryEvent {
  /**
   * Date of the change event
   * 
   * ISO8601 Date format. UTC.
   * @example "2022-09-24T11:34:00.000Z"
   * @see [ISO 8601 on Wikipedia](https://en.wikipedia.org/wiki/ISO_8601)
   */
  @IsDefined()
  @IsDateString()
  date!: string;

  /** 
   * The type of change 
   * @example [100]
   * @see {@link EPgChangeType}
   */
  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsEnum(EPgChangeType, { each: true })
  @ArrayUnique()
  type!: EPgChangeType[];

  /** 
   * Author of the change. Signer account address 
   * @see {@link IsEthAddressArray}
   */
  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @Validate(IsEthAddressArray)
  @ArrayUnique()
  author!: string[];

  /** 
   * Anterior version of the PG definition that this change has replaced 
   * @see {@link EPgChangePrevious}
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => EPgChangePrevious)
  previous?: EPgChangePrevious;

  /** Optional comment input when committing the PG definition changes */
  @IsOptional()
  @IsString()
  @Length(0, 255)
  comment?: string;
}

/**
 * Versioning and history of the Project grant definition changes
 */
export class PgHistory {
  /** 
   * Current version number of the project grant definition 
   * @example 3
   */
  @IsDefined()
  @IsPositive()
  @IsInt()
  version!: number;

  /** 
   * List of the events that change the project grant definition
   * @see {@link PgHistoryEvent}
   */
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => PgHistoryEvent)
  event!: PgHistoryEvent[];
}
