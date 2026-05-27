import { Menu, Search, ShoppingCart, User, X, LogOut, Package, LayoutDashboard, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function Navbar() {
  const { cart, user, logout } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const linkBase =
    'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200';
  const activeStyle = 'bg-brand-600 text-white shadow-sm';
  const inactiveStyle = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';

  const navLink = ({ isActive }) =>
    `${linkBase} ${isActive ? activeStyle : inactiveStyle}`;

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 text-xl font-extrabold tracking-tight text-slate-900"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-md shadow-brand-200">
            <ShoppingCart size={18} strokeWidth={2.5} />
          </div>
          <span className="hidden sm:inline">ECommerce</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1.5 lg:flex">
          <NavLink to="/" end className={navLink} id="nav-home">
            <Package size={16} /> Products
          </NavLink>
          {user && (
            <NavLink to="/orders" className={navLink} id="nav-orders">
              <ClipboardList size={16} /> My Orders
            </NavLink>
          )}
          {user?.role === 'admin' && (
            <>
              <NavLink to="/admin/products" className={navLink} id="nav-admin-products">
                <LayoutDashboard size={16} /> Manage Products
              </NavLink>
              <NavLink to="/admin/orders" className={navLink} id="nav-admin-orders">
                <ClipboardList size={16} /> Manage Orders
              </NavLink>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            id="nav-cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-[10px] font-bold text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 lg:flex">
              <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                title="Logout"
                id="nav-logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-200 transition-all hover:bg-brand-700 hover:shadow-md lg:flex"
              id="nav-login"
            >
              <User size={16} /> Login
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
            id="mobile-menu-btn"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1.5">
            <NavLink to="/" end className={navLink} onClick={closeMobile}>
              <Package size={16} /> Products
            </NavLink>
            <NavLink to="/cart" className={navLink} onClick={closeMobile}>
              <ShoppingCart size={16} /> Cart {cartCount > 0 && `(${cartCount})`}
            </NavLink>
            {user && (
              <NavLink to="/orders" className={navLink} onClick={closeMobile}>
                <ClipboardList size={16} /> My Orders
              </NavLink>
            )}
            {user?.role === 'admin' && (
              <>
                <NavLink to="/admin/products" className={navLink} onClick={closeMobile}>
                  <LayoutDashboard size={16} /> Manage Products
                </NavLink>
                <NavLink to="/admin/orders" className={navLink} onClick={closeMobile}>
                  <ClipboardList size={16} /> Manage Orders
                </NavLink>
              </>
            )}
            <hr className="my-2 border-slate-100" />
            {user ? (
              <button
                onClick={handleLogout}
                className={`${linkBase} text-red-600 hover:bg-red-50`}
              >
                <LogOut size={16} /> Logout ({user.name})
              </button>
            ) : (
              <NavLink to="/login" className={navLink} onClick={closeMobile}>
                <User size={16} /> Login
              </NavLink>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
