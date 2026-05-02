import { View, ScrollView, Text } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { ref, onChildAdded, off, query, orderByChild, equalTo, onValue } from 'firebase/database';
import { database } from 'helpers/firebaseHelper';
import NextStepButton from 'components/scan/NextStepButton';
import SessionInfo from 'components/scan/SessionInfo';
import CustomHeader from 'components/global/CustomHeader';
import { useScan } from '../ScanContexs';
import { Ionicons } from '@expo/vector-icons';

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}

type Log = {
  id: number;
  title: string;
  description: string;
  created_at: string;
};

export default function Step3({ onNext, onBack }: Step3Props) {
  const { formData } = useScan();
  const ticketId = formData.ticketId;

  const [logs, setLogs] = useState<Log[]>([]);
  const [isFinished, setIsFinished] = useState(false);
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
      const log = snapshot.val() as Log;

      setLogs(prev => {
        const exists = prev.some(l => l.id === log.id);
        if (exists) return prev;
        return [...prev, log].sort((a, b) => a.id - b.id);
      });
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

  const completedSteps = logs.length;
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
          <View className="bg-white rounded-xl p-4 gap-3">
            {logs.length === 0 ? (
              <Text className="text-gray-400 text-sm">Waiting for logs...</Text>
            ) : (
              logs.map((log, index) => (
                <View key={`log-${log.id}-${index}`} className="flex-row items-start gap-3">
                  <View className="mt-0.5">
                    <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-900">{log.title}</Text>
                    <Text className="text-xs text-gray-500 mt-0.5">{log.description}</Text>
                    <Text className="text-xs text-gray-400 mt-0.5">{log.created_at}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

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