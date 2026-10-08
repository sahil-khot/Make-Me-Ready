import {
  Occasion,
  CatalogWardrobe,
  Look,
  Product,
  AppConfig,
  CatalogItem,
} from "../models/index.js";
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

export const getCatalog = async (_req, res) => {
  try {
    // 1. Try reading from dedicated collections first
    const [dbOccasions, dbWardrobe, dbLooks, dbProducts, dbConfig] =
      await Promise.all([
        Occasion.find().lean(),
        CatalogWardrobe.find().lean(),
        Look.find().lean(),
        Product.find().lean(),
        AppConfig.findOne({ key: "main" }).lean(),
      ]);

    if (
      dbOccasions.length > 0 ||
      dbWardrobe.length > 0 ||
      dbLooks.length > 0 ||
      dbProducts.length > 0
    ) {
      return res.json({
        occasions: dbOccasions.length > 0 ? dbOccasions : occasions,
        wardrobe: dbWardrobe.length > 0 ? dbWardrobe : wardrobe,
        looks: dbLooks.length > 0 ? dbLooks : looks,
        products: dbProducts.length > 0 ? dbProducts : products,
        cats: dbConfig?.cats || cats,
        shopCats: dbConfig?.shopCats || shopCats,
        brands: dbConfig?.brands || brands,
        styles: dbConfig?.styles || styles,
        colors: dbConfig?.colors || colors,
        lookTabs: dbConfig?.lookTabs || lookTabs,
        config: dbConfig
          ? {
              brands: dbConfig.brands || brands,
              cats: dbConfig.cats || cats,
              colors: dbConfig.colors || colors,
              lookTabs: dbConfig.lookTabs || lookTabs,
              shopCats: dbConfig.shopCats || shopCats,
              styles: dbConfig.styles || styles,
            }
          : { brands, cats, colors, lookTabs, shopCats, styles },
      });
    }

    // 2. Try polymorphic CatalogItem fallback
    const entries = await CatalogItem.find().lean();
    if (entries && entries.length > 0) {
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
    }

    return res.json(fallbackCatalog);
  } catch (error) {
    console.warn("Catalog fetch fallback due to error:", error.message);
    return res.json(fallbackCatalog);
  }
};
