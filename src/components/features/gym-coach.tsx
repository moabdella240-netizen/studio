
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateWorkout, GenerateWorkoutInput, GenerateWorkoutOutput } from '@/ai/flows/generate-workout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Dumbbell, Loader2, Sparkles, Zap, Flame, Repeat, Wind } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import {z} from 'zod';

const translations = {
  ti: {
    title: 'AI ናይ ስፖርት ኣማኻሪ',
    description: 'ብናይ AI ሓገዝ፡ ንኣኻ ዝኸውን ናይ ስፖርት ውጥን ምረጽ።',
    generate: 'ውጥን ፍጠር',
    generating: 'ይስራሕ ኣሎ...',
    goal: 'ዕላማ',
    workoutType: 'ዓይነት ስፖርት',
    difficulty: 'ጽፍሒ ጽንዓት',
    sessionTime: 'ግዜ (ደቓይቕ)',
    focus: 'ትኹረት',
    equipment: 'መሳርሒታት',
    errorTitle: 'ጌጋ ኣጋጢሙ',
    errorMessage: 'ውጥን ክንፈጥር ኣይከኣልናን። ደጊምካ ፈትን።',
    initialMessage: 'ናይ ስፖርት ውጥንካ ኣብዚ ክርአ እዩ።',
    warmUp: 'ምድላው',
    mainWorkout: 'ዋና ስፖርት',
    coolDown: 'ምዝሕሓል',
    safetyTips: 'ናይ ድሕንነት ምኽርታት',
    calories: 'ካሎሪ',
    startWorkout: 'ስፖርት ጀምር',
    randomPlan: 'ዘይተመርጸ ውጥን',
    beginnerMode: 'ናይ መጀመርታ ደረጃ',
  },
  en: {
    title: 'AI Gym Coach',
    description: 'Get personalized workout plans with the help of AI.',
    generate: 'Generate Plan',
    generating: 'Generating...',
    goal: 'Goal',
    workoutType: 'Workout Type',
    difficulty: 'Difficulty',
    sessionTime: 'Session Time (min)',
    focus: 'Body-part Focus',
    equipment: 'Equipment',
    errorTitle: 'Error',
    errorMessage: 'Failed to generate workout plan. Please try again.',
    initialMessage: 'Your workout plan will appear here.',
    warmUp: 'Warm-Up',
    mainWorkout: 'Main Workout',
    coolDown: 'Cool-Down',
    safetyTips: 'Safety Tips',
    calories: 'Calories',
    startWorkout: 'Start Workout',
    randomPlan: 'Random Plan',
    beginnerMode: 'Beginner Mode',
  },
};

const GenerateWorkoutInputClientSchema = z.object({
  goal: z.enum(['weight loss', 'muscle gain', 'strength', 'beginner fitness', 'endurance']),
  workoutType: z.enum(['Gym', 'Home', 'Outdoor']),
  difficulty: z.enum(['Easy', 'Medium', 'Advanced']),
  sessionTime: z.coerce.number().min(15).max(120),
  focus: z.string().optional(),
  equipment: z.string().optional(),
});


export default function GymCoach({ language = 'ti' }: { language?: 'ti' | 'en' }) {
  const [workout, setWorkout] = useState<GenerateWorkoutOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const t = translations[language];

  const form = useForm<GenerateWorkoutInput>({
    resolver: zodResolver(GenerateWorkoutInputClientSchema),
    defaultValues: {
      goal: 'beginner fitness',
      workoutType: 'Home',
      difficulty: 'Easy',
      sessionTime: 30,
      focus: 'full-body',
      equipment: 'body-weight',
    },
  });

  const handleGenerate = async (values: GenerateWorkoutInput) => {
    setIsLoading(true);
    setWorkout(null);
    try {
      const result = await generateWorkout(values);
      setWorkout(result);
    } catch (error) {
      console.error('AI Error:', error);
      toast({
        variant: 'destructive',
        title: t.errorTitle,
        description: t.errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePreset = (preset: 'random' | 'beginner') => {
    if (preset === 'beginner') {
         form.reset({
            goal: 'beginner fitness',
            workoutType: 'Home',
            difficulty: 'Easy',
            sessionTime: 30,
            focus: 'full-body',
            equipment: 'body-weight',
        });
        handleGenerate(form.getValues());
    } else {
        // For random, we can just submit empty values and let the AI decide
        handleGenerate({} as GenerateWorkoutInput);
    }
  }


  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerate)}>
              <CardHeader>
                <CardTitle>{t.title}</CardTitle>
                <CardDescription>{t.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField control={form.control} name="goal" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.goal}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="weight loss">Weight Loss</SelectItem>
                            <SelectItem value="muscle gain">Muscle Gain</SelectItem>
                            <SelectItem value="strength">Strength</SelectItem>
                            <SelectItem value="beginner fitness">Beginner Fitness</SelectItem>
                            <SelectItem value="endurance">Endurance</SelectItem>
                        </SelectContent>
                    </Select>
                  </FormItem>
                )}/>
                 <FormField control={form.control} name="workoutType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.workoutType}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Gym">Gym</SelectItem>
                            <SelectItem value="Home">Home</SelectItem>
                            <SelectItem value="Outdoor">Outdoor</SelectItem>
                        </SelectContent>
                    </Select>
                  </FormItem>
                )}/>
                <FormField control={form.control} name="difficulty" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.difficulty}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}/>
                <FormField control={form.control} name="sessionTime" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.sessionTime}</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                )}/>
                <FormField control={form.control} name="focus" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.focus}</FormLabel>
                        <FormControl><Input placeholder="abs, chest, legs..." {...field} /></FormControl>
                    </FormItem>
                )}/>
                <FormField control={form.control} name="equipment" render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.equipment}</FormLabel>
                        <FormControl><Input placeholder="dumbbells, body-weight..." {...field} /></FormControl>
                    </FormItem>
                )}/>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {isLoading ? t.generating : t.generate}
                </Button>
                <div className="grid grid-cols-2 gap-2 w-full">
                    <Button type="button" variant="outline" onClick={() => handlePreset('random')} disabled={isLoading} className="w-full">{t.randomPlan}</Button>
                    <Button type="button" variant="outline" onClick={() => handlePreset('beginner')} disabled={isLoading} className="w-full">{t.beginnerMode}</Button>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      <div className="lg:col-span-8">
        <Card className="min-h-[80vh]">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : !workout ? (
                <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground h-full">
                    <Dumbbell className="h-20 w-20 mb-4" />
                    <p>{t.initialMessage}</p>
                </CardContent>
            ) : (
                <>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl text-primary">{workout.planTitle}</CardTitle>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                        <span>Goal: {workout.goal}</span>
                        <span>Type: {workout.workoutType}</span>
                        <span>Difficulty: {workout.difficulty}</span>
                        <span>Time: {workout.sessionTime}</span>
                        {workout.caloriesEstimate && <span><Flame className="inline h-4 w-4 mr-1"/>{workout.caloriesEstimate}</span>}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-2 flex items-center"><Zap className="mr-2 h-5 w-5 text-primary"/>{t.warmUp}</h3>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {workout.warmUp.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                    <Separator/>
                    <div>
                        <h3 className="text-xl font-semibold mb-2 flex items-center"><Dumbbell className="mr-2 h-5 w-5 text-primary"/>{t.mainWorkout}</h3>
                        <div className="space-y-4">
                            {workout.mainWorkout.map((ex, i) => (
                                <div key={i} className="p-3 bg-muted/50 rounded-lg">
                                    <p className="font-semibold">{ex.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        <Repeat className="inline h-3 w-3 mr-1.5"/>{ex.sets} sets x {ex.reps} reps, {ex.rest} rest
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Separator/>
                    <div>
                        <h3 className="text-xl font-semibold mb-2 flex items-center"><Wind className="mr-2 h-5 w-5 text-primary"/>{t.coolDown}</h3>
                         <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            {workout.coolDown.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                     <Separator/>
                     <div>
                        <h3 className="text-xl font-semibold mb-2">{t.safetyTips}</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{workout.safetyTips}</p>
                    </div>
                </CardContent>
                </>
            )}
        </Card>
      </div>
    </div>
  );
}
