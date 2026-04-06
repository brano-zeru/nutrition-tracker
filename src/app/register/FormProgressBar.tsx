interface FormProgressBarProps {
    error: string | null;
}

export const FormProgressBar = ({ error }: FormProgressBarProps) => {
    return (
        <>
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {error}
                </div>
            )}
        </>
    );
};
