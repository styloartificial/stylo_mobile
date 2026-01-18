import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SessionStatus = 'pending' | 'processing' | 'completed' | 'error';

interface InfoItem {
  label: string;
  value: string;
}

interface SessionInfoProps {
  sessionId: string;
  totalSteps: number;
  completedSteps?: number;
  elapsedTime: string;
  status?: SessionStatus;
  successMessage?: string;
  errorMessage?: string;
  infoItems?: InfoItem[];
}

const SessionInfo: React.FC<SessionInfoProps> = ({
  sessionId,
  totalSteps,
  completedSteps = 0,
  elapsedTime,
  status = 'processing',
  successMessage = 'Generation successful — ready to view outfits',
  errorMessage = 'Generation failed. Please try again.',
  infoItems = [],
}) => {
  
  const InfoRow = ({ label, value }: InfoItem) => (
    <View className="flex-row justify-between items-center mb-3">
      <Text className="text-sm text-gray-600">{label}</Text>
      <Text className="text-sm font-semibold text-gray-900">{value}</Text>
    </View>
  );

  const formatSteps = () => {
    if (completedSteps === totalSteps) {
      return `${totalSteps} completed`;
    }
    return `${completedSteps} of ${totalSteps}`;
  };

  const renderStatusBadge = () => {
    switch (status) {
      case 'completed':
        return (
          <View className="bg-purple-100 rounded-lg px-3 py-2.5 flex-row items-center gap-2">
            <Ionicons name="checkmark-circle" size={18} color="#8F42DE" />
            <Text className="text-sm text-purple-700 flex-1">
              {successMessage}
            </Text>
          </View>
        );
      
      case 'error':
        return (
          <View className="bg-red-50 rounded-lg px-3 py-2.5 flex-row items-center gap-2">
            <Ionicons name="close-circle" size={18} color="#ef4444" />
            <Text className="text-sm text-red-700 flex-1">
              {errorMessage}
            </Text>
          </View>
        );
      
      case 'processing':
        return (
          <View className="bg-blue-50 rounded-lg px-3 py-2.5 flex-row items-center gap-2">
            <Ionicons name="time-outline" size={18} color="#3b82f6" />
            <Text className="text-sm text-blue-700 flex-1">
              Processing your request...
            </Text>
          </View>
        );
      
      default:
        return null;
    }
  };

  const defaultInfoItems: InfoItem[] = [
    { label: 'Session ID', value: sessionId },
    { label: 'Total steps', value: formatSteps() },
    { label: 'Elapsed time', value: elapsedTime },
  ];

  const allInfoItems = [...defaultInfoItems, ...infoItems];

  return (
    <View className="bg-white rounded-2xl p-4">

      {allInfoItems.map((item, index) => (
        <InfoRow key={index} label={item.label} value={item.value} />
      ))}

      {renderStatusBadge()}
    </View>
  );
};

export default SessionInfo;