import { ApiProperty } from '@nestjs/swagger';

export class IndexOperationResponseDto {
  @ApiProperty()
  current_page: number;
  @ApiProperty()
  from: number;
  @ApiProperty()
  to: number;
  @ApiProperty()
  last_page: number;
  @ApiProperty()
  per_page: number;
  @ApiProperty()
  total: number;
  @ApiProperty({ type: () => [IndexOperationDataResponseDto] })
  data: IndexOperationDataResponseDto[];
}

export class IndexOperationDataResponseDto {
  @ApiProperty()
  id: number; // operation id
  @ApiProperty()
  client_id: string; //  id cliente sap
  @ApiProperty()
  client_cuit: string; // id cliente sap
  @ApiProperty()
  type: string; //  IMPO EXPO
  @ApiProperty()
  user_creator: string; //  id user creador de la operations
  @ApiProperty()
  status: string; //  order status
  @ApiProperty()
  vessel_vissit: string; // identificador buque viaje
  @ApiProperty()
  booking_id: string;
  @ApiProperty()
  shifts_operation_id: number; // id de la operacion de coordinacion (shifts asociada)
}
