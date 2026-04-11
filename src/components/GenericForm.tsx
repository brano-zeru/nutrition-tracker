'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as Label from '@radix-ui/react-label';
import { DefaultValues, FieldValues, Path, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface FormField<T> {
    name: Path<T>;
    label: string;
    type: string;
    placeholder?: string;
}

interface GenericFormProps<TFieldValues extends FieldValues> {
    schema: z.ZodType<TFieldValues>;
    onSubmit: (data: TFieldValues) => Promise<void>;
    fields: FormField<TFieldValues>[];
    title: string;
    description: string;
    submitLabel: string;
    isSubmittingLabel: string;
    defaultValues?: DefaultValues<TFieldValues>;
    linkElement?: React.ReactNode;
    onFieldChange?: (name: string, value: any) => void;
    externalErrors?: Record<string, string>;
    isExternalLoading?: boolean;
}

export function GenericForm<TFieldValues extends FieldValues>({
    schema,
    onSubmit,
    fields,
    title,
    description,
    submitLabel,
    isSubmittingLabel,
    defaultValues,
    linkElement,
    onFieldChange,
    externalErrors,
    isExternalLoading,
}: GenericFormProps<TFieldValues>) {
    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<TFieldValues>({
        mode: 'onChange',
        resolver: zodResolver(schema),
        defaultValues,
    });

    useEffect(() => {
        if (!onFieldChange) return;

        const subscription = watch((value, { name }) => {
            if (name) onFieldChange(name, value[name]);
        });

        return () => subscription.unsubscribe();
    }, [watch, onFieldChange]);

    useEffect(() => {
        if (!externalErrors) return;

        Object.entries(externalErrors).forEach(([name, message]) => {
            setError(name as any, {
                type: 'manual',
                message: message,
            });
        });
    }, [externalErrors, setError]);

    return (
        <div className="w-full max-w-md space-y-6 rounded-2xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl shadow-emerald-900/20 font-sans text-zinc-100 selection:bg-emerald-500/30">
            <div className="text-center space-y-1">
                <h1 className="text-3xl font-extrabold tracking-tighter bg-gradient-to-bl from-red-500 to-blue-500 bg-clip-text text-transparent">
                    {title}
                </h1>
                <p className="text-xs text-zinc-400">{description}</p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-1.5 transition-all duration-300"
            >
                {fields.map((field) => (
                    <div key={field.name as string} className="group">
                        <Label.Root
                            className="text-[11px] font-semibold text-zinc-500 ml-1 uppercase tracking-wider group-focus-within:text-emerald-500 transition-colors"
                            htmlFor={field.name as string}
                        >
                            {field.label}
                        </Label.Root>

                        <input
                            {...register(field.name)}
                            id={field.name as string}
                            type={field.type}
                            placeholder={field.placeholder}
                            className={`mt-1 flex h-11 w-full rounded-lg border bg-zinc-950 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-700 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:opacity-50 ${
                                errors[field.name]
                                    ? 'border-red-500/40 focus-visible:ring-red-500/50'
                                    : 'border-zinc-800 focus-visible:ring-emerald-600/50'
                            }`}
                        />

                        <div className="h-6 flex items-center px-1 transition-all duration-300">
                            {errors[field.name] && (
                                <span className="text-[11px] text-red-400 font-medium leading-none">
                                    {errors[field.name]?.message as string}
                                </span>
                            )}
                        </div>
                    </div>
                ))}

                <Button
                    type="submit"
                    disabled={
                        isSubmitting ||
                        isExternalLoading ||
                        Object.keys(errors).length > 0
                    }
                    className={`
        inline-flex h-11 w-full items-center justify-center rounded-lg px-6 py-2 text-sm font-bold transition-all mt-2 shadow-lg
        
        bg-emerald-600 text-emerald-50 shadow-emerald-900/10 hover:bg-emerald-700 active:scale-[0.98]
        
        disabled:bg-zinc-800 disabled:text-zinc-500 disabled:opacity-100 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none
        
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900
    `}
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-500 border-t-transparent" />
                            {isSubmittingLabel}
                        </div>
                    ) : (
                        submitLabel
                    )}
                </Button>
            </form>

            {linkElement && (
                <div className="text-center text-xs border-t border-zinc-800/50 pt-5 mt-2">
                    {linkElement}
                </div>
            )}
        </div>
    );
}
