export interface ApproveReturnRequestDTO {
  approvedItems: ApproveReturnRequestItemDto[];
  deduction: number;
}


export interface ApproveReturnRequestItemDto {
  quantity: number;
  orderItemId: string;
}
