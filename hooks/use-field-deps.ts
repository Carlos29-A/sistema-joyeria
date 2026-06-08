import type { UseFormReturn } from "react-hook-form";
import { useEffect } from "react";

export function useFieldDependencies(
  form: UseFormReturn<Record<string, unknown>>,
  deps: Record<string, string[]>
) {
  const watched = form.watch();

  useEffect(() => {
    for (const [field, triggers] of Object.entries(deps)) {
      const triggerValue = watched[triggers[0]];
      if (!triggerValue || !triggers.includes(triggerValue as string)) {
        form.setValue(field, null);
      }
    }
  }, [deps, form, watched]);
}
