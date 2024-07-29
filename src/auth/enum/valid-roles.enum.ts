import { registerEnumType } from '@nestjs/graphql';

export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  superadmin = 'superadmin',
}

registerEnumType(ValidRoles, {
  name: 'ValidRoles',
  description: 'Valid roles for users',
});
