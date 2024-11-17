<script lang="ts" setup>
  import { useAppData } from '../hooks/use-data';
  import { useContext } from '../hooks/use-context';
  import {
    IconButton,
    MODAL,
    ScrollContainer,
    TopAppBar,
    useModal,
    useToast,
  } from '@vue-material/core';
  import { computed, ref, watch } from 'vue';

  const appData = useAppData();
  const context = useContext();
  const toast = useToast();
  const modal = useModal();

  const tAreaRef = ref<HTMLTextAreaElement>();

  const note = computed(() =>
    context.active ? appData.value[context.active] : undefined
  );

  function updateHeight() {
    if (!tAreaRef.value) {
      note.value && setTimeout(updateHeight, 100);
      return;
    }

    const textArea = tAreaRef.value;
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 40 + 'px';
  }

  function deleteNote() {
    if (!note.value) return;
    const title = note.value.title;

    modal.open('delete-note', {
      icon: 'mdi:delete-outline',
      title: 'Delete "' + title + '"?',
      width: 400,
      content:
        'Are you sure you want to delete this note? ' +
        'This action cannot be undone.',

      actions: MODAL.PRESET_ACTION_CONFIRM(({ close }) => {
        if (!context.active) return;

        delete appData.value[context.active];
        context.active = undefined;

        close();

        toast.open({
          message: 'Deleted "' + title + '"',
        });
      }),
    });
  }

  const headline = computed(() => {
    if (!note.value) return '';

    const long = note.value.title.length > 20;
    return long ? note.value.title.slice(0, 20) + '...' : note.value.title;
  });

  watch(() => note.value?.content, updateHeight, {
    immediate: true,
    flush: 'post',
  });
</script>

<template>
  <ScrollContainer class="content" :shown="Boolean(note) || undefined">
    <template #header>
      <TopAppBar :headline v-if="note">
        <IconButton
          icon="mdi:arrow-left"
          @click="context.active = undefined"
        />

        <template #content>
          <input
            v-if="note"
            v-model="note.title"
            placeholder="Note title..."
          />
        </template>

        <template #actions>
          <IconButton icon="mdi:trash-outline" @click="deleteNote" />
        </template>
      </TopAppBar>
    </template>

    <div class="note-preview" v-if="note">
      <textarea
        placeholder="What's on your mind?"
        v-model="note.content"
        @change="updateHeight"
        ref="tAreaRef"
      />
    </div>

    <div v-else class="no-active">
      <h1>No note selected</h1>
    </div>
  </ScrollContainer>
</template>

<style lang="scss">
  .content {
    transition: left 0.2s var(--timing-standard);

    input {
      width: 100%;
      max-width: 100%;
      border: none;
      font: inherit;
      color: var(--on-surface-variant);
      font-size: var(--component-xs);
      background: none;
      outline: none;
    }
    textarea {
      width: 100%;
      border: none;
      resize: none;
      font: inherit;
      color: var(--on-surface-variant);
      background: none;
      outline: none;
    }

    .no-active {
      inset: 0;
      display: grid;
      position: absolute;
      place-items: center;
      color: var(--outline-variant);
      height: 100%;
    }

    input:focus,
    textarea:focus {
      color: var(--on-surface);
    }
  }
</style>
