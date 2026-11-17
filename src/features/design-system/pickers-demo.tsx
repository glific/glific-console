import { useState } from "react";
import { AsyncSearchSelect } from "@/components/async-search-select";
import { DatePicker } from "@/components/date-picker";
import { TimePicker } from "@/components/time-picker";
import { Combobox } from "@/components/ui/combobox";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { SearchInput } from "@/components/ui/search-input";

const demoFlows = ["Registration", "Daily quiz", "Feedback survey", "Help desk", "Opt-in"].map((label, index) => ({
  value: String(index + 1),
  label,
}));

async function searchDemoFlows(text: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return demoFlows.filter((flow) => flow.label.toLowerCase().includes(text.toLowerCase()));
}

export function PickersDemo() {
  const [language, setLanguage] = useState<string | null>("hi");
  const [groups, setGroups] = useState<string[]>(["batch-a"]);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("09:30");
  const [flow, setFlow] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  return (
    <div className="grid w-full max-w-2xl gap-stack sm:grid-cols-2">
      <Combobox
        aria-label="Language"
        options={[
          { value: "en", label: "English" },
          { value: "hi", label: "Hindi" },
          { value: "mr", label: "Marathi" },
          { value: "ta", label: "Tamil" },
        ]}
        value={language}
        onValueChange={setLanguage}
      />
      <Combobox
        multiple
        aria-label="Collections"
        placeholder="Add to collections"
        options={[
          { value: "batch-a", label: "Batch A", group: "Students" },
          { value: "batch-b", label: "Batch B", group: "Students" },
          { value: "volunteers", label: "Volunteers", group: "Staff" },
        ]}
        value={groups}
        onValueChange={setGroups}
      />
      <DatePicker aria-label="Send on" value={date} onValueChange={setDate} fromDate={new Date()} />
      <TimePicker aria-label="Send at" value={time} onValueChange={setTime} />
      <AsyncSearchSelect
        aria-label="Flow"
        placeholder="Search flows on the server"
        queryKey={["design-system", "flows"]}
        search={searchDemoFlows}
        value={flow}
        onValueChange={setFlow}
      />
      <SearchInput value={search} onValueChange={setSearch} placeholder="Search flows" />
      <div className="sm:col-span-2">
        <FileDropzone onFiles={() => {}} accept=".csv" hint="Contacts CSV, up to 5 MB" />
      </div>
    </div>
  );
}
