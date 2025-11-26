import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useRegenerateStore } from "@/stores/regenerateStore";
import { RegenerateWithAIDrawer } from "./regenerate/RegenerateWithAIDrawer";
import { useFlowStore } from "@/stores/flowStore";

export const RegenerateAIButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { openDrawer, closeDrawer, setIntentDraft } = useRegenerateStore();
  const { nodes } = useFlowStore();

  const handleClick = () => {
    // Initialize with current workflow intent if available
    const currentIntent = nodes.length > 0 
      ? "Update workflow with AI assistance"
      : "Create a new workflow";
    setIntentDraft(currentIntent);
    openDrawer();
    setIsOpen(true);
  };

  const handleClose = () => {
    closeDrawer();
    setIsOpen(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={handleClick}
        title="Modify with AI"
      >
        <Wand2 className="h-4 w-4" />
      </Button>
      {isOpen && <RegenerateWithAIDrawer onClose={handleClose} />}
    </>
  );
};

