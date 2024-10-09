import dynamic from "next/dynamic";

const P5Sketch = dynamic(() => import("./components/P5Sketch"), { ssr: false });

export default function Home() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <P5Sketch />
    </div>
  );
}
