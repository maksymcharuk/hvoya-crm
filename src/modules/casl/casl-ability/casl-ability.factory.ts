import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { BalanceEntity } from '@entities/balance.entity';
import { CartEntity } from '@entities/cart.entity';
import { FaqEntity } from '@entities/faq.entity';
import { NotificationEntity } from '@entities/notification.entity';
import { OrderReturnRequestEntity } from '@entities/order-return-request.entity';
import { OrderEntity } from '@entities/order.entity';
import { ProductBaseEntity } from '@entities/product-base.entity';
import { ProductCategoryEntity } from '@entities/product-category.entity';
import { ProductColorEntity } from '@entities/product-color.entity';
import { ProductPackageSizeEntity } from '@entities/product-package-size.entity';
import { ProductSizeEntity } from '@entities/product-size.entity';
import { ProductVariantEntity } from '@entities/product-variant.entity';
import { RequestEntity } from '@entities/request.entity';
import { UserEntity } from '@entities/user.entity';
import { Action } from '@enums/action.enum';
import { OrderReturnRequestStatus } from '@enums/order-return-request-status.enum';
import { OrderStatus } from '@enums/order-status.enum';
import { Role } from '@enums/role.enum';

import { ADMIN_ORDER_READ_FIELDS } from './permitted-fields/admin/order';
import { ADMIN_USER_READ_FIELDS } from './permitted-fields/admin/user';
import { ANY_ADMIN_REQUEST_READ_FIELDS } from './permitted-fields/any-admin/request';
import { SUPER_ADMIN_ORDER_READ_FIELDS } from './permitted-fields/super-admin/order';
import {
  SUPER_ADMIN_USER_READ_FIELDS,
  SUPER_ADMIN_USER_WRITE_FIELDS,
} from './permitted-fields/super-admin/user';
import { USER_BALANCE_READ_FIELDS } from './permitted-fields/user/balance';
import { USER_ORDER_READ_FIELDS } from './permitted-fields/user/order';
import { USER_REQUEST_READ_FIELDS } from './permitted-fields/user/request';
import { USER_USER_READ_FIELDS } from './permitted-fields/user/user';

type Subjects =
  | InferSubjects<
      | typeof UserEntity
      | typeof ProductCategoryEntity
      | typeof ProductBaseEntity
      | typeof ProductVariantEntity
      | typeof ProductColorEntity
      | typeof ProductSizeEntity
      | typeof ProductPackageSizeEntity
      | typeof CartEntity
      | typeof OrderEntity
      | typeof FaqEntity
      | typeof BalanceEntity
      | typeof NotificationEntity
      | typeof OrderReturnRequestEntity
      | typeof RequestEntity
    >
  | 'AdminAalytics'
  | 'PersonalAnalytics'
  | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserEntity) {
    const ability = new AbilityBuilder<AppAbility>(createMongoAbility);

    this.setPermissionsForSuperAdmin(ability, user);
    this.setPermissionsForAdmin(ability, user);
    this.setPermissionsForUser(ability, user);

    return createMongoAbility<AppAbility>(ability.rules, {
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  // SuperAdmin
  private setPermissionsForSuperAdmin(
    { can, cannot }: AbilityBuilder<AppAbility>,
    currentUser: UserEntity,
  ) {
    if (currentUser.role !== Role.SuperAdmin) {
      return;
    }

    // All
    // -------------------------------------------------------------------------
    // Read-write access to everything
    can(Action.Manage, 'all');
    can(Action.SuperUpdate, 'all');
    // -------------------------------------------------------------------------

    // Users
    // -------------------------------------------------------------------------
    can(Action.Read, UserEntity, SUPER_ADMIN_USER_READ_FIELDS);
    can(Action.Update, UserEntity, SUPER_ADMIN_USER_WRITE_FIELDS, {
      role: { $ne: Role.SuperAdmin },
    });
    // -------------------------------------------------------------------------

    // Orders
    // -------------------------------------------------------------------------
    can(Action.Read, OrderEntity, SUPER_ADMIN_ORDER_READ_FIELDS);
    // -------------------------------------------------------------------------

    // Cart
    // -------------------------------------------------------------------------
    cannot([Action.AddTo, Action.RemoveFrom], CartEntity);
    // -------------------------------------------------------------------------

    // Return requests
    // -------------------------------------------------------------------------
    cannot(
      [Action.Update, Action.Approve, Action.Decline],
      OrderReturnRequestEntity,
      {
        status: { $ne: OrderReturnRequestStatus.Pending },
      },
    );
    can(Action.Read, RequestEntity, ANY_ADMIN_REQUEST_READ_FIELDS);
  }

  // Admin
  private setPermissionsForAdmin(
    { can, cannot }: AbilityBuilder<AppAbility>,
    currentUser: UserEntity,
  ) {
    if (currentUser.role !== Role.Admin) {
      return;
    }

    // Users
    // -------------------------------------------------------------------------
    can([Action.Read], UserEntity, ADMIN_USER_READ_FIELDS, {
      role: { $ne: Role.SuperAdmin },
    });
    can([Action.Update], UserEntity, { id: currentUser.id });
    can([Action.Update, Action.Approve], UserEntity, {
      role: { $eq: Role.User },
    });
    // -------------------------------------------------------------------------

    // Products
    // -------------------------------------------------------------------------
    can([Action.Read, Action.Create, Action.Update], ProductCategoryEntity);
    can([Action.Read, Action.Create, Action.Update], ProductBaseEntity);
    can([Action.Read, Action.Create, Action.Update], ProductVariantEntity);
    can([Action.Read, Action.Create, Action.Update], ProductColorEntity);
    can([Action.Read, Action.Create, Action.Update], ProductSizeEntity);
    can([Action.Read, Action.Create, Action.Update], ProductPackageSizeEntity);
    // -------------------------------------------------------------------------

    // Orders
    // -------------------------------------------------------------------------
    can([Action.Create, Action.Update, Action.SuperUpdate], OrderEntity);
    can(Action.Read, OrderEntity, ADMIN_ORDER_READ_FIELDS);
    // -------------------------------------------------------------------------

    // FAQ
    // -------------------------------------------------------------------------
    can([Action.Read, Action.Create, Action.Update], FaqEntity);
    // -------------------------------------------------------------------------

    // Balance
    // -------------------------------------------------------------------------
    can([Action.Read, Action.Update], BalanceEntity);
    // -------------------------------------------------------------------------

    // Notifications
    // -------------------------------------------------------------------------
    can([Action.Read, Action.Create, Action.Update], NotificationEntity);
    // -------------------------------------------------------------------------

    // Return requests
    // -------------------------------------------------------------------------
    can(Action.Read, OrderReturnRequestEntity);
    can(
      [Action.Update, Action.Approve, Action.Decline],
      OrderReturnRequestEntity,
      {
        status: OrderReturnRequestStatus.Pending,
      },
    );
    can(Action.Read, RequestEntity, ANY_ADMIN_REQUEST_READ_FIELDS);
    can([Action.Update, Action.Approve, Action.Decline], RequestEntity);
    // -------------------------------------------------------------------------

    // Cart
    // -------------------------------------------------------------------------
    cannot([Action.AddTo, Action.RemoveFrom], CartEntity);
    // -------------------------------------------------------------------------

    // Analytics
    // -------------------------------------------------------------------------
    can(Action.Read, 'AdminAalytics');
  }

  // User
  private setPermissionsForUser(
    { can }: AbilityBuilder<AppAbility>,
    currentUser: UserEntity,
  ) {
    if (currentUser.role !== Role.User) {
      return;
    }

    // Users
    // -------------------------------------------------------------------------
    can([Action.Read, Action.Update], UserEntity, USER_USER_READ_FIELDS, {
      id: currentUser.id,
    });
    // -------------------------------------------------------------------------

    // Products
    // -------------------------------------------------------------------------
    can(Action.Read, ProductCategoryEntity);
    can(Action.Read, ProductBaseEntity);
    can(Action.Read, ProductVariantEntity, {
      ['properties.isPublished' as keyof ProductVariantEntity]: true,
    });
    can([Action.Read], ProductColorEntity);
    can([Action.Read], ProductSizeEntity);
    can([Action.Read], ProductPackageSizeEntity);
    // -------------------------------------------------------------------------

    // Cart
    // -------------------------------------------------------------------------
    can([Action.Read, Action.AddTo, Action.RemoveFrom], CartEntity, {
      ['owner.id' as keyof CartEntity]: currentUser.id,
    });
    // -------------------------------------------------------------------------

    // Orders
    // -------------------------------------------------------------------------
    can([Action.Create], OrderEntity);
    // Can update or cancel only his own orders with status pending
    can([Action.Update, Action.Cancel], OrderEntity, {
      ['customer.id' as keyof OrderEntity]: currentUser.id,
      ['statuses.0.status' as keyof OrderEntity]: OrderStatus.Pending,
    });
    // Can read only his own orders
    can([Action.Read], OrderEntity, USER_ORDER_READ_FIELDS, {
      ['customer.id' as keyof OrderEntity]: currentUser.id,
    });
    // -------------------------------------------------------------------------

    // FAQ
    // -------------------------------------------------------------------------
    // Can read only published faq
    can([Action.Read], FaqEntity, { isPublished: true });
    // -------------------------------------------------------------------------

    // Balance
    // -------------------------------------------------------------------------
    // Can read only his own balance
    can([Action.Read], BalanceEntity, USER_BALANCE_READ_FIELDS, {
      ['owner.id' as keyof BalanceEntity]: currentUser.id,
    });
    // -------------------------------------------------------------------------

    // Notifications
    // -------------------------------------------------------------------------
    // Can read only his own notifications
    can([Action.Read], NotificationEntity, {
      ['user.id' as keyof NotificationEntity]: currentUser.id,
    });
    // -------------------------------------------------------------------------

    // Analytics
    // -------------------------------------------------------------------------
    can(Action.Read, 'PersonalAnalytics');

    // Return requests
    // -------------------------------------------------------------------------
    can([Action.Read, Action.Create], OrderReturnRequestEntity);
    can([Action.Update], OrderReturnRequestEntity, {
      status: OrderReturnRequestStatus.Pending,
    });
    can(Action.Read, RequestEntity, USER_REQUEST_READ_FIELDS, {
      ['customer.id' as keyof RequestEntity]: currentUser.id,
    });
    can([Action.Create, Action.Update], RequestEntity, {
      ['customer.id' as keyof RequestEntity]: currentUser.id,
    });
    // -------------------------------------------------------------------------
  }
}
