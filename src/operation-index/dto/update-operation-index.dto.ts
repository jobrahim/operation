import { PartialType } from '@nestjs/mapped-types';
import { CreateOperationIndexDto } from './create-operation-index.dto';

export class UpdateOperationIndexDto extends PartialType(CreateOperationIndexDto) {}
