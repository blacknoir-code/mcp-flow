import { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  NodeTypes,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { NodeCard } from "./NodeCard";
import { NodeData } from "@/data/sampleNodes";
import { useFlowStore } from "@/stores/flowStore";
import { CardDetailsDrawer } from "@/components/card-details/CardDetailsDrawer";

const nodeTypes: NodeTypes = {
  cardNode: NodeCard,
};

export const Canvas = () => {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    addEdge,
    setSelectedNodeId,
    selectedNodeId,
  } = useFlowStore();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes(applyNodeChanges(changes, nodes));
    },
    [nodes, setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges(applyEdgeChanges(changes, edges));
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      addEdge(connection);
    },
    [addEdge]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<NodeData>) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node<NodeData>) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const nodesWithSelection = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      selected: node.id === selectedNodeId,
    }));
  }, [nodes, selectedNodeId]);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodesWithSelection}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        defaultEdgeOptions={{ type: "smoothstep" }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      
      {selectedNodeId && (
        <CardDetailsDrawer
          nodeId={selectedNodeId}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  );
};
