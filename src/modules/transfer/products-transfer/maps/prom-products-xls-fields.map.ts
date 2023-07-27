import { PromProductXlsRaw } from '../interfaces/prom-products-xls-raw.interface';
import { PromProductXls } from '../interfaces/prom-products-xls.interface';

const CUSTOM_PROPERTY_KEYS = ['Название_Характеристики'];
const CUSTOM_PROPERTY_VALUE_KEYS = ['Значение_Характеристики'];

export const rawPromProductsXlsFieldsMap: Record<
  keyof PromProductXls,
  string[]
> = {
  baseExternalId: ['Номер_группы'],
  baseName: ['Название_группы'],
  variantExternalId: ['Уникальный_идентификатор'],
  variantName: ['Название_позиции_укр'],
  sku: ['Код_товара'],
  stock: ['Количество'],
  description: ['Описание_укр'],
  price: ['Цена'],
  height: CUSTOM_PROPERTY_KEYS,
  width: CUSTOM_PROPERTY_KEYS,
  diameter: CUSTOM_PROPERTY_KEYS,
  packageHeight: ['Высота,см'],
  packageWidth: ['Ширина,см'],
  packageDepth: ['Длина,см'],
  weight: ['Вес,кг'],
  images: ['Ссылка_изображения'],
  color: ['Цвет'],
  size: ['Размер'],
};

const rawPromProductsXlsCustomFieldsMapKeys = {
  height: ['Высота'],
  width: ['Диаметр нижнего яруса'],
  diameter: ['Диаметр'],
};

function getRawValueByKey<T>(
  rawProduct: PromProductXlsRaw,
  key: keyof PromProductXls,
): T | undefined {
  const arryRawKeys = rawPromProductsXlsFieldsMap[key];
  for (const rawKey of arryRawKeys) {
    if (rawProduct[rawKey as keyof PromProductXlsRaw]) {
      return rawProduct[rawKey as keyof PromProductXlsRaw] as T;
    }
  }
  return undefined;
}

function getValueOfCustomPropertyByKey<T>(
  rawProduct: PromProductXlsRaw,
  key: keyof typeof rawPromProductsXlsCustomFieldsMapKeys,
): T | undefined {
  const rawProductKeys = Object.keys(rawProduct) as Array<
    keyof PromProductXlsRaw
  >;

  const foundKey = rawProductKeys.find((rawProductKey) => {
    const isCustomKey = !!CUSTOM_PROPERTY_KEYS.find((key) =>
      (rawProductKey as string).includes(key),
    );
    if (isCustomKey) {
      const value = rawProduct[rawProductKey];
      return rawPromProductsXlsCustomFieldsMapKeys[key]?.find(
        (rawCustomFieldKey) =>
          (value as unknown as string).includes(rawCustomFieldKey),
      );
    }
    return undefined;
  });

  if (!foundKey) {
    return undefined;
  }

  const keyStringArr = (foundKey as string).split('_');
  const index = keyStringArr[keyStringArr.length - 1];
  const customValueKeys = CUSTOM_PROPERTY_VALUE_KEYS.map(
    (customValueKey) => `${customValueKey}_${index}`,
  );

  if (customValueKeys) {
    const valueKey = customValueKeys.find((customValueKey) =>
      rawProductKeys.includes(customValueKey as keyof PromProductXlsRaw),
    );
    if (valueKey) {
      const value = rawProduct[valueKey as keyof PromProductXlsRaw] as T;
      return value;
    }
  }

  return undefined;
}

function convertSizeToCm(size: string | undefined): string | undefined {
  if (!size) {
    return;
  }
  return parseInt((Number(size) * 100).toString()).toString();
}

export const converRawPromProductXslToPromProductXsl = (
  promProductXlsRaw: PromProductXlsRaw,
): PromProductXls => {
  return {
    baseExternalId:
      getRawValueByKey<number>(
        promProductXlsRaw,
        'baseExternalId',
      )?.toString() || '',
    baseName: getRawValueByKey(promProductXlsRaw, 'baseName') || '',
    variantExternalId:
      getRawValueByKey<number>(
        promProductXlsRaw,
        'variantExternalId',
      )?.toString() || '',
    variantName: getRawValueByKey(promProductXlsRaw, 'variantName') || '',
    sku: getRawValueByKey(promProductXlsRaw, 'sku') || '',
    stock: getRawValueByKey(promProductXlsRaw, 'stock') || 0,
    description: getRawValueByKey(promProductXlsRaw, 'description') || '',
    price: getRawValueByKey(promProductXlsRaw, 'price') || '',
    height:
      convertSizeToCm(
        getValueOfCustomPropertyByKey(promProductXlsRaw, 'height'),
      ) || '',
    width:
      convertSizeToCm(
        getValueOfCustomPropertyByKey(promProductXlsRaw, 'width'),
      ) || '',
    diameter:
      convertSizeToCm(
        getValueOfCustomPropertyByKey(promProductXlsRaw, 'diameter'),
      ) || '',
    packageHeight: getRawValueByKey(promProductXlsRaw, 'packageHeight') || '',
    packageWidth: getRawValueByKey(promProductXlsRaw, 'packageWidth') || '',
    packageDepth: getRawValueByKey(promProductXlsRaw, 'packageDepth') || '',
    weight: getRawValueByKey(promProductXlsRaw, 'weight') || '',
    images:
      getRawValueByKey<string>(promProductXlsRaw, 'images')
        ?.split(',')
        .map((image) => image.trim()) || [],
    color: getRawValueByKey(promProductXlsRaw, 'color') || '',
    size: getRawValueByKey(promProductXlsRaw, 'size') || '',
  };
};
