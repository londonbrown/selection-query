import { browser, Menus } from "webextension-polyfill-ts"
import MenuItem, { MenuItemType } from "../menu/MenuItem"
import MenuCategory, { MenuCategoryType } from "../menu/MenuCategory"
import MenuItemsDAO from "../dao/MenuItemsDAO"

export default class CreateMenuTask {
  async run() {
    console.log("Removing any existing menu items before building menu")
    await browser.menus.removeAll()
    console.log("Retrieving menu categories and items")
    const menuCategories = await MenuItemsDAO.getInstance().getCategories()
    const menuItems = await MenuItemsDAO.getInstance().getItems()
    console.log(
      `Building menu from ${menuCategories.length} categories and ${menuItems.length} items`
    )
    for (const menuCategory of await MenuItemsDAO.getInstance().getCategories()) {
      console.log(`Creating menuCategory with id: ${menuCategory.id}`)
      try {
        if (menuCategory.type == MenuCategoryType.SEPARATOR) {
          browser.menus.create({
            type: "separator",
            parentId: menuCategory.parentId,
            contexts: ["selection"]
          })
        } else {
          browser.menus.create({
            id: menuCategory.id,
            title: menuCategory.title,
            parentId: menuCategory.parentId,
            contexts: ["selection"]
          })
        }
      } catch (e) {
        console.error(`Failed to create menu category: ${menuCategory.id}`)
        CreateMenuTask.onError(e)
      }
    }
    for (const menuItem of await MenuItemsDAO.getInstance().getItems()) {
      console.log(`Creating menuItem with id: ${menuItem.id}`)
      try {
        if (menuItem.type == MenuItemType.SEPARATOR) {
          browser.menus.create({
            type: "separator",
            parentId: menuItem.categoryId,
            contexts: ["selection"]
          })
        } else {
          browser.menus.create(
            {
              id: menuItem.id,
              title: menuItem.title,
              parentId: menuItem.categoryId,
              contexts: ["selection"],
              onclick: CreateMenuTask.onItemClick
            },
            () => CreateMenuTask.onItemCreated(menuItem)
          )
        }
      } catch (e) {
        console.error(`Failed to create menu item: ${menuItem.id}`)
        CreateMenuTask.onError(e)
      }
    }
  }

  private static onTabCreated() {
    const { lastError } = browser.runtime
    lastError
      ? console.error(`Error: ${lastError.message}`)
      : console.debug("Tab created successfully")
  }

  private static onItemCreated(
    menuComponent: MenuItem | MenuCategory
  ): string | number {
    console.log(
      `Created menu component of type ${menuComponent.type}: ${menuComponent.id}`
    )
    return menuComponent.id
  }

  private static openInNewTab(searchUrl: string, selectionText?: string) {
    const url =
      selectionText === undefined
        ? searchUrl
        : searchUrl.replace("%s", selectionText)
    browser.tabs
      .create({
        url
      })
      .then(CreateMenuTask.onTabCreated, CreateMenuTask.onError)
  }

  private static onError(error: Error) {
    console.error(`Error: ${error.message}`)
  }

  private static onItemClick(info: Menus.OnClickData) {
    const { menuItemId, selectionText } = info

    const menuItem = MenuItemsDAO.getInstance()
      .getItems()
      .then((value) =>
        value.find((menuItem) => {
          return menuItem.id == menuItemId
        })
      )
    menuItem.then((value) => {
      console.debug(`menuItem is type ${value.type}`)
      if (value.type == MenuItemType.SEARCH) {
        CreateMenuTask.openInNewTab(value.url.trim(), selectionText.trim())
      } else if (value.type == MenuItemType.LINK) {
        CreateMenuTask.openInNewTab(value.url.trim())
      } else {
        console.debug("menuItem is not interactive. Nothing to do.")
      }
    })
  }
}
