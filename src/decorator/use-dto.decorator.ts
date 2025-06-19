// src/common/decorators/use-dto.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const DTO_TYPE = 'dto-type'
export const setUseDto = (dto_type: any) => SetMetadata(DTO_TYPE, dto_type);