import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ApplyConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  preview: any;
}

export const ApplyConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  preview,
}: ApplyConfirmationModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Apply Changes?</AlertDialogTitle>
          <AlertDialogDescription>
            This will update your workflow with the following changes:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-2 text-sm">
            <div>
              <strong>Nodes:</strong> {preview.nodes?.length || 0} (will replace current nodes)
            </div>
            <div>
              <strong>Edges:</strong> {preview.edges?.length || 0} (will replace current edges)
            </div>
            {preview.confidence && (
              <div>
                <strong>Confidence:</strong> {preview.confidence}%
              </div>
            )}
            {preview.suggestions && preview.suggestions.length > 0 && (
              <div>
                <strong>Suggestions:</strong> {preview.suggestions.length} new suggestions
              </div>
            )}
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-blue-600 font-medium">
              View full preview
            </summary>
            <pre className="mt-2 text-xs overflow-auto max-h-60 bg-white p-2 rounded border">
              {JSON.stringify(preview, null, 2)}
            </pre>
          </details>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Apply Changes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

