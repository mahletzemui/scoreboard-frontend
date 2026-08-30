import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';


import { requestInterceptor } from './request.interceptor';

import { environment } from '../../../environments/environment';

import { LoaderService } from '../loader/loader.service';


/**
 * Tests the RequestInterceptor's functionality.
 */
describe('requestInterceptor', () => {
    // Fields ---------------------------------------------------------------------
    let loaderSpy: LoaderService;
    
    // Setup ----------------------------------------------------------------------

    beforeEach(() =>
    {
        TestBed.configureTestingModule({ providers: [LoaderService] });
        loaderSpy = TestBed.inject(LoaderService);
        document.body.style.overflow = 'visible';
    });

    // Tests ----------------------------------------------------------------------

    it('should intercept actual http requests', () =>
    {
        const next = vi.fn(() => of({} as HttpEvent<any>));
        const request = new HttpRequest('GET', '/test');

        const spy = vi.spyOn(loaderSpy, 'setLoadedRequest');
        TestBed.runInInjectionContext(() => { requestInterceptor(request, next).subscribe(); });

        expect(spy.mock.calls).toEqual([ [false], [true] ]);
        expect(document.body.style.overflow).toBe('visible');
    });


    it('should intercept local http requests with default data', () =>
    {
        const next = vi.fn(() => of({} as HttpEvent<any>));
        const request = new HttpRequest('GET', '/test');

        environment.useMockData = true;
        const spy = vi.spyOn(loaderSpy, 'setLoadedRequest');

        let result;
        try {
            TestBed.runInInjectionContext(() => {
                requestInterceptor(request, next).subscribe(item => { result = item; });
            });
        } finally {
            environment.useMockData = false;
        }

        expect(spy).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
        expect(result).toBeInstanceOf(HttpResponse);
    });
});
