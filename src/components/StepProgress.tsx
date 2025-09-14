import React from 'react';
import { Check, Upload, FileText, MessageSquare } from 'lucide-react';

export interface Step {
  id: number;
  title: string;
  icon: React.ReactNode;
  status: 'pending' | 'current' | 'completed';
}

interface StepProgressProps {
  currentStep: number;
}

export function StepProgress({ currentStep }: StepProgressProps) {
  const steps: Step[] = [
    {
      id: 1,
      title: 'Upload concluído',
      icon: <Upload className="h-5 w-5" />,
      status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'pending'
    },
    {
      id: 2,
      title: 'Transcrição feita',
      icon: <FileText className="h-5 w-5" />,
      status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'pending'
    },
    {
      id: 3,
      title: 'Preparado para o Prompt',
      icon: <MessageSquare className="h-5 w-5" />,
      status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'pending'
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center space-y-2">
              <div
                className={`
                  flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                  ${step.status === 'completed' 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : step.status === 'current'
                    ? 'border-primary text-primary bg-primary/10 animate-pulse'
                    : 'border-muted-foreground/30 text-muted-foreground bg-background'
                  }
                `}
              >
                {step.status === 'completed' ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </div>
              <div className="text-center max-w-[120px]">
                <p className={`text-sm font-medium ${
                  step.status === 'current' ? 'text-primary' : 
                  step.status === 'completed' ? 'text-foreground' : 
                  'text-muted-foreground'
                }`}>
                  {step.title}
                </p>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div
                  className={`h-0.5 transition-all duration-500 ${
                    steps[index + 1].status === 'completed' || steps[index + 1].status === 'current'
                      ? 'bg-primary'
                      : 'bg-muted-foreground/30'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}