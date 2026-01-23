export type HttpError = {
  statusCode: number;
  body: { error: { code: string; message: string } };
};

export function mapErrorToHttp(error: Error): HttpError {
  const name = error.name;

  // Profile
  if (name === 'EmailAlreadyInUseError') {
    return {
      statusCode: 409,
      body: { error: { code: 'EMAIL_IN_USE', message: error.message } },
    };
  }
  if (
    name === 'InvalidProfileNameError' ||
    name === 'InvalidProfileEmailError'
  ) {
    return {
      statusCode: 400,
      body: { error: { code: 'VALIDATION_ERROR', message: error.message } },
    };
  }
  if (name === 'ProfileNotFoundError') {
    return {
      statusCode: 404,
      body: { error: { code: 'PROFILE_NOT_FOUND', message: error.message } },
    };
  }

  // Task
  if (name === 'InvalidTaskTitleError') {
    return {
      statusCode: 400,
      body: { error: { code: 'VALIDATION_ERROR', message: error.message } },
    };
  }
  if (name === 'TaskNotFoundError') {
    return {
      statusCode: 404,
      body: { error: { code: 'TASK_NOT_FOUND', message: error.message } },
    };
  }
  if (name === 'TaskAlreadyCompletedError') {
    return {
      statusCode: 409,
      body: {
        error: { code: 'TASK_ALREADY_COMPLETED', message: error.message },
      },
    };
  }
  if (name === 'NotTaskOwnerError') {
    return {
      statusCode: 403,
      body: { error: { code: 'NOT_TASK_OWNER', message: error.message } },
    };
  }

  return {
    statusCode: 500,
    body: {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
      },
    },
  };
}
