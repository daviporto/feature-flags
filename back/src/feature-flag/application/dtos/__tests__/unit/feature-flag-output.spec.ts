import { FeatureFlagEntity } from '@/feature-flag/domain/entities/feature-flag.entity';
import { FeatureFlagOutputMapper } from '@/feature-flag/application/dtos/feature-flag-output';
import { FeatureFlagDataBuilder } from '@/feature-flag/domain/testing/helper/feature-flag-data-builder';

describe('FeatureFlag output unit tests', () => {
  it('should convert a feature flag in output', () => {
    const feature = new FeatureFlagEntity(FeatureFlagDataBuilder({}));
    const spyJson = jest.spyOn(feature, 'toJSON');
    const sut = FeatureFlagOutputMapper.toOutput(feature);

    expect(spyJson).toHaveBeenCalled();
    expect(sut).toStrictEqual(feature.toJSON());
  });
});
