import {
  IsDefined,
  IsEnum,
  IsEthereumAddress,
  IsInt,
  IsNumber,
  Min
} from "class-validator";

/**
* List of supported computations used for mixing different conditions output
* and obtaining 1 consolidated result
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
  AVERAGE_WEIGHTED = 10,

  /** Default method */
  default = AVERAGE_WEIGHTED
}

export class PgConditionDataSet {


}

/** 
 * Types of supported oracle contracts 
 * used for extracting on-chain data input
 */
export enum EPgOracleType {
  POLL_NUMBER = 0,
  POLL_STRING = 30,
  VOTE_NUMBER = 100,
  VOTE_STRING = 130,
  UMA_STRING = 230,
  UMA_NUMBER = 200,
  TELLOR_NUMBER = 300,
  TELLOR_STRING = 330,
  default = TELLOR_NUMBER,
}

/**
 * 
 */
export enum EPgConditionComputeMethod {
  /** 1:1 mapping relation between the oracle value and a rating */
  MAP = 0,

}

/**
 * Mapping method defining the relation between reference values and a rating
 */
 export enum EPgConditionMappingType {
  /** 
   * Relation 'equal'. 
   *
   * Example: If `oracleValue=1`, `refValues=[0, 1]` and `refRatings=[50, 100]` 
   * then the condition output is `100` 
   */
  EQUAL = 0,

  /**
   * Relation 'greater than or equal'.
   * 
   * Example: If `oracleValue=30`, `refValues=[20, 30, 50]` and `refRatings=[10, 50, 100]` 
   * then the condition output is `50` 
   */
  GREATER_THAN_OR_EQUAL = 10,

  /**
   * Relation 'greater than or equal'.
   * 
   * Example: If `oracleValue=30`, `refValues=[20, 30, 50]` and `refRatings=[10, 50, 100]` 
   * then the condition output is `10` 
   */
  GREATER_THAN = 11,

  LOWER_THAN_OR_EQUAL = 20,
  LOWER_THAN = 21,

  default = EQUAL,
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
  @IsNumber()
  @IsInt()
  @Min(0)
  id!: number;

  @IsDefined()
  @IsEthereumAddress()
  oracle!: string;

  @IsDefined()
  @IsEnum(EPgOracleType)
  @IsInt()
  @Min(0)
  oracle_type!: EPgOracleType;

  compute!: EPgConditionComputeMethod;
}