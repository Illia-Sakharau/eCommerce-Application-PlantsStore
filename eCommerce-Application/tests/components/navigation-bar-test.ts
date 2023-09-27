/* eslint-disable no-undef */
/**
 * @jest-environment jsdom
 */

import NavigationBar from '../../src/components/navigation-bar/navigation-bar';
import { RouteAction } from '../../src/store/action/routeAction';
import { PageName } from '../../src/types';

test('navigarionBar.constructor', () => {
    const nav = new NavigationBar([
        { page: PageName.LOGIN, text: 'LOGIN' },
        { page: PageName.REGISTRATION, text: 'REGISTRATION' },
    ]);
    const el = nav.getComponent();

    expect(el.classList.contains('nav-bar')).toBe(true);
    expect(el.childNodes.length).toBe(2);
});

test('navigarionBar.changePage', () => {
    const nav = new NavigationBar([
        { page: PageName.LOGIN, text: 'LOGIN' },
        { page: PageName.REGISTRATION, text: 'REGISTRATION' },
    ]);
    const el = nav.getComponent();
    const action = new RouteAction();
    action.changePage({ addHistory: false, page: PageName.REGISTRATION });

    expect(el.querySelector('.current')?.textContent).toBe('REGISTRATION');
});
