export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">
          Pasindu Kavishka
        </h1>

        <div className="flex gap-6 text-sm">
          <a href="#">Projects</a>
          <a href="#">Experience</a>
          <a href="#">Skills</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </nav>
  );
}