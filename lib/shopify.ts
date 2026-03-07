const SHOPIFY_STORE_DOMAIN = "nkmc2n-ii.myshopify.com";
const SHOPIFY_STOREFRONT_TOKEN = "40ad06338c25a61509bbc4a9f93f628a";
const API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2026-01/graphql.json`;

// Product variant IDs (fetched from Shopify Storefront API)
export const VARIANTS = {
  BUNDLE: "gid://shopify/ProductVariant/59174582517841",         // 3-Serum System Bundle — $99
  VITAMIN_C: "gid://shopify/ProductVariant/59039475138641",      // Vitamin C Serum — $20
  DARK_SPOT_NORMAL: "gid://shopify/ProductVariant/59039474942033", // Dark Spot Serum (Normal) — $20
  DARK_SPOT_SENSITIVE: "gid://shopify/ProductVariant/59089641472081", // Dark Spot Serum (Sensitive) — $27.90
  RETINOL: "gid://shopify/ProductVariant/59040204882001",        // Retinol & Peptide — $29.90
} as const;

export interface ShopifyCartLine {
  lineId: string;
  merchandiseId: string;
  name: string;
  price: number;
  qty: number;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: ShopifyCartLine[];
}

interface RawCartLineNode {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    price: { amount: string };
    product: { title: string };
  };
}

function parseCart(raw: {
  id: string;
  checkoutUrl: string;
  lines: { edges: { node: RawCartLineNode }[] };
}): ShopifyCart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    lines: raw.lines.edges.map(({ node }) => ({
      lineId: node.id,
      merchandiseId: node.merchandise.id,
      name: node.merchandise.product.title,
      price: parseFloat(node.merchandise.price.amount),
      qty: node.quantity,
    })),
  };
}

const CART_FIELDS = `
  id
  checkoutUrl
  lines(first: 20) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            price { amount }
            product { title }
          }
        }
      }
    }
  }
`;

async function storeFetch(query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  return res.json();
}

export async function createCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<ShopifyCart> {
  const { data } = await storeFetch(
    `mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }`,
    { input: { lines } }
  );
  return parseCart(data.cartCreate.cart);
}

export async function addCartLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<ShopifyCart> {
  const { data } = await storeFetch(
    `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }`,
    { cartId, lines }
  );
  return parseCart(data.cartLinesAdd.cart);
}

export async function removeCartLines(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
  const { data } = await storeFetch(
    `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }`,
    { cartId, lineIds }
  );
  return parseCart(data.cartLinesRemove.cart);
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<ShopifyCart> {
  const { data } = await storeFetch(
    `mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ${CART_FIELDS} }
        userErrors { field message }
      }
    }`,
    { cartId, lines }
  );
  return parseCart(data.cartLinesUpdate.cart);
}
