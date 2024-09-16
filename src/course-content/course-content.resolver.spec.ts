import { Test, TestingModule } from '@nestjs/testing';
import { CourseContentResolver } from './course-content.resolver';
import { CourseContentService } from './course-content.service';

describe('CourseContentResolver', () => {
  let resolver: CourseContentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseContentResolver, CourseContentService],
    }).compile();

    resolver = module.get<CourseContentResolver>(CourseContentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
