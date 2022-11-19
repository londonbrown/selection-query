import MenuItem, { MenuItemType } from "../menu/MenuItem"
import MenuCategory, { MenuCategoryType } from "../menu/MenuCategory"

const generalCategoryId = "general"
const menuCategories: Array<MenuCategory> = [
  new MenuCategory(
    generalCategoryId,
    MenuCategoryType.CATEGORY,
    "General",
    null
  )
]
const menuItems: Array<MenuItem> = [
  new MenuItem(
    "duckduckgo-search",
    MenuItemType.SEARCH,
    "Duck Duck Go Search: %s",
    generalCategoryId,
    "https://duckduckgo.com/?q=%s"
  ),
  new MenuItem(
    "wikipedia-search",
    MenuItemType.SEARCH,
    "Wikipedia Search: %s",
    generalCategoryId,
    "https://en.wikipedia.org/wiki/Special:Search?search=%s"
  ),
  new MenuItem(
    "youtube-search",
    MenuItemType.SEARCH,
    "YouTube Search: %s",
    generalCategoryId,
    "https://www.youtube.com/results?search_query=%s"
  ),
  new MenuItem(
    "github",
    MenuItemType.LINK,
    "GitHub",
    null,
    "https://github.com/londonbrown/selection-query"
  )
]
export default {
  menuCategories,
  menuItems
}
