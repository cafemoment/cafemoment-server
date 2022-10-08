export interface IUser {
  user: {
    id: string;
    email: string;
  };
}

export interface IContext {
  req?: Request & IUser;
  res?: Response;
}

export interface IOAuthUser {
  user: {
    email: string;
    hashedPassword: string;
    name: string;
    phonenumber: string;
  };
}
