import { getMetadata } from "../../scripts/aem.js";
import { loadFragment } from "../fragment/fragment.js";

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata("footer");
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : "/footer";
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = "";
  const footer = document.createElement("div");
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const footerLinks1 = footer.querySelectorAll(
    ".footer-links > div:first-of-type p"
  );
  buttonClassRemover(footerLinks1);

  const footerLinks2 = footer.querySelectorAll(
    ".footer-links > div:last-of-type p"
  );
  buttonClassRemover(footerLinks2);

  block.append(footer);
}

const buttonClassRemover = (listOfPara) => {
  listOfPara.classList.remove("button-container");

  let linkAnchor = listOfPara.querySelector("a");
  if (linkAnchor) linkAnchor.classList.remove("button");
};
