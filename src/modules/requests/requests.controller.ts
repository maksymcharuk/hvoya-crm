import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { User } from '@decorators/user.decorator';
import { RequestsPageOptionsDto } from '@dtos/requests-page-options.dto';
import { ApproveRequestDto } from '@dtos/requests/approve-request.dto';
import { CreateRequestDto } from '@dtos/requests/create-request.dto';
import { RejectRequestDto } from '@dtos/requests/reject-request.dto';
import { UpdateRequestDto } from '@dtos/requests/update-request.dto';
import { RequestEntity } from '@entities/request.entity';
import { Action } from '@enums/action.enum';
import { Page } from '@interfaces/page.interface';

import { JwtAuthGuard } from '@modules/auth/jwt-auth/jwt-auth.guard';
import { AppAbility } from '@modules/casl/casl-ability/casl-ability.factory';
import { CheckPolicies } from '@modules/casl/check-policies.decorator';
import { PoliciesGuard } from '@modules/casl/policies.guard';

import { RequestsService } from './requests.service';

const uploadFilesConfig = {
  uploadFields: [
    { name: 'documents', maxCount: 1 },
    { name: 'images', maxCount: 3 },
  ],
  localOptions: {
    fileFilter: (_req: any, file: any, callback: any) => {
      switch (file.fieldname) {
        case 'documents':
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
};

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
      uploadFilesConfig.uploadFields,
      uploadFilesConfig.localOptions,
    ),
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Create, RequestEntity),
  )
  async createRequest(
    @User('id') userId: string,
    @Body() createRequestDto: CreateRequestDto,
    @UploadedFiles()
    files: {
      documents?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ): Promise<RequestEntity> {
    let document;

    if (files.documents) {
      [document] = files.documents;
    }

    return this.requestService.createRequest({
      userId,
      createRequestDto,
      document,
      images: files.images!,
    });
  }

  @Put(':number/approve')
  @UseInterceptors(
    FileFieldsInterceptor(
      uploadFilesConfig.uploadFields,
      uploadFilesConfig.localOptions,
    ),
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Approve, RequestEntity),
  )
  async approveRequest(
    @User('id') userId: string,
    @Param('number') number: string,
    @Body() approveRequestDto: ApproveRequestDto,
    @UploadedFiles()
    files: {
      documents?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ): Promise<RequestEntity> {
    let document;

    if (files.documents) {
      [document] = files.documents;
    }

    return this.requestService.approveRequest({
      userId,
      requestNumber: number,
      approveRequestDto,
      document,
      images: files.images!,
    });
  }

  @Put(':number/reject')
  @UseInterceptors(
    FileFieldsInterceptor(
      uploadFilesConfig.uploadFields,
      uploadFilesConfig.localOptions,
    ),
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Approve, RequestEntity),
  )
  async rejectRequest(
    @User('id') userId: string,
    @Param('number') number: string,
    @Body() rejectRequestDto: RejectRequestDto,
    @UploadedFiles()
    files: {
      documents?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ): Promise<RequestEntity> {
    let document;

    if (files.documents) {
      [document] = files.documents;
    }

    return this.requestService.rejectRequest({
      userId,
      requestNumber: number,
      rejectRequestDto,
      document,
      images: files.images!,
    });
  }

  @Put(':number')
  @UseInterceptors(
    FileFieldsInterceptor(
      uploadFilesConfig.uploadFields,
      uploadFilesConfig.localOptions,
    ),
  )
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Update, RequestEntity),
  )
  async updateRequest(
    @User('id') userId: string,
    @Param('number') requestNumber: string,
    @Body() updateRequestDto: UpdateRequestDto,
    @UploadedFiles()
    files: {
      documents?: Express.Multer.File[];
      images?: Express.Multer.File[];
    },
  ): Promise<RequestEntity> {
    let document;

    if (files.documents) {
      [document] = files.documents;
    }

    return this.requestService.updateRequest({
      userId,
      requestNumber,
      updateRequestDto,
      document,
      images: files.images!,
    });
  }

  @Put(':number/restore')
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Restore, RequestEntity),
  )
  async restoreRequest(
    @User('id') userId: string,
    @Param('number') requestNumber: string,
  ): Promise<RequestEntity> {
    return this.requestService.restoreRequest({ userId, requestNumber });
  }
}
