/* eslint-disable no-undef */
/**
 * @jest-environment jsdom
 */

import { RouteAction } from '../src/store/action/routeAction';
import { AppStore } from '../src/store/app-store';
import { PageName } from '../src/types';

test('appStore.constructor', () => {
    const appStore = new AppStore();

    expect(appStore.getCurrentPage()).toBe(PageName.INDEX);
    expect(appStore.getIsAnonUser()).toBe(true);
});

test('appStore.changePage', () => {
    const appStore = new AppStore();
    const action = new RouteAction();
    action.changePage({ addHistory: false, page: PageName.LOGIN });

    expect(appStore.getCurrentPage()).toBe(PageName.LOGIN);
});
