import { elements } from './base';

export const renderItem = item => {
    const markup =`
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.count}" step="${item.count}" class="shopping__count--value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.ingredient}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = id => {
    //using css attribute selector -> [] we want to select the data-itemid and the id which we passed into the created list item, therefore the ids will be the same.
    const item = document.querySelector(`[data-itemid="${id}"]`);
    // removing the list item from the UI.
    if (item) item.parentElement.removeChild(item);

};