import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { STATUS_MSG } from '../constant/status-message.constants';
import { Config } from '../constant/constants';

@Injectable()
export class UserService {
  constructor() {}

  async createAdmin(data: any): Promise<any> {
    try {
      // Hash the password before creating a new admin user.

      const hashedPassword = data.password
        ? await this.hashPassword(data.password)
        : null;

      // Create a new admin user with the provided data and the hashed password.
      const user = {
        ...data,
        password: hashedPassword,
      };

      return user;
    } catch (err) {
      throw new BadRequestException('FAILED_CREATING_ADMIN');
    }
  }

  async hashPassword(password: string): Promise<string> {
    // Generate a salt with a predefined number of rounds
    const saltOrRounds = await bcrypt.genSalt(Config.SALT);

    // Hash the provided password using the generated salt
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    // Return the hashed password
    return hashedPassword;
  }

  async findAll(req: any, searchQuery: any): Promise<any> {
    const findAll = searchQuery;
    return findAll;
  }

  async findByUserID(id: string): Promise<any> {
    const user = id;
    if (!user) {
      throw new NotFoundException(STATUS_MSG.ERROR.RECORD_NOT_FOUND);
    }
    return user;
  }

  async findByEmail(email: string): Promise<any> {
    return email;
  }

  async updateUser(id: any, data: any): Promise<any> {
    return { id, data };
  }
}
