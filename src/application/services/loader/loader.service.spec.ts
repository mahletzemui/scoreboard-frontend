import { TestBed } from '@angular/core/testing';


import { LoaderService } from './loader.service';


/**
 * Tests the LoaderService class.
 */
describe('LoaderService', () => {
    // Fields ---------------------------------------------------------------------
    let service: LoaderService;

    // Setup ----------------------------------------------------------------------

    beforeEach(() =>
    {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoaderService);
    });

    // Tests ----------------------------------------------------------------------

    it('should create service', () =>
    {
        expect(service).toBeTruthy();
        expect(service.loadedPage()).toBe(false);
        expect(service.loadedHeader()).toBe(false);
        expect(service.loadedRequest()).toBe(true);
        expect(service.loadedContent()).toBe(false);
    });


    it("should update the header's loading status", () =>
    {
        service.setLoadedHeader(true);
        expect(service.loadedHeader()).toBe(true);

        service.setLoadedHeader(false);
        expect(service.loadedHeader()).toBe(false);
    });


    it("should update the content's loading status", () =>
    {
        service.setLoadedContent(true);
        expect(service.loadedContent()).toBe(true);

        service.setLoadedContent(false);
        expect(service.loadedContent()).toBe(false);
    });


    it("should update the HTTP request's loading status", () =>
    {
        service.setLoadedRequest(false);
        expect(service.loadedRequest()).toBe(false);

        service.setLoadedRequest(true);
        expect(service.loadedRequest()).toBe(true);
    });


    it("should update the page's loading status", () =>
    {
        service.setLoadedHeader(true);
        expect(service.loadedPage()).toBe(false);

        service.setLoadedContent(true);
        expect(service.loadedPage()).toBe(true);

        service.setLoadedHeader(false);
        expect(service.loadedPage()).toBe(false);
    });
});
