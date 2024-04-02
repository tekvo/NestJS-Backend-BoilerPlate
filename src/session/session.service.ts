import { Injectable } from '@nestjs/common';

/**
 * Service for managing user sessions and tokens.
 *
 * @class
 * @module SessionService
 * @implements {Logger}
 * @singleton
 */
@Injectable()
export class SessionService {
  constructor() {}

  /**
   * Adds a new session token for a user.
   *
   * @param {string} token - The session token to be added.
   * @param {string} userObjectID - The unique object identifier associated with the user.
   * @returns {Promise<Session>} - The created Session entity.
   */
  async addToken(token: string, userObjectID: string): Promise<any> {
    const add = { token: token, userObjectID: userObjectID };
    return { add, message: 'token add in session' };
  }

  /**
   * Finds a session token by its token value.
   *
   * @param {string} token - The session token to be found.
   * @returns {Promise<Session | undefined>} - The found Session entity or undefined if not found.
   */
  async findToken(token: string): Promise<any> {
    const tokenDetails = token;
    return { tokenDetails: tokenDetails };
  }

  /**
   * Deletes a session token by its token value.
   *
   * @param {string} token - The session token to be deleted.
   * @returns {Promise<string>} - A success message indicating the token deletion.
   */
  async deleteByToken(token: string): Promise<string> {
    const deleteTOken = token;
    return deleteTOken;
  }

  /**
   * Deletes all session tokens associated with a user.
   *
   * @param {string} userObjectID - The unique object identifier associated with the user.
   * @returns {Promise<IStatusMassage>} - A success message indicating the deletion of user's session tokens.
   */
  async deleteSessionByUserObjectID(userObjectID: string): Promise<string> {
    const deleteByUserID = userObjectID;
    return deleteByUserID;
  }
}
