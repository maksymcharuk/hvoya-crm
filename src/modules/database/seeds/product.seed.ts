import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { ProductVariantEntity } from '../../../entities/product-variant.entity';
import { ProductCategoryEntity } from '../../../entities/product-category.entity';
import { ProductBaseEntity } from '../../../entities/product-base.entity';
import { FileEntity } from '../../../entities/file.entity';

export default class ProductSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const productCategoryRepository = dataSource.getRepository(
      ProductCategoryEntity,
    );
    const productBaseRepository = dataSource.getRepository(ProductBaseEntity);
    const productVariantRepository =
      dataSource.getRepository(ProductVariantEntity);
    const fileRepository = dataSource.getRepository(FileEntity);
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
    await productVariantRepository.save([
      {
        sku: '102/55/G',
        name: 'Вінок різдвяний литий Premium 55 см зелений',
        description: `Які ж новорічні свята без різдвяного віночка?
          Такий віночок можна почепити на двері вдома, або прикрасити ним кімнату, або створити новорічний настрій в офісі.
          Святковий вінок може стати чудовим новорічним подарунком.
        `,
        size: '55 см',
        color: '#6DA35A',
        price: 455,
        availableItemCount: 10,
        images: [
          await fileRepository.save({
            public_id: 'id-1',
            url: 'https://res.cloudinary.com/djwybydjd/image/upload/v1675479850/vinok-rizdvyanii-litii-premium-55-sm-thumb_iazool.jpg',
          }),
        ],
        baseProduct: productBase[0],
      },
      {
        sku: '102/55/B',
        name: 'Вінок різдвяний литий Premium 55 см голубий',
        description: `Які ж новорічні свята без різдвяного віночка?
          Такий віночок можна почепити на двері вдома, або прикрасити ним кімнату, або створити новорічний настрій в офісі.
          Святковий вінок може стати чудовим новорічним подарунком.
        `,
        size: '55 см',
        color: '#87e3ef',
        price: 455,
        availableItemCount: 10,
        images: [
          await fileRepository.save({
            public_id: 'id-2',
            url: 'https://res.cloudinary.com/djwybydjd/image/upload/v1675479851/vinochok-novorichnyj-lytyj-lux-52-sm-thumb_zbcur0.jpg',
          }),
        ],
        baseProduct: productBase[0],
      },
      {
        sku: '214/60/G',
        name: 'Гілка новорічнаTraditional 60 см зелена',
        description:
          'Традиційна гілка ялинки. Композиція з хвойних гілок може замінити новорічне дерево.',
        size: '60 см',
        color: '#6DA35A',
        price: 197,
        availableItemCount: 10,
        images: [
          await fileRepository.save({
            public_id: 'id-3',
            url: 'https://res.cloudinary.com/djwybydjd/image/upload/v1675479850/gilka-novorichnatraditional-60-sm-zelena-thumb_itfwrc.jpg',
          }),
        ],
        baseProduct: productBase[1],
      },
      {
        sku: '214/60/B',
        name: 'Гілка новорічнаTraditional 60 см блакитна',
        description:
          'Традиційна гілка ялинки. Композиція з хвойних гілок може замінити новорічне дерево.',
        size: '60 см',
        color: '#87e3ef',
        price: 197,
        availableItemCount: 10,
        images: [
          await fileRepository.save({
            public_id: 'id-4',
            url: 'https://res.cloudinary.com/djwybydjd/image/upload/v1675479851/gilka-novorichnatraditional-60-sm-blakitna-thumb_zyycdl.jpg',
          }),
        ],
        baseProduct: productBase[1],
      },
      {
        sku: '200/220/G',
        name: 'Ялинка лита Premium Mix 220 см зелена',
        description: `Одна з найпопулярніших новорічних ялинок усіх часів. Ялинка зібрана гілочок типу Premium.
          Дерево створене таким чином, щоб імітувати точний вигляд справжньої ялинки — від кольору до виражених 
          напівплоских голок. Створіть надзвичайні святкові моменти з литою ялинкою Premium Mix. 
          Комбінована з плівкою для заповнення внутрішнього простору. Міцна складна металева підставка.`,
        size: '220 см',
        color: '#6DA35A',
        price: 2843,
        availableItemCount: 10,
        images: [
          await fileRepository.save({
            public_id: 'id-5',
            url: 'https://res.cloudinary.com/djwybydjd/image/upload/v1675479851/yalynka-lyta-classic-2-2-thumb_w94vel.jpg',
          }),
        ],
        baseProduct: productBase[2],
      },
      {
        sku: '200/180/W',
        name: 'Ялинка лита Premium Mix 180 см біла',
        description: `Одна з найпопулярніших новорічних ялинок усіх часів. Ялинка зібрана гілочок типу Premium.
          Дерево створене таким чином, щоб імітувати точний вигляд справжньої ялинки — від кольору до виражених 
          напівплоских голок. Створіть надзвичайні святкові моменти з литою ялинкою Premium Mix. 
          Комбінована з плівкою для заповнення внутрішнього простору. Міцна складна металева підставка.`,
        size: '180 см',
        color: '#EDEEF4',
        price: 2843,
        availableItemCount: 10,
        images: [
          await fileRepository.save({
            public_id: 'id-6',
            url: 'https://res.cloudinary.com/djwybydjd/image/upload/v1675479851/%D0%A5%D0%B2%D0%BE%D1%8F0150_2_2_Lyta-thumb_cxg28v.jpg',
          }),
        ],
        baseProduct: productBase[2],
      },
      {
        sku: '100/70/B',
        name: 'Ялинка лита Premium 70 см в мішковині блакитна',
        description: `Елегантна подарункова ялинка, настільний варіант новорічного декору.
          Горщик оздоблений мішковиною, з обтяжувачем, який захистить від перекидання.
          Така ялинка підійде як в офіс так і в дім.`,
        size: '70 см',
        color: '#87e3ef',
        price: 614,
        availableItemCount: 10,
        images: [
          await fileRepository.save({
            public_id: 'id-7',
            url: 'https://res.cloudinary.com/djwybydjd/image/upload/v1675479850/yalinka-lita-premium-70-sm-v-mishkovini-thumb_iikl8p.jpg',
          }),
        ],
        baseProduct: productBase[3],
      },
      {
        sku: '100/90/G',
        name: 'Ялинка лита Premium 90 см в мішковині блакитна',
        description: `Елегантна подарункова ялинка, настільний варіант новорічного декору.
          Горщик оздоблений мішковиною, з обтяжувачем, який захистить від перекидання.
          Така ялинка підійде як в офіс так і в дім.`,
        size: '90 см',
        color: '#6DA35A',
        price: 864,
        availableItemCount: 10,
        images: [
          await fileRepository.save({
            public_id: 'id-8',
            url: 'https://res.cloudinary.com/djwybydjd/image/upload/v1675482162/blue-cast-christmas-tree-90-cm-in-burlap-thumb_vgxo9u.jpg',
          }),
        ],
        baseProduct: productBase[3],
      },
    ]);
  }
}
