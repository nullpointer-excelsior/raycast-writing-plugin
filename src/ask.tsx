import { useState } from "react";
import { Form, Detail, ActionPanel, Action, showToast, Clipboard, closeMainWindow } from "@raycast/api";
import { createOpenAIClient } from "./libs/openai-client";
import { askAboutText } from "./libs/ask-service";

type Values = {
  question: string;
  textarea: string;
};

export default function Command() {
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  async function handleSubmit(values: Values) {
    setIsLoading(true);
    try {
      const client = createOpenAIClient();
      const result = await askAboutText(client, values.question, values.textarea);
      setAnswer(result);
    } catch (error) {
      showToast({ title: "Error", message: String(error) });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <Detail isLoading navigationTitle="Answering" markdown="" />;
  }

  if (answer) {
    return (
      <Detail
        markdown={answer}
        actions={
          <ActionPanel>
            <Action
              title="Copy to Clipboard"
              onAction={async () => {
                await Clipboard.copy(answer);
                await closeMainWindow();
                showToast({ title: "Copied", message: "Answer copied to clipboard" });
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
      <Form.Description text="Ask a question about the text." />
      <Form.TextField id="question" title="Question" placeholder="What do you want to know?" />
      <Form.TextArea id="textarea" title="Text" placeholder="Enter text" />
    </Form>
  );
}
