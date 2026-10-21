import { useState } from "react";
import { Form, Detail, ActionPanel, Action, showToast, Clipboard, closeMainWindow } from "@raycast/api";
import { createOpenAIClient } from "./libs/openai-client";
import { summarizeText, type SummaryStyle } from "./libs/summarize-service";

type Values = {
  textarea: string;
  summaryStyle: SummaryStyle;
};

const SUMMARY_STYLE_OPTIONS: { label: string; value: SummaryStyle }[] = [
  { label: "One single paragraph", value: "single-paragraph" },
  { label: "General Summary", value: "general" },
  { label: "Bullet points Summary", value: "bullet-points" },
];

export default function Command() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  async function handleSubmit(values: Values) {
    setIsLoading(true);
    try {
      const client = createOpenAIClient();
      const summarized = await summarizeText(client, values.textarea, values.summaryStyle ?? "general");
      setSummary(summarized);
    } catch (error) {
      showToast({ title: "Error", message: String(error) });
    } finally {
      setIsLoading(false);
    }
  }

  if (summary) {
    return (
      <Detail
        markdown={summary}
        actions={
          <ActionPanel>
            <Action
              title="Copy to Clipboard"
              onAction={async () => {
                await Clipboard.copy(summary);
                await closeMainWindow();
                showToast({ title: "Copied", message: "Summary copied to clipboard" });
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
      <Form.Description text="Summarize text." />
      <Form.TextArea id="textarea" title="Text" placeholder="Enter text" />
      <Form.Dropdown id="summaryStyle" title="Summary Style" defaultValue="general">
        {SUMMARY_STYLE_OPTIONS.map((option) => (
          <Form.Dropdown.Item key={option.value} value={option.value} title={option.label} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}
