import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlertResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Alert created successfully',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  responseMessage: string;
}
