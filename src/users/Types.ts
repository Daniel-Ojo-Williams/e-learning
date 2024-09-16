export enum Roles {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student',
}

export type AuthPayload = {
  sub: string;
  email: string;
  role: Roles;
};
