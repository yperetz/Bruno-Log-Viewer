import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';
import { prettifyBody } from '@/utils/jsonPrettifier';

export function BodyViewer({
  body,
  emptyMessage = 'No body',
}: {
  body: unknown;
  emptyMessage?: string;
}) {
  const str = body === undefined || body === null ? '' : prettifyBody(body);

  if (str === '') {
    return (
      <div className="text-gray-500 text-sm py-4">{emptyMessage}</div>
    );
  }

  const highlightedHtml = Prism.languages.json
    ? Prism.highlight(str, Prism.languages.json, 'json')
    : null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(str);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
      >
        Copy
      </button>
      <pre className="block p-4 pr-16 overflow-x-auto overflow-y-auto max-h-96 font-mono text-sm bg-gray-900 text-gray-100 rounded">
        {highlightedHtml ? (
          <code
            className="language-json"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <code className="language-json">{str}</code>
        )}
      </pre>
    </div>
  );
}
