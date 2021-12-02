import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({
    example: 'dev team',
    description: 'channel name',
  })
  public name: string;
}
