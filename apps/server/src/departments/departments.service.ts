import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { departmentItems } from 'src/shared/data/department';
import { Department } from './entities/department.entity';
import { plainToInstance } from 'class-transformer';
import { GetDepartmentsResponseDTO } from '@repo/shared';
import { DepartmentVenue } from './entities/department-venue.entity';
import { CourseVenue } from 'src/course/entities/course-venue.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    // repository injection
    @InjectRepository(Department)
    private readonly departmentsRepo: Repository<Department>,
    @InjectRepository(DepartmentVenue)
    private readonly departmentVenueRepo: Repository<DepartmentVenue>,
    @InjectRepository(CourseVenue)
    private readonly courseVenueRepo: Repository<CourseVenue>,
  ) {}

  /**
   * Creates the default departments for admin.
   **/
  initialize = async () => {
    // check if all of department exists
    const dbDepartmentItems = await this.getDepartment();
    // console.log('dbDepartmentItems:', dbDepartmentItems);
    const missingItems = [];

    // check for any menu items that have not been created or were deleted
    for (const departmentItem of departmentItems) {
      const found = dbDepartmentItems.find(
        (dbDepartment) => dbDepartment.id === departmentItem.id,
      );

      if (!found) {
        // console.log('found missing menu item:', departmentItem);
        missingItems.push(departmentItem);
      }
    }

    if (!missingItems.length) return;

    console.log('missingItems:', missingItems);

    // create any menu items that are not yet created
    missingItems.forEach(async (item: Department) => {
      const { departmentVenues, ...otherItems } = item;
      const savedDepartmentVenues = departmentVenues.map((venue) =>
        this.departmentVenueRepo.create({
          ...new DepartmentVenue(),
          ...venue,
          department: { id: item.id },
          courseVenue: this.courseVenueRepo.create({
            ...new CourseVenue(),
            ...venue.courseVenue,
            department: { id: item.id },
          }),
        }),
      );

      const savedDepartment = this.departmentsRepo.create({
        ...new Department(),
        ...otherItems,
      });

      const createdDepartmentItem = await this.departmentsRepo.save(
        this.departmentsRepo.create(savedDepartment),
      );

      await this.departmentVenueRepo.save(savedDepartmentVenues);

      // if there are children items, create them with parent reference
      // NOTE: Update to recursive function if there is more than one
      // tier of menu items, keeping it as a single nested loop now to
      // enhance readability.

      // console.log('children items:', item.children);

      if (savedDepartment.children) {
        // console.log('Creating children for item:', item.name);
        for (const childrenItem of savedDepartment.children) {
          const createdChildMenuItem = this.departmentsRepo.create({
            ...childrenItem,
            parent: createdDepartmentItem,
          });

          await this.departmentsRepo.save(createdChildMenuItem);
        }
      } else {
      }
    });
  };

  // get list of all
  async getDepartment(): Promise<GetDepartmentsResponseDTO[]> {
    try {
      const departments = await this.departmentsRepo.find();
      return plainToInstance(GetDepartmentsResponseDTO, departments, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  // get list of all
  async getVenues(): Promise<any> {
    try {
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  // create venue
  async createVenue(body): Promise<any> {
    try {
      const dept = this.departmentsRepo.create({
        ...new Department(),
        id: '5f943e16-9d95-440b-987a-7de7cd587659',
      });
      const savedVenue = this.departmentVenueRepo.create({
        ...new DepartmentVenue(),
        name: body.name,
        openStartTime: '0900',
        openEndTime: '1800',
        status: 1,
        department: dept,
      });
      this.departmentVenueRepo.save(savedVenue);
      // return;
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }

  /********************************************
   *              -- CLIENT --                *
   ********************************************/

  // get list of all
  async getDepartmentsForClient(): Promise<GetDepartmentsResponseDTO[]> {
    try {
      const departments = await this.departmentsRepo.find();
      return plainToInstance(GetDepartmentsResponseDTO, departments, {
        excludeExtraneousValues: true,
      });
    } catch (err) {
      throw new HttpException(err.message, 500);
    }
  }
}
