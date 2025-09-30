import { ShelfFormModal } from './ShelfFormModal';
import type { ShelfCardData } from '../../../../types/shelves';

interface EditShelfModalProps {
  isOpen: boolean;
  onClose: () => void;
  shelf: ShelfCardData;
}

export function EditShelfModal({ isOpen, onClose, shelf }: EditShelfModalProps) {
  return (
    <ShelfFormModal
      isOpen={isOpen}
      onClose={onClose}
      mode="edit"
      shelf={shelf}
    />
  );
}
