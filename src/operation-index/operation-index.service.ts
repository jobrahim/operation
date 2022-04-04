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
      'DECLARE @num_pagina INT = ' +
      page +
      ' DECLARE @reg_x_pagina INT = ' +
      limit +
      ' SELECT op.id, op.created, op.client_id, op.client_cuit, op.[type], op.user_creator, op.vesselVissit, op.booking_id FROM operation_order_entity as op' +
      ' inner join order_service_entity os on op.id = os.operation_id' +
      ' inner join subscriber_entity sub on sub.operation_order_id = op.id';

    let lastPage =
      ' SELECT CEILING( COUNT (*)/' +
      limit +
      '.0' +
      ') as val FROM operation_order_entity as op' +
      ' inner join order_service_entity os on op.id = os.operation_id' +
      ' inner join subscriber_entity sub on sub.operation_order_id = op.id';

    let total =
      ' SELECT COUNT (*) as val FROM operation_order_entity as op' +
      ' inner join order_service_entity os on op.id = os.operation_id' +
      ' inner join subscriber_entity sub on sub.operation_order_id = op.id';

    console.log('total:', total);

    const orderByQuery =
      ' ORDER BY op.created DESC' +
      ' OFFSET (@num_pagina - 1) * @reg_x_pagina ROWS ' +
      'FETCH NEXT @reg_x_pagina ROWS ONLY';

    if (publico === false) {
      const profile = await this.profileService
        .send<any>({ cmd: 'get-profile' }, userId)
        .toPromise();
      console.log(profile);
      const queryPrivate =
        ' WHERE sub.organization_id = ' + "'" + profile.organizations.id + "'";

      pagination = pagination + queryPrivate;
      lastPage = lastPage + queryPrivate;
      total = total + queryPrivate;
    } else {
      const profile = await this.profileService
        .send<any>({ cmd: 'get-profile' }, userId)
        .toPromise();
      console.log(profile);
      const queryPrivate =
        ' WHERE sub.organization_id <> ' + parseInt(profile.organizations.id);

      pagination = pagination + queryPrivate;
      lastPage = lastPage + queryPrivate;
      total = total + queryPrivate;
    }

    if (type) {
      const typeId =
        "select id from order_service_type where name = '" + type + "'";
      const typeResult = await this.repository.query(typeId);
      const queryWithType = ' AND os.type = ' + typeResult[0].id;
      pagination = pagination + queryWithType;
      lastPage = lastPage + queryWithType;
      total = total + queryWithType;
    }

    if (status) {
      const queryWithStatus = ' AND os.[status] = ' + "'" + status + "'";
      pagination = pagination + queryWithStatus;
      lastPage = lastPage + queryWithStatus;
      total = total + queryWithStatus;
    }

    if (client_cuit) {
      const queryWithClientCuit =
        ' AND op.client_cuit = ' + "'" + client_cuit + "'";
      pagination = pagination + queryWithClientCuit;
      lastPage = lastPage + queryWithClientCuit;
      total = total + queryWithClientCuit;
    }

    if (booking_id) {
      const queryWithBookingId =
        ' AND op.booking_id = ' + "'" + booking_id + "'";
      pagination = pagination + queryWithBookingId;
      lastPage = lastPage + queryWithBookingId;
      total = total + queryWithBookingId;
    }

    if (vesselVissit) {
      const queryWithVesselVissit =
        ' AND op.vesselVissit = ' + "'" + vesselVissit + "'";
      pagination = pagination + queryWithVesselVissit;
      lastPage = lastPage + queryWithVesselVissit;
      total = total + queryWithVesselVissit;
    }

    if (unitId) {
      const queryWithUnitId = ' AND os.unitId = ' + "'" + unitId + "'";
      pagination = pagination + queryWithUnitId;
      lastPage = lastPage + queryWithUnitId;
      total = total + queryWithUnitId;
    }

    pagination = pagination + orderByQuery;

    console.log('pagination :', pagination);
    console.log('**********************************************************');
    console.log('query lastPage:', lastPage);
    const operations = await this.repository.query(pagination);
    console.log('operation:', operations);

    const lastPageResult = await this.repository.query(lastPage);
    const resultTotal = await this.repository.query(total);

    const pag = lastPageResult[0].val;
    console.log('pag:', pag);

    if (page > pag) {
      throw new NotFoundException('page not found');
    }
    console.log('page:', page);
    const response = new IndexOperationResponseDto();

    response.current_page = page;
    response.from = (page - 1) * limit;
    if (page.toString() === pag.toString()) {
      const n = operations.length;
      response.to = response.from + n;
      response.per_page = n;
    } else {
      response.to = page * limit;
      response.per_page = limit;
    }
    response.last_page = lastPageResult[0].val;
    response.total = resultTotal[0].val;

    response.data = [];

    for (const operation of operations) {
      console.log('operation', operation);
      const item = new IndexOperationDataResponseDto();
      item.id = operation.id;
      item.client_id = operation.client_id;
      item.client_cuit = operation.client_cuit;
      item.type = operation.type;
      item.user_creator = operation.user_creator;
      item.status = operation.status;
      item.vessel_vissit = operation.vesselVissit;
      item.booking_id = operation.booking_id;
      item.shifts_operation_id = operation.shifts_operation_id;
      response.data.push(item);
    }
    return response;
  }
}
