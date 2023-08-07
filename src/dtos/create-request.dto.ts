import { IsNotEmpty, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

import { CreateReturnRequestDto } from "./create-return-request.dto";

import { RequestType } from "@enums/request-type.enum";

export class CreateRequestDto {
  @IsNotEmpty({ message: 'Необхідно вказати причину повернення' })
  customerComment: string;

  @IsNotEmpty()
  requestType: RequestType

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  returnRequest: CreateReturnRequestDto
}

