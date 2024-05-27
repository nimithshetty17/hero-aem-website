function createModelContent(modelData) {
  const fragment = document.createDocumentFragment();

  const img = document.createElement('img');
  img.src = modelData.imgSrc;
  img.alt = `${modelData.name} ${modelData.cc}`;
  fragment.appendChild(img);

  const name = document.createElement('p');
  name.textContent = modelData.name;
  fragment.appendChild(name);

  const cc = document.createElement('p');
  cc.textContent = modelData.cc;
  fragment.appendChild(cc);

  return fragment;
}

function createModelDiv(modelData) {
  const modelDiv = document.createElement('div');
  modelDiv.classList.add('motorcycle-model');

  const content = createModelContent(modelData);

  if (modelData.link) {
    const link = document.createElement('a');
    link.href = modelData.link;
    link.title = 'Link';
    link.appendChild(content);
    modelDiv.appendChild(link);
  } else {
    modelDiv.appendChild(content);
  }

  return modelDiv;
}

function processFragmentWrapper(wrapper) {
  const practicalSection = wrapper.querySelector(
    '.motorcycle-practical-category'
  );
  const executiveSection = wrapper.querySelector(
    '.motorcycle-executive-category'
  );
  const performanceSection = wrapper.querySelector(
    '.motorcycle-performance-category'
  );

  if (!practicalSection && !executiveSection && !performanceSection) {
    return; // Skip if no motorcycle categories are present
  }

  const categories = [
    { section: practicalSection, className: 'Practical' },
    { section: executiveSection, className: 'Executive' },
    { section: performanceSection, className: 'Performance' },
  ];

  const motorcycleContainer = document.createElement('div');
  motorcycleContainer.classList.add('motorcycle-container');

  categories.forEach((category) => {
    if (category.section) {
      const categoryDiv = document.createElement('div');
      categoryDiv.classList.add('motorcycle-category');

      const categoryTitle = document.createElement('h2');
      categoryTitle.textContent = category.className;
      categoryDiv.appendChild(categoryTitle);

      const modelsDiv = document.createElement('div');
      modelsDiv.classList.add('motorcycle-models');

      const models = category.section.querySelectorAll(
        '.default-content-wrapper p'
      );
      models.forEach((model) => {
        const img = model.querySelector('img');
        const nameNode = model.childNodes[0];
        const ccNode = model.childNodes[4];
        const name = nameNode ? nameNode.textContent.trim() : '';
        const cc = ccNode ? ccNode.textContent.trim() : '';
        const link = model.querySelector('a')
          ? model.querySelector('a').href
          : null;

        const modelData = {
          imgSrc: img ? img.src : '',
          name: name,
          cc: cc,
          link: link,
        };

        modelsDiv.appendChild(createModelDiv(modelData));
      });

      categoryDiv.appendChild(modelsDiv);
      motorcycleContainer.appendChild(categoryDiv);
    }
  });

  wrapper.innerHTML = '';
  wrapper.appendChild(motorcycleContainer);
}
export default function motorcycleDOMTransform() {
  const fragmentWrappers = document.querySelectorAll('.fragment-wrapper');
  fragmentWrappers.forEach((wrapper) => {
    processFragmentWrapper(wrapper);
  });
}
