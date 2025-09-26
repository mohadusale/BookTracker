
interface ShelfFormErrorsProps {
  errors: string[];
}

export default function ShelfFormErrors({ errors }: ShelfFormErrorsProps) {
  if (errors.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
      <ul className="text-sm text-red-600 space-y-1">
        {errors.map((error, index) => (
          <li key={index}>• {error}</li>
        ))}
      </ul>
    </div>
  );
}
