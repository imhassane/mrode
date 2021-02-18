<template>
  <div>
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <div class="pb-6">
        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bold() }"
          @click="commands.bold"
        >
          <t-button variant="secondary"><i class="fas fa-bold"></i></t-button>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.italic() }"
          @click="commands.italic"
        >
          <t-button variant="secondary"><i class="fas fa-italic" /></t-button>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.strike() }"
          @click="commands.strike"
        >
          <t-button variant="secondary"><i class="fas fa-strikethrough" /></t-button>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.underline() }"
          @click="commands.underline"
        >
          <t-button variant="secondary"><i class="fas fa-underline" /></t-button>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.code() }"
          @click="commands.code"
        >
          <t-button variant="secondary"><i class="fas fa-code" /></t-button>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.paragraph() }"
          @click="commands.paragraph"
        >
          <t-button variant="secondary"><i class="fas fa-paragraph" /></t-button>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          <t-button variant="secondary">H1</t-button>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          <t-button variant="secondary">H2</t-button>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          <t-button variant="secondary">H3</t-button>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <t-button variant="secondary"><i class="fas fa-list-ul" /></t-button>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <t-button variant="secondary"><i class="fas fa-list-ol" /></t-button>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          <t-button variant="secondary"><i class="fas fa-quote-left" /></t-button>
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': isActive.code_block() }"
          @click="commands.code_block"
        >
          <t-button variant="secondary"><i class="fas fa-code" /></t-button>
        </button>

        <button
          class="menubar__button"
          @click="commands.horizontal_rule"
        >
          <t-button variant="secondary"><i class="fas fa-ruler-horizontal" /></t-button>
        </button>

        <button
          class="menubar__button"
          @click="commands.undo"
        >
          <t-button variant="secondary"><i class="fas fa-undo" /></t-button>
        </button>

        <button
          class="menubar__button"
          @click="commands.redo"
        >
          <t-button variant="secondary"><i class="fas fa-redo" /></t-button>
        </button>

      </div>
    </editor-menu-bar>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions'

export default {
  name: "ax-editor",
  data() {
    const contentChange = this.onContentChange;
    const content = this.initialContent ? this.initialContent : "<p>Entrez la description détaillée du produit</p>";
    return {
      editor: new Editor({
        content,
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({levels: [1, 2, 3]}),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
        ],
        onUpdate({getHTML}) {
          contentChange(getHTML());
        }
      })
    }
  },
  props: ["onContentChange", "initialContent"],
  components: {
    EditorContent,
    EditorMenuBar,
  },
  beforeDestroy() {
    this.editor.destroy();
  }
}
</script>

<style scoped>
.menubar__button {
  background-color: transparent;
  border: 1px solid white;
  border-radius: 2px;
}

.is-active {
  background-color: silver;
  border: 1px solid silver;
  border-radius: 5px;
}
</style>

<style>
.ProseMirror {
  background-color: #f3f3f3 !important;
  padding: 15px;
  border: 1px solid #f3f3f3;
  border-radius: 5px;
  min-height: 300px;
}
</style>
