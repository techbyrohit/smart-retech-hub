import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import {
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiMenu,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { MdLogout, MdDashboard } from "react-icons/md";
import { useState } from "react";
import toast from "react-hot-toast";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [keyword, setKeyword] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success("Logged out successfully");
      navigate("/login");
      setMobileMenuOpen(false);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${keyword}`);
    } else {
      navigate("/products");
    }
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  const cartItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/products?category=Electronics", label: "Electronics" },
    { to: "/products?category=Laptops", label: "Laptops" },
    { to: "/products?category=Headphones", label: "Headphones" },
    { to: "/products?category=Accessories", label: "Accessories" },
    { to: "/sell", label: "Sell Product" },
    { to: "/second-hand", label: "Second Hand" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* ── Top Bar ── */}
      <div className="bg-primary-600 text-white py-1.5">
        <div className="container-custom px-4">
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <p className="hidden sm:block">
              Welcome to our Smart-Retech Store!
            </p>
            <p className="sm:hidden">Smart-Retech Store</p>
            <div className="flex gap-3 sm:gap-4">
              <Link to="/products" className="hover:text-primary-200">
                Shop Now
              </Link>
              <Link to="/orders" className="hover:text-primary-200">
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Header ── */}
      <div className="container-custom px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Hamburger - mobile only */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold text-primary-600 whitespace-nowrap"
            onClick={() => setMobileMenuOpen(false)}
          >
            Smart-Retech
          </Link>

          {/* Search Bar - hidden on mobile, visible md+ */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search Laptop and Computers..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-4 py-2 pr-12 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-1.5 rounded-lg hover:bg-primary-700"
              >
                <FiSearch size={18} />
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiShoppingCart size={22} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                    {user?.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser size={18} className="text-primary-600" />
                    )}
                  </div>
                  <FiChevronDown
                    size={14}
                    className="hidden sm:block text-gray-500"
                  />
                </button>

                {/* Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-12 w-52 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <ul className="py-1">
                      <li>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary-50 transition-colors"
                        >
                          <FiUser size={15} /> My Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary-50 transition-colors"
                        >
                          <FiShoppingCart size={15} /> My Orders
                        </Link>
                      </li>
                      {user?.role === "admin" && (
                        <li>
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-primary-50 transition-colors"
                          >
                            <MdDashboard size={15} /> Dashboard
                          </Link>
                        </li>
                      )}
                      <li className="border-t border-gray-100 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <MdLogout size={15} /> Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary-600 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors whitespace-nowrap"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="md:hidden mt-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Laptop and Computers..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-2.5 pr-12 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-1.5 rounded-lg"
                >
                  <FiSearch size={18} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ── Desktop Navigation ── */}
      <nav className="hidden lg:block bg-gray-50 border-t border-gray-200">
        <div className="container-custom px-4">
          <ul className="flex items-center gap-6 py-2.5 text-sm font-medium overflow-x-auto">
            {navLinks.map((link) => (
              <li key={link.to} className="whitespace-nowrap">
                <Link
                  to={link.to}
                  className="hover:text-primary-600 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          {/* Mobile Nav Links */}
          <nav className="px-4 py-2">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile User Info */}
          {isAuthenticated && (
            <div className="border-t border-gray-100 px-4 py-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FiUser size={20} className="text-primary-600" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <MdLogout size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop for dropdown */}
      {userDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
