export interface PromProductXlsRawRu {
  Код_товара: string;
  Название_позиции: string;
  Название_позиции_укр: string;
  Поисковые_запросы: string;
  Поисковые_запросы_укр: string;
  Описание: string;
  Описание_укр: string;
  Тип_товара: string;
  Цена: string;
  Валюта: string;
  Единица_измерения: string;
  Оптовая_цена: string;
  Минимальный_заказ_опт: string;
  Ссылка_изображения: string; // 'link, link, link'
  Наличие: number;
  Количество: number;
  Номер_группы: number;
  Название_группы: string;
  Адрес_подраздела: string;
  Способ_упаковки_укр: string;
  Уникальный_идентификатор: number;
  Идентификатор_товара: string;
  Идентификатор_подраздела: number;
  Производитель: string;
  Страна_производитель: string;
  Скидка: string;
  Личные_заметки: string;
  Продукт_на_сайте: string;
  Срок_действия_скидки_от: string;
  Срок_действия_скидки_до: string;
  Цена_от: string;
  Ярлык: string;
  HTML_заголовок: string;
  HTML_заголовок_укр: string;
  HTML_описание: string;
  HTML_описание_укр: string;
  HTML_ключевые_слова: string;
  HTML_ключевые_слова_укр: string;
  'Код_маркировки_(GTIN)': string;
  'Номер_устройства_(MPN)': string;
  'Вес,кг': string; // '0.350'
  'Ширина,см': string; // '40.0'
  'Высота,см': string; // '11.0'
  'Длина,см': string; // '40.0'
  Где_находится_товар: string;
  Название_Характеристики: string;
  Измерение_Характеристики: string;
  Значение_Характеристики: string;
  Название_Характеристики_1: string;
  Измерение_Характеристики_1: string;
  Значение_Характеристики_1: string;
}

export type PromProductXlsRaw = PromProductXlsRawRu;
export type PromProductsXlsRaw = PromProductXlsRawRu[];
