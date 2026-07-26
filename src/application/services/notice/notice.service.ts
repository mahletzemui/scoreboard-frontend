import { Injectable, signal } from '@angular/core';


/**
 * Manages the application's notices.
 */
@Injectable({
    providedIn: 'root'
})
export class NoticeService {
    // Fields ---------------------------------------------------------------------
    private bannerNoticeSignal = signal<string>('');
    readonly bannerNotice = this.bannerNoticeSignal.asReadonly();

    private messageNoticeSignal = signal<string>('');
    readonly messageNotice = this.messageNoticeSignal.asReadonly();

    private timer?: ReturnType<typeof setTimeout>;

    // Methods --------------------------------------------------------------------

    /**
     * Shows the banner's notice.
     *
     * @param notice - Notice to display.
     */
    showBanner(notice: string): void
    {
        clearTimeout(this.timer);
        this.bannerNoticeSignal.set(notice);
        this.timer = setTimeout(() => this.bannerNoticeSignal.set(''), 5000);
    }

    /**
     * Dismisses the banner's notice.
     */
    closeBanner(): void
    {
        clearTimeout(this.timer);
        this.bannerNoticeSignal.set('');
    }

    /**
     * Shows the message's notice.
     *
     * @param notice - Notice to display.
     */
    showMessage(notice: string): void
    {
        this.messageNoticeSignal.set(notice);
    }

    /**
     * Dismisses the message's notice.
     */
    closeMessage(): void
    {
        this.messageNoticeSignal.set('');
    }
}
