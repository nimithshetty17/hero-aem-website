import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
    const fragment = await loadFragment('/header-data-new');

    block.textContent = '';
    const newHeader = document.createElement('div');
    while (fragment.firstElementChild) newHeader.append(fragment.firstElementChild);
    console.log('newHeader: ', newHeader);

    const headerTabs = newHeader.querySelector('.header-tabs');
    console.log('headerTabs: ', headerTabs);

    block.append(newHeader);
}
