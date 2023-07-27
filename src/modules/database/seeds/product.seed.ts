import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { ProductPackageSizeEntity } from '@entities/product-package-size.entity';

import { FileEntity } from '../../../entities/file.entity';
import { ProductBaseEntity } from '../../../entities/product-base.entity';
import { ProductCategoryEntity } from '../../../entities/product-category.entity';
import { ProductColorEntity } from '../../../entities/product-color.entity';
import { ProductPropertiesEntity } from '../../../entities/product-properties.entity';
import { ProductSizeEntity } from '../../../entities/product-size.entity';
import { ProductVariantEntity } from '../../../entities/product-variant.entity';

export default class ProductSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const productCategoryRepository = dataSource.getRepository(
      ProductCategoryEntity,
    );
    const productBaseRepository = dataSource.getRepository(ProductBaseEntity);
    const productVariantRepository =
      dataSource.getRepository(ProductVariantEntity);
    const productColorRepository = dataSource.getRepository(ProductColorEntity);
    const productSizeRepository = dataSource.getRepository(ProductSizeEntity);
    const productPackageSizeRepository = dataSource.getRepository(
      ProductPackageSizeEntity,
    );
    const productPropertiesRepository = dataSource.getRepository(
      ProductPropertiesEntity,
    );
    const fileRepository = dataSource.getRepository(FileEntity);
    const productColors = await productColorRepository.save([
      {
        name: 'Зелений',
        hex: '#008000',
      },
      {
        name: 'Блакитний',
        hex: '#A6CAF0',
      },
      {
        name: 'Білий',
        hex: '#EDEEF4',
      },
    ]);
    const productSizes = await productSizeRepository.save([
      {
        height: 220,
        width: 125,
        depth: 125,
      },
      {
        height: 180,
        width: 110,
        depth: 110,
      },
      {
        height: 90,
        width: 50,
        depth: 50,
      },
      {
        height: 70,
        width: 40,
        depth: 40,
      },
      {
        height: 30,
        diameter: 60,
      },
      {
        height: 30,
        diameter: 55,
      },
    ]);
    const productPackageSizes = await productPackageSizeRepository.save([
      {
        height: 110,
        width: 70,
        depth: 70,
      },
      {
        height: 90,
        width: 60,
        depth: 60,
      },
      {
        height: 70,
        width: 30,
        depth: 30,
      },
      {
        height: 70,
        width: 20,
        depth: 20,
      },
      {
        height: 30,
        width: 60,
        depth: 60,
      },
      {
        height: 30,
        width: 55,
        depth: 55,
      },
    ]);
    const productCategory = await productCategoryRepository.save([
      {
        name: 'Віночки і гірлянди',
      },
      {
        name: 'Ялинки литі',
      },
    ]);
    const productBase = await productBaseRepository.save([
      {
        name: 'Вінок різдвяний литий Premium',
        category: productCategory[0],
      },
      {
        name: 'Гілка новорічнаTraditional',
        category: productCategory[0],
      },
      {
        name: 'Ялинка лита Premium Mix ',
        category: productCategory[1],
      },
      {
        name: 'Ялинка лита Premium в мішковині',
        category: productCategory[1],
      },
    ]);
    const productProperties = await productPropertiesRepository.save([
      {
        name: 'Вінок різдвяний литий Premium 55 см зелений',
        description: `Які ж новорічні свята без різдвяного віночка?
        Такий віночок можна почепити на двері вдома, або прикрасити ним кімнату, або створити новорічний настрій в офісі.
        Святковий вінок може стати чудовим новорічним подарунком.
      `,
        size: productSizes[5],
        packageSize: productPackageSizes[5],
        color: productColors[0],
        price: 455,
        availableItemCount: 10,
        images: [
          await fileRepository.save({
            public_id: 'id-1',
            url: 'https://res.cloudinary.com/djwybydjd/image/upload/v1675479850/vinok-rizdvyanii-litii-premium-55-sm-thumb_iazool.jpg',
          }),
        ],
      },
      {
        name: 'Вінок різдвяний литий Premium 55 см голубий',
        description: `Які ж новорічні свята без різдвяного віночка?
        Такий віночок можна почепити на двері вдома, або прикрасити ним кімнату, або створити новорічний настрій в офісі.
        Святковий вінок може стати чудовим новорічним подарунком.
      `,
        size: productSizes[5],
        packageSize: productPackageSizes[5],
        color: productColors[1],
        price: 455,
        availableItemCount: 10,
        images: [
          await fileRepository.save({
            public_id: 'id-2',
            url: 'https://res.cloudinary.com/djwybydjd/image/upload/v1675479851/vinochok-novorichnyj-lytyj-lux-52-sm-thumb_zbcur0.jpg',
          }),
        ],
      },
      {
        name: 'Гілка новорічнаTraditional 60 см зелена',
        description:
          'Традиційна гілка ялинки. Композиція з хвойних гілок може замінити новорічне дерево.',
        size: productSizes[4],
        packageSize: productPackageSizes[4],
        color: productColors[0],
        price: 197,
        availableItemCount: 10,
        images: [
          await fileRepository.save({
            public_id: 'id-3',
            url: 'https://res.cloudinary.com/djwybydjd/image/upload/v1675479850/gilka-novorichnatraditional-60-sm-zelena-thumb_itfwrc.jpg',
          }),
        ],
      },
      {
        name: 'Гілка новорічнаTraditional 60 см блакитна',
        description:
          'Традиційна гілка ялинки. Композиція з хвойних гілок може замінити новорічне дерево.',
        size: productSizes[4],
        packageSize: productPackageSizes[4],
        color: productColors[1],
        price: 197,
        availableItemCount: 10,
        images: [
          await fileRepository.save({
            public_id: 'id-4',
            url: 'https://res.cloudinary.com/djwybydjd/image/upload/v1675479851/gilka-novorichnatraditional-60-sm-blakitna-thumb_zyycdl.jpg',
          }),
        ],
      },
      {
        name: 'Ялинка лита Premium Mix 220 см зелена',
        description: `Одна з найпопулярніших новорічних ялинок усіх часів. Ялинка зібрана гілочок типу Premium.
        Дерево створене таким чином, щоб імітувати точний вигляд справжньої ялинки — від кольору до виражених 
        напівплоских голок. Створіть надзвичайні святкові моменти з литою ялинкою Premium Mix. 
        Комбінована з плівкою для заповнення внутрішнього простору. Міцна складна металева підставка.`,
        size: productSizes[0],
        packageSize: productPackageSizes[0],
        color: productColors[0],
        price: 2843,
        availableItemCount: 10,
        images: [
          await fileRepository.save({
            public_id: 'id-5',
            url: 'https://res.cloudinary.com/djwybydjd/image/upload/v1675479851/yalynka-lyta-classic-2-2-thumb_w94vel.jpg',
          }),
        ],
      },
      {
        name: 'Ялинка лита Premium Mix 180 см біла',
        description: `Одна з найпопулярніших новорічних ялинок усіх часів. Ялинка зібрана гілочок типу Premium.
        Дерево створене таким чином, щоб імітувати точний вигляд справжньої ялинки — від кольору до виражених 
        напівплоских голок. Створіть надзвичайні святкові моменти з литою ялинкою Premium Mix. 
        Комбінована з плівкою для заповнення внутрішнього простору. Міцна складна металева підставка.`,
        size: productSizes[1],
        packageSize: productPackageSizes[1],
        color: productColors[2],
        price: 2843,
        availableItemCount: 10,
        images: [
          await fileRepository.save({
            public_id: 'id-6',
            url: 'https://res.cloudinary.com/djwybydjd/image/upload/v1675479851/%D0%A5%D0%B2%D0%BE%D1%8F0150_2_2_Lyta-thumb_cxg28v.jpg',
          }),
        ],
      },
      {
        name: 'Ялинка лита Premium 70 см в мішковині блакитна',
        description: `Елегантна подарункова ялинка, настільний варіант новорічного декору.
        Горщик оздоблений мішковиною, з обтяжувачем, який захистить від перекидання.
        Така ялинка підійде як в офіс так і в дім.`,
        size: productSizes[2],
        packageSize: productPackageSizes[2],
        color: productColors[1],
        price: 614,
        availableItemCount: 10,
        images: [
          await fileRepository.save({
            public_id: 'id-7',
            url: 'https://res.cloudinary.com/djwybydjd/image/upload/v1675479850/yalinka-lita-premium-70-sm-v-mishkovini-thumb_iikl8p.jpg',
          }),
        ],
      },
      {
        name: 'Ялинка лита Premium 90 см в мішковині блакитна',
        description: `Елегантна подарункова ялинка, настільний варіант новорічного декору.
        Горщик оздоблений мішковиною, з обтяжувачем, який захистить від перекидання.
        Така ялинка підійде як в офіс так і в дім.`,
        size: productSizes[3],
        packageSize: productPackageSizes[3],
        color: productColors[1],
        price: 864,
        availableItemCount: 10,
        images: [
          await fileRepository.save({
            public_id: 'id-8',
            url: 'https://res.cloudinary.com/djwybydjd/image/upload/v1675482162/green-cast-christmas-tree-90-cm-in-burlap-thumb_vgxo9u.jpg',
          }),
        ],
      },
    ]);
    const productVariants = await productVariantRepository.save([
      {
        sku: '102/55/G',
        stock: 100,
        properties: productProperties[0],
        baseProduct: productBase[0],
      },
      {
        sku: '102/55/B',
        stock: 90,
        properties: productProperties[1],
        baseProduct: productBase[0],
      },
      {
        sku: '214/60/G',
        stock: 80,
        properties: productProperties[2],
        baseProduct: productBase[1],
      },
      {
        sku: '214/60/B',
        stock: 70,
        properties: productProperties[3],
        baseProduct: productBase[1],
      },
      {
        sku: '200/220/G',
        stock: 50,
        properties: productProperties[4],
        baseProduct: productBase[2],
      },
      {
        sku: '200/180/W',
        stock: 20,
        properties: productProperties[5],
        baseProduct: productBase[2],
      },
      {
        sku: '100/70/B',
        stock: 10,
        properties: productProperties[6],
        baseProduct: productBase[3],
      },
      {
        sku: '100/90/G',
        stock: 0,
        properties: productProperties[7],
        baseProduct: productBase[3],
      },
    ]);
    await productPropertiesRepository.save([
      { ...productProperties[0], product: productVariants[0] },
      { ...productProperties[1], product: productVariants[1] },
      { ...productProperties[2], product: productVariants[2] },
      { ...productProperties[3], product: productVariants[3] },
      { ...productProperties[4], product: productVariants[4] },
      { ...productProperties[5], product: productVariants[5] },
      { ...productProperties[6], product: productVariants[6] },
      { ...productProperties[7], product: productVariants[7] },
    ]);
  }
}
