<script setup lang="ts">
  import {
    IconButton,
    ScrollContainer,
    TopAppBar,
    Text,
    rippleEffect,
    keyClick,
    TextInput,
    Fab,
  } from '@vue-material/core';
  import { useAppData } from '../hooks/use-data';
  import { useContext } from '../hooks/use-context';
  import { computed, ref } from 'vue';

  const data = useAppData();
  const context = useContext();

  const search = ref('');

  function addNote() {
    const id = Date.now().toString();

    data.value[id] = {
      title: 'Untitled',
      content: '',
    };

    context.active = id;
  }

  const notes = computed(() =>
    Object.fromEntries(
      Object.entries(data.value)
        .filter(([, note]) =>
          [note.content, note.title]
            .join('')
            .toLowerCase()
            .includes(search.value.toLowerCase())
        )
        .reverse()
    )
  );
</script>

<template>
  <div class="sidebar">
    <ScrollContainer class="sidebar-content">
      <template #header>
        <TopAppBar headline="Notes">
          <template #actions>
            <IconButton icon="mdi:archive-outline" />
            <IconButton icon="mdi:plus" @click="addNote" />
          </template>
        </TopAppBar>
      </template>

      <TextInput
        span
        placeholder="Search notes..."
        v-model="search"
        variant="outlined"
      />
      <div class="notes">
        <div
          :key="id"
          class="note"
          v-for="(note, id) in notes"
          @click="context.active = String(id)"
          :active="context.active === id || undefined"
          @pointerdown="rippleEffect"
          @keydown="keyClick"
          tabindex="0"
        >
          <Text weight="700" as="span">{{ note.title }}</Text>
          <Text lines="3">{{ note.content }}</Text>
        </div>
      </div>
    </ScrollContainer>
    <Fab icon="mdi:plus" @click="addNote" />
  </div>
</template>

<style lang="scss">
  .sidebar {
    height: 100%;
    position: relative;
    contain: layout;
    box-shadow: 0 0 0 1px var(--surface-container-high);

    .sidebar-content {
      position: absolute;
      inset: 0;
    }

    .notes {
      padding-bottom: var(--component-lg);
    }

    .notes:empty::after {
      content: 'No notes, use the + button to add one.';
      padding: var(--xl);
      text-wrap: balance;
      text-align: center;
      display: grid;
      position: absolute;
      inset: 0;
      place-items: center;
      color: var(--outline-variant);
    }

    .note {
      cursor: pointer;
      margin-bottom: var(--xs);
      border-radius: var(--sm);
      padding: var(--sm);
      position: relative;
      overflow: hidden;
      border: 1px solid var(--surface-container);
      background: var(--surface-container-low);
      transition: border-color 0.15s;

      &[active] {
        border-color: var(--primary);
      }
    }
  }
</style>
