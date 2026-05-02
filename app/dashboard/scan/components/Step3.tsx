import { View, ScrollView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from 'helpers/firebaseHelper';
import GenerationSteps, { GenerationStep } from 'components/scan/GenerationSteps';
import NextStepButton from 'components/scan/NextStepButton';
import SessionInfo from 'components/scan/SessionInfo';
import CustomHeader from 'components/global/CustomHeader';
import { useScan } from '../ScanContexs';

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}

// Map title dari Firebase ke id step
const TITLE_TO_STEP_ID: Record<string, number> = {
  'Registering data in ticket queue': 1,
  'Creating a prompt':                2,
  'Submitting the prompt':            3,
  'Getting result from prompt':       4,
  'Getting data for scraping':        5,
  'Registering data in scrap queue':  6,
  'Getting the scrap result':         7,
  'Successful generation':            8,
};

const INITIAL_STEPS: GenerationStep[] = [
  { id: 1, title: 'Registering data in ticket queue', description: 'Storing the initial request data into the ticket queue for processing.', status: 'pending' },
  { id: 2, title: 'Creating a prompt',                description: 'Generating an AI prompt based on the submitted data.',                  status: 'pending' },
  { id: 3, title: 'Submitting the prompt',            description: 'Sending the generated prompt to the AI service for processing.',        status: 'pending' },
  { id: 4, title: 'Getting result from prompt',       description: 'Receiving and parsing the AI-generated response.',                      status: 'pending' },
  { id: 5, title: 'Getting data for scraping',        description: 'Preparing and collecting the required data for the scraping process.',  status: 'pending' },
  { id: 6, title: 'Registering data in scrap queue',  description: 'Adding scraping tasks to the scraping queue for execution.',            status: 'pending' },
  { id: 7, title: 'Getting the scrap result',         description: 'Retrieving and processing the scraping results.',                       status: 'pending' },
  { id: 8, title: 'Successful generation',            description: 'Finalizing the process and confirming successful output generation.',   status: 'pending' },
];

const generateSessionId = () =>
  `GEN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

export default function Step3({ onNext, onBack }: Step3Props) {
  const { formData } = useScan();
  const ticketId = formData.ticketId;

  const [steps, setSteps] = useState<GenerationStep[]>(INITIAL_STEPS);
  const [sessionId] = useState(generateSessionId());
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState('0s');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer elapsed
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const seconds = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(`${seconds}s`);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime]);

  // Firebase listener
  useEffect(() => {
    if (!ticketId) return;

    const logsRef = ref(database, `tickets/${ticketId}/logs`);

    const unsubscribe = onValue(logsRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const logsData = snapshot.val();
      const logs: { title: string }[] = Object.values(logsData);

      setSteps(prev =>
        prev.map(step => {
          const isLogged = logs.some(log => log.title === step.title);
          if (!isLogged) return step;
          return {
            ...step,
            status: step.title === 'Successful generation' ? 'ready' : 'done',
            timestamp: 'Just now',
          };
        })
      );
    });

    return () => off(logsRef);
  }, [ticketId]);

  // Stop timer kalau sudah selesai
  const isFinished = steps.every(s => s.status === 'done' || s.status === 'ready');
  useEffect(() => {
    if (isFinished && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [isFinished]);

  const completedSteps = steps.filter(s => s.status === 'done' || s.status === 'ready').length;
  const sessionStatus: 'processing' | 'completed' = isFinished ? 'completed' : 'processing';

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
          <GenerationSteps data={steps.filter((s, index) => {
            const firstPendingIndex = steps.findIndex(s => s.status === 'pending');
            return s.status !== 'pending' || index === firstPendingIndex;
          })} />
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
        promptText={isFinished ? 'Stylo AI has finished processing this request.' : 'Generating outfit recommendations…'}
        buttonText={isFinished ? 'View outfits' : 'Please wait'}
        buttonIcon="sparkles"
        onPress={onNext}
        disabled={!isFinished}
      />
    </View>
  );
}