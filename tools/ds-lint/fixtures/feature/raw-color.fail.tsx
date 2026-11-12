export function Banner() {
  return (
    // @expect ds/no-raw-color
    <div className="text-foreground" data-color="#ff0000">
      {/* @expect ds/no-raw-color */}
      {"oklch(0.5 0.1 200)"}
    </div>
  );
}

// @expect ds/no-raw-color
export const chartColor = "rgb(10, 20, 30)";
