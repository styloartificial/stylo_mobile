import { View, ScrollView } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { ref, onChildAdded, off, query, orderByChild, equalTo, onValue } from 'firebase/database';
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

type FirebaseLog = {
  id: number;
  title: string;
  description: string;
  created_at: string;
};

export default function Step3({ onNext, onBack }: Step3Props) {
  const { formData } = useScan();
  const ticketId = formData.ticketId;

  const [steps, setSteps] = useState<GenerationStep[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState('0s');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Queue untuk tampilkan log satu-satu dengan delay
  const queueRef = useRef<FirebaseLog[]>([]);
  const isProcessingRef = useRef(false);

  const processQueue = () => {
    if (isProcessingRef.current || queueRef.current.length === 0) return;

    isProcessingRef.current = true;

    const log = queueRef.current.shift()!;

    setSteps(prev => {
      const exists = prev.some(s => s.id === log.id);
      if (exists) {
        isProcessingRef.current = false;
        setTimeout(processQueue, 600);
        return prev;
      }

      const isLast = log.title === 'Successful generation';
      const newStep: GenerationStep = {
        id: log.id,
        title: log.title,
        description: log.description,
        status: 'done',
        timestamp: log.created_at,
      };

      const updated = [...prev, newStep].sort((a, b) => a.id - b.id);

      setTimeout(() => {
        isProcessingRef.current = false;
        processQueue();
      }, 600);

      return updated;
    });
  };

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

  // Stop timer kalau sudah selesai
  useEffect(() => {
    if (isFinished && timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [isFinished]);

  // Stream logs satu-satu pakai onChildAdded
  useEffect(() => {
    if (!ticketId) return;

    const logsRef = ref(database, `tickets/${ticketId}/logs`);

    const unsubscribe = onChildAdded(logsRef, (snapshot) => {
      const log = snapshot.val() as FirebaseLog;
      queueRef.current.push(log);
      processQueue();
    });

    return () => off(logsRef);
  }, [ticketId]);

  // Stream status dari ticket-request
  useEffect(() => {
    if (!ticketId) return;

    const ticketRequestRef = query(
      ref(database, 'ticket-request'),
      orderByChild('ticket_id'),
      equalTo(ticketId)
    );

    const unsubscribe = onValue(ticketRequestRef, (snapshot) => {
      if (!snapshot.exists()) return;

      const raw = snapshot.val();
      const entries = Object.values(raw) as { ticket_id: string; status: string }[];
      const ticket = entries.find(e => e.ticket_id === ticketId);

      if (ticket?.status === 'success' || ticket?.status === 'complete') {
        setIsFinished(true);
      }
    });

    return () => off(ticketRequestRef);
  }, [ticketId]);

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
        <View className="px-6 pt-4 gap-3">
          <GenerationSteps data={steps} />

          <SessionInfo
            sessionId={ticketId}
            totalSteps={8}
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