import { PageName, StoreEventType } from '../types';
import { AppStore } from '../store/app-store';
import { Page } from './abstract/page';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import { HomePage } from './home/home';
import { NotFoundPage } from './notfound/notfound';
import { LoginPage } from './login/login';
import { RegisterPage } from './registration/registration';
import { AccountPage } from './account/account';
import { CatalogPage } from './catalog/catalog';
import { ProductPage } from './product/product';
import { CartPage } from './cart/cart';
import { AboutPage } from './about/about';

export class Layout extends Page {
    private appStore = new AppStore();

    private homePage = new HomePage();
    private loginPage = new LoginPage();
    private registerPage = new RegisterPage();
    private accountPage = new AccountPage();
    private catalogPage = new CatalogPage();
    private productPage = new ProductPage();
    private cartPage = new CartPage();
    private aboutPage = new AboutPage();
    private notFound = new NotFoundPage();

    private mainEl = document.createElement('main');

    private header = new Header();
    private main: Page = this.homePage;
    private footer = new Footer();

    constructor() {
        super();
        this.appStore.addChangeListener(StoreEventType.PAGE_CHANGE, this.onStoreChange.bind(this));
    }

    protected onStoreChange(): void {
        const page: PageName = this.appStore.getCurrentPage();
        switch (page) {
            case PageName.INDEX:
                this.updateMainView(this.homePage);
                break;
            case PageName.LOGIN:
                this.updateMainView(this.loginPage);
                break;
            case PageName.REGISTRATION:
                this.updateMainView(this.registerPage);
                break;
            case PageName.ACCOUNT:
                this.updateMainView(this.accountPage);
                break;
            case PageName.CART:
                this.updateMainView(this.cartPage);
                break;
            case PageName.PRODUCT:
                this.updateMainView(this.productPage);
                break;
            case PageName.CATALOG:
                this.updateMainView(this.catalogPage);
                break;
            case PageName.ABOUT_US:
                this.updateMainView(this.aboutPage);
                break;
            case PageName.NOT_FOUND:
                this.updateMainView(this.notFound);
                break;
        }
    }

    private updateMainView(page: Page): void {
        this.mainEl.innerHTML = '';
        this.main = page;
        this.main.render();
        this.mainEl.append(this.main.getHtml());
    }

    public render(): void {
        this.header.render();
        this.footer.render();
        this.mainEl.append(this.main.getHtml());
        document.body.append(this.header.getComponent(), this.mainEl, this.footer.getComponent());
    }
}
