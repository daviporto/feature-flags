import { AppUserEntity } from '@/app-user/domain/entities/app-user.entity';
import { AppUserDataBuilder } from '@/app-user/domain/testing/helper/app-user-data-builder';
import { AppUserOutputMapper } from '@/app-user/application/dtos/app-user-output';

describe('AppUser output unit tests', () => {
  it('should convert a app user in output', () => {
    const user = new AppUserEntity(AppUserDataBuilder({}));
    const spyJson = jest.spyOn(user, 'toJSON');
    const sut = AppUserOutputMapper.toOutput(user);

    expect(spyJson).toHaveBeenCalled();
    expect(sut).toStrictEqual(user.toJSON());
  });
});
