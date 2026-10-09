import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import axios, { isAxiosError } from 'axios';
import type { User as FirebaseUser, UserCredential } from 'firebase/auth';
import app from '../../Firebase/firebase.config';
import { getApiBaseUrl } from '@/src/lib/api';
import type {
  CartItem,
  Order,
  Product,
  ProductId,
  Service,
} from '@/src/types/catalog';
import { normalizeProduct } from '@/src/types/catalog';

interface AuthContextValue {
  user: FirebaseUser | null;
  loading: boolean;
  catalogLoading: boolean;
  error: string | null;
  products: Product[];
  services: Service[];
  cart: CartItem[];
  orders: Order[];
  signUp: (input: {
    displayName: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  sendPasswordReset: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<UserCredential>;
  logOut: () => Promise<void>;
  addToCart: (productId: ProductId, quantity?: number) => Promise<CartItem>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateCartItemQuantity: (
    productId: ProductId,
    newQuantity: number
  ) => Promise<CartItem>;
  fetchCart: () => Promise<void>;
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  clearError: () => void;
  placeOrder: (orderData: Record<string, unknown>) => Promise<unknown>;
  fetchOrders: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within the AuthProvider.');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
  initialProducts?: Product[];
  initialServices?: Service[];
}

const AuthProvider = ({
  children,
  initialProducts = [],
  initialServices = [],
}: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [catalogLoading, setCatalogLoading] = useState(
    initialProducts.length === 0
  );
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [services, setServices] = useState<Service[]>(initialServices);
  
  const API_URL = getApiBaseUrl();

  const getErrorMessage = (cause: unknown, fallback: string): string =>
    cause instanceof Error ? cause.message : fallback;


  // Create user in our backend - memoized with useCallback
  const createBackendUser = useCallback(
    async (
      firebaseUser: Pick<
        FirebaseUser,
        'uid' | 'email' | 'displayName' | 'photoURL' | 'providerData' | 'phoneNumber'
      >
    ) => {
      try {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || "",
          photoURL: firebaseUser.photoURL || "",
          provider: firebaseUser.providerData[0]?.providerId || "email",
          phoneNumber: firebaseUser.phoneNumber || "",
        };

        const response = await axios.post(`${API_URL}/users`, userData);
        return response.data;
      } catch (cause) {
        console.error('Error creating backend user:', cause);
        throw cause;
      }
    },
    [API_URL]
  );

  // Auth state observer
  useEffect(() => {
    let unsubscribe;
    let isMounted = true;

    import('firebase/auth')
      .then(({ getAuth, onAuthStateChanged }) => {
        if (!isMounted) return;

        unsubscribe = onAuthStateChanged(getAuth(app), async currentUser => {
          if (currentUser) {
            try {
              if (currentUser.email) {
                await axios.get(
                  `${API_URL}/users/${encodeURIComponent(currentUser.email)}`
                );

                try {
                  const cartResponse = await axios.get<CartItem[]>(
                    `${API_URL}/cart/${encodeURIComponent(currentUser.email)}`
                  );
                  setCart(cartResponse.data);
                } catch (cartError) {
                  console.error('Error fetching cart:', cartError);
                  setCart([]);
                }
              }
            } catch (userError) {
              if (
                isAxiosError(userError) &&
                userError.response?.status === 404
              ) {
                await createBackendUser(currentUser);
              } else {
                console.error('Error checking user:', userError);
              }
            }
          } else {
            setCart([]);
          }
          setUser(currentUser);
          setLoading(false);
        });
      })
      .catch(authError => {
        if (!isMounted) return;
        console.error('Unable to initialize Firebase authentication:', authError);
        setError('Authentication service is unavailable');
        setLoading(false);
      });

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, [API_URL, createBackendUser]);

  // Auth functions
  const signUp = async ({
    displayName,
    email,
    password,
    phoneNumber,
  }: {
    displayName: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const {
        createUserWithEmailAndPassword,
        getAuth,
        updateProfile,
      } = await import('firebase/auth');
      const auth = getAuth(app);

      // First check if user exists in our backend
      try {
        await axios.get(`${API_URL}/users/${encodeURIComponent(email)}`);
        throw new Error("User already exists with this email");
      } catch (err) {
        if (!isAxiosError(err) || err.response?.status !== 404) throw err;
      }

      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });

      // Create user in our backend
      await createBackendUser({
        ...userCredential.user,
        displayName,
        phoneNumber: phoneNumber ?? null,
      });

      return userCredential;
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to create your account.'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Verify user exists in our backend
      await axios.get(`${API_URL}/users/${encodeURIComponent(email)}`);

      return userCredential;
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to sign in.'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    if (!email?.trim()) {
      throw new Error('Email is required to reset your password');
    }

    const { getAuth, sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(getAuth(app), email.trim());
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);

    try {
      const { getAuth, GoogleAuthProvider, signInWithPopup } = await import(
        'firebase/auth'
      );
      const result = await signInWithPopup(
        getAuth(app),
        new GoogleAuthProvider()
      );
      const user = result.user;

      // Check if user exists in our backend
      try {
        await axios.get(`${API_URL}/users/${user.email}`);
      } catch (err) {
        if (isAxiosError(err) && err.response?.status === 404) {
          await createBackendUser(user);
        } else {
          throw err;
        }
      }

      return result;
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to sign in with Google.'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      const { getAuth, signOut } = await import('firebase/auth');
      await signOut(getAuth(app));
      setCart([]); // Clear cart on logout
    } finally {
      setLoading(false);
    }
  };

  // Fetch products data - memoized with useCallback
  const fetchProducts = useCallback(async () => {
    setCatalogLoading(true);
    try {
      const response = await axios.get<unknown>(`${API_URL}/products`);
      if (!Array.isArray(response.data)) {
        throw new Error('The products API returned an invalid response.');
      }
      setProducts(response.data.map(normalizeProduct));
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(getErrorMessage(err, 'Failed to load products'));
    } finally {
      setCatalogLoading(false);
    }
  }, [API_URL]);


  // Fetch services data - memoized with useCallback
  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get<Service[]>(`${API_URL}/services`);
      if (!Array.isArray(response.data)) {
        throw new Error('The services API returned an invalid response.');
      }
      setServices(response.data);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services");
    }
  }, [API_URL]);


  // Cart operations
  const addToCart = async (
    productId: ProductId,
    quantity = 1
  ): Promise<CartItem> => {
    if (!user) throw new Error("You must be logged in to add to cart");
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error('Quantity must be a positive whole number.');
    }

    try {
      const cartItem = {
        userId: user.uid, 
        userEmail: user.email,
        productId,
        quantity,
        addedAt: new Date().toISOString(),
      };

      const response = await axios.post<CartItem>(`${API_URL}/cart`, cartItem);
      setCart(previous => [
        ...previous.filter(
          item => String(item.productId) !== String(response.data.productId)
        ),
        response.data,
      ]);
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  // Fetch user's cart - memoized with useCallback
  const fetchCart = useCallback(async () => {
    if (!user) return;
    if (!user.email) {
      setCart([]);
      return;
    }

    try { 
      const response = await axios.get<CartItem[]>(
        `${API_URL}/cart/${encodeURIComponent(user.email)}`
      );
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }, [API_URL, user]);




// Update cart item quantity
const updateCartItemQuantity = async (
  productId: ProductId,
  newQuantity: number
): Promise<CartItem> => {
  if (!user || !user.email) {
    throw new Error("You must be logged in to update your cart");
  }
  
  if (newQuantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  try {
    // Find the current item for potential rollback
    const currentItem = cart.find(
      item => String(item.productId) === String(productId)
    );
    if (!currentItem) {
      throw new Error("Item not found in cart");
    }

    // Optimistic UI update
    setCart(prev =>
      prev.map(item =>
        String(item.productId) === String(productId)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );

    // Update backend using PATCH - note the numeric productId
    const response = await axios.patch<CartItem>(
      `${API_URL}/cart/${encodeURIComponent(productId)}`,
      {
      quantity: newQuantity,
      userEmail: user.email,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to update quantity:", error);
    // Re-fetch cart to ensure sync with server
    await fetchCart();
    throw error;
  }
};


  // Remove item from cart
  const removeFromCart = async (cartItemId: string): Promise<void> => {
  if (!cartItemId) {
    console.warn("Invalid cartItemId passed to removeFromCart");
    return;
  }

  try {
    await axios.delete(`${API_URL}/cart/${encodeURIComponent(cartItemId)}`);
    setCart((prev) => prev.filter((item) => item._id !== cartItemId));
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};




// Place Order
const placeOrder = async (orderData: Record<string, unknown>): Promise<unknown> => {
  if (!user) {
    throw new Error("You must be logged in to place an order");
  }

  try {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

// Fetch Order data(required email)
const fetchOrders = useCallback(async (email: string) => {
  if (!email) throw new Error("Email is required to fetch orders");

  try {
    const response = await axios.get<Order[]>(
      `${API_URL}/orders/${encodeURIComponent(email)}`
    );
    setOrders(response.data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}, [API_URL]);


  // Fetch products when the component mounts
useEffect(() => {
  if (initialProducts.length === 0) fetchProducts();
  if (initialServices.length === 0) fetchServices();
  if (user?.email) fetchOrders(user.email);
}, [
  fetchProducts,
  fetchServices,
  fetchOrders,
  initialProducts.length,
  initialServices.length,
  user?.email,
]);



  // Fetch cart when user changes
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const authInfo = {
    user,
    loading,
    catalogLoading,
    error,
    signUp,
    signIn,
    sendPasswordReset,
    signInWithGoogle,
    logOut,
    products,
    services,
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    fetchCart,
    clearError: () => setError(null),
    placeOrder,
    orders,
    fetchOrders,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
