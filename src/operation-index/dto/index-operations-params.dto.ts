import { ApiProperty } from '@nestjs/swagger';
import {
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
}
