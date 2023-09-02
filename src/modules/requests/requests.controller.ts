import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';

import { User } from '@decorators/user.decorator';
import { ApproveReturnRequestDto } from '@dtos/approve-return-request.dto';
import { CreateRequestDto } from '@dtos/create-request.dto';
import { RejectReturnRequestDto } from '@dtos/reject-return-request.dto';
import { RequestsPageOptionsDto } from '@dtos/requests-page-options.dto';
import { UpdateRequestByCustomerDto } from '@dtos/update-request-by-customer.dto';
import { RequestEntity } from '@entities/request.entity';
import { Action } from '@enums/action.enum';
import { Page } from '@interfaces/page.interface';

import { JwtAuthGuard } from '@modules/auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '@modules/casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '@modules/casl/check-policies.decorator';
import { PoliciesGuard } from '@modules/casl/policies.guard';

import { RequestsService } from './requests.service';

@Controller('requests')
@UseGuards(JwtAuthGuard, PoliciesGuard)
export class RequestsController {
  constructor(private requestService: RequestsService) {}

  @Get()
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, RequestEntity),
  )
  async getRequests(
    @User('id') userId: string,
    @Query() requestsPageOptionsDto: RequestsPageOptionsDto,
  ): Promise<Page<RequestEntity>> {
    return this.requestService.getRequests(userId, requestsPageOptionsDto);
  }

  @Get(':number')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Read, RequestEntity),
  )
  async getRequest(
    @User('id') userId: string,
    @Param('number') number: string,
  ): Promise<RequestEntity> {
    return this.requestService.getRequest(userId, number);
  }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'waybill', maxCount: 1 },
        { name: 'images', maxCount: 3 },
      ],
      {
        fileFilter: (_req, file, callback) => {
          switch (file.fieldname) {
            case 'waybill':
              if (!file.mimetype.match(/(pdf)$/)) {
                return callback(
                  new BadRequestException(
                    'Лише файли формату PDF дозволені для файлу маркування',
                  ),
                  false,
                );
              }
              break;
            case 'images':
              if (!file.mimetype.match(/(jpeg|jpg|png)$/)) {
                return callback(
                  new BadRequestException(
                    'Лише файли формату JPEG, JPG, PNG дозволені для зображень',
                  ),
                  false,
                );
              }
              break;
          }
          callback(null, true);
        },
      },
    ),
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, RequestEntity),
  )
  async createRequest(
    @User('id') userId: string,
    @Body() createRequestDto: CreateRequestDto,
    @UploadedFiles()
    files: { waybill: Express.Multer.File[]; images?: Express.Multer.File[] },
  ): Promise<RequestEntity> {
    const [waybill] = files.waybill;

    return this.requestService.createRequest(
      userId,
      createRequestDto,
      waybill,
      files.images,
    );
  }

  @Put(':number/approve')
  @UseInterceptors(FilesInterceptor('images'))
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Approve, RequestEntity),
  )
  async approveRequest(
    @User('id') userId: string,
    @Param('number') number: string,
    @Body() approveRequestDto: ApproveReturnRequestDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: '(jpeg|jpg|png)$' }),
        ],
        fileIsRequired: false,
      }),
    )
    managerImages: Express.Multer.File[],
  ): Promise<RequestEntity> {
    console.log(approveRequestDto);

    return this.requestService.approveRequest(
      userId,
      number,
      approveRequestDto,
      managerImages,
    );
  }

  @Put(':number/reject')
  @UseInterceptors(FilesInterceptor('images'))
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Approve, RequestEntity),
  )
  async rejectRequest(
    @User('id') userId: string,
    @Param('number') number: string,
    @Body() rejectRequestDto: RejectReturnRequestDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: '(jpeg|jpg|png)$' }),
        ],
        fileIsRequired: false,
      }),
    )
    managerImages: Express.Multer.File[],
  ): Promise<RequestEntity> {
    return this.requestService.rejectRequest(
      userId,
      number,
      rejectRequestDto,
      managerImages,
    );
  }

  @Put(':number/update-by-customer')
  @UseInterceptors(FileInterceptor('waybill'))
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, RequestEntity),
  )
  async updateRequestWaybill(
    @User('id') userId: string,
    @Param('number') requestNumber: string,
    @Body() updateRequestByCustomerDto: UpdateRequestByCustomerDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: '(pdf)$' }),
        ],
        fileIsRequired: false,
      }),
    )
    waybill: Express.Multer.File,
  ): Promise<RequestEntity> {
    return this.requestService.updateRequestByCustomer(
      userId,
      requestNumber,
      updateRequestByCustomerDto,
      waybill,
    );
  }
}
