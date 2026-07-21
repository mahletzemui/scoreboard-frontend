import { computed, Injectable, Signal, signal } from '@angular/core';


/**
 * Manages the application's loading status.
 */
@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    // Fields ---------------------------------------------------------------------
    private loadedHeaderSignal = signal<boolean>(false);
    readonly loadedHeader = this.loadedHeaderSignal.asReadonly();

    private loadedContentSignal = signal<boolean>(false);
    readonly loadedContent = this.loadedContentSignal.asReadonly();

    private loadedRequestSignal = signal<boolean>(true);
    readonly loadedRequest = this.loadedRequestSignal.asReadonly();

    readonly loadedPage: Signal<boolean> = computed(() => this.loadedHeaderSignal() && this.loadedContentSignal());

    // Methods --------------------------------------------------------------------

    /**
     * Sets the header's loaded status.
     *
     * @param value - Status to set to.
     */
    setLoadedHeader(value: boolean): void
    {
        this.loadedHeaderSignal.set(value);
    }

    /**
     * Sets the content's loaded status.
     *
     * @param value - Status to set to.
     */
    setLoadedContent(value: boolean): void
    {
        this.loadedContentSignal.set(value);
    }

    /**
     * Sets the HTTP request's loaded status.
     *
     * @param value - Status to set to.
     */
    setLoadedRequest(value: boolean): void
    {
        this.loadedRequestSignal.set(value);
    }
}
