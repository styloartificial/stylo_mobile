import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type StepStatus = 'pending' | 'done' | 'ready' | 'error';

export type GenerationStep = {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
  timestamp?: string;
};

interface GenerationStepsProps {
  title?: string;
  subtitle?: string;
  data: GenerationStep[];
}

const GenerationSteps: React.FC<GenerationStepsProps> = ({
  title = 'Generation steps',
  subtitle = 'From your input to shoppable outfit results.',
  data,
}) => {
  const getStatusBadge = (status: StepStatus) => {
    switch (status) {
      case 'done':
        return (
          <View className="bg-purple-100 px-3 py-1 rounded-full">
            <Text className="text-purple-700 text-xs font-semibold">Done</Text>
          </View>
        );
      case 'ready':
        return (
          <View className="bg-purple-500 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-semibold">Ready</Text>
          </View>
        );
      case 'pending':
        return (
          <View className="bg-gray-100 px-3 py-1 rounded-full">
            <Text className="text-gray-500 text-xs font-semibold">Pending</Text>
          </View>
        );
      case 'error':
        return (
          <View className="bg-red-100 px-3 py-1 rounded-full">
            <Text className="text-red-700 text-xs font-semibold">Error</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const getStatusIcon = (status: StepStatus) => {
    switch (status) {
      case 'done':
        return <Ionicons name="checkmark-circle" size={20} color="#8F42DE" />;
      case 'ready':
        return <Ionicons name="checkmark-circle" size={20} color="#8F42DE" />;
      case 'pending':
        return <Ionicons name="ellipse-outline" size={20} color="#9ca3af" />;
      case 'error':
        return <Ionicons name="close-circle" size={20} color="#ef4444" />;
      default:
        return <Ionicons name="ellipse-outline" size={20} color="#9ca3af" />;
    }
  };

  // Count steps
  const totalSteps = data.length;
  const completedSteps = data.filter(step => step.status === 'done').length;

  return (
    <View className="bg-white rounded-lg p-4 ">

        <Text className="text-xl font-semibold text-gray-900 mb-1">
          {title}
        </Text>
        <Text className="text-sm text-gray-600 mb-2">
          {subtitle}
        </Text>
        <View className="flex-row items-center gap-2 mt-2 mb-3">
          <Ionicons name="list-outline" size={14} color="#6b7280" />
          <Text className="text-xs text-gray-500">
            {completedSteps} of {totalSteps} steps
          </Text>
        </View>

      

      {/* Steps List */}
      <ScrollView className="max-h-124">
        {data.map((step, index) => (
          <View 
            key={step.id}
            className={`flex-row gap-3 ${index !== data.length - 1 ? 'mb-4' : ''}`}
          >
        
            <View className="mt-0.5">
              {getStatusIcon(step.status)}
            </View>

            <View className="flex-1">
              <View className="flex-row items-start justify-between mb-1">
                <Text className="text-sm font-semibold text-gray-900 flex-1">
                  {step.title}
                </Text>
                {getStatusBadge(step.status)}
              </View>
              
              <Text className="text-sm text-gray-600 mb-1">
                {step.description}
              </Text>
              
              {step.timestamp && (
                <Text className="text-xs text-gray-400">
                  {step.timestamp}
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default GenerationSteps;