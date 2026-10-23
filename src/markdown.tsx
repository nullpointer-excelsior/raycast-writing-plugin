import { useState } from "react";
import { Form, Detail, ActionPanel, Action, showToast, Clipboard, closeMainWindow } from "@raycast/api";
import { createOpenAIClient } from "./libs/openai-client";
import { convertToMarkdown } from "./libs/markdown-service";

type Values = {
  textarea: string;
};

export default function Command() {
  const [isLoading, setIsLoading] = useState(false);
  const [markdown, setMarkdown] = useState<string | null>(null);

  async function handleSubmit(values: Values) {
    setIsLoading(true);
    try {
      const client = createOpenAIClient();
      const converted = await convertToMarkdown(client, values.textarea);
      setMarkdown(converted);
    } catch (error) {
      showToast({ title: "Error", message: String(error) });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <Detail isLoading navigationTitle="Converting" markdown="" />;
  }

  if (markdown) {
    return (
      <Detail
        markdown={markdown}
        actions={
          <ActionPanel>
            <Action
              title="Copy to Clipboard"
              onAction={async () => {
                await Clipboard.copy(markdown);
                await closeMainWindow();
                showToast({ title: "Copied", message: "Markdown copied to clipboard" });
              }}
            />
          </ActionPanel>
        }
      />
    );
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="Convert text into Markdown with titles, emojis, lists and tables." />
      <Form.TextArea id="textarea" title="Text" placeholder="Enter text" />
    </Form>
  );
}
