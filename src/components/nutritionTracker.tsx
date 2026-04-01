'use client';

import { GoalsSettings } from '@/components/goalsSettings';
import { SavedFoodsLibrary } from '@/components/savedFoodsLibrary';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NutritionProvider } from '@/contexts/nutritionContext';
import { Apple, BarChart3, History as HistoryIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Dashboard, History, Stats } from './pages';
import { Tab, tabKeys } from '@/types';
import { TabsContent } from '@radix-ui/react-tabs';

function TrackerContent() {
    const [activeTab, setActiveTab] = useState(tabKeys.DASHBOARD);

    const tabs: Tab[] = useMemo(
        () => [
            {
                key: tabKeys.DASHBOARD,
                icon: <Apple className="h-4 w-4 sm:mr-2" />,
                pageComponent: <Dashboard />,
                classNames: 'space-y-4 sm:space-y-6 mt-4 sm:mt-6',
            },
            {
                key: tabKeys.HISTORY,
                icon: <HistoryIcon className="h-4 w-4 sm:mr-2" />,
                pageComponent: <History />,
                classNames: 'mt-4 sm:mt-6',
            },
            {
                key: tabKeys.STATISTICS,
                icon: <BarChart3 className="h-4 w-4 sm:mr-2" />,
                pageComponent: <Stats />,
                classNames: 'mt-4 sm:mt-6',
            },
        ],
        [],
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Apple className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                                    NutriTrack
                                </h1>
                                <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                                    Your nutrition companion
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <SavedFoodsLibrary />
                            <GoalsSettings />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                <Tabs
                    value={activeTab}
                    onValueChange={(value: string) =>
                        setActiveTab(value as tabKeys)
                    }
                    className="space-y-4 sm:space-y-6"
                >
                    <TabsList className="bg-secondary/50 border border-border/50 p-1 w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
                        {tabs.map(({ key, icon }) => (
                            <TabsTrigger
                                key={key}
                                value={key}
                                className="data-[state=active]:bg-card data-[state=active]:text-foreground text-xs sm:text-sm px-2 sm:px-4"
                            >
                                {icon}
                                <span className="hidden sm:inline">{key}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {tabs.map(({ key, classNames, pageComponent }) => (
                        <TabsContent
                            key={key}
                            value={key}
                            className={classNames}
                        >
                            {pageComponent}
                        </TabsContent>
                    ))}
                </Tabs>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/50 mt-8 sm:mt-12">
                <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                    <p className="text-center text-xs sm:text-sm text-muted-foreground">
                        NutriTrack - Track your nutrition journey
                    </p>
                </div>
            </footer>
        </div>
    );
}

export function NutritionTracker() {
    return (
        <NutritionProvider>
            <TrackerContent />
        </NutritionProvider>
    );
}
