export function Box() {
  return (
    <div
      // @expect ds/no-inline-style
      style={{ marginTop: 4 }}
    />
  );
}
