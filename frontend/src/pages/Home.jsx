import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTopProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/product/ProductCard";
import Loader from "../components/ui/Loader";
import { FiArrowRight, FiTruck, FiShield, FiHeadphones } from "react-icons/fi";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getTopProducts());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div>
      {/* ── Hero Section ── */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom px-4 py-10 sm:py-14 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Text Content */}
            <div className="fade-in text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
                Welcome to Smart-Retech
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-primary-100">
                Discover amazing products at unbeatable prices. Shop now and
                enjoy fast, free delivery on orders over ₹999!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                <Link
                  to="/products"
                  className="btn-primary flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium"
                >
                  Shop Now
                  <FiArrowRight />
                </Link>
                <Link
                  to="/products?category=Electronics"
                  className="btn-secondary flex items-center justify-center py-3 px-6 rounded-lg font-medium"
                >
                  Browse Categories
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden md:block">
              <img
                src="/christopher-gower-m_HRfLhgABo-unsplash.jpg"
                alt="Shopping"
                className="rounded-lg shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-10 sm:py-14 md:py-16 bg-gray-50">
        <div className="container-custom px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-5 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTruck className="text-primary-600" size={28} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Free delivery on orders over ₹999
              </p>
            </div>

            <div className="text-center p-5 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="text-primary-600" size={28} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Secure Payment
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                100% secure payment processing
              </p>
            </div>

            <div className="text-center p-5 sm:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiHeadphones className="text-primary-600" size={28} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">
                24/7 Support
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Dedicated customer support team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Top Products ── */}
      <section className="py-10 sm:py-14 md:py-16">
        <div className="container-custom px-4">
          <div className="flex justify-between items-center mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Top Rated Products
              </h2>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Check out our best-selling products
              </p>
            </div>
            <Link
              to="/products"
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 sm:gap-2 text-sm sm:text-base whitespace-nowrap"
            >
              View All
              <FiArrowRight />
            </Link>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No products available</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-10 sm:py-14 md:py-16 bg-gray-50">
        <div className="container-custom px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              {
                name: "Electronics",
                image:
                  "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop",
              },
              {
                name: "Laptops",
                image:
                  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=200&fit=crop",
              },
              {
                name: "Headphones",
                image:
                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
              },
              {
                name: "Accessories",
                image:
                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop",
              },
            ].map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="group relative overflow-hidden rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-shadow"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <h3 className="text-white font-bold text-sm sm:text-base md:text-xl p-3 sm:p-4">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-10 sm:py-14 md:py-16 bg-primary-600 text-white">
        <div className="container-custom px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-primary-100">
            Join thousands of happy customers today
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-primary-600 hover:bg-gray-100 font-bold px-8 py-3 rounded-lg transition-colors text-sm sm:text-base"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
