import SeparatorMenuItem from "../menu/SeparatorMenuItem";
import {browser, Menus} from "webextension-polyfill-ts";
import MenuItem from "../menu/MenuItem";
import SearchMenuItem from "../menu/SearchMenuItem";
import LinkMenuItem from "../menu/LinkMenuItem";
import LoadMenuItemsTask from "./LoadMenuItemsTask";

export default class BuildMenuTask {
    private static readonly menuItems = this.getMenuItems()

    async run() {
        console.log(`Building menu from MenuItems: ${BuildMenuTask.menuItems.toString()}`)
        for (let menuItem of await BuildMenuTask.menuItems) {
            console.log(`Creating menuItem with id: ${menuItem.props.id}`)
            try {
                if (menuItem instanceof SeparatorMenuItem) {
                    browser.menus.create({
                        type: "separator",
                        parentId: menuItem.props.parentId,
                        contexts: ["selection"]
                    })
                } else {
                    browser.menus.create({
                        id: menuItem.props.id,
                        title: menuItem.props.title,
                        parentId: menuItem.props.parentId,
                        contexts: ["selection"],
                        onclick: BuildMenuTask.onItemClick
                    }, () => BuildMenuTask.onItemCreated(menuItem))
                }
            } catch (e) {
                console.error(`Failed to create menu item: ${menuItem.props.id}`)
                BuildMenuTask.onError(e)
            }
        }
    }

    private static onTabCreated() {
        let { lastError } = browser.runtime
        lastError ? console.error(`Error: ${lastError.message}`) : console.debug("Tab created successfully")
    }

    private static onItemCreated(menuItem: MenuItem): string | number {
        console.log(`Created item: ${menuItem.props.id}`)
        return menuItem.props.id
    }

    private static openInNewTab(searchUrl: string, selectionText?: string) {
        let url = selectionText === undefined ? searchUrl : searchUrl.replace("%s", selectionText)
        browser.tabs.create({
            url
        }).then(BuildMenuTask.onTabCreated, BuildMenuTask.onError)
    }

    private static onError(error: Error) {
        console.error(`Error: ${error.message}`)
    }

    private static onItemClick(info: Menus.OnClickData) {
        const { menuItemId, selectionText } = info
        let menuItem = BuildMenuTask.menuItems.then(value => value.find(menuItem => {
            return menuItem.props.id == menuItemId
        }))
        menuItem.then(value => {
            if (value instanceof SearchMenuItem) {
                console.debug("menuItem is type SearchMenuItem")
                BuildMenuTask.openInNewTab(value.props.searchUrl.trim(), selectionText.trim())
            } else if (value instanceof LinkMenuItem) {
                console.debug("menuItem is type LinkMenuItem")
                BuildMenuTask.openInNewTab(value.props.url.trim())
            } else {
                console.debug("menuItem is not interactive. Nothing to do.")
            }
        })
    }

    private static async getMenuItems(): Promise<Array<MenuItem>> {
        const loadMenuItemsTask = new LoadMenuItemsTask()
        return await loadMenuItemsTask.load()
    }
}