export interface ApproveReturnRequestDTO {
  approvedItems: ApproveReturnRequestItemDto[];
  managerComment?: string;
  deduction: number;
}

export interface ApproveReturnRequestItemDto {
  quantity: number;
  orderItemId: string;
}
