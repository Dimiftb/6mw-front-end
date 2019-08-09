export class User {
  user_id: number;
  forename: string;
  surname: string;
  email: string;
  dob: string;
  height: number;
  weight: number;
  height_unit: string;
  weight_unit: string;
  gender: string;

  constructor(user_id: number, forename: string, surname: string, email: string, dob: string, height: number, weight:number,
              height_unit:string, weight_unit:string, gender:string) {
    this.user_id = user_id;
    this.forename = forename;
    this.surname = surname;
    this.email = email;
    this.dob = dob;
    this.height = height;
    this.weight = weight;
    this.height_unit = height_unit;
    this.weight_unit = weight_unit;
    this.gender = gender;
  }
}
