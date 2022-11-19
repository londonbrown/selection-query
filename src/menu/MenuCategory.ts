export enum MenuCategoryType {
  CATEGORY = "CATEGORY",
  SEPARATOR = "SEPARATOR"
}
export default class MenuCategory {
  readonly id: string
  readonly type: MenuCategoryType
  readonly title: string
  readonly parentId?: string
  constructor(
    id: string,
    type: MenuCategoryType,
    title: string,
    parentId?: string
  ) {
    this.id = id
    this.type = type
    this.title = title
    this.parentId = parentId
  }
  toString(): string {
    return JSON.stringify(this, undefined, 2)
  }

  static fromObjectProperties(props: MenuCategory): MenuCategory {
    return new MenuCategory(props.id, props.type, props.title, props.parentId)
  }
}
