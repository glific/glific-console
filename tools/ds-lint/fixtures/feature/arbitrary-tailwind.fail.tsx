export function Card() {
  return (
    // @expect ds/no-arbitrary-tailwind
    <div className="p-[13px] text-body">
      {/* @expect ds/no-arbitrary-tailwind */}
      <span className="text-[15px]">x</span>
    </div>
  );
}
