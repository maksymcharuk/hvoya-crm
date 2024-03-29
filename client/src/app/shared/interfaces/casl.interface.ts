import { AbilityClass, InferSubjects, PureAbility } from '@casl/ability';

import { Faq } from './entities/faq.entity';
import { FundsWithdrawalRequest } from './entities/funds-withdrawal-request.entity';
import { OrderReturnRequest } from './entities/order-return-request.entity';
import { Order } from './entities/order.entity';
import { RequestEntity } from './entities/request.entity';
import { User } from './entities/user.entity';
import { AdminPage } from './pages/admin-page.entity';
import { DashboardPage } from './pages/dashboard-page.entity';

export type Actions =
  // Basic actions
  | 'manage'
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  // Orders
  | 'cancel'
  | 'return'
  // Requests
  | 'approve'
  // Pages
  | 'visit';

export type Subjects =
  | InferSubjects<
      // Pages
      | typeof AdminPage
      | typeof DashboardPage
      // Entities
      | typeof Order
      | typeof Faq
      | typeof User
      | typeof RequestEntity
      | typeof OrderReturnRequest
      | typeof FundsWithdrawalRequest
    >
  | 'all';

export type AppAbility = PureAbility<[Actions, Subjects]>;
export const AppAbility = PureAbility as AbilityClass<AppAbility>;
