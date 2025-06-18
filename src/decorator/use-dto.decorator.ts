// src/common/decorators/use-dto.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const DTOTYPE = 'dtoType'
export const UseDto = (dtoType: any) => SetMetadata(DTOTYPE, dtoType);