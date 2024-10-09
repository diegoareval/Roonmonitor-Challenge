import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
  MANAGER = 'MANAGER',
  CLIENT = 'CLIENT',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  .grant(AppRoles.MANAGER)
  .createAny('product')
  .updateAny('product')
  .deleteAny('product')
  .readAny('product');

roles
  .grant(AppRoles.CLIENT)
  .createOwn('order')
  .readOwn('order')

  .grant(AppRoles.MANAGER)
  .createOwn('order')
  .readAny('order');

roles
  .grant([AppRoles.CLIENT, AppRoles.MANAGER])
  .createOwn('cart-item')
  .readOwn('cart-item');

roles
  .grant([AppRoles.CLIENT, AppRoles.MANAGER])
  .createOwn('like')
  .readOwn('like');
