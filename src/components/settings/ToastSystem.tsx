import { useToast } from "@/hooks/use-toast";

export const useToastSystem = () => {
  const { toast } = useToast();

  return {
    showSuccess: (message: string) => {
      toast({
        title: "Success",
        description: message,
      });
    },
    showError: (message: string) => {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
    showInfo: (message: string) => {
      toast({
        title: "Info",
        description: message,
      });
    },
  };
};

