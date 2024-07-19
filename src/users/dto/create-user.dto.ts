import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Username of the user', example: 'john_doe' })
  @IsString()
  @Length(3, 20)
  username: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'securePassword',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string;
}
