import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class JoinRequestDto {
  @IsEmail()
  @ApiProperty({
    example: 'jinpark@email.com',
    description: '이메일',
  })
  public email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'jinpark',
    description: 'nickname',
  })
  public nickname: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'password',
    description: '비밀번호 password',
  })
  public password: string;
}
