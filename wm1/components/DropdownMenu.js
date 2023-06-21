import React from 'react';
import { ContextMenuTrigger, ContextMenu, ContextMenuItem } from 'rctx-contextmenu';

export default function DropdownMenu({ items, amount }) {
    return (
        <div className="app">
          <ContextMenuTrigger
            id="my-context-menu-1"
          >
            <div className="box">
              Right Click On Me
            </div>
          </ContextMenuTrigger>
    
          <ContextMenu id="my-context-menu-1">
            <ContextMenuItem>Menu Item 1</ContextMenuItem>
            <ContextMenuItem>Menu Item 2</ContextMenuItem>
            <ContextMenuItem>Menu Item 3</ContextMenuItem>
            <ContextMenuItem>Menu Item 4</ContextMenuItem>
          </ContextMenu>
        </div>
      )
}