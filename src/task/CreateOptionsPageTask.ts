import MenuItemsDAO from "../dao/MenuItemsDAO"
import MenuCategory, { MenuCategoryType } from "../menu/MenuCategory"
import MenuItem, { MenuItemType } from "../menu/MenuItem"
import { browser } from "webextension-polyfill-ts"
import CreateMenuTask from "./CreateMenuTask"

export default class CreateOptionsPageTask {
  async run() {
    const menuCategories = await MenuItemsDAO.getInstance().getCategories()
    const menuItems = await MenuItemsDAO.getInstance().getItems()

    const content = document.getElementById("content")
    const menuCategoriesJson = JSON.stringify(menuCategories, undefined, 2)
    const menuItemsJson = JSON.stringify(menuItems, undefined, 2)

    const categoryId = "example-unique-category-id"
    const categoriesPlaceholderText = JSON.stringify(
      new MenuCategory(
        categoryId,
        MenuCategoryType.CATEGORY,
        "Example Parent Menu"
      ),
      undefined,
      2
    )
    const categoriesJsonEditor = this.createJsonEditor(
      "menuCategories",
      categoriesPlaceholderText,
      menuCategoriesJson
    )
    content.appendChild(categoriesJsonEditor)
    content.appendChild(this.createButtonGroup("menuCategories"))
    content.appendChild(document.createElement("br"))

    const itemsPlaceholderText = JSON.stringify(
      new MenuItem(
        "example-unique-id",
        MenuItemType.SEARCH,
        "Example Menu Title: %s",
        categoryId,
        "https://duckduckgo.com/?q=%s"
      ),
      undefined,
      2
    )
    const itemsJsonEditor = this.createJsonEditor(
      "menuItems",
      itemsPlaceholderText,
      menuItemsJson
    )

    content.appendChild(itemsJsonEditor)
    content.appendChild(this.createButtonGroup("menuItems"))
    content.appendChild(document.createElement("br"))
  }

  createJsonEditor(
    key: string,
    placeholder: string,
    value?: string
  ): HTMLTextAreaElement {
    const textArea = document.createElement("textarea")
    textArea.id = `${key}-editor`
    textArea.placeholder = placeholder
    textArea.value = value
    return textArea
  }

  createButtonGroup(key: string): HTMLDivElement {
    const buttonGroup = document.createElement("div")
    const saveButton = this.createButton(`save-${key}`, "Save", () =>
      this.onSave(key)
    )
    const importButton = this.createButton(`import-${key}`, "Import", () =>
      this.onImport(key)
    )
    const exportButton = this.createButton(`export-${key}`, "Export", () =>
      this.onExport(key)
    )
    buttonGroup.appendChild(saveButton)
    buttonGroup.appendChild(importButton)
    buttonGroup.appendChild(exportButton)
    return buttonGroup
  }

  createButton(
    id: string,
    text: string,
    onclick: (this: GlobalEventHandlers, ev: MouseEvent) => unknown
  ): HTMLButtonElement {
    const button = document.createElement("button")
    button.id = id
    button.innerHTML = text
    button.onclick = onclick
    return button
  }

  onSave(key: string) {
    console.log(`${key}-editor`)
    const editor = document.getElementById(
      `${key}-editor`
    ) as HTMLTextAreaElement
    const editorText = editor.value.trim()
    if (editorText) {
      browser.storage.local.set({ [key]: JSON.parse(editorText) }).then(
        () => {
          console.log("OK")
          new CreateMenuTask().run().then(() => {
            console.log("Rebuilt menu")
          })
        },
        (e) => {
          console.error(`Not okay: ${e}`)
        }
      )
    }
  }

  onImport(key: string) {
    console.log(`Import key: ${key}`)
  }

  onExport(key: string) {
    console.log(`Export key: ${key}`)
  }
}
