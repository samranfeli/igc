import { ProductItem, ProductItemDeveloper, ProductItemGameplay, ProductItemGenres, ProductItemPlayerPerspective, ProductItemPublisher, ProductItemTheme } from "@/types/commerce";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Products = {
    availableFilters: {
        publishers: ProductItemPublisher[];
        developers: ProductItemDeveloper[];
        gameplays: ProductItemGameplay[];
        genres: ProductItemGenres[];
        themes: ProductItemTheme[];
        playerPerspectives: ProductItemPlayerPerspective[];
        pegis: ProductItem["pegi"][];
        esrbs: ProductItem["esrb"][];
        variants: {
            id: number;
            value?: string;
            slug?: string;
        }[];
    };
    openedFilter: string | "" | "all";
};

const initialState: Products = {
    availableFilters: {
        publishers: [],
        developers: [],
        gameplays: [],
        genres: [],
        themes: [],
        playerPerspectives: [],
        pegis: [],
        esrbs: [],
        variants: []
    },
    openedFilter: ""
};

export const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setAvailableFilters: (state, action) => {
            state.availableFilters = action.payload;
        },
        openFilter: (state, action: PayloadAction<string | "" | "all">) => {
            state.openedFilter = action.payload;
        },
    }
});

export const { setAvailableFilters,openFilter } = productsSlice.actions

export default productsSlice.reducer;