import { handlePaste } from "./core/HandlePaste"

declare const tinymce: any

const setup = (editor, url) => {
  editor.on("paste", event => {
    handlePaste(event, editor)
  })
}

export default () => {
  tinymce.PluginManager.add("paste-it-cleaned-tiny", setup)
}
