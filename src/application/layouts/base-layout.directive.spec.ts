import { TestBed } from '@angular/core/testing';


import { BaseLayout } from './base-layout.directive';

import { LoaderService } from '../services';


class TestLayout extends BaseLayout {};

/**
 * Tests the BaseLayout class.
 */
describe('BaseLayout', () => {
    // Tests ----------------------------------------------------------------------

    it('should be constructible', () =>
    {
        TestBed.configureTestingModule({ providers: [BaseLayout] });
        const instance = TestBed.inject(BaseLayout);
        expect(instance).toBeInstanceOf(BaseLayout);
    });


    it('should resolve the layout after view initialization', async () =>
    {
        const loader = new LoaderService();
        const layout = new TestLayout(loader);

        vi.useFakeTimers();
        const spy = vi.spyOn(loader, 'setLoadedContent');

        layout.ngAfterViewInit();
        expect(spy).not.toHaveBeenCalled();
        await vi.advanceTimersByTimeAsync(1000);
        expect(spy).toHaveBeenCalledWith(true);

        vi.useRealTimers();
    });
});
