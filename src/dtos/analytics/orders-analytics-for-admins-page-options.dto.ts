import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class OrdersAnalyticsForAdminsPageOptionsDto {
  private readonly now = new Date();
  private readonly defaultStartDate = new Date(
    this.now.getFullYear() - 1,
    this.now.getMonth(),
    this.now.getDate(),
  );

  @IsOptional()
  @Transform(({ value }: { value: [string, string] }) => {
    const [from, to] = value;
    return [new Date(from), new Date(to)];
  })
  readonly range: [Date, Date] = [this.defaultStartDate, this.now];
}
