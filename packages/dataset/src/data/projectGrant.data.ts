import { Type } from 'class-transformer';
import {
  Length,
  IsEnum,
  IsDefined,
  IsEthereumAddress,
  IsOptional,
  Max,
  MaxLength,
  Contains,
  ValidateIf,
  ValidateNested,
  Min,
  IsPositive,
  ArrayMaxSize,
  IsDate,
  IsDateString,
  IsNumber,
  IsString,
} from 'class-validator';

/** Main Types of Data Feed */
export enum EFeedDataType {
  /** Price data feed */
  PRICE = 'price',
  default = PRICE,
};


// Class-Validator doc: https://www.npmjs.com/package/class-validator

/**
 * Config parameters of the feed's handled data, its values
 */
export class ProjectGrantPlanData {
  /** 
   * Feed's data type 
   * @example 'price'
   */
  @IsDefined()
  @IsEnum(EFeedDataType)
  type: EFeedDataType = EFeedDataType.default;

  /** 
   * For price feeds, specification of the price pair's quote currency
   * @example 'usd' for the pair 'BTC/USD'
   */
  @IsOptional()
  @ValidateIf(o => o.type === EFeedDataType.PRICE)
  @Length(3, 6)
  quote?: string;

  /** The source contract's data info */
  @IsOptional()
  //@ValidateIf(o => o.status == EContractStatus.OK)
  @ValidateNested()
  //@Type(() => FeedSourceData)
  data?: number; // FeedSourceData
}