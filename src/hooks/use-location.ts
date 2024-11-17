import { FrameQueue, toProxy } from '@vue-material/core';
import { inject, onMounted, onUnmounted, provide, ref } from 'vue';

type Location = {
  href: string;
  pathname: string;
  search: string;
  hash: string;
  hostname: string;
  host: string;
  port: string;
  protocol: string;
};

export function useLocation(): Location {
  const provided = inject('app-location', undefined);

  if (provided) return provided;

  const loc = ref({
    href: location.href,
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
    hostname: location.hostname,
    host: location.host,
    port: location.port,
    protocol: location.protocol,
  });

  const data = toProxy(loc);

  function update() {
    if (loc.value.href !== location.href) {
      loc.value = {
        href: location.href,
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
        hostname: location.hostname,
        host: location.host,
        port: location.port,
        protocol: location.protocol,
      };
    }
  }

  provide('app-location', data);
  onMounted(() => FrameQueue.add(update));
  onUnmounted(() => FrameQueue.remove(update));

  return data;
}
