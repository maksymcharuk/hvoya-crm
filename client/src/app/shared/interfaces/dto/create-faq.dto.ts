export interface CreateFaqDTO {
  question: string;
  answer: string;
  order: number;
  isPublished?: boolean;
}
