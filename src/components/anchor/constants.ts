import type { InjectionKey, Ref } from 'vue';

export interface AnchorLinkState {
  el: any;
  href: string;
}

export interface AnchorList {
  href: string;
  title: string;
  children?: AnchorList[];
}

export type HrefMap = Record<string, Array<string> | string>;

export type HrefShow = Record<string, Boolean>;

export interface AnchorContext {
  hrefShow: Ref<HrefShow>;
  hrefMap: Ref<HrefMap>;
  currentAnchor: Ref<string>;
  addLink(state: AnchorLinkState): void;
  removeLink(href: string): void;
  handleClick(e: MouseEvent, href?: string): void;
  onExpand(href: string): void;
}

export const anchorKey: InjectionKey<AnchorContext> = Symbol('anchor');
