import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateIf, ValidateNested } from 'class-validator';


class ProductCategoryDto {
    @IsNotEmpty()
    name: string;
}

class ProductBaseDto {
    @IsNotEmpty()
    name: string;
}

class ProductVariantDto {
    @IsNotEmpty()
    sku: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    size: string;

    @IsNotEmpty()
    color: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    availableItemCount: number;
}

export class CreateProductDto {

    @ValidateIf(o => !o.productCategory)
    @IsNotEmpty()
    productCategoryId: number;

    @ValidateIf(o => !o.productCategoryId)
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => ProductCategoryDto)
    productCategory: ProductCategoryDto;

    @ValidateIf(o => !o.productBase)
    @IsNotEmpty()
    productBaseId: number;

    @ValidateIf(o => !o.productBaseId)
    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => ProductBaseDto)
    productBase: ProductBaseDto;

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested({ each: true })
    @Type(() => ProductVariantDto)
    productVariant: ProductVariantDto;
}

