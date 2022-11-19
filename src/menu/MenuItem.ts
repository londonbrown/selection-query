export enum MenuItemType {
    LINK = "LINK",
    SEARCH = "SEARCH",
    SEPARATOR = "SEPARATOR"
}
export default class MenuItem {
    readonly id: string;
    readonly type: MenuItemType;
    readonly title: string | undefined;
    readonly categoryId: string | undefined;
    readonly url: string | undefined;
    constructor(id: string,
                type: MenuItemType,
                title: string | undefined,
                categoryId: string | undefined,
                url: string | undefined) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.categoryId = categoryId;
        this.url = url;
    }
    toString(): string {
        return JSON.stringify(this, undefined, 2)
    }
    static fromObjectProperties(props: any): MenuItem {
        return new MenuItem(props.id,
            props.type,
            props.title,
            props.categoryId,
            props.url)
    }
}
