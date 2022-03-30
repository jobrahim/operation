import {
  Controller,
  Get,
  Res,
  Query,
  Req,
  HttpStatus,
  NotFoundException,
  UseGuards,
  Body,
} from '@nestjs/common';
import { OperationIndexService } from './operation-index.service';
import { IndexOperationsParamsDto } from './dto/index-operations-params.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/operation-index')
export class OperationIndexController {
  constructor(private readonly operationIndexService: OperationIndexService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async indexOperations(
    @Req() req,
    @Res() res,
    @Query()
    {
      type,
      page,
      publico,
      status,
      client_cuit,
      booking_id,
      vesselVissit,
      unitId,
    }: IndexOperationsParamsDto,
  ) {
    console.log('publico typeof:', publico);
    try {
      const userId = req.user ? req.user.userId : null;
      const p = publico ? true : false;

      if (userId === null) {
        throw new NotFoundException('userId not found');
      }

      console.log('req.user:', req.user);
      const indexOperations = await this.operationIndexService.indexOperations(
        userId,
        type,
        page,
        p,
        status,
        client_cuit,
        booking_id,
        vesselVissit,
        unitId,
      );

      return res.status(HttpStatus.OK).json(indexOperations);
    } catch (error) {
      throw error;
    }
  }
}
