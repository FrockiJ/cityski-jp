import { Test, TestingModule } from '@nestjs/testing';
import { CoursePlanSessionService } from './course-plan-session.service';

describe('CoursePlanSessionService', () => {
  let service: CoursePlanSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursePlanSessionService],
    }).compile();

    service = module.get<CoursePlanSessionService>(CoursePlanSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
