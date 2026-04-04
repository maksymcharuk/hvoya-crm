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

export interface NlqResponseDto {
  answer: string;
  toolCalled: string | null;
  data: unknown;
}

/**
 * Minimal subset of AG-UI RunAgentInput used by the /stream endpoint.
 * The full spec includes threadId, runId, state, tools, context, forwardedProps.
 */
export class RunAgentMessageDto {
  @IsString()
  id: string;

  @IsString()
  role: 'user' | 'assistant';

  @IsString()
  content: string;
}

export class RunAgentInputDto {
  @IsString()
  threadId: string;

  @IsString()
  runId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RunAgentMessageDto)
  messages: RunAgentMessageDto[];
}
