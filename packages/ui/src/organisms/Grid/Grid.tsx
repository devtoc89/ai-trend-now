"use client";

import Spinner from "#organisms/Spinner/Spinner";
import { type GetDotProp, getDotProp } from "@repo/util/property/object.util";
import { cn } from "@repo/util/style/tailwind.util";
import { throttle } from "es-toolkit";
import { type ReactNode, useEffect } from "react";
import { useInView } from "react-intersection-observer";
const eventThrottle = throttle((callback) => callback(), 200);
// TODO: need refactoring

function isCustomContent<T>(h: GridHeader<T> | CustomGridHeader): h is CustomGridHeader {
  return h.type === "custom";
}

/**
 * Check if a given header is a subfield header.
 * @param h - The header to check.
 * @returns True if the header is a subfield header, false otherwise.
 */
function isSubfieldContent<T>(h: GridHeader<T> | SubfieldGridHeader): h is SubfieldGridHeader {
  return h.type === "subfield";
}

type ItemType = { id: string } & Record<string, unknown>;
type KeyType<T> = keyof T extends string ? keyof T : string;

type CustomGridHeader = {
  type: "custom";
  key: string;
  label?: string;
  render?: (opt: { key: string; label?: string }) => ReactNode;
  width?: number | string;
  ratio?: number;
  classname?: string;
};
type SubfieldGridHeader = {
  type: "subfield";
  key: string;
  label?: string;
  render?: (opt: { key: string; label?: string }) => ReactNode;
  width?: number | string;
  ratio?: number;
  classname?: string;
};
export type GridHeader<T> =
  | {
      key: KeyType<T>;
      type?: undefined;
      label?: string;
      render?: (opt: { key: string; label?: string }) => ReactNode;
      width?: number | string;
      ratio?: number;
      classname?: string;
    }
  | CustomGridHeader
  | SubfieldGridHeader;

export type GridContents<T> = {
  [key in keyof Partial<T>]: {
    render?: (props: { value: T[key]; id: string }) => ReactNode;
  };
};

export type CustomGridContents = {
  [key in string]: {
    render?: (props: { id: string }) => ReactNode;
  };
};
export type SubfieldGridContents<T, P extends string> = {
  [key in P]: {
    render?: (props: { id: string; value: GetDotProp<T, P> }) => ReactNode;
  };
};

export type GridOptions<T> = {
  header: Array<GridHeader<T>>;
  content: GridContents<T>;
  customContent?: CustomGridContents;
  subfieldContent?: SubfieldGridContents<T, string>;
};

export type GridProps<T extends ItemType> = {
  items: Array<T>;
  options: GridOptions<T>;
  nextPage?: () => void;
  hasNext?: boolean;
};

function renderHeader<T>(h: GridHeader<T>) {
  return h.render ? h.render({ key: h.key, label: h.label }) : (h.label ?? h.key);
}

function renderNormalContent<T extends ItemType>(item: T, h: GridHeader<T>, c: GridContents<T>) {
  const tableOption = c[h.key];
  const value = item[h.key];
  return tableOption?.render ? tableOption.render({ value, id: item.id }) : String(value);
}
function renderCustomContent<T extends ItemType>(item: T, h: CustomGridHeader, c?: CustomGridContents) {
  const id = item.id;
  const tableOption = c?.[h.key];
  return tableOption?.render ? tableOption.render({ id }) : "";
}
function renderSubfieldContent<T extends ItemType>(
  item: T,
  h: SubfieldGridHeader,
  render?: ({ value, id }: { value: GetDotProp<T, string>; id: string }) => ReactNode,
) {
  const value = getDotProp(item, h.key);
  return render ? render({ value, id: item.id }) : String(value);
}

function renderContent<T extends ItemType>(item: T, header: GridHeader<T>, options: GridOptions<T>) {
  if (isSubfieldContent(header)) {
    return renderSubfieldContent(item, header, options.subfieldContent?.[header.key]?.render);
  }

  if (isCustomContent(header)) {
    return renderCustomContent(item, header, options.customContent);
  }

  return renderNormalContent(item, header, options.content);
}

function Grid<T extends ItemType>({ items, options, nextPage, hasNext }: GridProps<T>) {
  const gridWidths = options.header.map((h) => h.width).join(" ");
  const [ref, InView] = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    if (InView) {
      nextPage && eventThrottle(nextPage);
    }
  }, [nextPage, InView]);

  return (
    <div className="w-full  bg-white border-gray-300 rounded-lg overflow-y-auto h-full">
      <div
        className="grid  gap-2 bg-gray-200 sticky top-0 z-10 px-4 py-2 font-semibold text-gray-700"
        style={{ gridTemplateColumns: gridWidths }}
      >
        {options.header.map((h) => (
          <div className={cn("font-medium text-gray-500 text-center sticky top-0", h.classname)} key={h.key}>
            {renderHeader(h)}
          </div>
        ))}
      </div>
      {items.map((item) => (
        <div
          className="grid gap-2 border-b px-4 py-2 text-gray-700"
          key={item.id}
          style={{ gridTemplateColumns: gridWidths }}
        >
          {options.header.map((h) => (
            <div className="py-3" key={h.key}>
              {renderContent(item, h, options)}
            </div>
          ))}
        </div>
      ))}
      {hasNext && (
        <div ref={ref} className="flex flex-col items-center justify-center w-full h-20">
          <Spinner />
        </div>
      )}
    </div>
  );
}

export default Grid;
