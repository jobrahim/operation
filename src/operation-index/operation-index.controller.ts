import {
  Controller,
  Get,
  Res,
  Query,
  Req,
  HttpStatus,
  NotFoundException,
  UseGuards,
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
    @Query() { type, page }: IndexOperationsParamsDto,
  ) {
    try {
      const userId = req.user
        ? req.user.userId
        : '81abaaa9-7842-4737-be4f-555dca7a873a';
      if (userId === undefined) {
        throw new NotFoundException('userId not found');
      }

      console.log('req.user:', req.user);
      const indexOperations = await this.operationIndexService.indexOperations(
        userId,
        type,
        page,
      );

      return res.status(HttpStatus.OK).json(indexOperations);
    } catch (error) {
      throw error;
    }
  }
}
