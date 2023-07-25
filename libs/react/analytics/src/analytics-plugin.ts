import type { AnalyticsPlugin } from 'analytics'

export type PageViewProps = {
    payload: {
        type: "page";
        anonymousId: string;
        properties: {
            title: string;
            url: string;
            height: number;
            width: number;
            referrer: string;
            hash: string;
        }
    }
}


export const analyticsPlugin: AnalyticsPlugin = {
    name: 'chair-flight-analytics-plugin',
    config: {

    },
    initialize: () => { },
    page: (props: PageViewProps) => {
        console.log({
            type: props.payload.type,
            anonymousId: props.payload.anonymousId,
            properties: props.payload.properties
        });
    },
    track: ({ }) => {
        // call provider specific event tracking
    },
    identify: ({ }) => {
        // call provider specific user identify method
    },
    loaded: () => {
        return true;
    }
}