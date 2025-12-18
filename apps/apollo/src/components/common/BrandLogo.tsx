import Image from 'next/image';

export default function BrandLogo({
  width,
  height,
  style,
}: {
  width: number;
  height: number;
  style?: React.CSSProperties;
}) {
  return (
    <Image
      width={width}
      height={height}
      priority
      src="/images/CS_india_logo.svg"
      style={{ background: '#ffffff', padding: '2px', ...style }}
      alt="Credit Saison India"
    ></Image>
  );
}
