import { Type } from 'class-transformer';
import {
  IsEnum,
  IsDefined,
  IsOptional,
  ValidateIf,
  ValidateNested,
  IsPositive,
  ArrayMaxSize,
  IsNumber,
  IsInt,
  ArrayMinSize,
  IsArray,
  Min,
} from 'class-validator';
import {
  PgCondition,
  PgConditionDataSet as PgOracleDataSet,
} from './project-grant-condition.data';
import {
  PgActor,
  PgHistory,
  PgNFT,
  PgOrganization,
  PgProject,
} from './project-grant-meta.data';
import {
  PgActivity,
  PgActivityGroup,
  PgOutcome,
  PgPlan,
} from './project-grant-plan.data';
import {
  PgToken,
  PgTransferShare,
  PgTransfer,
} from './project-grant-transfer.data';

/**
 * Enumeration of supported grant project statuses
 */
export enum EPgStatus {
  /** Status 'draft' */
  DRAFT = 0,

  /** Status 'draft submitted for validation' */
  SUBMITTED = 90,

  /** Status 'approved'. The project execution can start / be ran */
  APPROVED = 100,

  /** Status 'running'. The project execution is in progress */
  RUNNING = 200,

  /** Status 'halted'. The project is frozen and can be resumed */
  HALTED = 300,

  /** Status 'closed'. The project has been terminated */
  CLOSED = 400,

  /** Default status */
  default = DRAFT,
}

/**
 * Root of the Project Grant full definition
 */
export class ProjectGrant {
  /**
   * List of actors associated to the project grant, and their role
   * @see {@link PgActor}
   */
  //@ValidateIf(o => o.status > EPgStatus.DRAFT)
  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(15)
  @ValidateNested({ each: true })
  @Type(() => PgActor)
  actor!: PgActor[];

  /**
   * Edition history of the project grant definition
   * @see {@link PgHistory}
   */
  @IsDefined()
  @ValidateNested()
  @Type(() => PgHistory)
  history!: PgHistory;

  /**
   * References of the on-chain NFT
   * @see {@link PgNFT}
   */
  @IsOptional()
  @ValidateIf((o) => o.status > EPgStatus.DRAFT)
  @IsDefined()
  @ValidateNested()
  @Type(() => PgNFT)
  nft?: PgNFT;

  /**
   * General organization of the Project Grant
   * @see {@link PgOrganization}
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => PgOrganization)
  //@ValidateIf(o => o.status > EPgStatus.DRAFT)
  organization?: PgOrganization;

  /**
   * The project general info and links to external document(s)
   * @see {@link PgProject}
   */
  @IsDefined()
  @ValidateNested()
  @Type(() => PgProject)
  project!: PgProject;

  /**
   * General version number of the project grant schema
   *
   * A positive integer is expected.
   * @example 35
   */
  @IsDefined()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsInt()
  @IsPositive()
  schema!: number;

  /**
   * Project Grant's current status
   * @example 100
   * @see {@link EPgStatus}
   */
  @IsDefined()
  @IsEnum(EPgStatus, { message: 'Unsupported PG status' })
  status!: EPgStatus;

  // ===========================================================
  //
  // Project Grant Execution Plan(s)
  //

  /**
   * List of all data sets available for querying oracle contracts
   * @see {@link PgOracleDataSet}
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => PgOracleDataSet)
  dataset?: PgOracleDataSet[];

  /**
   * Used on-chain **asset tokens** info
   *
   * @see {@link PgToken}
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => PgToken)
  token?: PgToken[];

  /**
   * Sharing models for asset transfers
   *
   * @see {@link PgTransferShare}
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => PgTransferShare)
  transfer_share?: PgTransferShare[];

  /**
   * Outcomes' related **asset transfers**
   *
   * @see {@link PgTransfer}
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => PgTransfer)
  transfer?: PgTransfer[];

  /**
   * Outcome **conditions** used for rating the amounts of assets to transfer
   * @see {@link PgCondition}
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(120)
  @ValidateNested({ each: true })
  @Type(() => PgCondition)
  condition?: PgCondition[];

  /**
   * Activities' **outcomes**
   * @see {@link PgOutcome}
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => PgOutcome)
  outcome?: PgOutcome[];

  /**
   * **Activities** composing the group
   * @see {@link PgActivity}
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(30)
  @ValidateNested({ each: true })
  @Type(() => PgActivity)
  activity?: PgActivity[];

  /**
   * **Groups** of activities defining the plan
   * @see {@link PgActivityGroup}
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => PgActivityGroup)
  activity_group?: PgActivityGroup[];

  /**
   * Possible execution **plans**
   * @see {@link PgPlan}
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => PgPlan)
  plan?: PgPlan[];

  /**
   * Default plan that this Project Grant currently implements.
   *
   * Defines the active plan (on-chain) for this project grant proposal. Others are draft.
   * @example `0`
   * @see {@link PgPlan}
   */
  @IsOptional()
  //@ValidateIf((o) => o.status > EPgStatus.DRAFT || o.plan?.length > 0)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsInt()
  @Min(0)
  planDefault_id?: number;

  /**
   * Default plan that this Project Grant currently implements.
   *
   * Defines the active plan (on-chain) for this project grant proposal. Others are draft.
   * @see {@link PgPlan}
   */
  @IsOptional()
  //@ValidateIf((o) => o.status > EPgStatus.DRAFT || o.plan?.length > 0)
  @ValidateNested()
  @Type(() => PgPlan)
  planDefault?: PgPlan;
}
