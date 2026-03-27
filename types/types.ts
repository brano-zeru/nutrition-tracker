import { ReactNode } from "react";

export const enum tabKeys {
    DASHBOARD = 'dashboard',
    HISTORY = 'history',
    STATISTICS = 'stats'
}

export interface Tab {
    key: tabKeys,
    icon: ReactNode,
    pageComponent: ReactNode,
    classNames: string,
}