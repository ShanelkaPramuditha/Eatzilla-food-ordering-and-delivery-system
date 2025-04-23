import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { User, UserDocument } from './models/user.schema';
import { SignUpDto } from './dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).exec();
  }

  async create(signUpDto: SignUpDto): Promise<UserDocument> {
    // Check if user with this email already exists
    const existingUser = await this.findOne(signUpDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = this.hashPassword(signUpDto.password);

    // Create the new user
    const newUser = new this.userModel({
      ...signUpDto,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.findOne(email);
    if (!user) return null;

    const isPasswordValid = this.comparePasswords(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  private hashPassword(password: string): string {
    // Generate a random salt
    const salt = crypto.randomBytes(16).toString('hex');

    // Hash password using sha256 with the generated salt
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');

    // Store both salt and hash separated by a colon
    return `${salt}:${hash}`;
  }

  private comparePasswords(password: string, storedPassword: string): boolean {
    // Split stored password into salt and hash
    const [salt, storedHash] = storedPassword.split(':');

    // Hash the input password with the same salt
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');

    // Compare the generated hash with the stored hash
    return storedHash === hash;
  }
}
