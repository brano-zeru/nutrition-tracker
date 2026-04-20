'use client';

import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
    label: string;
    value: string;
}

interface FancyDropdownProps {
    value?: string;
    onValueChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    error?: string;
}

export function FancyDropdown({
    value,
    onValueChange,
    options,
    placeholder,
    error,
}: FancyDropdownProps) {
    return (
        <div className="flex flex-col gap-1 w-full">
            <Select.Root value={value} onValueChange={onValueChange}>
                <Select.Trigger
                    className={cn(
                        'flex h-11 w-full items-center justify-start rounded-lg border bg-zinc-950 px-4 py-2 text-sm text-zinc-100 outline-none transition-all gap-3',
                        'border-zinc-800 focus:ring-1 focus:ring-emerald-600/50',
                        error && 'border-red-500 focus:ring-red-500/50',
                    )}
                >
                    <div className="flex-1 text-left overflow-hidden">
                        <Select.Value
                            placeholder={placeholder || 'Select activity...'}
                        />
                    </div>

                    <Select.Icon className="flex-shrink-0">
                        <ChevronDown className="h-4 w-4 text-zinc-500" />
                    </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                    <Select.Content
                        align="start"
                        position="popper"
                        sideOffset={5}
                        className="z-[100] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-2xl animate-in fade-in-0 zoom-in-95"
                    >
                        <Select.Viewport className="p-1.5">
                            {options.map((opt) => (
                                <Select.Item
                                    key={opt.value}
                                    value={opt.value}
                                    className={cn(
                                        'relative flex w-full cursor-pointer select-none items-start justify-start rounded-md py-4 pl-10 pr-4 text-sm outline-none transition-colors',
                                        'text-zinc-300 focus:bg-zinc-900 focus:text-emerald-400 data-[state=checked]:text-emerald-400 text-left',
                                        'leading-relaxed',
                                    )}
                                >
                                    <span className="absolute left-3 top-5 flex h-3.5 w-3.5 items-center justify-center">
                                        <Select.ItemIndicator>
                                            <Check className="h-4 w-4" />
                                        </Select.ItemIndicator>
                                    </span>

                                    <Select.ItemText>
                                        <span className="inline-block w-full">
                                            {opt.label}
                                        </span>
                                    </Select.ItemText>
                                </Select.Item>
                            ))}
                        </Select.Viewport>
                    </Select.Content>
                </Select.Portal>
            </Select.Root>
        </div>
    );
}
