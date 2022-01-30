class ContextMenu {
    constructor({ target = null, menuItems = [] }) {
        this.target = target;
        this.menuItems = menuItems;
        this.targetNode = document.querySelector(this.target);;
        this.menuItemsNode = this.getMenuItems();
        this.isOpened = false;
    }

    getMenuItems() {
        const items = [];
        if (!this.menuItems) return;

        this.menuItems.forEach((data, index) => {
            const item = this.createItem(data);
            item.firstChild.setAttribute("style", `animation-delay: ${index * 0.08}s`);
            items.push(item);
        });

        return items;
    }

    createItem(data) {
        const button = document.createElement("BUTTON");
        const item = document.createElement("LI");

        button.innerHTML = data.content;
        button.classList.add("contextMenu-button");
        item.classList.add("contextMenu-item");

        if (data.divider) item.setAttribute("data-divider", data.divider);
        item.appendChild(button);

        if (data.events && data.events.length !== 0) {
            Object.entries(data.events).forEach(event => {
                const [key, value] = event;
                button.addEventListener(key, value);
            });
        }
        return item;
    }

    renderMenu() {
        const menuContainer = document.createElement("UL");
        menuContainer.classList.add("contextMenu");
        this.menuItemsNode.forEach(item => menuContainer.appendChild(item));
        return menuContainer;
    }

    closeMenu(menu) {
        this.isOpened && menu.remove();
    }

    init() {
        const contextMenu = this.renderMenu();
        document.addEventListener("click", () => this.closeMenu(contextMenu));
        window.addEventListener("blur", () => this.closeMenu(contextMenu));
        document.addEventListener("contextmenu", () => {
            if (!this.targetNode) contextMenu.remove();
        });

        this.targetNode.addEventListener("contextmenu", e => {
            e.preventDefault();
            this.isOpened = true;
            const { clientX, clientY } = e;
            document.body.appendChild(contextMenu);

            const positionY = clientY + contextMenu.scrollHeight >= window.innerHeight 
                ? window.innerHeight - contextMenu.scrollHeight - 20
                : clientY;
            const positionX = clientX + contextMenu.scrollWidth >= window.innerWidth 
                ? window.innerWidth - contextMenu.scrollWidth - 20
                : clientX;

            contextMenu.setAttribute("style",
                `--width: ${contextMenu.scrollWidth}px;
                --height: ${contextMenu.scrollHeight}px;
                --top: ${positionY}px;
                --left: ${positionX}px;`
            );
        });
    }
}

const menuItems = [
    { content: `Copy`, events: { click: e => console.log(e) } },
    { content: `Paste` },
    { content: `Cut` },
    { content: `Download` },
    { content: `Delete`, divider: "top" }
];

const menu = new ContextMenu({ target: ".target", menuItems });
menu.init();