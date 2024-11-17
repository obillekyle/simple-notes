import { toProxy } from '@vue-material/core';
import { inject, provide, ref } from 'vue';

type AppSession = {
  active?: string;
};

export function useContext(): AppSession {
  const provided = inject('app-context', undefined);

  if (provided) return provided;

  const context = toProxy(ref<AppSession>({}));

  provide('app-context', context);
  return context;
}
