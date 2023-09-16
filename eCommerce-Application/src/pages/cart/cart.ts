import './cart.scss';
import { AppStore } from '../../store/app-store';
import createElement from '../../utils/create-element';
import { Page } from '../abstract/page';
import { CartActions } from '../../store/action/cartActions';
import { Button } from '../../components/button/button';
import { CartStore } from '../../store/cart-store';
import CartItem from '../../components/cart-item/cart-item';

export class CartPage extends Page {
    private cartAction: CartActions;

    constructor(private appStore: AppStore, private cartStore: CartStore) {
        super();
        this.cartAction = new CartActions();
    }

    public async render(): Promise<void> {
        this.html = document.createElement('div');
        this.html.append(this.createCartSection());
    }

    private createCartSection(): HTMLElement {
        const heroBannerEl = createElement({ tag: 'section', classes: ['cart'] });
        const wrapperEl = createElement({ tag: 'div', classes: ['wrapper', 'cart__wrapper'] });
        const myCartEl = this.createMyCart();
        const summaryEl = this.createSummary();

        wrapperEl.append(myCartEl, summaryEl);
        heroBannerEl.append(wrapperEl);
        return heroBannerEl;
    }

    private createMyCart(): HTMLElement {
        const myCartEl = createElement({ tag: 'div', classes: ['cart__my-cart'] });
        const headerEl = this.createMyCartHeader();
        const listEl = this.createMyCartList();

        myCartEl.append(headerEl, listEl);
        return myCartEl;
    }

    private createMyCartHeader(): HTMLElement {
        const headerEl = createElement({ tag: 'div', classes: ['my-cart__header'] });
        const titleEl = createElement({
            tag: 'h4',
            classes: ['my-cart__title'],
            text: 'My Cart',
        });
        const btnResetCartEl = new Button('bordered', 'clear-cart', 'Clear cart').getComponent();
        btnResetCartEl.classList.add('button_bordered_negative');
        btnResetCartEl.addEventListener('click', () => {
            this.cartAction.clearCart();
            console.log('Clear cart');
        });

        headerEl.append(titleEl, btnResetCartEl);
        return headerEl;
    }

    private createMyCartList(): HTMLElement {
        const cartListEl = createElement({
            tag: 'div',
            classes: ['my-cart__list'],
        });

        cartListEl.innerHTML = `
            <div class="my-cart__list-header">
                <p class="header-plant">Plant</p>
                <p class="header-price">Price</p>
                <p class="header-count">Quantity</p>
                <p class="header-total">Total</p>
            </div>
        `;

        const items = this.cartStore.getCartItems();
        for (let i = 0; i < items.length; i += 1) {
            const item = new CartItem(items[i].productID, items[i].count as number, this.cartStore);
            item.render();
            cartListEl.append(item.getComponent());
        }

        return cartListEl;
    }

    private createSummary(): HTMLElement {
        const summaryEl = createElement({ tag: 'div', classes: ['cart__summary', 'summary'] });
        const headerEl = createElement({
            tag: 'h4',
            classes: ['summary__header'],
            text: 'Summary',
        });
        const innerEl = this.createSummaryInner();

        summaryEl.append(headerEl, innerEl);
        return summaryEl;
    }

    private createSummaryInner(): HTMLElement {
        const summaryInnerEl = createElement({
            tag: 'div',
            classes: ['summary__inner'],
            text: 'SUMMARY_INNER',
        });

        return summaryInnerEl;
    }
}
