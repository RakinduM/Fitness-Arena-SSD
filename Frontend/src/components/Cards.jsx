import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";

const Cards = ({ item }) => {
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(AuthContext);

  // Function to extract file name from photoURL
  const extractFileName = (image) => {
    return image.split("\\").pop(); // Split the string by backslash and get the last element
  };

  const handleHeartClick = () => {
    setIsHeartFilled(!isHeartFilled);
  };

  // Check if the item is already in the cart
  const isItemInCart = (itemId) => {
    return cartItems.some((cartItem) => cartItem.menuItemId === itemId);
  };

  // add to cart handler
  const handleAddToCart = (item) => {
    if (isItemInCart(item._id)) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Item already in cart",
        text: "This item is already in your cart. You can update the quantity from the cart page.",
        showConfirmButton: true,
        confirmButtonText: "Go to Cart",
        showCancelButton: true,
        cancelButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/cart-page";
        }
      });
    } else {
      const cartItem = {
        menuItemId: item._id,
        quantity: 1,
        email: user.email,
      };

      axios
        .post("http://localhost:6005/carts/", cartItem)
        .then((response) => {
          if (response && response.data) {
            setCartItems([...cartItems, cartItem]);
            // Display success SweetAlert
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Item added to cart",
              text: `${item.name} has been successfully added to your cart!`,
              showConfirmButton: true,
              confirmButtonText: "Continue Shopping",
              showCancelButton: true,
              cancelButtonText: "View Cart",
              timer: 4000,
            }).then((result) => {
              if (result.dismiss === Swal.DismissReason.cancel) {
                window.location.href = "/cart-page";
              }
            });
          }
        })
        .catch((error) => {
          console.error("Cart error:", error);
          let errorMessage = "Failed to add to cart";
          let errorDetails = "";

          // Handle validation errors from backend
          if (error.response && error.response.status === 400) {
            const errorData = error.response.data;
            if (errorData.errors && Array.isArray(errorData.errors)) {
              errorDetails = errorData.errors
                .map((err) => `${err.path}: ${err.msg}`)
                .join(", ");
            } else if (errorData.message) {
              errorDetails = errorData.message;
            } else {
              errorDetails = "Please check your input and try again";
            }
          } else if (error.response && error.response.status >= 500) {
            errorDetails = "Server error. Please try again later.";
          } else if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            errorDetails = error.response.data.message;
          } else {
            errorDetails = "Please check your connection and try again";
          }

          // Display error SweetAlert
          Swal.fire({
            position: "center",
            icon: "error",
            title: errorMessage,
            text: errorDetails,
            showConfirmButton: true,
            confirmButtonText: "Try Again",
            timer: 5000,
          });
        });
    }
  };

  return (
    <div>
      <div className="shadow-xl card w-96 bg-base-100">
        <div
          className={`rating gap-1 absolute right-2 top-2 p-4 heartStar bg-Aorange ${
            isHeartFilled ? "text-rose-500" : "text-white"
          }`}
          onClick={handleHeartClick}
        >
          <FaHeart className="w-5 h-5 cursor" />
        </div>
        <Link to={`/product/${item.id}`} className="card-image">
          <figure>
            <img
              src={`http://localhost:6005/uploads/${extractFileName(
                item.image
              )}`}
              alt="image"
              className="transition duration-200 card-image hover:scale-105 md:h-72"
            />
          </figure>
        </Link>
        <div className="card-body">
          <Link to={`/product/${item.id}`}>
            <h2 className="card-title">{item.name}</h2>
          </Link>
          <div className="items-center justify-between mt-2 card-actions">
            <h5 className="font-semibold">Rs.{item.price}</h5>
            <button
              className="btn bg-Aorange"
              onClick={() => handleAddToCart(item)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
