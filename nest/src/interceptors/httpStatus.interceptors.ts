import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Injectable()
export class HttpStatusInterceptors<T> implements NestInterceptor<T, T> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const response = context.switchToHttp().getResponse();
    if (response.statusCode >= 200 && response.statusCode <= 204) {
      response.statusCode = 200;
    }
    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}
