import Navigation from '@/components/Bakery/Navigation';

export default function BakeryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
