import { PgTransfer, PgTransferShare } from './project-grant-transfer.data';
import { Type } from 'class-transformer';
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
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { EPgConditionMix, PgCondition } from './project-grant-condition.data';

/**
 * Outcome of a project grant activity
 */
export class PgOutcome {
  /**
   * Outcome ID
   * @example 1
   */
  @IsDefined()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsInt()
  @Min(0)
  id!: number;

  /**
   * Outcome name
   * @example '`Expected outcome #1 of activity #2'`
   */
  @IsDefined()
  @IsString()
  @Length(3, 50)
  name!: string;

  /**
   * Token transfers related to the outcome result
   * @example `[2,5]`
   * @see {@link PgTransfer}
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  @IsInt({ each: true })
  @Min(0, { each: true })
  @ArrayUnique()
  transfer_id?: number[];

  /**
   * Token transfers related to the outcome result
   * @see {@link PgTransfer}
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => PgTransfer)
  transfer?: PgTransfer[];

  /**
   * Payment sharing model, its ID
   * @example `1`
   * @see {@link PgTransferShare}
   */
  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsInt()
  @Min(0)
  share_id!: number;

  /**
   * Payment sharing model
   * @see {@link PgTransferShare}
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => PgTransferShare)
  share!: PgTransferShare;

  /**
   * List of conditions impacting the transfer ratio
   * @example [1,4]
   * @see {@link PgCondition}
   */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ArrayUnique()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  @IsInt({ each: true })
  @Min(0, { each: true })
  condition_id?: number[];

  /**
   * List of conditions impacting the transfer ratio
   * @see {@link PgCondition}
   */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ArrayUnique()
  @ValidateNested({ each: true })
  @Type(() => PgCondition)
  condition?: PgCondition[];

  /**
   * Method used to compute the final transfer amount when several conditions are defined
   * @example 0
   * @see {@link EPgConditionMix}
   */
  @IsDefined()
  @IsEnum(EPgConditionMix)
  condition_mix!: EPgConditionMix;

  /**
   * Weights for each listed condition output to be used for computing
   * a final weighted average result, numeric
   * @example [1,2]
   */
  @IsOptional()
  @ValidateIf((o) => o.condition_mix == EPgConditionMix.AVERAGE_WEIGHTED)
  @IsArray()
  @ArrayMaxSize(20)
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  @IsInt({ each: true })
  @Min(0, { each: true })
  condition_weight?: number[];
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
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsInt()
  @Min(0)
  id!: number;

  /**
   * Activity name
   * @example 'Awesome activity title #101'
   */
  @IsDefined()
  @IsString()
  @Length(3, 120)
  name!: string;

  /**
   * Reference to external documents depicting the activity
   * @example ["https://github.com/scrtlabs/Grants/issues/70", "https://forum.scrt.network/t/ccbl-crowdfunding-platform/6262"]
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ArrayUnique()
  @Length(8, 180, { each: true })
  doc?: string[];

  /**
   * IDs of the Activity Outcomes
   * @example [0,2]
   * @see {@link PgOutcome}
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ArrayUnique()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  @IsInt({ each: true })
  @Min(0, { each: true })
  outcome_id?: number[];

  /**
   * The Activity Outcomes
   * @see {@link PgOutcome}
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @ArrayUnique()
  @ValidateNested({ each: true })
  @Type(() => PgOutcome)
  outcome?: PgOutcome[];
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
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsInt()
  @Min(0)
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
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsInt()
  @Min(0)
  phase?: number;

  /**
   * Activity IDs composing the group
   * @example [1,4]
   * @see {@link PgActivity}
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @ArrayUnique()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  @IsInt({ each: true })
  @Min(0, { each: true })
  activity_id?: number[];

  /**
   * Activities composing the group
   * @see {@link PgActivity}
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(30)
  @ArrayUnique()
  @ValidateNested({ each: true })
  @Type(() => PgActivity)
  activity?: PgActivity[];
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
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsInt()
  @Min(0)
  id!: number;

  /**
   * Plan name
   * @example `'Best plan ever #101'`
   */
  @IsDefined()
  @IsString()
  @Length(3, 100)
  name!: string;

  /**
   * IDs of Activty Groups defining the plan
   * @example `[0, 1, 2]` to define 3 activity groups
   * @see {@link PgActivityGroup}
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ArrayUnique()
  @IsNumber({ allowInfinity: false, allowNaN: false }, { each: true })
  @IsInt({ each: true })
  @Min(0, { each: true })
  group_id?: number[];

  /**
   * Activity groups defining the plan
   * @see {@link PgActivityGroup}
   */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ArrayUnique()
  @ValidateNested({ each: true })
  @Type(() => PgActivityGroup)
  group?: PgActivityGroup[];
}
