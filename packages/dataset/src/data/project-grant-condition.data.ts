import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsEthereumAddress,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

/**
 * List of supported computations used for mixing different conditions output
 * and obtaining 1 consolidated result
 * @default EPgConditionMix.default
 */
export enum EPgConditionMix {
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
  AVERAGE_WEIGHTED = 100,

  /** Default method */
  default = AVERAGE_WEIGHTED,
}

/**
 * Data set used for querying a Tellor oracle contract
 */
export class PgTellorQueryData {
  /** Tellor oracle query ID
   * @example 'Ha$hKeccak256'
   */
  @IsDefined()
  queryId!: string;

  // TODO Tellor queryData model + validation
  @IsDefined()
  queryData!: unknown;
}

/**
 * Data set used for querying a polling contract
 */
export class PgPollQueryData {
  // TODO Polling contract query data model + validation
}

/**
 * Supported types of data sets
 */
export enum EConditionDataSetType {
  //  ANY = 0,
  POLL = 1,
  VOTE = 100,
  ORACLE_QUERY_TELLOR = 200,
  ORACLE_QUERY_UMA = 300,
  //  default = ANY
}

/**
 * Data set used by conditions handler to process
 * queries requiring extra custom data.
 *
 * Example: Querying an oracle contract might require
 * specific types of input fields, values & structure
 */
export class PgConditionDataSet {
  /**
   * ID of the data set
   *
   * @example 4
   */
  @IsDefined()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsInt()
  @Min(0)
  id!: number;

  /**
   * Type of the data set, among the supported ones
   */
  @IsDefined()
  @IsEnum(EConditionDataSetType)
  type!: EConditionDataSetType;

  // @IsOptional()
  // data?: any;

  /**
   * Data set specific to querying a Tellor oracle contract
   *
   * Considered when type == EConditionDataSetType.ORACLE_QUERY_TELLOR
   */
  @ValidateIf((o) => o.type == EConditionDataSetType.ORACLE_QUERY_TELLOR)
  @IsDefined()
  @ValidateNested()
  @Type(() => PgTellorQueryData)
  tellor?: PgTellorQueryData;

  /**
   * Data set specific to querying a Poll contract
   *
   * Considered when type == EConditionDataSetType.POLL
   */
  @ValidateIf(
    (o) =>
      o.type >= EConditionDataSetType.POLL &&
      o.type < EConditionDataSetType.VOTE,
  )
  @IsDefined()
  @ValidateNested()
  @Type(() => PgTellorQueryData)
  poll?: PgPollQueryData;
}

/**
 * Types of supported oracle contracts
 * used for extracting on-chain data input.
 *
 * This parameter impacts the way data are retrieved from contracts
 * and the computation of a single value.
 *
 * @see {@link EPgConditionComputeMethod}
 */
export enum EPgOracleType {
  /** Polling which aggregated output is a single number */
  POLL_NUMBER = 0,
  /** Polling which output is a single string */
  POLL_STRING = 50,

  /** Voting which output is a single number (most voted) */
  VOTE_NUMBER = 100,
  /** Voting which output is a single string (most voted) */
  VOTE_STRING = 150,

  /** UMA Optimistic Oracle which output is a single number */
  UMA_NUMBER = 200,
  /** UMA Optimistic Oracle which output is a single string */
  // UMA_STRING = 250,

  /** Tellor Oracle which output is a single number */
  TELLOR_NUMBER = 300,
  /** Tellor Oracle which output is a single string */
  // TELLOR_STRING = 350,

  /** Default oracle type */
  default = TELLOR_NUMBER,
}

/**
 * Oracles data computation methods, or how to interpret extracted on-chain
 * values against a condition's expected output type.
 *
 * Example: Oracle contract reports the integer value `0` or `1`, using the method `MAP_NUMBER`
 * and a list of ref values `[0,1]` enable to define mapping towards percentage ratings `[0, 100]`.
 *
 * Having a relation `EQUAL`, if the oracle provides the value `1` the condition result is `100`.
 * If the oracle value is not exactly `0` or `1` no mapping applies: the condition default value is then returned.
 *
 * Having a relation `GREATER_THAN`, if the oracle provides the value `0.5` the condition result is `0`.
 * `100` if the oracle value is bigger than `1.0`.
 *
 * @see {@link EPgOracleType}
 * @see {@link EPgConditionMappingType}
 */
export enum EPgConditionComputeMethod {
  /**
   * 1:1 mapping relation between an oracle single *numeric value* and the defined reference values
   *
   * Compatible with mapping methods: {@link EPgConditionMappingType.EQUAL}, {@link EPgConditionMappingType.GREATER_THAN}, {@link EPgConditionMappingType.GREATER_THAN_OR_EQUAL}
   */
  MAP_NUMBER = 0,

  /**
   * 1:1 mapping relation between an oracle single textual value and the defined reference values
   *
   * Compatible with mapping methods: {@link EPgConditionMappingType.EQUAL}
   */
  MAP_STRING = 50,

  /**
   * Compute an average *number* based on a flat list of *numbers* provided by a contract.
   *
   * If no mapping method is defined then the condition outputs that average number.
   *
   * Example: From a poll, 33% of participants voted for the value `100`, 50% for `75` and 27% for `50`.
   * Computed output number is `0.33*100+0.5*75+0.27*50 = 84`
   *
   * Compatible with mapping methods: {@link EPgConditionMappingType.NONE}, {@link EPgConditionMappingType.EQUAL}, {@link EPgConditionMappingType.GREATER_THAN}, {@link EPgConditionMappingType.GREATER_THAN_OR_EQUAL}
   */
  AVERAGE = 100,

  /**
   * Compute an average *number* based on weighted numbers provided by a contract.
   *
   * If no mapping method is defined then the condition outputs that average number.
   *
   * Example: From a poll, 33% of participants voted for the value `100`, 50% for `75` and 27% for `50`.
   * Computed output number is `0.33*100+0.5*75+0.27*50 = 84`
   *
   * Compatible with mapping methods: {@link EPgConditionMappingType.NONE}, {@link EPgConditionMappingType.EQUAL}, {@link EPgConditionMappingType.GREATER_THAN}, {@link EPgConditionMappingType.GREATER_THAN_OR_EQUAL}
   */
  AVERAGE_WEIGHTED = 150,

  /**
   * No averaging, just pick the most selected value in the context of a poll or a vote
   */
  MOST_CHOSEN = 200,

  /** Default computation method */
  default = MAP_NUMBER,
}

/**
 * Mapping method defining the relation between an array of reference values
 * and an array of output values ([0-100] percentages)
 *
 * The `mapping.ref[] -> mapping.out[]` mapping method
 *
 * @see {@link EPgConditionComputeMethod}
 */
export enum EPgConditionMappingType {
  /**
   * No mapping expected, ignore the values and ratings but the default rating if the computation is inconsistent.
   */
  NONE = 0,

  /**
   * Relation 'equal'.
   *
   * Example: If `oracleValue=1`, `refValues=[0, 1]` and `rating=[50, 100]`
   * then the condition output is `100`
   */
  EQUAL = 100,

  /**
   * Relation 'greater than or equal'.
   *
   * Example: If `oracleValue=30`, `refValues=[20, 30, 50]` and `rating=[10, 50, 100]`
   * then the condition output is `50`
   */
  GREATER_THAN_OR_EQUAL = 200,

  /**
   * Relation 'greater than or equal'.
   *
   * Example: If `oracleValue=30`, `refValues=[20, 30, 50]` and `rating=[10, 50, 100]`
   * then the condition output is `10`
   */
  GREATER_THAN = 250,

  LOWER_THAN_OR_EQUAL = 300,
  LOWER_THAN = 350,

  /** Default ref[]->out[] mapping method */
  default = EQUAL,
}

/**
 * Mapping of an oracle post-processed result (expected to
 * consist in a single numeric value) against reference values
 * towards a final output value (expected to consist in a
 * percentage value to rate the condition's transfer amount)
 */
export class PgConditionMapping {
  /**
   * Mapping method to translate an input value against the
   * reference values set in `ref[]` towards an ouput value
   * defined in `out[]`
   *
   * @example `100`
   */
  @IsDefined()
  @IsEnum(EPgConditionMappingType)
  type!: EPgConditionMappingType;

  /**
   * Reference values used to perform a mapping of an input value
   *
   * @example `[0, 1, 2]`
   */
  @IsDefined()
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(20)
  @IsInt({ each: true })
  @Min(0, { each: true })
  ref!: number[];

  /**
   * Output values from the mapping of the input value against
   * the reference values.
   *
   * Output values must be a percentage value [0-100]
   *
   * @example `[0, 50, 100]`
   */
  @IsDefined()
  @IsArray()
  @ArrayMinSize(0)
  @ArrayMaxSize(20)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(100, { each: true })
  out!: number[];
}

/**
 * Oracle contract used for querying collected off-chain data
 */
export class PgConditionOracle {
  /**
   * Address of the oracle contract
   * @example '0xb4DE6867eD781aB2Fe24464714692af65Da'
   */
  @IsDefined()
  @IsEthereumAddress()
  contract!: string;

  /**
   * Type of oracle contract.
   *
   * This conditions both the query and response handling.
   *
   * @example 0
   * @see {@link EPgOracleType}
   */
  @IsDefined()
  @IsEnum(EPgOracleType)
  type!: EPgOracleType;

  /**
   * ID of the data set constituing the Query Parameters, specific to the oracle type
   * @example `2`
   * @see {@link PgConditionDataSet}
   */
  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsInt()
  @Min(0)
  param_id?: number;

  /**
   * Oracle Query Parameters, specific to the oracle type
   * @see {@link PgConditionDataSet}
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => PgConditionDataSet)
  param?: PgConditionDataSet;
}

/**
 * The supported validation methods relative to the output
 * provided by an Oracle
 *
 * Example: for setting a minimum participation
 * thresholds in order to consider as valid a voting or polling result
 */
export enum EPgConditionValidationType {
  /** Percentage based minimum participation threshold for a vote or poll result */
  MIN_PARTICIPATION_PERCENT = 0,
  /** Minimum number of participating accounts/addresses to a vote or a poll */
  MIN_PARTICIPATION_NB_ACCOUNT = 1,
  /** Default validation criteria */
  default = MIN_PARTICIPATION_NB_ACCOUNT,
}

/**
 * The minimum participation method used to make a poll or vote based
 * outcome considered as valid
 *
 * The processing of a validation must be adapted to the integrated oracle
 * type, its output type.
 *
 * For example, you can expect that at least 3 reviewers have provided
 * their notation to a given evaluation criteria.
 *
 * @see {@link PgCondition}
 * @see {@link PgConditionOracle}
 */
export class PgConditionValidation {
  /**
   * Type of the defined minimum particpation threshold
   * @example `1` */
  @IsDefined()
  @IsEnum(EPgConditionValidationType)
  type: EPgConditionValidationType = EPgConditionValidationType.default;

  /**
   * Reference value to be used by the validation method
   *
   * Examples:
   *  * With type `EPgConditionValidationType.MIN_PARTICIPATION_NB_ACCOUNT` at least `3` accounts must have participated
   *  * With type `EPgConditionValidationType.MIN_PARTICIPATION_PERCENT` `51`% of the group members must have participated
   *
   * @example `3`
   */
  @IsDefined()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0.1)
  value!: number;
}

/**
 * Condition for evaluating the completion of an activity outcome.
 *
 * The condition input rely on retrieving data from on-chain contracts,
 * such as oracles (e.g. Tellor or UMA OO), polls, votes or multisig-based on-chain data, etc.
 *
 * @see {@link PgOutcome}
 */
export class PgCondition {
  /**
   * Condition ID
   * @example 1
   */
  @IsDefined()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsInt()
  @Min(0)
  id!: number;

  /**
   * Oracle contract which data are used as condition input
   */
  @IsDefined()
  @ValidateNested()
  @Type(() => PgConditionOracle)
  oracle!: PgConditionOracle;

  /**
   * Expected type of post-processing of the oracle response data to
   * compute the condition ouput rating.
   */
  @IsDefined()
  @IsEnum(EPgConditionComputeMethod)
  compute: EPgConditionComputeMethod = EPgConditionComputeMethod.default;

  /**
   * Specification of minimum participation threshold required when
   * dealing with a voting or polling based evaluation of the condition criteria
   */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => PgConditionValidation)
  @ValidateIf(
    (o) =>
      o.oracle.type == EPgOracleType.POLL_NUMBER ||
      o.oracle.type == EPgOracleType.VOTE_NUMBER,
  )
  valid?: PgConditionValidation[];

  /**
   * Mapping of the oracle output data towards custom ones:
   * based on a given arithmetic method or a simple 1:1 mapping,
   * depending on the oracle data type.
   */
  @IsOptional()
  //@ValidateIf(o => o.oracle.type == EPgOracleType.POLL_STRING
  //  || o.oracle.type == EPgOracleType.VOTE_STRING)
  //@IsDefined()
  @ValidateNested()
  @Type(() => PgConditionMapping)
  mapping?: PgConditionMapping;

  /**
   * Default fallback rating value to output in case the condition
   * is not met, or its processing fails, e.g. the oracle value(s)
   * post-processing or its mapping.
   *
   * The condition logic is based on this default value, e.g. set
   * the default rating to its max value and conditions degrading it
   */
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsInt()
  @Min(0)
  default = 0;
}
