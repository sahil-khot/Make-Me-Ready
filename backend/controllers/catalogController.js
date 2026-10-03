import { CatalogItem } from "../models/index.js";
import {
  brands,
  cats,
  colors,
  lookTabs,
  looks,
  occasions,
  products,
  shopCats,
  styles,
  wardrobe,
} from "../../frontend/src/data.js";

const fallbackCatalog = {
  occasions,
  wardrobe,
  looks,
  products,
  config: { brands, cats, colors, lookTabs, shopCats, styles },
};

export const getCatalog = async (_req, res, next) => {
  try {
    const entries = await CatalogItem.find().lean();
    if (!entries || entries.length === 0) {
      return res.json(fallbackCatalog);
    }

    const catalog = Object.fromEntries(
      ["occasions", "wardrobe", "looks", "products"].map((type) => [
        type,
        entries.filter((item) => item.type === type).map((item) => item.data),
      ]),
    );

    catalog.config = entries.find((item) => item.type === "config")?.data || {
      brands,
      cats,
      colors,
      lookTabs,
      shopCats,
      styles,
    };

    return res.json(catalog);
  } catch (error) {
    // If DB fails, respond with fallback catalog instead of crashing
    return res.json(fallbackCatalog);
  }
};
