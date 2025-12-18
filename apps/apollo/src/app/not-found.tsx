import Link from 'next/link';
import Image from 'next/image';
export default function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-y-4 bg-red-100/40">
      <Image
        src="/images/not_found.svg"
        alt="PAGE NOT FOUND"
        width={'100'}
        height={'50'}
      ></Image>
      <p>Could not find requested resource</p>
      <Link href="/" className="text-blue-600 visited:text-purple-600">
        Return Home
      </Link>
    </div>
  );
}
