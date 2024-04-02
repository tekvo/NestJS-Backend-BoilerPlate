import { HttpStatus } from '@nestjs/common';

/**
 *
 * @description creating custom status message
 * @status_msg ERROR.
 * @status_msg SUCCESS
 *
 */

export const STATUS_MSG = {
  ERROR: {
    UNAUTHORIZED: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Invalid Credentials',
      type: 'UNAUTHORIZED',
    },

    MISSING_SECRET_KEY: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Unauthorized: Please double check this secret key',
      type: 'UNAUTHORIZED',
    },

    UNAUTHORIZED_CAPTCHA: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Invalid captcha',
      type: 'UNAUTHORIZED',
    },

    API_EXPIRED: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Your api is expired please regenerate',
      type: 'UNAUTHORIZED',
    },

    NOT_UPDATE_PREDEFINED_ROLE: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message:
        'Unauthorized: You do not have the necessary permissions to update this predefined role. Please contact your administrator for assistance.',
      type: 'NOT_UPDATE_PREDEFINED_ROLE',
    },

    PRIVATE_WORKSPACE_ACCESS_RESTRICTION: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'Access restricted: This form is private and can only be accessed within your workspace. our If made public, only users with the designated secret key can access it.',
      type: 'PRIVATE_WORKSPACE_ACCESS_RESTRICTION',
    },

    EMAIL_EXISTS: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'Sorry, a user with the same email address already exists. Please use a different email or try logging in with your existing credentials.',
      type: 'EMAIL_EXISTS',
    },

    PASSWORD_MATCH_ERROR: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'New password cannot be the same as the current password.',
      type: 'PASSWORD_MATCH_ERROR',
    },

    PASSWORD_DOSE_NOT_MATCH: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'The current password you entered is incorrect.try again.',
      type: 'PASSWORD_DOSE_NOT_MATCH',
    },

    MAX_CELL_SIZE: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'File upload is not possible due to exceeding the cell limit specified in the package.',
      type: 'UPLOAD_PIC_ERROR',
    },

    UPCOMING_INVOICE_NOT_ACCESSIBLE: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'Sorry, were unable to provide the upcoming invoice at the moment. To access this feature, please consider upgrading your package.',
      type: 'UPCOMING_INVOICE_NOT_ACCESSIBLE',
    },

    TO_MANY_REQUEST_IN_THIS_IP: {
      message:
        'Too many accounts created from this IP, please try again after an hour',
      type: 'TO_MANY_REQUEST_IN_THIS_IP',
    },
    DEACTIVATE_ACCOUNT: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'Your account is currently deactivated. Please activate your account to enjoy Notion services.',
      type: 'DEACTIVATE_ACCOUNT',
    },

    FORM_GROUP_LIMIT: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'You will need to consider upgrading the package if you wish to create additional form groups',
      type: 'PACKAGE_LIMIT_EXCEED',
    },

    FORM_LIMIT: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'You will need to consider upgrading the package if you wish to create additional form',
      type: 'PACKAGE_LIMIT_EXCEED',
    },

    TABLE_LIMIT: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'You will need to consider upgrading the package if you wish to create additional table',
      type: 'PACKAGE_LIMIT_EXCEED',
    },

    NOT_DEFAULT_WORKSPACE: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'This workspace belongs to another Admin. Kindly utilize your designated workspace for your activities',
      type: 'NOT_DEFAULT_WORKSPACE',
    },

    INVALID_EMAIL: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'Invalid Email Address. Please provide a valid email address to proceed.',
      type: 'INVALID_EMAIL',
    },

    TABLE_GROUP_LIMIT: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'You will need to consider upgrading the package if you wish to create additional table groups',
      type: 'PACKAGE_LIMIT_EXCEED',
    },

    UPLOAD_PIC_ERROR: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'PLEASE_UPLOAD_ONLY_PNG_AND_JPEG_FILE',
      type: 'UPLOAD_PIC_ERROR',
    },

    NOTION_TOKEN_ALREADY_USED: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'This Notion token has already been used.',
      type: 'NOTION_TOKEN_ALREADY_USED',
    },

    REACTIVATE_USER: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'Please use this token to activate your account. Welcome to our community!',
      type: 'REACTIVATE_USER',
    },

    ALREADY_ACCEPTED_INVITE: {
      statusCode: HttpStatus.CONFLICT,
      message: 'This user has already accepted the invitation. Welcome aboard!',
      error: 'ALREADY_ACCEPTED_INVITE',
    },

    USE_THEME: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'This theme is currently in use. Please remove all references to this theme before proceeding.',
      type: 'USE_THEME',
    },

    PAGE_EXISTS: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'A page with this name already exists in your workspace.',
      type: 'EMAIL_EXISTS',
    },

    ALREADY_OBJECT_LEVEL_ACCESS: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'You already have access granted.',
      type: 'ALREADY_OBJECT_LEVEL_ACCESS',
    },

    USER_NOT_FOUND_WORKSPACE: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'Im sorry, but the specified user was not found within the designated workspace. Kindly send them an invitation to join.',
      type: 'USER_NOT_FOUND_WORKSPACE',
    },

    FAILED_TO_UPLOAD_PROFILE_PIC: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Failed to upload profile picture for the user.',
      type: 'FAILED_TO_UPLOAD_PROFILE_PIC',
    },

    ROLE_USER_FOUND: {
      statusCode: HttpStatus.FAILED_DEPENDENCY,
      message:
        'Cannot delete this role as it is assigned to one or more users. If you want to delete this role in you workspace all user first you change role',
      type: 'ROLE_USER_FOUND',
    },

    EMAIL_NOT_FOUND: {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'This email not found please signup',
      type: 'EMAIL_NOT_FOUND',
    },

    PREDEFINED_ROLE: {
      statusCode: HttpStatus.FAILED_DEPENDENCY,
      message: 'You cannot delete predefined roles',
      type: 'PREDEFINED_ROLE',
    },

    UPGRADED_PACKAGE: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        "You already have an active package. If you want to upgrade your package, please use the 'upgrade package' feature..",
      type: 'UPGRADED_PACKAGE',
    },

    DELETE_OWN_ID_FROM_WORKSPACE: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'Own id cannot be deleted from workspace, you can deactivate your account from Account Settings',
      type: 'DELETE_OWN_ID_FROM_WORKSPACE',
    },

    RECORD_NOT_FOUND: {
      statusCode: HttpStatus.NOT_FOUND,
      message:
        'Data not available: The requested record does not exist, as our data  is currently not found.',
      type: 'RECORD_NOT_FOUND',
    },

    ROLE_RECORD_NOT_FOUND: {
      statusCode: HttpStatus.NOT_FOUND,
      message:
        'Apologies, the specified role is not available in your workspace. Please choose a role from the ones you created or use one of the default roles provided',
      type: 'ROLE_RECORD_NOT_FOUND',
    },

    FORM_NOT_FOUND: {
      statusCode: HttpStatus.NOT_FOUND,
      message:
        'The form corresponding to the provided information is not available. Please ensure the accuracy of the details provided.',
      type: 'FORM_NOT_FOUND',
    },

    UNAUTHORIZED_NOTION_TOKEN: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message:
        'Kindly reach out to the administrator to reset the Notion workspace token. Thank you.',
      type: 'UNAUTHORIZED_NOTION_TOKEN',
    },

    BLOCK_ACCOUNT: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message:
        'We regret to inform you that your account has been temporarily blocked due to security reasons.Please contact administrator to reactivate account',
      type: 'BLOCK_ACCOUNT',
    },

    FORMS_EXIST_IN_TABLE: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        "In this table, there is a dependency on the 'from' field. To delete an entry, you must first delete the corresponding form associated with it.",

      type: 'FORMS_EXIST_IN_TABLE',
    },

    CREATE_ACCOUNT: {
      statusCode: HttpStatus.NOT_FOUND,
      message:
        "Invalid authentication credentials. Please double-check your information, sign up if you haven't already, and try again.",
      type: 'CREATE_ACCOUNT',
    },

    SELECTED_USERWORKSPACESET_REQUIRED: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'The selected user workspace set is mandatory. Please ensure you have chosen a valid workspace before proceeding.',
      type: 'SELECTED_USERWORKSPACESET_REQUIRED',
    },

    USER_WORKSPACE_LIMIT_EXCEEDED: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'User workspace limit has been exceeded. Please upgrade your package to increase the limit.',
      type: 'PACKAGE_LIMIT_EXCEED',
    },

    TABLE_GROUP_WITH_ASSOCIATED_TABLES: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'Oops! This table group cannot be deleted because it still has associated tables. Please remove the tables linked to this group before attempting to delete.',
      type: 'TABLE_GROUP_WITH_ASSOCIATED_TABLES',
    },

    FORM_GROUP_WITH_ASSOCIATED_TABLES: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'Oops! This form group cannot be deleted because it still has associated forms. Please remove the forms linked to this group before attempting to delete.',
      type: 'FORM_GROUP_WITH_ASSOCIATED_TABLES',
    },

    FORM_NOT_SUBMIT: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'We apologize, but your form could not be saved due to a technical error. Please try again later or contact support for assistance.',
      type: 'FORM_NOT_SUBMIT',
    },

    USER_ADD_LIMIT_EXCEEDED: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'Sorry, the limit for adding users to your workspace has been exceeded. If you wish to add more users, please consider upgrading your package.',
      type: 'PACKAGE_LIMIT_EXCEED',
    },

    SESSIONS_LIMIT_EXCEEDED: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'You have exceeded the session limit in your workspace. Please log out and log back in to continue. If the issue persists.',
      type: 'SESSIONS_LIMIT_EXCEEDED',
    },

    FILE_STORAGE_LIMIT_EXCEEDED: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'File storage limit has been exceeded. Please upgrade your package to increase the limit.',
      type: 'PACKAGE_LIMIT_EXCEED',
    },

    FILE_NOT_FOUND: {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Record does not exist for provided details',
      type: 'FILE_NOT_FOUND',
    },

    INVALID_CREDENTIALS: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message:
        'Invalid Credentials: The authentication credentials provided are incorrect. Please double-check your information and try again',
      type: 'INVALID_CREDENTIALS',
    },

    UNAUTHORIZED_MISSING_WORKSPACE_DATA: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'Unauthorized access workspace . Please double-check your information and try again',
      type: 'UNAUTHORIZED_MISSING_WORKSPACE_DATA',
    },

    BLOCK_SOME_FOR_TIME: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message:
        'Invalid Password: Please enter the correct password. Your account has been temporarily blocked for 30 minutes due to multiple failed attempts',
      type: 'BLOCK_SOME_FOR_TIME',
    },

    PERMISSION_DENIED: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message:
        'Permission denied. Please contact the administrator for assistance.',
      type: 'PERMISSION_DENIED',
    },

    INVITE_ACCEPTED: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'This user has already accepted the invitation',
      type: 'INVITE_ACCEPTED',
    },

    INVITE_EXPIRED: {
      statusCode: HttpStatus.ACCEPTED,
      message:
        'This invitation has expired. Please request a new invitation or contact the sender for assistance.',
      type: 'INVITE_EXPIRED',
    },

    INVITE_PENDING: {
      statusCode: HttpStatus.CONFLICT,
      message: '"Would you like to resend the invitation?',
      type: 'INVITE_PENDING',
    },

    INVITE_FAILED: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'We cannot send emails from your own address. Please provide a different email address to proceed.',
      type: 'INVITE_FAILED',
    },

    NOTION_TOKEN_ALREADY_EXISTS: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'Notion token already exists. Please use a different token or update the existing one if needed.',
      type: 'NOTION_TOKEN_ALREADY_EXISTS',
    },

    IS_NOT_VERIFIED: {
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Please verify your email to proceed.',
      type: 'IS_NOT_VERIFIED',
    },

    SERVER_ERROR: {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
      type: 'INTERNAL_SERVER_ERROR',
    },

    RECORD_EXISTS: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Record exist for provided details',
      type: 'RECORD_EXISTS',
    },

    INVITATION_DECLINED: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'The invitation has already been declined.',
      type: 'INVITATION_DECLINED',
    },
    SUSPEND_WORKSPACE: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'This workspace is already suspend',
      type: 'SUSPEND_WORKSPACE',
    },

    TEMPLATE_EXISTS: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Template already exists',
      type: 'TEMPLATE_EXISTS',
    },

    ONLY_IDS_ALLOWED: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Only xlsx and csv files are allowed!',
      type: 'ONLY_IDS_ALLOWED',
    },

    FILE_TOO_LARGE: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'Upload File is to large. If you want upload large file please consider upgrading your package.',
      type: ' PACKAGE_LIMIT_EXCEED',
    },

    API_RATE_LIMIT_EXCEED: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'In Your Workspace. API rate limit exceeded. If you wish to add more API rate limit, please consider upgrading your package.',
      type: 'PACKAGE_LIMIT_EXCEED',
    },

    PAYMENT_REQUIRED: {
      statusCode: HttpStatus.PAYMENT_REQUIRED,
      message:
        'Upgrade your package so that you can use this service. Your package has expired.',
      type: 'PAYMENT_REQUIRED',
    },

    SUBSCRIPTION_CANCELED: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Your subscription is cancelled. Please crate your subscription',
      type: 'SUBSCRIPTION_CANCELED',
    },

    OWN_ROLE_NOT_CHANGE: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Sorry, you cannot change your own role.',
      type: 'OWN_ROLE_NOT_CHANGE',
    },

    CHECK_DOWNGRADE: {
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      message:
        'The downgrade feature is currently unavailable. We apologize for the inconvenience. Please try again later.',
      type: 'CHECK_DOWNGRADE',
    },

    UNABLE_TO_ENABLE: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Column already have data unable to enable EEE',
      type: ' UNABLE_TO_ENABLE',
    },

    COLUMN_ALREADY_ADDED: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Column already present in the table',
      type: ' UNABLE_TO_ENABLE',
    },

    INVALID_DATE: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'The provided date is invalid. Please enter a valid date.',
      type: ' INVALID_DATE',
    },

    MISSING_DETAILS: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Missing required details',
      type: 'MISSING_DETAILS',
    },

    FAILED_UPLOAD_PROFILE_PIC: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Failed to upload profile pic',
      type: 'FAILED_UPLOAD_PROFILE_PIC',
    },

    PLEASE_USE_PRORATION: {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'you are package is not expired. If you want to update the package, please use proration.',
      type: 'PLEASE_USE_PRORATION',
    },

    FAILED_UPLOAD_STRIPE_INVOICE: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Failed to stripe transaction invoice in S3 bucket.',
      type: 'FAILED_UPLOAD_STRIPE_INVOICE',
    },

    UPLOAD_WORKSPACE_PIC: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Failed to upload workspace picture.',
      type: 'UPLOAD_WORKSPACE_PIC',
    },

    MISSING_SCHEMA_ERROR: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Please add atleast one column to the view.',
      type: 'MISSING_SCHEMA_ERROR',
    },

    PACKAGE_EXPIRED: {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Your package has expired. Please upgrade your package.',
      type: 'PACKAGE_EXPIRED',
    },
  },

  SUCCESS: {
    AUTHORIZED: {
      statusCode: HttpStatus.ACCEPTED,
      message: 'User is authorized.',
      type: 'Authorized',
    },

    SEND_INVITE: {
      statusCode: HttpStatus.OK,
      message: 'Invitation sent successfully. Thank you!',
      type: 'SEND_INVITE',
    },

    SEND_NOTIFICATIONS: {
      statusCode: HttpStatus.OK,
      message: 'Notification sent successfully',
      type: 'Notification sent successfully',
    },

    VERIFY_EMAIL: {
      statusCode: HttpStatus.OK,
      message:
        'Email verification sent successfully. Please check your inbox for further instructions.',
      type: 'VERIFY_EMAIL',
    },

    RESENT_VERIFY_EMAIL: {
      statusCode: HttpStatus.OK,
      message:
        'An account with this email already exists. Please verify your email. Verification email sent successfully.',
      type: 'RESENT_VERIFY_EMAIL',
    },

    UPGRADE_PACKAGE: {
      statusCode: HttpStatus.OK,
      message:
        'Your package has been successfully updated. Enjoy your enhanced experience!',
      type: 'UPGRADE_PACKAGE',
    },

    ADDED: {
      statusCode: HttpStatus.OK,
      message: 'Details added successfully. Your information is now add.',
      type: 'ADDED',
    },

    PERMISSION_ADD: {
      statusCode: HttpStatus.OK,
      message: 'Permission granted successfully. Enjoy your enhanced access.',
      type: 'PERMISSION_ADD',
    },

    EMAIL_NOT_INVITE: {
      statusCode: HttpStatus.OK,
      message: 'This email is not associated with any workspace invitation.',
      type: 'EMAIL_NOT_INVITE',
    },

    UPDATED_HUB_TABLE_SCHEMA: {
      statusCode: HttpStatus.OK,
      message: 'This hub table schema has been updated.',
      type: 'UPDATED_HUB_TABLE_SCHEMA',
    },

    ROLE_WITH_PERMISSIONS: {
      statusCode: HttpStatus.OK,
      message:
        'Role with permissions added successfully. Your new role is now active.',
      type: 'ROLE_WITH_PERMISSIONS',
    },

    WORKSPACE_API_KEY_WITH_PERMISSIONS: {
      message:
        'Key with permissions added successfully. Your new key is now active.',
      type: 'WORKSPACE_API_KEY_WITH_PERMISSIONS',
    },

    ACCEPTED_INVITE: {
      statusCode: HttpStatus.OK,
      message: 'Your invitation has been accepted. Welcome aboard!',
      type: 'ACCEPTED_INVITE',
    },

    DELETE_INVITE: {
      statusCode: HttpStatus.OK,
      message: 'Invitation deleted successfully.',
      type: 'DELETE_INVITE',
    },

    LOG_OUT_SUCCESSFULLY: {
      statusCode: HttpStatus.OK,
      message: 'You have been successfully logged out.',
      type: 'LOG_OUT_SUCCESSFULLY',
    },

    UPDATED: {
      statusCode: HttpStatus.OK,
      message: 'Record updated successfully. Your changes have been saved.',
      type: 'UPDATED',
    },

    DEACTIVATED: {
      statusCode: HttpStatus.OK,
      message: 'Record deactivated successfully. The item is now inactive.',
      type: 'DEACTIVATED',
    },

    SYNC: {
      statusCode: HttpStatus.OK,
      message: 'Sync is successful.',
      type: 'SYNC',
    },

    DELETED: {
      statusCode: HttpStatus.OK,
      message: 'Record deleted successfully. The item has been removed.',
      type: 'DELETED',
    },

    PASSWORD_CHANGE: {
      statusCode: HttpStatus.OK,
      message: 'Password changed successfully.',
      type: 'PASSWORD_CHANGE',
    },

    SEND_FORGOT_PASSWORD_EMAIL: {
      statusCode: HttpStatus.OK,
      message:
        'An email for resetting your password has been sent to your email address successfully',
      type: 'SEND_FORGOT_PASSWORD_EMAIL',
    },

    REMOVE_FILE_FROM_S3: {
      statusCode: HttpStatus.OK,
      message: 'Remove file from S3',
      type: 'REMOVE_FILE_FROM_S3',
    },

    REMOVE_TABLE_FILE: {
      statusCode: HttpStatus.OK,
      message: 'File successfully removed from the table',
      type: 'REMOVE_TABLE_FILE',
    },

    DISCONNECT_TO_NOTION: {
      statusCode: HttpStatus.OK,
      message: 'This workspace has been disconnected to notion!',
      type: 'DISCONNECT_TO_NOTION',
    },
  },
};
