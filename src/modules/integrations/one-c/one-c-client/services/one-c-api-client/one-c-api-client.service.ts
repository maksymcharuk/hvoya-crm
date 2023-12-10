import { AxiosError, AxiosResponse } from 'axios';
import { Observable, catchError, firstValueFrom, map } from 'rxjs';

import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import config from '@root/config';

import {
  Counterparty,
  CounterpartyDto,
  CounterpartyDtoData,
  DepositFundsDto,
  DepositFundsDtoData,
  GetProductsStockDto,
  GetProductsStockResponse,
  GetProductsStockResponseData,
  Order,
  OrderDto,
  OrderDtoData,
  RefundsDto,
  RefundsDtoData,
  ReturnDto,
  ReturnDtoData,
  SyncProduct,
  SyncProductsResponse,
  SyncProductsResponseData,
} from '@interfaces/one-c';

const { isOneCDisabled } = config();

@Injectable()
export class OneCApiClientService {
  private readonly username =
    this.configService.get<string>('ONE_C_API_USERNAME') ?? '';
  private readonly password =
    this.configService.get<string>('ONE_C_API_PASSWORD') ?? '';
  private readonly apiUrl =
    this.configService.get<string>('ONE_C_API_URL') ?? '';
  private readonly auth = {
    username: this.username,
    password: this.password,
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) {}

  counterparty(data: CounterpartyDtoData): Promise<void> {
    const requestData: CounterpartyDto = [new Counterparty(data)];

    return this.makeApiCall(
      this.httpService
        .post<void>(`${this.apiUrl}/Counterparty`, requestData, {
          auth: this.auth,
        })
        .pipe(
          map((response: AxiosResponse<void>) => {
            return response.data;
          }),
        ),
    );
  }

  order(data: OrderDtoData): Promise<void> {
    const requestData: OrderDto = [new Order(data)];
    return this.makeApiCall(
      this.httpService
        .post<void>(`${this.apiUrl}/Order`, requestData, {
          auth: this.auth,
        })
        .pipe(
          catchError((error: AxiosError) => {
            if (error.response?.data) {
              throw new HttpException(
                {
                  message: 'На жаль, деяких товарів вже немає в наявності',
                  data: this.parseOrderProductsAvailabilityError(error),
                },
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
              );
            } else {
              throw new HttpException(
                error.message,
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }
          }),
          map((response: AxiosResponse<void>) => {
            return response.data;
          }),
        ),
    );
  }

  refunds(data: RefundsDtoData): Promise<void> {
    const requestData: RefundsDto = new RefundsDto(data);
    return this.makeApiCall(
      this.httpService
        .post<void>(`${this.apiUrl}/Refunds`, requestData, {
          auth: this.auth,
        })
        .pipe(
          map((response: AxiosResponse<void>) => {
            return response.data;
          }),
        ),
    );
  }

  return(data: ReturnDtoData): Promise<void> {
    const requestData: ReturnDto = new ReturnDto(data);
    return this.makeApiCall(
      this.httpService
        .post<void>(`${this.apiUrl}/Return`, requestData, {
          auth: this.auth,
        })
        .pipe(
          map((response: AxiosResponse<void>) => {
            return response.data;
          }),
        ),
    );
  }

  cancel(orderId: string): Promise<void> {
    return this.makeApiCall(
      this.httpService
        .post<void>(
          `${this.apiUrl}/Cancel?id_order=${orderId}`,
          {},
          {
            auth: this.auth,
          },
        )
        .pipe(
          map((response: AxiosResponse<void>) => {
            return response.data;
          }),
        ),
    );
  }

  depositFunds(data: DepositFundsDtoData): Promise<void> {
    const requestData: DepositFundsDto = new DepositFundsDto(data);
    return this.makeApiCall(
      this.httpService
        .post<void>(`${this.apiUrl}/DepositFunds`, requestData, {
          auth: this.auth,
        })
        .pipe(
          map((response: AxiosResponse<void>) => {
            return response.data;
          }),
        ),
    );
  }

  getProductsStock(
    data: GetProductsStockDto,
  ): Promise<GetProductsStockResponse> {
    const requestData: GetProductsStockDto = data;
    return this.makeApiCall(
      this.httpService
        .post<GetProductsStockResponseData>(
          `${this.apiUrl}/GetProductsStock`,
          requestData,
          {
            auth: this.auth,
          },
        )
        .pipe(
          map((response: AxiosResponse<GetProductsStockResponseData>) => {
            return new GetProductsStockResponse(response.data);
          }),
        ),
    );
  }

  syncProducts(): Promise<SyncProductsResponse> {
    return this.makeApiCall(
      this.httpService
        .get<SyncProductsResponseData>(`${this.apiUrl}/SyncProducts`, {
          auth: this.auth,
        })
        .pipe(
          map((response: AxiosResponse<SyncProductsResponseData>) => {
            return response.data.map((product) => {
              return new SyncProduct(product);
            });
          }),
        ),
    );
  }

  private parseOrderProductsAvailabilityError(
    error: AxiosError,
  ): SyncProduct[] {
    const productsData = error.response?.data;
    if (productsData && Array.isArray(productsData)) {
      return productsData.map((product) => new SyncProduct(product));
    } else {
      return [];
    }
  }

  private makeApiCall<T>(apiCall: Observable<T>): Promise<T> {
    if (isOneCDisabled()) {
      return Promise.resolve() as Promise<T>;
    }
    return firstValueFrom(
      apiCall.pipe(
        catchError((error: AxiosError) => {
          this.logger.error({
            context: 'OneCApiClientService',
            message: error.message,
            stack: error.stack,
            details: error.response?.data,
          });

          throw new HttpException(
            {
              message: error.message,
              data: error.response?.data,
            },
            error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      ),
    );
  }
}
