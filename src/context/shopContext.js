import React, { Component, createContext } from "react";
import Client from "shopify-buy";

const ShopContext = createContext();

const client = Client.buildClient({
  storefrontAccessToken: process.env.REACT_APP_SHOPIFY_STOREFRONT_KEY,
  domain: process.env.REACT_APP_SHOPIFY_DOMAIN,
  
});

class ShopProvider extends Component {
  state = {
    product: {},
    products: [],
    checkout: {},
    inCartOpen: false,
    inMenuOpen: false,
  };

  componentDidMount() {
    if(localStorage.checkout_id){
      this.fetchCheckout(localStorage.checkout_id)
    } else {
      this.createCheckout()
    }
    
    // this.fetchAllProducts()
  }

  createCheckout = async () => {
    // Create an empty checkout
    const checkout = await client.checkout.create()
    localStorage.setItem("checkout_id", checkout.id)
    this.setState({checkout: checkout})


  };

  fetchCheckout = async (checkoutId) => {
    client.checkout
      .fetch(checkoutId)
      .then((checkout) => {
      // Do something with the checkout
      console.log(checkout);
    });
  };

  addItemtoCheckout = async () => {};

  removeLineItem = async (lineItemIdsToRemove) => {};

  fetchAllProducts = async () => {
    const products = await client.product.fetchAll()
    this.setState({ products });

    
  };

  fetchProductWithHandle = async (handle) => {
    const product = await client.product.fetchByHandle(handle) 
    this.setState({product})
  };

  closeCart = () => {};

  openCart = () => {};

  closeMenu = () => {};
  openMenu = () => {};

  render() {

    return (
    <ShopContext.Provider value = {{
      ...this.state,
      fetchAllProducts: this.fetchAllProducts,
      fetchProductWithHandle:this.fetchProductWithHandle,
      addItemtoCheckout:this.addItemtoCheckout,
      removeLineItem:this.removeLineItem,
      closeCart:this.closeCart,
      openCart:this.openCart,
      closeMenu:this.closeMenu,
      openMenu:this.openMenu,
      }}>
      {this.props.children}
    </ShopContext.Provider>
    )
  }
}

const ShopConsumer = ShopContext.Consumer;
export { ShopConsumer, ShopContext };
export default ShopProvider;
