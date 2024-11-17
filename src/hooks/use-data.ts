import { useIDBStorage } from '@vue-material/core';
import { inject, provide } from 'vue';

export type Note = {
  title: string;
  content: string;
};

export type Notes = Record<string, Note>;

export function useAppData() {
  const provided = inject('app-data', undefined);
  if (provided) return provided;

  const notes = useIDBStorage<Notes>('app-notes', {});

  provide('app-data', notes);
  return notes;
}
