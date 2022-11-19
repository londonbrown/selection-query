import MenuCategory from "../menu/MenuCategory";
import MenuItem from "../menu/MenuItem";
import {browser} from "webextension-polyfill-ts";
import DefaultMenu from "../datastore/DefaultMenu";

export default class MenuItemsDAO {

    private static instance: MenuItemsDAO

    static getInstance(): MenuItemsDAO {
        if (this.instance == null) {
            this.instance = new MenuItemsDAO()
        }
        return this.instance
    }

    async saveCategories(menuCategories: Array<MenuCategory>): Promise<void> {
        return await browser.storage.local.set({menuCategories})
    }

    async saveItems(menuItems: Array<MenuItem>): Promise<void> {
        return await browser.storage.local.set({menuItems})
    }

    async getCategories(): Promise<Array<MenuCategory>> {
        return this.getMenuComponents("menuCategories", MenuCategory.fromObjectProperties)
    }
    async getItems(): Promise<Array<MenuItem>> {
        return this.getMenuComponents("menuItems", MenuItem.fromObjectProperties)
    }

    private async getMenuComponents(key: "menuCategories" | "menuItems",
                                    serializer: (menuComponentProps: any) => MenuItem | MenuCategory) {
        let menuComponentItem = await browser.storage.local.get(key)
        if (menuComponentItem[key]) {
            return menuComponentItem[key].map((menuComponentProps: any) => {
                return serializer(menuComponentProps)
            })
        } else {
            return DefaultMenu[key]
        }
    }
}