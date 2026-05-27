# Frontend

The frontend is a single-page application built with React 18 and Vite. It uses Tailwind CSS for styling, React Router for navigation, and Axios for API communication. State is managed through React Context with localStorage persistence.

## Architecture

```
src/
├── components/
│   ├── Navbar.jsx            Sticky header with navigation, cart badge, mobile menu
│   ├── ProductCard.jsx       Product display card with add-to-cart functionality
│   └── ProtectedRoute.jsx    Route guard that redirects unauthenticated users
├── context/
│   └── AppContext.jsx        Global state provider for auth and cart management
├── pages/
│   ├── Home.jsx              Product listing with search and category filter
│   ├── Login.jsx             Login form with demo credential quick-fill
│   ├── Register.jsx          Registration form with validation
│   ├── Cart.jsx              Shopping cart with quantity controls
│   ├── Checkout.jsx          Shipping address form and order placement
│   ├── MyOrders.jsx          Order history for logged-in users
│   ├── AdminProducts.jsx     Admin panel for adding and removing products
│   └── AdminOrders.jsx       Admin panel for viewing and updating order statuses
├── api.js                    Axios instance with base URL and auth interceptor
├── App.jsx                   Route definitions and layout structure
├── main.jsx                  Application entry point with providers
└── index.css                 Global styles, animations, and Tailwind directives
```

## Pages

### Home
- Displays all products in a responsive grid (1 to 4 columns depending on screen size)
- Search bar filters products by name in real time
- Category dropdown filters by product category
- Active filters shown as removable pills
- Skeleton loading animation while data loads
- Empty state when no products match

### Login
- Centered card layout with email and password fields
- Password visibility toggle
- Loading spinner on submit
- Quick-fill buttons for demo admin and user credentials
- Link to registration page

### Register
- Name, email, and password fields with labels
- Password minimum length hint
- Same design language as the login page

### Cart
- Empty state with illustration when cart is empty
- Product image, name, category, and price for each item
- Quantity stepper (plus/minus) with stock limit enforcement
- Remove button for each item
- Sticky order summary sidebar with subtotal, free delivery tag, and checkout link

### Checkout
- Shipping address form with labeled fields (full name, address, city, postal code, country)
- Cash on delivery payment selection
- Scrollable item list in the sidebar
- Place order button with loading state
- Redirects to order history on success

### My Orders
- Lists all orders with color-coded status badges
- Each order shows item images, quantities, and line totals
- Date formatted in Indian locale
- Empty state when no orders exist

### Admin Products
- Form to add new products with labeled fields and image URL preview
- Product list table with thumbnails, prices, stock levels, and delete buttons
- Loading states for add and delete operations

### Admin Orders
- All orders with customer name and email
- Color-coded status dropdown to update order status inline
- Shipping address shown in the footer of each order card
- Order count badge in the header

## State Management

The application uses React Context (AppContext) to manage:

- **User state**: Login, logout, and persistence via localStorage
- **Cart state**: Add to cart, update quantity, remove item, clear cart
- **Cart total**: Computed using useMemo for performance

The Axios interceptor in `api.js` automatically attaches the JWT token from localStorage to every request.

## Routing

| Path | Component | Access |
| --- | --- | --- |
| / | Home | Public |
| /login | Login | Public |
| /register | Register | Public |
| /cart | Cart | Public |
| /checkout | Checkout | Protected |
| /orders | MyOrders | Protected |
| /admin/products | AdminProducts | Admin only |
| /admin/orders | AdminOrders | Admin only |

Protected routes redirect to /login if the user is not authenticated. Admin routes redirect to the home page if the user is not an admin.

## Styling

- Tailwind CSS 3 with a custom brand color palette (indigo-based)
- Inter font loaded from Google Fonts
- Responsive design with mobile-first approach
- Micro-animations: fade-up on page load, skeleton shimmer for loading states
- Custom scrollbar styling

## Commands

```bash
npm install       # Install frontend dependencies
npm run dev       # Start Vite development server (port 5173)
npm run build     # Build for production (output to dist/)
npm run preview   # Preview the production build locally
```

## Environment Variables

Refer to `.env.example` for the required variables. Copy it to `.env` and fill in your values:

```bash
cp .env.example .env
```

The frontend requires the backend API URL to make requests.

## Build Output

Running `npm run build` generates optimized static files in the `dist` directory. This is what gets deployed to Vercel.
