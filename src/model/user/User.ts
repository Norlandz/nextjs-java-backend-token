export class User {
  public readonly id: string;
  public readonly username: string;
  public readonly email: string;
  public readonly phone: string;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly birthday: Date | null;
  //
  public readonly creationTime: Date | null;
  public readonly lastLoginTime: Date | null;

  constructor(
    id: string,
    username: string,
    email: string,
    phone: string,
    firstName: string,
    lastName: string,
    birthday: Date | null,
    creationTime: Date | null,
    lastLoginTime: Date | null,
    rank: number | null
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.phone = phone;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthday = birthday;
    this.creationTime = creationTime;
    this.lastLoginTime = lastLoginTime;
    this.rank = rank;
  }
  public readonly rank: number | null;
}
