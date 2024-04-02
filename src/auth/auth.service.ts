import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import { STATUS_MSG } from '../constant/status-message.constants';
import { UserService } from '../user/user.service';
import Handlebars from 'handlebars';
import * as crypto from 'crypto';
import { ActiveType, Provider } from '../constant/enum';
import { SessionService } from 'src/session/session.service';
import { RESET_PASSWORD_URL, VERIFY_EMAIL_URL } from 'src/constant/url';
import { FailedLoginAttemptService } from 'src/failed-login-attempt/failed-login-attempt.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  SendMailForgotPasswordDto,
} from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly failedLoginService: FailedLoginAttemptService,
    private sessionService: SessionService,
  ) {}

  async getDeviceId(req: Request): Promise<string> {
    // Extract the user agent from the request headers
    const userAgent = req.headers['user-agent'];

    // Create an MD5 hash of the user agent string
    const hash = crypto.createHash('md5').update(userAgent).digest('hex');

    // Return the MD5 hash as a string (device ID)
    return hash;
  }

  /**
   * The function logs out a user from all devices by deleting their session counts and sessions from
   * the database.
   * @param {any} req - The `req` parameter is an object that represents the HTTP request. It contains
   * information such as headers, body, and query parameters.
   * @returns the success message "LOG_OUT" from the constant STATUS_MSG.SUCCESS.
   */
  async logoutFromAllDevices(req: any): Promise<any> {
    let decoded;

    // Check for authorization token in headers
    // Extract the JWT token from the request header
    const token = req.headers.authorization.split(' ')[1];
    try {
      // Verify the token and extract the user ID and device name
      decoded = this.jwtService.verify(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException(STATUS_MSG.ERROR.UNAUTHORIZED);
      }
    }

    // Find the user with the decoded user ID.
    const user = await this.userService.findByUserID(decoded.userID);
    // Log an error message if the user is not found.
    if (!user) {
      throw new NotFoundException(STATUS_MSG.ERROR.RECORD_NOT_FOUND);
    }

    // Delete all session counts for the user.

    // Delete the all session associated with the user from the database
    await this.sessionService.deleteSessionByUserObjectID(decoded.userID);

    // Return a success message.
    return STATUS_MSG.SUCCESS.LOG_OUT_SUCCESSFULLY;
  }

  /**
   * This function handles the login process, including verifying the user's account, retrieving user
   * details from the database, creating a session, constructing a payload object, generating an
   * authentication token, and adding the token to the session entity.
   * @param {any} req - The `req` parameter is an object that represents the request made by the user.
   * It contains information such as the user's account details, device information, and other relevant
   * data needed for the login process.
   * @returns a Promise that resolves to a token.
   */
  async login(req: any): Promise<string> {
    // Checks if the user's account has been verified and disabled.
    if (req.user.isVerified && req.user.active === ActiveType.disabled) {
      const payload = { userID: req.user.objectID, token: 'verify' };
      const token = await this.generateAuthToken(payload);
      throw new BadRequestException({
        message: STATUS_MSG.ERROR.REACTIVATE_USER.type,
        token,
      });
    }

    // Finds the user's details in the database.
    const userDetails = await this.userService.findAll('callUserLogin', [
      req.user.id,
    ]);

    // Throws an error if the user's details cannot be found.
    if (userDetails['0'].length === 0) {
      const payload = { userID: req.user.objectID, token: 'verify' };
      const token = await this.generateAuthToken(payload);
      await this.sessionService.addToken(token, req.user.objectID);
      throw new BadRequestException({
        message: STATUS_MSG.ERROR.SESSIONS_LIMIT_EXCEEDED.type,
        token,
      });
    }

    // Gets the device ID from the request.
    const deviceName = await this.getDeviceId(req);

    // Creates a session for the user in the workspace.

    // Constructs a payload object containing the user's information.
    const payload = {
      email: req.user.email,
      name: req.user.name,
      userID: req.user.objectID,
      deviceName: deviceName,
    };

    // Generates an authentication token using the payload object and returns it.
    const token = await this.generateAuthToken(payload);

    // add token in session entity
    await this.sessionService.addToken(token, req.user.objectID);

    return token;
  }

  /**
   * The above function logs out a user by verifying and extracting the JWT token from the request
   * header, finding the user associated with the token, logging the user out of their session, deleting
   * the session from the database, and returning a success message.
   * @param {any} req - The `req` parameter is the request object that contains information about the
   * incoming HTTP request. It typically includes details such as the request headers, body, and other
   * metadata. In this case, it is used to extract the JWT token from the request header.
   * @returns a Promise that resolves to an object with a "message" property. The value of the "message"
   * property is "STATUS_MSG.SUCCESS.LOG_OUT".
   */
  async logout(req: any): Promise<any> {
    let decoded;

    // Extract the JWT token from the request header
    const token = req.headers.authorization.split(' ')[1];
    try {
      // Verify the token and extract the user ID and device name
      decoded = this.jwtService.verify(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException(STATUS_MSG.ERROR.UNAUTHORIZED);
      }
    }

    // Find the user associated with the decoded user ID
    await this.userService.findByUserID(decoded.userID);

    // Delete the session associated with the token from the database
    await this.sessionService.deleteByToken(token);

    // Return a success message
    return {
      message: STATUS_MSG.SUCCESS.LOG_OUT_SUCCESSFULLY,
    };
  }

  /**
   * The function creates a new session by finding user data, logging out from all devices, and then
   * logging in again.
   * @param {any} req - The `req` parameter is an object that represents the request being made to
   * create a new session. It likely contains information such as the user ID and any other necessary
   * data for creating a session.
   * @returns a Promise that resolves to a session object.
   */
  async createNewSession(req?: any, userID?: string): Promise<string> {
    // Find user data using userID from the request
    const objectID = userID ? userID : req.user.userID;

    const userData = await this.userService.findByUserID(objectID);

    await this.logoutFromAllDevices(req);

    req.user = userData;
    const session = await this.login(req);
    return session;
  }

  /**
   * This function handles the authentication strategy for a user.
   * It checks if the user already exists in the database, and if not, creates a new user and workspace.
   * If the user exists, it logs them in.
   *
   * @param {any} req - The request object containing user information.
   * @returns {Promise<string | any>} A promise that resolves with a string or any object.
   */
  async handlerStrategy(req: any): Promise<any> {
    // Destructure the user information from the request object
    const { email, name, lastName, provider } = req.user;

    // Find the user by email in the database
    const getUser = await this.userService.findByEmail(email);

    // If the user is not found in the database
    if (!getUser) {
      // Generate a workspace name based on the user's name
      const workspaceName = `${name} Team`;

      // Create a new user and workspace, and return the result
      const signUpOrLogin = await this.createNewUserAndWorkspace({
        email,
        name,
        lastName,
        workspaceName,
        provider,
      });
      return signUpOrLogin;
    }

    // If the user is found in the database, assign the user object to the request object
    req.user = getUser;

    // Log the user in and return the result
    const signUpOrLogin = await this.login(req);
    return signUpOrLogin;
  }

  /**
   * A description of the entire function.
   *
   * @param {any} req - description of parameter
   * @return {Promise<string | any>} description of return value
   */
  async googleCallback(req: any): Promise<Promise<string | any>> {
    const handlerStrategy = await this.handlerStrategy(req);
    return handlerStrategy;
  }

  /**
   * The `signup` function handles the signup process for a user, including checking if the user already
   * exists, creating a new user and workspace if necessary, generating a verification token, sending a
   * verification email, and returning success messages.
   * SignupRequestDto, which contains the following properties:
   * @returns a Promise that resolves to either `STATUS_MSG.SUCCESS.RESENT_VERIFY_EMAIL` or
   * `STATUS_MSG.SUCCESS.VERIFY_EMAIL` depending on the conditions met in the code.
   */
  async signup(signupRequest: any): Promise<any> {
    // 1. Find user by email in the user database
    const adminExists = await this.userService.findByEmail(signupRequest.email);

    if (adminExists) {
      // User with the provided email exists
      if (
        adminExists.active === ActiveType.disabled ||
        !adminExists.isVerified
      ) {
        // User is disabled or not verified, resend verification email
        await this.resendVerificationEmail(signupRequest.email);
        return STATUS_MSG.SUCCESS.RESENT_VERIFY_EMAIL;
      } else {
        // User is already active and verified
        throw new BadRequestException(STATUS_MSG.ERROR.EMAIL_EXISTS);
      }
    } else {
      // User with the provided email does not exist
      await this.createNewUserAndWorkspace(signupRequest);
      return STATUS_MSG.SUCCESS.VERIFY_EMAIL;
    }
  }

  private async resendVerificationEmail(email: string): Promise<any> {
    const adminExists = await this.userService.findByEmail(email);

    const accessToken = await this.generateAuthToken({
      userID: adminExists.objectID,
      email: email,
      token: 'verify',
    });

    const templateData = fs.readFileSync(
      'src/auth/template/verify-user.hbs',
      'utf8',
    );
    const template = Handlebars.compile(templateData, { noEscape: true });

    const verifyEmailUrl = VERIFY_EMAIL_URL.replace(
      ':accessToken',
      accessToken,
    );

    const htmlBody = template({ verifyEmailUrl });

    const mail = {
      to: email,
      subject: 'Verify Your LockBoxy Account and Let the Magic Begin! 🪄✨',
      from: process.env.SENDGRID_SENDER_EMAIL_ID,
      text: 'Verify Your LockBoxy Account and Let the Magic Begin! 🪄✨',
      html: htmlBody,
    };

    await this.sendEmail(mail);
    return STATUS_MSG.SUCCESS.VERIFY_EMAIL;
  }
  async sendEmail(mail) {
    return mail;
  }

  private async createNewUserAndWorkspace(
    signupRequest: any,
  ): Promise<any | string> {
    // 2. Create a new admin user
    const adminResponse = await this.userService.createAdmin({
      ...signupRequest,
    });

    if (signupRequest.provider === Provider.Google) {
      await this.userService.updateUser(
        { id: adminResponse.data.id },
        { isVerified: true, active: ActiveType.active },
      );

      const session = await this.createNewSession(adminResponse.data.objectID);
      return session;
    }

    // 4. Generate a JWT token with the user ID and email
    const payload = {
      userID: adminResponse.data.objectID,
      email: adminResponse.data.email,
      token: 'verify',
    };

    const accessToken = await this.generateAuthToken(payload);

    // 5. Generate email template for verify mail
    const templateData = fs.readFileSync(
      'src/auth/template/verify-user.hbs',
      'utf8',
    );
    const template = Handlebars.compile(templateData, { noEscape: true });

    const verifyEmailUrl = VERIFY_EMAIL_URL.replace(
      ':accessToken',
      accessToken,
    );

    const htmlBody = template({ verifyEmailUrl });

    // 6. Generate template for send mail
    const mail = {
      to: signupRequest.email,
      subject: 'Verify Your LockBoxy Account and Let the Magic Begin! 🪄✨',
      from: process.env.SENDGRID_SENDER_EMAIL_ID,
      text: 'Verify Your LockBoxy Account and Let the Magic Begin! 🪄✨',
      html: htmlBody,
    };

    await this.sendEmail(mail);
    return STATUS_MSG.SUCCESS.VERIFY_EMAIL;
  }

  /**
   * The function generates an authentication token using the user information and JWT configuration.
   * @param {any} user - The `user` parameter is an object that contains the information of the user
   * for whom the authentication token is being generated. This object typically includes properties
   * such as the user's ID, username, email, and any other relevant information needed for
   * authentication.
   * @returns a Promise that resolves to an authentication token.
   */
  async generateAuthToken(user: any): Promise<string> {
    const token = this.jwtService.sign(user, {
      expiresIn: process.env.JWT_EXPIRATION,
      secret: process.env.JWT_SECRET,
    });
    return token;
  }

  /**
   * This function updates a notification flag for a failed login attempt, generates an email template,
   * attaches a reset password link, and sends the email using a mailer service.
   * @param {string} email - The email parameter is a string that represents the email address of the
   * user who attempted to login.
   * @param {string} name - The name parameter is a string that represents the username or name of the
   * user who is trying to login.
   */
  async anyOneTryToLogin(email: string, name: string): Promise<void> {
    await this.failedLoginService.update(email, { notificationSent: true });

    // 3. Generate email template for forgot password
    const templateData = fs.readFileSync(
      'src/auth/template/failed-login-attempt.hbs',
      'utf8',
    );

    // 4. Attach reset password link with token

    const template = Handlebars.compile(templateData, { noEscape: true });

    const htmlBody = template({
      username: name,
    });

    // 5. generate template for send mail
    const mail = {
      to: email,
      subject:
        'Oopsie-Doodle Alert! 🚨 Your LockBoxy Login Attempt Needs a Second Take!',
      from: process.env.SENDGRID_SENDER_EMAIL_ID,
      text: 'Oopsie-Doodle Alert! 🚨 Your LockBoxy Login Attempt Needs a Second Take!',
      html: htmlBody,
    };

    // 6. Send the email using the mailer service
    await this.sendEmail(mail);
  }

  /**
   * The `BlockAccount` function blocks a user's account, updates the user's status in the database,
   * generates an email template, and sends an email to the user.
   * @param {string} email - The email parameter is a string that represents the email address of the
   * user whose account needs to be blocked.
   * @param {string} name - The name parameter is a string that represents the name of the user whose
   * account is being blocked.
   */
  async BlockAccount(email: string, name: string): Promise<any> {
    await this.userService.updateUser({ email }, { blocked: true });

    const templateData = fs.readFileSync(
      'src/auth/template/block-account.hbs',
      'utf8',
    );

    // 4. Attach reset password link with token

    const template = Handlebars.compile(templateData, { noEscape: true });

    const htmlBody = template({
      username: name,
    });

    // 5. generate template for send mail
    const mail = {
      to: email,
      subject: 'Oopsie-Daisy! 🌼 Important: Your LockBoxy Update!',
      from: process.env.SENDGRID_SENDER_EMAIL_ID,
      text: 'Oopsie-Daisy! 🌼 Important: Your LockBoxy Update!',
      html: htmlBody,
    };

    // 6. Send the email using the mailer service
    await this.sendEmail(mail);
    return STATUS_MSG.ERROR.BLOCK_SOME_FOR_TIME;
  }

  /**
   * The function creates or updates a failed login attempt record for a given email address.
   * @param {string} email - The email parameter is a string that represents the email address of the
   * user attempting to log in.
   * @returns The function `createFailedLoginAttempt` returns either the newly created failed login
   * attempt object or the updated failed login attempt object.
   */
  async createFailedLoginAttempt(email: string): Promise<any> {
    const findFailedLoginAttempt = await this.failedLoginService.findOne(email);

    if (!findFailedLoginAttempt) {
      const createFailedLogin = await this.failedLoginService.create({
        email: email,
        attempt_count: 1,
      });
      return createFailedLogin;
    } else {
      // Update the attempt_count by incrementing it by 1
      await this.failedLoginService.update(email, {
        attempt_count: +1,
      });
      return STATUS_MSG.SUCCESS.UPDATED;
    }
  }

  /**
   * The function `validateUser` is an asynchronous function that takes an email and password as
   * parameters, and it validates the user by checking if the email is blocked, if the email is
   * verified and active, and if the password is valid.
   * @param {string} email - The email parameter is a string that represents the user's email address.
   * @param {string} password - The password parameter is a string that represents the user's password.
   * @returns a Promise that resolves to a User object if the user is valid and the password is valid.
   * If the user is not valid, it returns null.
   */
  async validateUser(email: string, password: string): Promise<null> {
    // Find user with given email
    const user = await this.userService.findByEmail(email);

    if (user.blocked) {
      throw new UnauthorizedException(STATUS_MSG.ERROR.BLOCK_ACCOUNT);
    }

    if (!user.isVerified && user.active === ActiveType.disabled) {
      throw new UnauthorizedException(STATUS_MSG.ERROR.IS_NOT_VERIFIED);
    }

    // Check if the password is valid
    const isValid = await bcrypt.compare(password, user.password);

    // If password is invalid, throw an UnauthorizedException
    if (isValid === false) {
      const findLoginAttempt: any = this.failedLoginService.findOne(email);

      // If findLoginAttempt than check attempt_count
      if (findLoginAttempt === 3 && findLoginAttempt === false) {
        await this.anyOneTryToLogin(email, user.name);
        throw new UnauthorizedException(STATUS_MSG.ERROR.BLOCK_SOME_FOR_TIME);
      } else if (findLoginAttempt && findLoginAttempt === 6) {
        await this.BlockAccount(email, user.name);

        //use save funtion to block in the internal blockAccount function so that we dont have to call the hubspot function explicitly
        Object.assign(user, { blocked: true });

        throw new UnauthorizedException(STATUS_MSG.ERROR.BLOCK_ACCOUNT);
      } else {
        await this.createFailedLoginAttempt(email);
        throw new UnauthorizedException(STATUS_MSG.ERROR.INVALID_CREDENTIALS);
      }
    }

    // If user is valid and password is valid, delete the password field from user object and return it
    if (user && isValid) {
      delete user.password;
      await this.failedLoginService.remove(email);
      return user;
    }

    // If user is not valid, return null
    return null;
  }

  /**
   * The function `resetPassword` checks if the user enters their current password correctly, hashes the
   * new password, and updates the user's password in the database.
   * @param {any} req - The `req` parameter is an object that represents the HTTP request made by the
   * client. It contains information such as the request headers, query parameters, and body of the
   * request.
   * @param {ChangePasswordDto} data - The `data` parameter is an object of type `ChangePasswordDto`. It
   * contains the following properties:
   * @returns the success message "PASSWORD_CHANGE" from the STATUS_MSG object.
   */
  async resetPassword(req: any, data: ChangePasswordDto): Promise<any> {
    // 3. Check if the user enters their current password correctly
    if (data.currentPassword) {
      if (data.currentPassword === data.password) {
        throw new BadRequestException();
      }
      const user = await this.userService.findByUserID(req.user.userID);

      if (
        user
        // (await bcrypt.compare(data.currentPassword, user.password))
      ) {
        const isValid = await bcrypt.compare(
          data.currentPassword,
          user.password,
        );
        if (isValid === false) {
          throw new BadRequestException(
            STATUS_MSG.ERROR.PASSWORD_DOSE_NOT_MATCH,
          );
        }
        // 4. Hash the new password and update the user's password in the database
        const hashedPassword = await this.userService.hashPassword(
          data.password,
        );
        // 5. Update the user's password'
        await this.userService.updateUser(
          {
            id: user.id,
          },
          { password: hashedPassword },
        );
      }
    }
    return STATUS_MSG.SUCCESS.PASSWORD_CHANGE;
  }

  /**
   * This function sends a forgot password email to a user with a reset password link.
   * @param {SendMailForgotPasswordDto} sendMailUpdatePasswordDto - The `sendMailUpdatePasswordDto`
   * parameter is an object that contains the following properties:
   * @returns the success message "STATUS_MSG.SUCCESS.SEND_FORGOT_PASSWORD_EMAIL" if the email is sent
   * successfully.
   */
  async sendForgotPasswordMail(
    sendMailUpdatePasswordDto: SendMailForgotPasswordDto,
  ): Promise<any> {
    // 1. Find the user by email
    const user = await this.userService.findByEmail(
      sendMailUpdatePasswordDto.email,
    );
    if (!user) {
      throw new BadRequestException(STATUS_MSG.ERROR.RECORD_NOT_FOUND);
    }

    // 2. Generate a JWT token with the user ID and email
    const payload = { userID: user.objectID, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION,
      secret: process.env.JWT_SECRET,
    });

    // 3. Generate email template for forgot password
    const templateData = fs.readFileSync(
      'src/auth/template/forgot-password.hbs',
      'utf8',
    );

    // 4. Attach reset password link with token

    const template = Handlebars.compile(templateData, { noEscape: true });

    const resetPasswordLink = RESET_PASSWORD_URL.replace(
      ':accessToken',
      accessToken,
    );

    const htmlBody = template({
      user: user.name,
      resetPasswordLink,
    });

    // 5. generate template for send mail
    const mail = {
      to: sendMailUpdatePasswordDto.email,
      subject: 'Oops! 🙊 Lets Get You Back into the LockBoxy Party!',
      from: process.env.SENDGRID_SENDER_EMAIL_ID,
      text: 'Oops! 🙊 Lets Get You Back into the LockBoxy Party!',
      html: htmlBody,
    };

    // 6. Send the email using the mailer service
    await this.sendEmail(mail);

    // 7. Return a success message if the email is sent successfully
    return STATUS_MSG.SUCCESS.SEND_FORGOT_PASSWORD_EMAIL;
  }

  /**
   * The function updates a user's password by verifying a JWT token, finding the user associated with
   * the token, hashing the new password, and updating the user's password in the database.
   * @param {any} req - The `req` parameter is the request object that contains information about the
   * HTTP request being made. It typically includes headers, query parameters, and the request body.
   * @param {ForgotPasswordDto} changePassword - The `changePassword` parameter is an object of type
   * `ForgotPasswordDto`. It contains the new password that the user wants to set.
   * @returns the success message "PASSWORD_CHANGE" if the password update is successful.
   */
  async updatePassword(
    req: any,
    changePassword: ForgotPasswordDto,
  ): Promise<any> {
    try {
      let decoded;

      // Extract the JWT token from the request header
      const token = req.headers.authorization.split(' ')[1];
      try {
        // Verify the token and extract the user ID and device name
        decoded = this.jwtService.verify(token);
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          throw new UnauthorizedException(STATUS_MSG.ERROR.UNAUTHORIZED);
        }
      }

      const user = await this.userService.findByUserID(
        // Finds the user associated with the decoded token
        decoded.userID,
      );

      if (!user) {
        // Throws an error if the user is not found
        throw new NotFoundException(STATUS_MSG.ERROR.RECORD_NOT_FOUND);
      }

      const hashedPassword = await this.userService.hashPassword(
        changePassword.password, // Hashes the new password
      );

      await this.userService.updateUser(
        {
          id: user.id,
        },
        { password: hashedPassword }, // Updates the user's password in the database
      );
      return STATUS_MSG.SUCCESS.PASSWORD_CHANGE;
    } catch (err) {
      // Catches any errors that occur during the process
      throw new BadRequestException(err);
    }
  }

  /**
   * The function `verifyEmail` is an asynchronous function that verifies the email of a user by
   * extracting and verifying a JWT token from the request header, finding the user in the user entity,
   * and updating the user's `isVerified` and `active` properties.
   * @param {any} req - The `req` parameter is an object that represents the request being made to the
   * server. It typically contains information such as headers, query parameters, and request body. In
   * this case, it is used to extract the JWT token from the request header.
   * @returns a Promise that resolves to an UpdateResult object.
   */
  async verifyEmail(req: any): Promise<any> {
    let decoded;

    // Extract the JWT token from the request header
    const token = req.headers.authorization.split(' ')[1];
    try {
      // Verify the token and extract the user ID and device name
      decoded = this.jwtService.verify(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException(STATUS_MSG.ERROR.UNAUTHORIZED);
      }
    }

    if (!decoded.token) {
      throw new UnauthorizedException(STATUS_MSG.ERROR.UNAUTHORIZED);
    }
    //  find user in user entity
    const user = await this.userService.findByUserID(decoded.userID);

    // if user is not found return throw error
    if (!user) {
      throw new BadRequestException(STATUS_MSG.ERROR.UNAUTHORIZED);
    } else {
      // if user  found than update isVerified as true

      const updated = await this.userService.updateUser(
        { id: user.id },
        { isVerified: true, active: ActiveType.active },
      );

      //TODO: use save function nto update instead of update on user repository so that this operation can be done by subscriber.
      Object.assign(user, { isVerified: true, active: ActiveType.active });

      return updated;
    }
  }

  /**
   * The `reactivateAccount` function verifies the email, extracts the user ID and device name from the
   * JWT token, finds the user by ID, finds the user's default workspace set, updates the user's default
   * workspace set to be active, and updates the workspace to be active.
   * @param {any} req - The `req` parameter is an object that represents the request made to reactivate
   * the account. It contains information such as the headers, body, and other details of the request.
   * @returns a Promise that resolves to an UpdateResult.
   */
  async reactivateAccount(req: any): Promise<any> {
    // Verify email
    await this.verifyEmail(req);

    let decoded;

    // Extract the JWT token from the request header
    const token = req.headers.authorization.split(' ')[1];
    try {
      // Verify the token and extract the user ID and device name
      decoded = this.jwtService.verify(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException(STATUS_MSG.ERROR.UNAUTHORIZED);
      }
    }

    // Find user by ID
    await this.userService.findByUserID(decoded.userID);
  }
}
