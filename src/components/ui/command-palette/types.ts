export interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  group: string;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export interface CommandItemProps {
  cmd: Command;
  isSelected: boolean;
  currentIndex: number;
  isRTL: boolean;
  itemRef: (el: HTMLButtonElement | null) => void;
  onMouseEnter: () => void;
}

export interface CommandGroupProps {
  group: string;
  items: Command[];
  startIndex: number;
  selected: number;
  isRTL: boolean;
  itemsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  onSelect: (index: number) => void;
}