import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import {
  IndexOperationDataResponseDto,
  IndexOperationResponseDto,
} from './dto/index-operation-response.dto';
import { Status } from './dto/index-operations-params.dto';

@Injectable()
export class OperationIndexService {
  constructor(
    private readonly repository: EntityManager,
    @Inject('ITL_PROFILE_SERVICE')
    private readonly profileService: ClientProxy,
  ) {}

  async indexOperations(
    userId: string,
    type: string,
    page: number,
    publico: boolean,
    status: Status,
    client_cuit: string,
    booking_id: string,
    vesselVissit: string,
    unitId: string,
    limit = 5,
  ) {
    if (page <= 0) {
      throw new NotFoundException('page not found');
    }

    let pagination =
      ' SELECT op.id FROM operation_order_entity as op' +
      ' inner join order_service_entity os on op.id = os.operation_id' +
      ' inner join subscriber_entity sub on sub.operation_order_id = op.id';

    const profile = await this.profileService
      .send<any>({ cmd: 'get-profile' }, userId)
      .toPromise();
    console.log(profile);

    if (publico === false) {
      const queryPrivate =
        ' WHERE sub.organization_id = ' + "'" + profile.organizations.id + "'";

      pagination = pagination + queryPrivate;
    } else {
      const queryPrivate =
        ' WHERE sub.organization_id <> ' + parseInt(profile.organizations.id);

      pagination = pagination + queryPrivate;
    }

    if (type) {
      const typeId =
        "select id from order_service_type where name = '" + type + "'";
      const typeResult = await this.repository.query(typeId);
      const queryWithType = ' AND os.type = ' + typeResult[0].id;
      pagination = pagination + queryWithType;
    }

    if (status) {
      const queryWithStatus = ' AND os.[status] = ' + "'" + status + "'";
      pagination = pagination + queryWithStatus;
    }

    if (client_cuit) {
      const queryWithClientCuit =
        ' AND op.client_cuit = ' + "'" + client_cuit + "'";
      pagination = pagination + queryWithClientCuit;
    }

    if (booking_id) {
      const queryWithBookingId =
        ' AND op.booking_id = ' + "'" + booking_id + "'";
      pagination = pagination + queryWithBookingId;
    }

    if (vesselVissit) {
      const queryWithVesselVissit =
        ' AND op.vesselVissit = ' + "'" + vesselVissit + "'";
      pagination = pagination + queryWithVesselVissit;
    }

    if (unitId) {
      const queryWithUnitId = ' AND os.unitId = ' + "'" + unitId + "'";
      pagination = pagination + queryWithUnitId;
    }

    const groupBy = ' GROUP BY op.id order by op.id desc';

    pagination = pagination + groupBy;

    console.log('pagination :', pagination);

    const operations = await this.repository.query(pagination);
    console.log('operation:', operations);
    const listOfOperations = [];
    for (const operation of operations) {
      const op =
        'select * from operation_order_entity where id = ' + operation.id;
      const operationResult = await this.repository.query(op);
      listOfOperations.push(operationResult[0]);
    }
    console.log('listOfOperations:', listOfOperations);

    const pag = Math.ceil(listOfOperations.length / limit);
    console.log('pag:', pag);

    if (page > pag) {
      throw new NotFoundException('page not found');
    }
    console.log('page:', page);
    const response = new IndexOperationResponseDto();

    response.current_page = page;
    if (page.toString() === '1') {
      response.from = 1;
    } else {
      response.from = (page - 1) * limit;
    }
    if (page.toString() === pag.toString()) {
      response.to = listOfOperations.length;
      response.per_page = listOfOperations.length - (page - 1) * limit;
    } else {
      response.to = page * limit;
      response.per_page = limit;
    }
    response.last_page = Math.ceil(listOfOperations.length / limit);
    response.total = listOfOperations.length;

    response.data = [];
    const position = (page - 1) * limit;
    for (let i = position; i < response.to; i++) {
      const item = new IndexOperationDataResponseDto();
      item.id = listOfOperations[i].id;
      item.client_id = listOfOperations[i].client_id;
      item.client_cuit = listOfOperations[i].client_cuit;
      item.type = listOfOperations[i].type;
      item.user_creator = listOfOperations[i].user_creator;
      item.vessel_vissit = listOfOperations[i].vesselVissit;
      item.booking_id = listOfOperations[i].booking_id;

      response.data.push(item);
    }
    return response;
  }
}
