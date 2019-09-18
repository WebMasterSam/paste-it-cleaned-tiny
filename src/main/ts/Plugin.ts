import { handlePaste } from "./core/HandlePaste"

declare const tinymce: any

const setup = (editor, url) => {
  /*editor.ui.registry.addButton("paste-it-cleaned-tiny", {
    text: "paste-it-cleaned-tiny button",
    onAction: () => {
      // tslint:disable-next-line:no-console
      editor.setContent("<p>content added from paste-it-cleaned-tiny</p>")
    }
  })*/

  editor.on("paste", event => {
    handlePaste(event, editor)
  })
}

export default () => {
  tinymce.PluginManager.add("paste-it-cleaned-tiny", setup)
}
