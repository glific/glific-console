// @expect ds/no-raw-controls
export function SubmitButton() {
  return (
    // @expect ds/no-raw-controls
    <button type="submit">Save</button>
  );
}

export function Search() {
  // @expect ds/no-raw-controls
  return <input type="search" />;
}

// @expect ds/no-raw-controls
export const ConfirmModal = () => null;
