import { Layout } from './pages/layout';
import { Router } from './router';
import { CartStore } from './store/cart-store';

export default class App {
    private cartStore: CartStore;
    private layout = new Layout();
    private router = new Router();

    constructor() {
        this.cartStore = new CartStore();
        this.cartStore.initCart().then(() => {
            this.router.initRouter();
            this.layout.render();
        });
    }
}
