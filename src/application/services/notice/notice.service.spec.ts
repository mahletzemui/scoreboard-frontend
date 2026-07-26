import { TestBed } from '@angular/core/testing';


import { NoticeService } from './notice.service';


/**
 * Tests the NoticeService class.
 */
describe('NoticeService', () => {
    // Fields ---------------------------------------------------------------------
    let service: NoticeService;

    // Setup ----------------------------------------------------------------------

    beforeEach(() =>
    {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NoticeService);
    });

    // Tests ----------------------------------------------------------------------

    it('should create service', () =>
    {
        expect(service).toBeTruthy();
        expect(service.bannerNotice()).toBe('');
        expect(service.messageNotice()).toBe('');
    });


    describe('Banner', () => {
        it('should show the notice and auto-dismiss after 5 seconds', () =>
        {
            vi.useFakeTimers();

            service.showBanner('Action taken successfully.');
            expect(service.bannerNotice()).toBe('Action taken successfully.');

            vi.advanceTimersByTime(4999);
            expect(service.bannerNotice()).toBe('Action taken successfully.');

            vi.advanceTimersByTime(1);
            expect(service.bannerNotice()).toBe('');

            vi.useRealTimers();
        });


        it('should replace the current notice and restart the timer', () =>
        {
            vi.useFakeTimers();

            service.showBanner('First action taken successfully.');
            expect(service.bannerNotice()).toBe('First action taken successfully.');

            vi.advanceTimersByTime(2500);
            service.showBanner('Second action taken successfully.');
            expect(service.bannerNotice()).toBe('Second action taken successfully.');

            vi.advanceTimersByTime(4999);
            expect(service.bannerNotice()).toBe('Second action taken successfully.');

            vi.advanceTimersByTime(1);
            expect(service.bannerNotice()).toBe('');

            vi.useRealTimers();
        });


        it('should dismiss the notice and cancel the pending timer', () =>
        {
            vi.useFakeTimers();

            service.showBanner('Action taken successfully.');
            expect(service.bannerNotice()).toBe('Action taken successfully.');

            service.closeBanner();
            vi.advanceTimersByTime(2500);
            expect(service.bannerNotice()).toBe('');

            vi.useRealTimers();
        });
    });


    describe('Message', () => {
        it('should show the notice without auto-dismissing', () =>
        {
            vi.useFakeTimers();

            service.showMessage('An action is about to be taken.');
            expect(service.messageNotice()).toBe('An action is about to be taken.');

            vi.advanceTimersByTime(5000);
            expect(service.messageNotice()).toBe('An action is about to be taken.');

            vi.useRealTimers();
        });


        it('should replace the current notice', () =>
        {
            service.showMessage('The first action is about to be taken.');
            expect(service.messageNotice()).toBe('The first action is about to be taken.');

            service.showMessage('The second action is about to be taken.');
            expect(service.messageNotice()).toBe('The second action is about to be taken.');
        });


        it('should dismiss the notice', () =>
        {
            service.showMessage('An action is about to be taken.');
            expect(service.messageNotice()).toBe('An action is about to be taken.');
            service.closeMessage();
            expect(service.messageNotice()).toBe('');
        });
    });


    it('should keep the banner and message notices independent', () =>
    {
        vi.useFakeTimers();

        service.showBanner('Action taken successfully.');
        service.showMessage('An action is about to be taken.');

        expect(service.bannerNotice()).toBe('Action taken successfully.');
        expect(service.messageNotice()).toBe('An action is about to be taken.');

        service.closeMessage();
        expect(service.bannerNotice()).toBe('Action taken successfully.');
        expect(service.messageNotice()).toBe('');

        vi.advanceTimersByTime(5000);
        expect(service.bannerNotice()).toBe('');

        vi.useRealTimers();
    });
});
