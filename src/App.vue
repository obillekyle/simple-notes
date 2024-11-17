<script setup lang="ts">
  import { Layout, OverlayProvider } from '@vue-material/core';
  import { useAppData } from './hooks/use-data';
  import { useContext } from './hooks/use-context';

  import Sidebar from './panel/sidebar.vue';
  import Content from './panel/content.vue';

  // for initialization
  useAppData();
  useContext();
</script>

<template>
  <Layout>
    <OverlayProvider>
      <div class="app">
        <Sidebar />
        <Content />
      </div>
    </OverlayProvider>
  </Layout>
</template>

<style lang="scss">
  .app {
    display: grid;
    inset: 0 0 0 0;
    position: fixed;
    grid-template-columns: minmax(0, 400px) 1fr;

    @media (width <= 768px) {
      grid-template-columns: 1fr;

      .content {
        inset: 0 0 0 0;
        left: 100%;
        z-index: 1000;
        position: fixed;
        background: var(--surface);
      }

      .content[shown] {
        left: 0;
      }
    }
  }

  * {
    scrollbar-width: none;
  }
</style>
