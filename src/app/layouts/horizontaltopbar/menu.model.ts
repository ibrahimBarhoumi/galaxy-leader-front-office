export interface MenuItem {
    id?: number;
    label?: string;
    icon?: string;
    link?: string;
    subItems?: MenuItem[];
    parentId?: number;
    isUiElement?: boolean;
    roles?: string[]; // TODO: change to role list
    subItemsIcons?: string;
}
