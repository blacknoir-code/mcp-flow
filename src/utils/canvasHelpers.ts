import { Node } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { NodeData } from "@/data/sampleNodes";
import { Card } from "@/data/mockCards";
import { useFlowStore } from "@/stores/flowStore";

/**
 * Insert a card into the React Flow canvas at the center of the viewport
 */
export function insertCardIntoCanvas(card: Card, position?: { x: number; y: number }) {
  const { addNode, nodes } = useFlowStore.getState();

  // If position is provided, use it; otherwise calculate center
  let nodePosition = position;
  if (!nodePosition) {
    // Default position: offset from last node or center
    const lastNode = nodes[nodes.length - 1];
    if (lastNode) {
      nodePosition = {
        x: lastNode.position.x + 300,
        y: lastNode.position.y,
      };
    } else {
      nodePosition = { x: 0, y: 0 };
    }
  }

  const newNode: Node<NodeData> = {
    id: uuidv4(),
    type: "cardNode",
    position: nodePosition,
    data: {
      title: card.name,
      app: card.app,
      functionName: card.id,
      params: extractDefaultParams(card.inputSchema),
      status: "idle",
    },
  };

  addNode(newNode);
  return newNode;
}

/**
 * Insert a card at a specific screen coordinate (for drag and drop)
 */
export function insertCardAtScreenPosition(
  card: Card,
  screenX: number,
  screenY: number,
  reactFlowInstance: any
) {
  if (!reactFlowInstance || !reactFlowInstance.screenToFlowPosition) {
    // Fallback to center insertion
    return insertCardIntoCanvas(card);
  }

  // Convert screen coordinates to flow coordinates
  const position = reactFlowInstance.screenToFlowPosition({
    x: screenX,
    y: screenY,
  });

  return insertCardIntoCanvas(card, position);
}

/**
 * Extract default parameters from input schema
 */
function extractDefaultParams(inputSchema: any): Record<string, any> {
  const params: Record<string, any> = {};

  if (inputSchema?.properties) {
    Object.keys(inputSchema.properties).forEach((key) => {
      const prop = inputSchema.properties[key];
      if (prop.default !== undefined) {
        params[key] = prop.default;
      }
    });
  }

  return params;
}

