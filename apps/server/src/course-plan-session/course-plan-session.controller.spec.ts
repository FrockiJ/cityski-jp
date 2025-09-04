import { Test, TestingModule } from '@nestjs/testing';
import { CoursePlanSessionController } from './course-plan-session.controller';

describe('CoursePlanSessionController', () => {
  let controller: CoursePlanSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursePlanSessionController],
    }).compile();

    controller = module.get<CoursePlanSessionController>(CoursePlanSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
