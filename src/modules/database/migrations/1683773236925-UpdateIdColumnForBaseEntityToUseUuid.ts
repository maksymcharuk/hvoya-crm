import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateIdColumnForBaseEntityToUseUuid1683773236925
  implements MigrationInterface
{
  name = 'UpdateIdColumnForBaseEntityToUseUuid1683773236925';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" DROP CONSTRAINT "FK_07ad4173381441065a18998fdec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" DROP CONSTRAINT "FK_c7d42fb3ea671da309d0d105dc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d"`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "file" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP CONSTRAINT "FK_e52944a42e0586566220c14dffe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_color" DROP CONSTRAINT "PK_e586d22a197c9b985af3ac82ce3"`,
    );
    await queryRunner.query(`ALTER TABLE "product_color" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "product_color" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_color" ADD CONSTRAINT "PK_e586d22a197c9b985af3ac82ce3" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_base" DROP CONSTRAINT "FK_baa9383d47c877117fd66feea42"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" DROP CONSTRAINT "PK_0dce9bc93c2d2c399982d04bef1"`,
    );
    await queryRunner.query(`ALTER TABLE "product_category" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "product_category" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" ADD CONSTRAINT "PK_0dce9bc93c2d2c399982d04bef1" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP CONSTRAINT "FK_9f15354d84c90d612ddb36d68a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_base" DROP CONSTRAINT "PK_13bac3fda6ce20723dd774c39f0"`,
    );
    await queryRunner.query(`ALTER TABLE "product_base" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "product_base" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_base" ADD CONSTRAINT "PK_13bac3fda6ce20723dd774c39f0" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_base" DROP COLUMN "categoryId"`,
    );
    await queryRunner.query(`ALTER TABLE "product_base" ADD "categoryId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_904370c093ceea4369659a3c810"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP CONSTRAINT "FK_cffc9e18f85a8d8173e5d835ee3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP CONSTRAINT "FK_ecc5f4613300a6899e65721e4f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP CONSTRAINT "PK_1ab69c9935c61f7c70791ae0a9f"`,
    );
    await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD CONSTRAINT "PK_1ab69c9935c61f7c70791ae0a9f" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP COLUMN "propertiesId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD "propertiesId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP COLUMN "baseProductId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD "baseProductId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" DROP CONSTRAINT "FK_4b84ca78e14dc02cbf0105faf14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_80a1b7abed72e271c31fc4cc75a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP CONSTRAINT "FK_d1e09d6e586e4441a30e6cc0229"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP CONSTRAINT "PK_c51d81a7e32d11a7b59c13192cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD CONSTRAINT "PK_c51d81a7e32d11a7b59c13192cb" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP COLUMN "colorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD "colorId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP COLUMN "sizeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD "sizeId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP COLUMN "productId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD "productId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_size" DROP CONSTRAINT "PK_3210db31599e5c505183be05896"`,
    );
    await queryRunner.query(`ALTER TABLE "product_size" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "product_size" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_size" ADD CONSTRAINT "PK_3210db31599e5c505183be05896" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_ec67a0143b254c3577087b20d3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" DROP CONSTRAINT "PK_962eec87d3d029c51525f259fba"`,
    );
    await queryRunner.query(`ALTER TABLE "order_delivery" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ADD CONSTRAINT "PK_962eec87d3d029c51525f259fba" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" DROP CONSTRAINT "UQ_c7d42fb3ea671da309d0d105dc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" DROP COLUMN "waybillId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ADD "waybillId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ADD CONSTRAINT "UQ_c7d42fb3ea671da309d0d105dc4" UNIQUE ("waybillId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90"`,
    );
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "productId"`);
    await queryRunner.query(`ALTER TABLE "order_item" ADD "productId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP COLUMN "productPropertiesId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD "productPropertiesId" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "orderId"`);
    await queryRunner.query(`ALTER TABLE "order_item" ADD "orderId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP CONSTRAINT "FK_eec1bdc9c06ce2fcd67cd79082b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_124456e637cca7a415897dce659"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "PK_1031171c13130102495201e3e20"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "REL_ec67a0143b254c3577087b20d3"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryId"`);
    await queryRunner.query(`ALTER TABLE "order" ADD "deliveryId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "UQ_ec67a0143b254c3577087b20d3a" UNIQUE ("deliveryId")`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customerId"`);
    await queryRunner.query(`ALTER TABLE "order" ADD "customerId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP CONSTRAINT "FK_a383ff3d0c13274d5b731d6e81c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP CONSTRAINT "PK_82c3470854cf4642dfb0d7150cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD CONSTRAINT "PK_82c3470854cf4642dfb0d7150cd" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "orderId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "orderId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "balanceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "balanceId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_122eba7abb932493831f1e0f62b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance" DROP CONSTRAINT "PK_079dddd31a81672e8143a649ca0"`,
    );
    await queryRunner.query(`ALTER TABLE "balance" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "balance" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance" ADD CONSTRAINT "PK_079dddd31a81672e8143a649ca0" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "FK_29e590514f9941296f3a2440d39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "PK_bd94725aa84f8cf37632bcde997"`,
    );
    await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "productId"`);
    await queryRunner.query(`ALTER TABLE "cart_item" ADD "productId" uuid`);
    await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "cartId"`);
    await queryRunner.query(`ALTER TABLE "cart_item" ADD "cartId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_342497b574edb2309ec8c6b62aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7"`,
    );
    await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "cart" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7"`,
    );
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "notification" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_342497b574edb2309ec8c6b62aa"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "cartId"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "cartId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_342497b574edb2309ec8c6b62aa" UNIQUE ("cartId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_122eba7abb932493831f1e0f62b"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "balanceId"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "balanceId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_122eba7abb932493831f1e0f62b" UNIQUE ("balanceId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "faq" DROP CONSTRAINT "PK_d6f5a52b1a96dd8d0591f9fbc47"`,
    );
    await queryRunner.query(`ALTER TABLE "faq" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "faq" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "faq" ADD CONSTRAINT "PK_d6f5a52b1a96dd8d0591f9fbc47" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" DROP CONSTRAINT "PK_821011afa9b8116302ed74a26d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" ADD CONSTRAINT "PK_07ad4173381441065a18998fdec" PRIMARY KEY ("fileId")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4b84ca78e14dc02cbf0105faf1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" DROP COLUMN "productPropertiesId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" ADD "productPropertiesId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" DROP CONSTRAINT "PK_07ad4173381441065a18998fdec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" ADD CONSTRAINT "PK_821011afa9b8116302ed74a26d7" PRIMARY KEY ("fileId", "productPropertiesId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" DROP CONSTRAINT "PK_821011afa9b8116302ed74a26d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" ADD CONSTRAINT "PK_4b84ca78e14dc02cbf0105faf14" PRIMARY KEY ("productPropertiesId")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_07ad4173381441065a18998fde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" DROP COLUMN "fileId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" ADD "fileId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" DROP CONSTRAINT "PK_4b84ca78e14dc02cbf0105faf14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" ADD CONSTRAINT "PK_821011afa9b8116302ed74a26d7" PRIMARY KEY ("productPropertiesId", "fileId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4b84ca78e14dc02cbf0105faf1" ON "product_properties_images_file" ("productPropertiesId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_07ad4173381441065a18998fde" ON "product_properties_images_file" ("fileId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product_base" ADD CONSTRAINT "FK_baa9383d47c877117fd66feea42" FOREIGN KEY ("categoryId") REFERENCES "product_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD CONSTRAINT "FK_ecc5f4613300a6899e65721e4f5" FOREIGN KEY ("propertiesId") REFERENCES "product_properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD CONSTRAINT "FK_9f15354d84c90d612ddb36d68a4" FOREIGN KEY ("baseProductId") REFERENCES "product_base"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD CONSTRAINT "FK_e52944a42e0586566220c14dffe" FOREIGN KEY ("colorId") REFERENCES "product_color"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD CONSTRAINT "FK_d1e09d6e586e4441a30e6cc0229" FOREIGN KEY ("sizeId") REFERENCES "product_size"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD CONSTRAINT "FK_cffc9e18f85a8d8173e5d835ee3" FOREIGN KEY ("productId") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ADD CONSTRAINT "FK_c7d42fb3ea671da309d0d105dc4" FOREIGN KEY ("waybillId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_80a1b7abed72e271c31fc4cc75a" FOREIGN KEY ("productPropertiesId") REFERENCES "product_properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_ec67a0143b254c3577087b20d3a" FOREIGN KEY ("deliveryId") REFERENCES "order_delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD CONSTRAINT "FK_eec1bdc9c06ce2fcd67cd79082b" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD CONSTRAINT "FK_a383ff3d0c13274d5b731d6e81c" FOREIGN KEY ("balanceId") REFERENCES "balance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf" FOREIGN KEY ("productId") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_342497b574edb2309ec8c6b62aa" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_122eba7abb932493831f1e0f62b" FOREIGN KEY ("balanceId") REFERENCES "balance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" ADD CONSTRAINT "FK_4b84ca78e14dc02cbf0105faf14" FOREIGN KEY ("productPropertiesId") REFERENCES "product_properties"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" ADD CONSTRAINT "FK_07ad4173381441065a18998fdec" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" DROP CONSTRAINT "FK_07ad4173381441065a18998fdec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" DROP CONSTRAINT "FK_4b84ca78e14dc02cbf0105faf14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_122eba7abb932493831f1e0f62b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_342497b574edb2309ec8c6b62aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "FK_29e590514f9941296f3a2440d39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP CONSTRAINT "FK_a383ff3d0c13274d5b731d6e81c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP CONSTRAINT "FK_eec1bdc9c06ce2fcd67cd79082b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_124456e637cca7a415897dce659"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_ec67a0143b254c3577087b20d3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_80a1b7abed72e271c31fc4cc75a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_904370c093ceea4369659a3c810"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" DROP CONSTRAINT "FK_c7d42fb3ea671da309d0d105dc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP CONSTRAINT "FK_cffc9e18f85a8d8173e5d835ee3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP CONSTRAINT "FK_d1e09d6e586e4441a30e6cc0229"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP CONSTRAINT "FK_e52944a42e0586566220c14dffe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP CONSTRAINT "FK_9f15354d84c90d612ddb36d68a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP CONSTRAINT "FK_ecc5f4613300a6899e65721e4f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_base" DROP CONSTRAINT "FK_baa9383d47c877117fd66feea42"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_07ad4173381441065a18998fde"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4b84ca78e14dc02cbf0105faf1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" DROP CONSTRAINT "PK_821011afa9b8116302ed74a26d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" ADD CONSTRAINT "PK_4b84ca78e14dc02cbf0105faf14" PRIMARY KEY ("productPropertiesId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" DROP COLUMN "fileId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" ADD "fileId" integer NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_07ad4173381441065a18998fde" ON "product_properties_images_file" ("fileId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" DROP CONSTRAINT "PK_4b84ca78e14dc02cbf0105faf14"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" ADD CONSTRAINT "PK_821011afa9b8116302ed74a26d7" PRIMARY KEY ("fileId", "productPropertiesId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" DROP CONSTRAINT "PK_821011afa9b8116302ed74a26d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" ADD CONSTRAINT "PK_07ad4173381441065a18998fdec" PRIMARY KEY ("fileId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" DROP COLUMN "productPropertiesId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" ADD "productPropertiesId" integer NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4b84ca78e14dc02cbf0105faf1" ON "product_properties_images_file" ("productPropertiesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" DROP CONSTRAINT "PK_07ad4173381441065a18998fdec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" ADD CONSTRAINT "PK_821011afa9b8116302ed74a26d7" PRIMARY KEY ("productPropertiesId", "fileId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "faq" DROP CONSTRAINT "PK_d6f5a52b1a96dd8d0591f9fbc47"`,
    );
    await queryRunner.query(`ALTER TABLE "faq" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "faq" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "faq" ADD CONSTRAINT "PK_d6f5a52b1a96dd8d0591f9fbc47" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_122eba7abb932493831f1e0f62b"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "balanceId"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "balanceId" integer`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_122eba7abb932493831f1e0f62b" UNIQUE ("balanceId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_342497b574edb2309ec8c6b62aa"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "cartId"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "cartId" integer`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_342497b574edb2309ec8c6b62aa" UNIQUE ("cartId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "notification" ADD "userId" integer`);
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7"`,
    );
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7"`,
    );
    await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "cart" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_342497b574edb2309ec8c6b62aa" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "cartId"`);
    await queryRunner.query(`ALTER TABLE "cart_item" ADD "cartId" integer`);
    await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "productId"`);
    await queryRunner.query(`ALTER TABLE "cart_item" ADD "productId" integer`);
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "PK_bd94725aa84f8cf37632bcde997"`,
    );
    await queryRunner.query(`ALTER TABLE "cart_item" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "cart_item" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "balance" DROP CONSTRAINT "PK_079dddd31a81672e8143a649ca0"`,
    );
    await queryRunner.query(`ALTER TABLE "balance" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "balance" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "balance" ADD CONSTRAINT "PK_079dddd31a81672e8143a649ca0" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_122eba7abb932493831f1e0f62b" FOREIGN KEY ("balanceId") REFERENCES "balance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "balanceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "balanceId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "orderId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "orderId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP CONSTRAINT "PK_82c3470854cf4642dfb0d7150cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD CONSTRAINT "PK_82c3470854cf4642dfb0d7150cd" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD CONSTRAINT "FK_a383ff3d0c13274d5b731d6e81c" FOREIGN KEY ("balanceId") REFERENCES "balance"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "customerId"`);
    await queryRunner.query(`ALTER TABLE "order" ADD "customerId" integer`);
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "UQ_ec67a0143b254c3577087b20d3a"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveryId"`);
    await queryRunner.query(`ALTER TABLE "order" ADD "deliveryId" integer`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "REL_ec67a0143b254c3577087b20d3" UNIQUE ("deliveryId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "PK_1031171c13130102495201e3e20"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "order" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_transaction" ADD CONSTRAINT "FK_eec1bdc9c06ce2fcd67cd79082b" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "orderId"`);
    await queryRunner.query(`ALTER TABLE "order_item" ADD "orderId" integer`);
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP COLUMN "productPropertiesId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD "productPropertiesId" integer`,
    );
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "productId"`);
    await queryRunner.query(`ALTER TABLE "order_item" ADD "productId" integer`);
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90"`,
    );
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" DROP CONSTRAINT "UQ_c7d42fb3ea671da309d0d105dc4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" DROP COLUMN "waybillId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ADD "waybillId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ADD CONSTRAINT "UQ_c7d42fb3ea671da309d0d105dc4" UNIQUE ("waybillId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" DROP CONSTRAINT "PK_962eec87d3d029c51525f259fba"`,
    );
    await queryRunner.query(`ALTER TABLE "order_delivery" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ADD CONSTRAINT "PK_962eec87d3d029c51525f259fba" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_ec67a0143b254c3577087b20d3a" FOREIGN KEY ("deliveryId") REFERENCES "order_delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_size" DROP CONSTRAINT "PK_3210db31599e5c505183be05896"`,
    );
    await queryRunner.query(`ALTER TABLE "product_size" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "product_size" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_size" ADD CONSTRAINT "PK_3210db31599e5c505183be05896" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP COLUMN "productId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD "productId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP COLUMN "sizeId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD "sizeId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP COLUMN "colorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD "colorId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP CONSTRAINT "PK_c51d81a7e32d11a7b59c13192cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" DROP COLUMN "id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD CONSTRAINT "PK_c51d81a7e32d11a7b59c13192cb" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD CONSTRAINT "FK_d1e09d6e586e4441a30e6cc0229" FOREIGN KEY ("sizeId") REFERENCES "product_size"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_80a1b7abed72e271c31fc4cc75a" FOREIGN KEY ("productPropertiesId") REFERENCES "product_properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" ADD CONSTRAINT "FK_4b84ca78e14dc02cbf0105faf14" FOREIGN KEY ("productPropertiesId") REFERENCES "product_properties"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP COLUMN "baseProductId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD "baseProductId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP COLUMN "propertiesId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD "propertiesId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP CONSTRAINT "PK_1ab69c9935c61f7c70791ae0a9f"`,
    );
    await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD CONSTRAINT "PK_1ab69c9935c61f7c70791ae0a9f" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD CONSTRAINT "FK_ecc5f4613300a6899e65721e4f5" FOREIGN KEY ("propertiesId") REFERENCES "product_properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD CONSTRAINT "FK_cffc9e18f85a8d8173e5d835ee3" FOREIGN KEY ("productId") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf" FOREIGN KEY ("productId") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_base" DROP COLUMN "categoryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_base" ADD "categoryId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_base" DROP CONSTRAINT "PK_13bac3fda6ce20723dd774c39f0"`,
    );
    await queryRunner.query(`ALTER TABLE "product_base" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "product_base" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_base" ADD CONSTRAINT "PK_13bac3fda6ce20723dd774c39f0" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD CONSTRAINT "FK_9f15354d84c90d612ddb36d68a4" FOREIGN KEY ("baseProductId") REFERENCES "product_base"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" DROP CONSTRAINT "PK_0dce9bc93c2d2c399982d04bef1"`,
    );
    await queryRunner.query(`ALTER TABLE "product_category" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "product_category" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_category" ADD CONSTRAINT "PK_0dce9bc93c2d2c399982d04bef1" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_base" ADD CONSTRAINT "FK_baa9383d47c877117fd66feea42" FOREIGN KEY ("categoryId") REFERENCES "product_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_color" DROP CONSTRAINT "PK_e586d22a197c9b985af3ac82ce3"`,
    );
    await queryRunner.query(`ALTER TABLE "product_color" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "product_color" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_color" ADD CONSTRAINT "PK_e586d22a197c9b985af3ac82ce3" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties" ADD CONSTRAINT "FK_e52944a42e0586566220c14dffe" FOREIGN KEY ("colorId") REFERENCES "product_color"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" DROP CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d"`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "file" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "file" ADD CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_delivery" ADD CONSTRAINT "FK_c7d42fb3ea671da309d0d105dc4" FOREIGN KEY ("waybillId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_properties_images_file" ADD CONSTRAINT "FK_07ad4173381441065a18998fdec" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
