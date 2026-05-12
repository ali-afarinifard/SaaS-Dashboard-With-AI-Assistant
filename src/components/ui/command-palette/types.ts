export interface ICommand {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  group: string;
}

export interface ICommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export interface ICommandItemProps {
  cmd: ICommand;
  isSelected: boolean;
  currentIndex: number;
  isRTL: boolean;
  itemRef: (el: HTMLButtonElement | null) => void;
  onMouseEnter: () => void;
}

export interface ICommandGroupProps {
  group: string;
  items: ICommand[];
  startIndex: number;
  selected: number;
  isRTL: boolean;
  itemsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  onSelect: (index: number) => void;
}