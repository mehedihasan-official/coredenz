import React, { useState, useEffect, useCallback } from "react";
import app from "../../Firebase/firebase.config";
import axios from "axios";

export const AuthContext = React.createContext();

const AuthProvider = ({
  children,
  initialProducts = [],
  initialServices = [],
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [catalogLoading, setCatalogLoading] = useState(
    initialProducts.length === 0
  );
  const [error, setError] = useState(null);
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([])
  const [services, setServices] = useState(initialServices);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;


  // Create user in our backend - memoized with useCallback
  const createBackendUser = useCallback(
    async (firebaseUser) => {
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
      } catch (err) {
        console.error("Error creating backend user:", err);
        throw err;
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
              await axios.get(`${API_URL}/users/${currentUser.email}`);

              try {
                const cartResponse = await axios.get(
                  `${API_URL}/cart/${currentUser.uid}`
                );
                setCart(cartResponse.data);
              } catch (cartError) {
                console.error('Error fetching cart:', cartError);
                setCart([]);
              }
            } catch (userError) {
              if (userError.response?.status === 404) {
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
  const signUp = async ({ displayName, email, password, phoneNumber }) => {
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
        await axios.get(`${API_URL}/users/${email}`);
        throw new Error("User already exists with this email");
      } catch (err) {
        if (err.response?.status !== 404) throw err;
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
        phoneNumber,
      });

      return userCredential;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign in with email and password

  const signIn = async (email, password) => {
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
      await axios.get(`${API_URL}/users/${email}`);

      return userCredential;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async email => {
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
        if (err.response?.status === 404) {
          await createBackendUser(user);
        } else {
          throw err;
        }
      }

      return result;
    } catch (err) {
      setError(err.message);
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
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setCatalogLoading(false);
    }
  }, [API_URL]);


  // Fetch services data - memoized with useCallback
  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/services`);
      setServices(response.data);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services");
    }
  }, [API_URL]);


  // Cart operations
  const addToCart = async (productId, quantity = 1) => {
    if (!user) throw new Error("You must be logged in to add to cart");

    try {
      const cartItem = {
        userId: user.uid, 
        userEmail: user.email,
        productId,
        quantity,
        addedAt: new Date().toISOString(),
      };

      const response = await axios.post(`${API_URL}/cart`, cartItem);
      setCart((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  // Fetch user's cart - memoized with useCallback
  const fetchCart = useCallback(async () => {
    if (!user) return;

    try { 
      const response = await axios.get(`${API_URL}/cart/${user.email}`);
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }, [API_URL, user]);




// Update cart item quantity
const updateCartItemQuantity = async (productId, newQuantity) => {
  if (!user || !user.email) {
    throw new Error("You must be logged in to update your cart");
  }
  
  if (newQuantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  try {
    // Find the current item for potential rollback
    const currentItem = cart.find(item => item.productId === productId);
    if (!currentItem) {
      throw new Error("Item not found in cart");
    }

    // Optimistic UI update
    setCart(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );

    // Update backend using PATCH - note the numeric productId
    const response = await axios.patch(`${API_URL}/cart/${productId}`, {
      quantity: newQuantity,
      userEmail: user.email
    });

    return response.data;
  } catch (error) {
    console.error("Failed to update quantity:", error);
    // Re-fetch cart to ensure sync with server
    await fetchCart();
    throw error;
  }
};


  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
  if (!cartItemId) {
    console.warn("Invalid cartItemId passed to removeFromCart");
    return;
  }

  try {
    await axios.delete(`${API_URL}/cart/${cartItemId}`);
    setCart((prev) => prev.filter((item) => item._id !== cartItemId));
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
};




// Place Order
const placeOrder = async (orderData) => {
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
const fetchOrders = useCallback(async (email) => {
  if (!email) throw new Error("Email is required to fetch orders");

  try {
    const response = await axios.get(`${API_URL}/orders/${email}`);
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
    orders
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
