import { create } from "zustand";

const translations = {
  en: {
    welcome: "Welcome to Stuffy Supermarket",
    search_placeholder: "Search tech gear...",
    add_to_cart: "Add to Cart",
    view_details: "View Details",
    cart: "Cart",
    login: "Login",
    logout: "Logout",
    flash_sale: "Flash Sale Madness",
    ends_in: "Ends in",
    category: "Category",
    all: "All",
    language: "Language"
  },
  vi: {
    welcome: "Chào mừng đến với Stuffy Supermarket",
    search_placeholder: "Tìm kiếm đồ công nghệ...",
    add_to_cart: "Thêm vào giỏ",
    view_details: "Xem chi tiết",
    cart: "Giỏ hàng",
    login: "Đăng nhập",
    logout: "Đăng xuất",
    flash_sale: "Cơn lốc Flash Sale",
    ends_in: "Kết thúc sau",
    category: "Danh mục",
    all: "Tất cả",
    language: "Ngôn ngữ"
  }
};

interface I18nState {
  lang: 'en' | 'vi';
  setLang: (lang: 'en' | 'vi') => void;
  t: (key: keyof typeof translations['en']) => string;
}

export const useI18nStore = create<I18nState>((set, get) => ({
  lang: (localStorage.getItem('stuffy_lang') as 'en' | 'vi') || 'en',
  
  setLang: (lang) => {
    localStorage.setItem('stuffy_lang', lang);
    set({ lang });
    // Phát sự kiện toàn cục để các app khác có thể phản ứng nếu cần
    window.dispatchEvent(new CustomEvent('STUFFY_LANG_CHANGED', { detail: lang }));
  },

  t: (key) => {
    const { lang } = get();
    return translations[lang][key] || key;
  }
}));
