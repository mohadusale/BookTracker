import { ShelfFormModal } from './ShelfFormModal';

interface CreateShelfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateShelfModal({ isOpen, onClose }: CreateShelfModalProps) {
  return (
    <ShelfFormModal
      isOpen={isOpen}
      onClose={onClose}
      mode="create"
    />
  );
}
