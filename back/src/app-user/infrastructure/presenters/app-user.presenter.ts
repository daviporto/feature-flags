import { AppUserOutput } from '@/app-user/application/dtos/app-user-output';
import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ListAppUsersUsecase } from '@/app-user/application/usecases/list-app-user.usecase';

export class AppUserPresenter {
  @ApiProperty({ description: 'The id of the app user' })
  id: string;

  @ApiProperty({ description: 'The name of the app user' })
  name: string;

  @ApiProperty({ description: 'The email of the app user' })
  email: string;

  @ApiProperty({
    description: 'The status of the app user, if is active or not',
  })
  externalId: string;

  @ApiProperty({ description: 'The date when the app user was created' })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  @ApiProperty({
    nullable: true,
    description: 'The data of last app user update',
  })
  @Transform(({ value }: { value: Date }) => value.toISOString())
  updatedAt: Date;
  constructor(output: AppUserOutput) {
    this.id = output.id;
    this.name = output.name;
    this.email = output.email;
    this.externalId = output.externalId;
    this.createdAt = output.createdAt;
    this.updatedAt = output.updatedAt;
  }
}

@ApiExtraModels(AppUserPresenter)
export class AppUserCollectionPresenter extends CollectionPresenter {
  @ApiProperty({
    type: AppUserPresenter,
    isArray: true,
    description: 'List of AppUser',
  })
  data: AppUserPresenter[];

  constructor(output: ListAppUsersUsecase.Output) {
    const { items, ...pagination } = output;
    super(pagination);
    this.data = items.map((item: AppUserOutput) => new AppUserPresenter(item));
  }
}
