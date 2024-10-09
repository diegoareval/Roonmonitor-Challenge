import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UseRoles } from 'nest-access-control';
import { ExposedEndpoint } from '../../decorators/exposed-endpoint.decorator';
import { SearchProductQueryDto } from './dto/search-product-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Products')
@Controller({
  path: '',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('products')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new product',
  })
  @UseRoles({
    resource: 'product',
    action: 'create',
    possession: 'any',
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post('products/:id/images/upload')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Upload a image for a product',
  })
  @UseRoles({
    resource: 'product',
    action: 'update',
    possession: 'any',
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    type: 'multipart/form-data',
  })
  addImage(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.productsService.addImage(+id, file);
  }
  @Delete('products/:id/images/:imageId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a image for a product',
  })
  @UseRoles({
    resource: 'product',
    action: 'update',
    possession: 'any',
  })
  removeImage(@Param('id') id: string, @Param('imageId') imageId: string) {
    return this.productsService.removeImage(+id, +imageId);
  }

  @Get('public/products')
  @ExposedEndpoint()
  @ApiOperation({
    summary: 'Get all the published products',
  })
  findAllPublic(@Query() searchProductDto: SearchProductQueryDto) {
    const conditions = searchProductDto.category
      ? {
          isVisible: true,
          category: {
            contains: searchProductDto.category,
          },
        }
      : {
          isVisible: true,
        };
    return this.productsService.findAll(searchProductDto, conditions);
  }

  @Get('products')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all the products',
  })
  @UseRoles({
    resource: 'product',
    action: 'read',
    possession: 'any',
  })
  findAll(@Query() searchProductDto: SearchProductQueryDto) {
    const conditions = searchProductDto.category
      ? {
          category: {
            contains: searchProductDto.category,
          },
        }
      : undefined;
    return this.productsService.findAll(searchProductDto, conditions);
  }

  @Get('products/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find one specific product',
  })
  @UseRoles({
    resource: 'product',
    action: 'read',
    possession: 'any',
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch('products/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a single product',
  })
  @UseRoles({
    resource: 'product',
    action: 'update',
    possession: 'any',
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete('products/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a product',
  })
  @UseRoles({
    resource: 'product',
    action: 'delete',
    possession: 'any',
  })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
