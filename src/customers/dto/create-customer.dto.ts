import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Name of the customer', example: 'John Doe' })
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiProperty({ description: 'Last name of the customer', example: 'Doe' })
  @IsString()
  @Length(3, 100)
  lastname: string;

  @ApiProperty({
    description: 'Birthday of the customer',
    example: '1990-01-01',
  })
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  birthday: Date;
}
