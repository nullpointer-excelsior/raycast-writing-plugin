import { useState } from "react";
import { Form, Detail, ActionPanel, Action, showToast, Clipboard, closeMainWindow } from "@raycast/api";
import { createOpenAIClient } from "./libs/openai-client";
import { correctGrammar } from "./libs/grammar-service";

type Values = {
  textarea: string;
};

export default function Command() {
  const [isLoading, setIsLoading] = useState(false);
  const [correctedText, setCorrectedText] = useState<string | null>(null);

  async function handleSubmit(values: Values) {
    setIsLoading(true);
    try {
      const client = createOpenAIClient();
      const corrected = await correctGrammar(client, values.textarea);
      setCorrectedText(corrected);
    } catch (error) {
      showToast({ title: "Error", message: String(error) });
    } finally {
      setIsLoading(false);
    }
  }

  if (correctedText) {
    return (
      <Detail
        markdown={correctedText}
        actions={
          <ActionPanel>
            <Action
              title="Copy to Clipboard"
              onAction={async () => {
                await Clipboard.copy(correctedText);
                await closeMainWindow();
                showToast({ title: "Copied", message: "Corrected text copied to clipboard" });
              }}
            />
          </ActionPanel>
        }
      />
    );
  }

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="Apply grammar and spelling." />
      <Form.TextArea id="textarea" title="Text" placeholder="Enter text" />
    </Form>
  );
}
