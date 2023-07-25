import { default as Analytics, AnalyticsInstance } from 'analytics'
import { analyticsPlugin } from './analytics-plugin';
import { TrackEventName, TrackEventPayload } from './analytics-types';
import { FunctionComponent, PropsWithChildren, createContext, useContext, useRef } from 'react';

export const analytics = Analytics({
    app: 'chair-flight',
    version: "1",
    plugins: [
        analyticsPlugin,
    ]
})

const analyticsContext = createContext(analytics);

export const AnalyticsProvider : FunctionComponent<PropsWithChildren> = ({
    children,
}) => {
    return (
        <analyticsContext.Provider value={analytics}>
            {children}
        </analyticsContext.Provider>
    );
} 

export const useAnalytics = () => {
    const analytics = useContext(analyticsContext);

    return {
        page: () => {
            analytics.page();
        },

        track: <T extends TrackEventName>(name: T, payload: TrackEventPayload<T>) => {
            analytics.track(name, payload);
        },
    }
}