// 떠 있는 요소(Select, Menu, Popover) 공통: 그림자 없이 bg/surface + 1px 테두리 (DESIGN.md 원칙 4)
export const popupClass =
  'sn:box-border sn:min-w-(--anchor-width) sn:max-h-(--available-height) sn:overflow-y-auto sn:origin-(--transform-origin) sn:rounded-lg sn:border sn:border-default sn:bg-surface sn:p-1 sn:font-sans sn:text-body sn:text-default sn:outline-none sn:transition-[opacity,scale] sn:duration-(--sn-duration-normal) sn:ease-standard sn:data-starting-style:scale-98 sn:data-starting-style:opacity-0 sn:data-ending-style:scale-98 sn:data-ending-style:opacity-0 sn:motion-reduce:transition-none';

// 목록 항목(Select Item, Menu Item) 공통
export const itemClass =
  'sn:group sn:flex sn:h-8 sn:cursor-default sn:items-center sn:gap-2 sn:rounded-md sn:px-2 sn:outline-none sn:select-none sn:data-highlighted:bg-subtle sn:data-disabled:opacity-(--sn-opacity-disabled) sn:[&_svg]:size-4 sn:[&_svg]:shrink-0';

// Checkbox 상자 (Checkbox, 다중 Select 항목 공용)
export const boxClass =
  'sn:box-border sn:inline-flex sn:size-4 sn:shrink-0 sn:items-center sn:justify-center sn:rounded-sm sn:border sn:border-strong sn:bg-surface sn:text-on-primary sn:[&_svg]:size-3';
