import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceDto {
  @ApiProperty({
    example: 'Sleact',
    description: 'name for workspace',
  })
  public workspace: string;

  @ApiProperty({
    example: 'sleact',
    description: 'url address',
  })
  public url: string;
}
