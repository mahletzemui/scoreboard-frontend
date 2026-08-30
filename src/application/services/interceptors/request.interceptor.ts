import { finalize, of } from 'rxjs';
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';


import { environment } from '../../../environments/environment';
import { resolveMockResponse } from '../../../environments/mock-data';

import { LoaderService } from '../loader/loader.service';


/**
 * Manages the application's HTTP requests status.
 *
 * @param request - Incoming HTTP request.
 * @param next    - Request forwarding function.
 *
 * @return the HTTP response stream.
 */
export const requestInterceptor: HttpInterceptorFn = (request, next) =>
{
    if (environment.useMockData) {
        return of(resolveMockResponse(request));
    }

    const loader = inject(LoaderService);
    const previousStyle = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    loader.setLoadedRequest(false);

    return next(request).pipe(finalize(() => {
        document.body.style.overflow = previousStyle;
        loader.setLoadedRequest(true);
    }));
};
