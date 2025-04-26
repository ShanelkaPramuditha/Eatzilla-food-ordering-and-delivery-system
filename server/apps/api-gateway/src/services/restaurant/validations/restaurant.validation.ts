import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Coordinates {
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lng: number;
}

class Location {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @ValidateNested()
  @Type(() => Coordinates)
  coordinates: Coordinates;
}

export class Restaurant {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @ValidateNested()
  @Type(() => Location)
  location: Location;

  @IsOptional()
  @IsString()
  status?: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  owner: string;
}
