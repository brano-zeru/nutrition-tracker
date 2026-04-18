import { Apple } from 'lucide-react';
import { GoalsSettings } from './goalsSettings';
import { LogoutButton } from './logoutButton';
import { SavedFoodsLibrary } from './savedFoodsLibrary';

export const Navbar = () => {
    return (
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
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </header>
    );
};
