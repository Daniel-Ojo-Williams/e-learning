import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Courses } from './entities/courses.entity';
import { DataSource, ILike, Repository } from 'typeorm';
import { CourseDetails } from './dto/add-course.dto';
import { UsersService } from '../users/users.service';
import { UpdateCourseInput } from './dto/update-course.dto';
import { SearchCourses } from './dto/get-courses.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Courses) private readonly courses: Repository<Courses>,
    private readonly dataSource: DataSource,
    private readonly users: UsersService,
  ) {}

  async addCourse(courseDetails: CourseDetails, instructorId: string) {
    const instructor = await this.users.findOneById(instructorId);

    const course = this.courses.create(courseDetails);
    course.instructor = instructor;
    instructor.coursesInstructing = instructor.coursesInstructing || [];
    instructor.coursesInstructing.push(course);

    await this.dataSource.transaction(async (manager) => {
      await manager.save(course);
      await manager.save(instructor);
    });

    return course;
  }

  async updateCourse(
    courseId: string,
    courseDetails: UpdateCourseInput,
    instructorId: string,
  ) {
    const course = await this.findCourseById(courseId);

    if (course.instructor.id !== instructorId)
      throw new UnprocessableEntityException({
        message: 'You can only update a course you created',
      });

    const updatedCourse: Courses = Object.assign(course, courseDetails);

    return this.courses.save(updatedCourse);
  }

  async findCourseById(courseId: string) {
    const course = await this.courses.findOne({
      where: { id: courseId },
      relations: {
        instructor: true,
      },
    });

    if (!course) throw new NotFoundException({ message: 'Course not found' });

    return course;
  }

  async getAllCourses(searchCourse?: SearchCourses) {
    const { keyword } = searchCourse;
    let courses: Courses[];
    if (keyword) {
      courses = await this.courses.find({
        where: { title: ILike(`%${keyword}%`) },
      });
    } else {
      courses = await this.courses.find();
    }
    return courses;
  }
}
