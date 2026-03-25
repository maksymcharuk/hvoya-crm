import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class NlqMessageDto {
  @IsString()
  role: 'user' | 'assistant';

  @IsString()
  content: string;
}

export class NlqRequestDto {
  @IsString()
  question: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NlqMessageDto)
  conversationHistory?: NlqMessageDto[];
}

export type VizType = 'table' | 'bar' | 'line' | 'kpi';

export interface NlqResponseDto {
  answer: string;
  toolCalled: string | null;
  data: unknown;
  vizType: VizType;
  vizFields?: string[];
}
