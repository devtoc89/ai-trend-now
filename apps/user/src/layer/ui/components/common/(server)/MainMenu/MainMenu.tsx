"use client";

import { Button } from "@repo/ui/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@repo/ui/components/ui/menubar";
import Link from "next/link";
import { Fragment } from "react";

type MenuItem = {
  id: string;
  label: string;
} & (
  | {
      disabled?: false;
      href: string;
      isCrossOrigin?: boolean;
    }
  | {
      disabled: true;
      href?: string;
    }
);

type MenuGroup = {
  id: string;
  label: string;
  items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
  {
    id: "publication",
    label: "Publication",
    items: [
      {
        id: "postPaper",
        label: "Paper",
        href: "/post/paper/page/1",
      },
      // {
      //   id: "postColumn",
      //   label: "Column",
      //   disabled: true,
      // },
    ],
  },
  // {
  //   id: "content",
  //   label: "Content",
  //   items: [
  //     {
  //       id: "contentCommunity",
  //       label: "Community",
  //       disabled: true,
  //     },
  //   ],
  // },
  {
    id: "aboutService",
    label: "About Service",
    items: [
      {
        id: "developerProfile",
        label: "Developer Profile",
        isCrossOrigin: true,
        href: "https://github.com/devtoc89",
        // disabled: true,
      },
    ],
  },
];

function InnerMenuGroup({ group }: { group: MenuGroup }) {
  return (
    <MenubarGroup className="p-2" id={group.id}>
      <label htmlFor={group.id} className="font-medium">
        {group.label}
      </label>
      {group.items.map((item) => (
        <InnerMenuItem key={item.id} item={item} />
      ))}
    </MenubarGroup>
  );
}

function InnerMenuItem({ item }: { item: MenuItem }) {
  return (
    <MenubarItem disabled={item.disabled}>
      {!item.disabled && item.href ? (
        <>
          {item.isCrossOrigin ? (
            <a href={item.href} className="w-full" target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ) : (
            <Link href={item.href} className="w-full">
              {item.label}
            </Link>
          )}
        </>
      ) : (
        item.label
      )}
    </MenubarItem>
  );
}

function MainMenu() {
  return (
    <Menubar className="border-none p-0">
      <MenubarMenu>
        <Button variant="outline" asChild>
          <MenubarTrigger className="border-inherit cursor-pointer">Menu</MenubarTrigger>
        </Button>
        <MenubarContent className="px-2 min-w-fit">
          {menuGroups.map((group, idx) => (
            <Fragment key={group.id}>
              {idx > 0 && <MenubarSeparator />}
              <InnerMenuGroup group={group} />
            </Fragment>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export default MainMenu;
