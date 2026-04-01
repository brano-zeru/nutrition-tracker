import { NutritionTracker } from '@/components/nutritionTracker';
import { redirect } from 'next/navigation';

export default function HomePage() {
    // redirect('/login');
    return <NutritionTracker />;
}
