import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { EmailAlreadyInUseError } from '@/user/domain/errors/email-already-in-use-error';
import { UserFeatureFlagAlreadyExistsError } from '@/user-feature-flags/infrastructure/errors/user-feature-flag-already-exists-error';

@Catch(EmailAlreadyInUseError, UserFeatureFlagAlreadyExistsError)
export class ConflictErrorFilter implements ExceptionFilter {
  catch(
    exception: EmailAlreadyInUseError | UserFeatureFlagAlreadyExistsError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    response.status(409).send({
      statusCode: 409,
      error: 'Conflict',
      message: exception.message,
    });
  }
}
