import { Test, TestingModule } from '@nestjs/testing';
import { ListsResolver } from './lists.resolver';
import { ListsService } from './lists.service';

describe('ListsResolver', () => {
  let resolver: ListsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListsResolver, ListsService],
    }).compile();

    resolver = module.get<ListsResolver>(ListsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
