import { RouteAction, RouteActionData } from './store/action/routeAction';
import { Page, PageName } from './types';

export const pages: Page[] = [
    { name: PageName.INDEX, url: '' },
    { name: PageName.INDEX, url: 'index' },
    { name: PageName.LOGIN, url: 'login' },
    { name: PageName.REGISTRATION, url: 'registration' },
    { name: PageName.ACCOUNT, url: 'account' },
    { name: PageName.CART, url: 'cart', hasResourse: true },
    { name: PageName.CATALOG, url: 'catalog' },
    { name: PageName.ABOUT_US, url: 'about-us' },
    { name: PageName.NOT_FOUND, url: 'not_found' },
];

export class Router {
    private basePath = '';
    private routeAction: RouteAction;

    constructor() {
        this.routeAction = new RouteAction();
        document.addEventListener('DOMContentLoaded', () => {
            const host: string = window.location.host;
            if (host.includes('localhost')) {
                this.basePath = '/';
            } else if (host.includes('127.0.0.1')) {
                this.basePath = '/eCommerce-Application/eCommerce-Application/dist/';
            } else {
                this.basePath = '/eCommerce-sprint2-deploy/';
            }
            this.navigate();
        });
        window.addEventListener('popstate', this.navigate.bind(this));
    }

    public addHistory(page: PageName, resource?: string): void {
        let url: string = pages.find((item) => item.name === page)?.url as string;
        if (resource) {
            url += '/' + resource;
        }
        window.history.pushState(null, '', this.basePath + url);
    }

    private navigate(): void {
        const url = window.location.pathname.slice(this.basePath.length);
        const url_arr = url.split('/');
        if (url_arr.length > 1 && url_arr.at(-1) === '') {
            url_arr.pop();
        }
        let pageName: PageName;
        if (url_arr.length > 2) {
            pageName = PageName.NOT_FOUND;
        } else {
            const page: Page | undefined = pages.find((item) => item.url === url_arr[0]); //?.name;
            if (!page || Boolean(page.hasResourse) != url_arr.length > 1) {
                pageName = PageName.NOT_FOUND;
            } else {
                pageName = page?.name || PageName.NOT_FOUND;
            }
        }
        const data: RouteActionData = { addHistory: false, page: pageName };
        if (url_arr.length > 1) {
            data.resource = url_arr[1];
        }
        this.routeAction.changePage(data);
    }
}
