import { LayoutGrid, Folder, Clock3, Star, Trash2 } from "lucide-react";

const menuItems = [
  { id: "all", name: "All", icon: LayoutGrid },
  { id: "files", name: "My Files", icon: Folder },
  { id: "recent", name: "Recent", icon: Clock3 },
  { id: "favorites", name: "Favorites", icon: Star },
  { id: "deleted", name: "Recently Deleted", icon: Trash2 },
];

const Sidebar = ({ activeSection, onSectionChange }) => {
  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen border-r border-slate-800 bg-slate-950 px-4 py-6">
      <h2 className="text-white text-xl font-semibold mb-8">Drive Panel</h2>

      <nav className="space-y-1">
        {menuItems.map(({ id, name, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
              activeSection === id
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Icon size={18} />
            <span>{name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;