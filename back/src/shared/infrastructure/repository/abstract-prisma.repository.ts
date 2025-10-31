import { SearchParams as DefaultSearchParams } from '@/shared/domain/repositories/searchable-repository-contracts';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';

export abstract class AbstractPrismaRepository {
  constructor(protected prismaService: PrismaService) {}

  protected getTake(searchInput: DefaultSearchParams<any>) {
    return searchInput.perPage && searchInput.perPage > 0
      ? searchInput.perPage
      : 10;
  }

  protected getSkip(searchInput: DefaultSearchParams<any>) {
    return (
      (searchInput.page && searchInput.page > 0 ? searchInput.page - 1 : 0) *
      (searchInput.perPage && searchInput.perPage > 0
        ? searchInput.perPage
        : 10)
    );
  }
}
