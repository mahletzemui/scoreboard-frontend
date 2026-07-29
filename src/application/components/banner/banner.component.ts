import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';


import { NoticeService } from '../../services/notice/notice.service';


/**
 * Displays the application's banner.
 */
@Component({
    selector: 'app-banner',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './banner.component.html',
    styleUrl: './banner.component.css'
})
export class BannerComponent {
    // Fields ---------------------------------------------------------------------
    private service = inject(NoticeService);

    notice = this.service.bannerNotice;
    activated = computed(() => this.service.bannerNotice() !== '');

    // Methods --------------------------------------------------------------------

    /**
     * Dismisses the banner.
     */
    close(): void
    {
        this.service.closeBanner();
    }
}
