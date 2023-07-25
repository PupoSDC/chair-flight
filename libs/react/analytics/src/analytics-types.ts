export type TrackEvent = {
    "potato": {

    },
    "kiwi": {
        banana: string;
    }
}

export type TrackEventName = keyof TrackEvent;
export type TrackEventPayload<T extends TrackEventName> = TrackEvent[T];