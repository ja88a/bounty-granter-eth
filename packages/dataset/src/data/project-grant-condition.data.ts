
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

export class PgConditionDataSet {

}

export class PgCondition {

}