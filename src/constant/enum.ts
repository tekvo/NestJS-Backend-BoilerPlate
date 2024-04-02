/**
 *
 * @description Creating enum for provider
 * @enum Provider
 *
 */

export enum Provider {
  Google = 'google',
  Local = 'local',
  Jwt = 'jwt',
}

export enum InviteStatus {
  Accepted = 'Accepted',
  Pending = 'Pending',
  Rejected = 'Rejected',
}

export enum Environment {
  Development = 'development',
  Local = 'local',
  Production = 'production',
}
export enum ActiveType {
  active = 'active',
  disabled = 'disabled',
  softDelete = 'softDelete',
  Canceled = 'canceled',
  PastDue = 'past_due',
}
