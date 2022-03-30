import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class IndexOperationsParamsDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  type: string;
  @ApiProperty()
  @IsNumberString()
  page: number;
  @ApiProperty()
  @IsOptional()
  publico: boolean;
  @ApiProperty()
  @IsOptional()
  status: Status;
  @ApiProperty()
  @IsOptional()
  client_cuit: string;
  @ApiProperty()
  @IsOptional()
  booking_id: string;
  @ApiProperty()
  @IsOptional()
  vesselVissit: string;
  @ApiProperty()
  @IsOptional()
  unitId: string;
}

export enum Status {
  NEW = 'NEW',
  PROCESSING = 'PROCESSING',
  ERROR = 'ERROR',
  FINALIZED = 'FINALIZED',
}
