import { Request } from 'express';
import { AuthPayload } from 'src/users/Types';

export interface ReqContext {
  req: Request;
  $user: AuthPayload;
}
