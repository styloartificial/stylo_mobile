import { View, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import GenerationSteps, { GenerationStep,} from '../../../../components/scan/GenerationSteps';
import NextStepButton from '../../../../components/scan/NextStepButton';
import SessionInfo from '../../../../components/scan/SessionInfo';
import CustomHeader from 'components/global/CustomHeader';

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}

const INITIAL_STEPS: GenerationStep[] = [
  {
    id: 1,
    title: 'Creating a prompt',
    description: 'Merged your occasion, style tags, and preferences into an AI prompt.',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Submitting the prompt',
    description: 'Sent the formatted prompt securely to the AI model.',
    status: 'pending',
  },
  {
    id: 3,
    title: 'Getting result from prompt',
    description: 'Received outfit layout, colors, and item breakdown.',
    status: 'pending',
  },
  {
    id: 4,
    title: 'Getting data for scraping',
    description: 'Converted outfit items into product search keywords.',
    status: 'pending',
  },
  {
    id: 5,
    title: 'Registering data in scrap queue',
    description: 'Queued product searches with partnered sellers.',
    status: 'pending',
  },
  {
    id: 6,
    title: 'Getting the scrap result',
    description: 'Matched items with real products, prices, and ratings.',
    status: 'pending',
  },
  {
    id: 7,
    title: 'Successful generation',
    description: 'Your outfit and shoppable items are ready.',
    status: 'pending',
  },
];

const generateSessionId = () => {
  return `GEN-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()}`;
};

export default function Step3({ onNext, onBack }: Step3Props) {
  const [steps, setSteps] = useState<GenerationStep[]>(INITIAL_STEPS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionId] = useState(generateSessionId());
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState('0s');

  useEffect(() => {
    if (currentIndex >= steps.length) return;

    const timer = setTimeout(() => {
      setSteps(prev =>
        prev.map((step, index) =>
          index === currentIndex
            ? {
                ...step,
                status: index === steps.length - 1 ? 'ready' : 'done',
                timestamp: 'Just now',
              }
            : step,
        ),
      );

      setCurrentIndex(prev => prev + 1);
    }, 600);

    return () => clearTimeout(timer);
  }, [currentIndex, steps.length]);

  const completedSteps = steps.filter(
    step => step.status === 'done' || step.status === 'ready',
  ).length;

  const isFinished = steps.every(
    step => step.status === 'done' || step.status === 'ready',
  );

  const sessionStatus: 'processing' | 'completed' =
    isFinished ? 'completed' : 'processing';

  return (
    <View className="flex-1 bg-gray-100">
      <CustomHeader
          title="Scan Generate Logs"
          subtitle="Track each step while Stylo AI builds Your Looks."
          showBackButton
          onBackPress={onBack}
        />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-6 pt-2 gap-4">
          <GenerationSteps data={steps.slice(0, currentIndex + 1)} />

          <SessionInfo
            sessionId={sessionId}
            totalSteps={steps.length}
            completedSteps={completedSteps}
            elapsedTime={elapsedTime}
            status={sessionStatus}
          />
        </View>
      </ScrollView>

      <NextStepButton
        promptText={
          isFinished
            ? 'Stylo AI has finished processing this request.'
            : 'Generating outfit recommendations…'
        }
        buttonText={isFinished ? 'View outfits' : 'Please wait'}
        buttonIcon="sparkles"
        onPress={onNext}
        disabled={!isFinished}
      />
    </View>
  );
}
