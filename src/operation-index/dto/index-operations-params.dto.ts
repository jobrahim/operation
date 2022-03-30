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
  @IsBoolean()
  @IsOptional()
  publico: boolean;
}
