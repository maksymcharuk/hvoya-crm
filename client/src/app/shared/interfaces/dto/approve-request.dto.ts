export interface ApproveReturnRequestDTO {
  approvedItems: ApproveReturnRequestItemDTO[];
  managerComment?: string;
  deduction: number;
}

export interface ApproveReturnRequestItemDTO {
  quantity: number;
  orderItemId: string;
}
