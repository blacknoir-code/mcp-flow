import { useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFlowStore } from "@/stores/flowStore";
import { createSampleNodes, createSampleEdges } from "@/data/sampleNodes";
import { v4 as uuidv4 } from "uuid";

export const TopBar = () => {
  const [intent, setIntent] = useState("");
  const { setNodes, setEdges, setTaskSpec, saveHistory } = useFlowStore();

  const handleGenerate = () => {
    if (!intent.trim()) return;

    const nodes = createSampleNodes(intent).map((node) => ({
      ...node,
      id: uuidv4(),
    }));
    const nodeIds = nodes.map((n) => n.id);
    const edges = createSampleEdges(nodeIds).map((edge) => ({
      ...edge,
      id: uuidv4(),
    }));

    setNodes(nodes);
    setEdges(edges);
    setTaskSpec(intent);
    saveHistory();
  };

  return (
    <div className="h-16 border-b border-gray-200 bg-white flex items-center px-6">
      <div className="flex-1 flex items-center gap-4">
        <SparklesIcon className="w-5 h-5 text-blue-600" />
        <Input
          placeholder="What do you want to automate?"
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleGenerate();
            }
          }}
          className="flex-1 max-w-2xl"
        />
        <Button onClick={handleGenerate} disabled={!intent.trim()}>
          Generate Workflow
        </Button>
      </div>
    </div>
  );
};

