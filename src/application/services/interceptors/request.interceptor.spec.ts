import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { HttpEvent, HttpRequest } from '@angular/common/http';


import { requestInterceptor } from './request.interceptor';

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
        TestBed.configureTestingModule({ providers: [ LoaderService ] });
        loaderSpy = TestBed.inject(LoaderService);
        document.body.style.overflow = 'visible';
    });

    // Tests ----------------------------------------------------------------------

    it('should intercept the http request', () =>
    {
        const next = vi.fn(() => of({} as HttpEvent<any>));
        const request = new HttpRequest('GET', '/test');

        const spy = vi.spyOn(loaderSpy, 'setLoadedRequest');
        TestBed.runInInjectionContext(() => { requestInterceptor(request, next).subscribe(); });

        expect(spy.mock.calls).toEqual([ [false], [true] ]);
        expect(document.body.style.overflow).toBe('visible');
    });
});
