/** Brand-neutral loading indicator used in place of OpenDesignLoadingMark. */
export function NeutralLoadingMark({ height = 40 }: { height?: number }) {
  return (
    <span
      className="hf-loader-mark hf-loader-mark--neutral"
      style={{ height, width: height }}
      aria-hidden="true"
    />
  );
}
