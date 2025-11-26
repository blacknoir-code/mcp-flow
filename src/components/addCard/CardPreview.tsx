import { useMemo } from "react";
import { Card } from "@/data/mockCards";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useAddCardStore } from "@/stores/addCardStore";
import { insertCardIntoCanvas } from "@/utils/canvasHelpers";
import { Prism as SyntaxHighlighter } from "prism-react-renderer";
import { clsx } from "clsx";

export const CardPreview = () => {
  const selectedCard = useAddCardStore((state) => state.selectedCard);

  if (!selectedCard) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Select a card to preview
      </div>
    );
  }

  const handleInsert = () => {
    insertCardIntoCanvas(selectedCard);
    useAddCardStore.getState().close();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "action":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "query":
        return "bg-green-100 text-green-700 border-green-200";
      case "transform":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "logic":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 border-b p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">{selectedCard.name}</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600">{selectedCard.app}</span>
              <span className="text-gray-300">•</span>
              <span className="text-sm text-gray-600 capitalize">
                {selectedCard.category}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  "px-2 py-1 text-xs font-medium rounded border",
                  getTypeColor(selectedCard.type)
                )}
              >
                {selectedCard.type}
              </span>
              {selectedCard.complexity === "advanced" && (
                <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-700 border border-red-200">
                  Advanced
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-700">{selectedCard.description}</p>

        {selectedCard.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedCard.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Button
          onClick={handleInsert}
          className="w-full"
          size="sm"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Insert Card
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <h4 className="font-medium text-sm mb-2 text-gray-900">
            Input Schema
          </h4>
          <div className="bg-gray-50 rounded-lg p-3 overflow-x-auto">
            <SyntaxHighlighter
              language="json"
              code={JSON.stringify(selectedCard.inputSchema, null, 2)}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={style}>
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </SyntaxHighlighter>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2 text-gray-900">
            Output Schema
          </h4>
          <div className="bg-gray-50 rounded-lg p-3 overflow-x-auto">
            <SyntaxHighlighter
              language="json"
              code={JSON.stringify(selectedCard.outputSchema, null, 2)}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={style}>
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </SyntaxHighlighter>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2 text-gray-900">Example</h4>
          <div className="space-y-2">
            <div>
              <p className="text-xs text-gray-600 mb-1">Request:</p>
              <div className="bg-gray-50 rounded-lg p-3 overflow-x-auto">
                <SyntaxHighlighter
                  language="json"
                  code={JSON.stringify(selectedCard.examples.request, null, 2)}
                >
                  {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={className} style={style}>
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </SyntaxHighlighter>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Response:</p>
              <div className="bg-gray-50 rounded-lg p-3 overflow-x-auto">
                <SyntaxHighlighter
                  language="json"
                  code={JSON.stringify(selectedCard.examples.response, null, 2)}
                >
                  {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className={className} style={style}>
                      {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </div>
                      ))}
                    </pre>
                  )}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

