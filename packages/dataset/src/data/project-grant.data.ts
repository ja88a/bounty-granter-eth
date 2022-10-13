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
import { OutgoingMessage } from 'http';


// Class-Validator package & doc: https://www.npmjs.com/package/class-validator

/**
 * Project Grant related NFT info and references
 */
export declare class PGNftData {
  /** NFT Collection address 0x */
  @IsDefined()
  @IsEthereumAddress()
  collection: string;

  /** NFT Token ID inside the Collection */
  @IsDefined()
  @MaxLength(255)
  tokenId: string; // @TODO Review if token ID shall consist in a more generic string

  @IsDefined()
  @Length(5, 255)
  tokenUri: string;
}

/**
 * Enumeration of supported grant project statuses
 */
export enum EStatusProject {
  /** Status 'draft' */
  DRAFT = 0,
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

export declare class ProjectGrantData {

  /**
   * Project Grant's current status
   * @example 1
   */
  @IsEnum(EStatusProject)
  status: EStatusProject;

  @IsOptional()
  @ValidateIf(o => o.status > EStatusProject.DRAFT)
  @IsDefined()
  @ValidateNested()
  @Type(() => PGNftData)
  nft?: PGNftData;

}