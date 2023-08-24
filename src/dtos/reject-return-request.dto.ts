import { IsNotEmpty } from 'class-validator';

export class RejectReturnRequestDto {
  @IsNotEmpty({ message: 'Необхідно вказати причину відмови' })
  managerComment: string;
}
