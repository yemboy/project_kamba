const filterButtons = [...document.querySelectorAll('.filter-btn')];
const columns = [...document.querySelectorAll('.column')];
const modalOverlay = document.getElementById('modal-overlay');
const openModalBtn = document.getElementById('open-modal-btn');
const cancelModalBtn = document.getElementById('cancel-modal-btn');
const newCardForm = document.getElementById('new-card-form');
const titleInput = document.getElementById('card-title');

let activePriorityFilter = 'all';
let draggedCard = null;

const makeCardDraggable = (card) => {
  card.setAttribute('draggable', 'true');

  card.addEventListener('dragstart', (event) => {
    draggedCard = card;
    card.classList.add('dragging');
    event.dataTransfer?.setData('text/plain', card.dataset.id || '');
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    draggedCard = null;
    columns.forEach((column) => column.classList.remove('drag-over'));
  });
};

const updateColumnCounters = () => {
  columns.forEach((column) => {
    const visibleCards = column.querySelectorAll('.card:not(.hidden)').length;
    const countEl = column.querySelector('.column-count');
    if (countEl) {
      countEl.textContent = String(visibleCards);
    }
  });
};

const filterCards = (priority) => {
  activePriorityFilter = priority;
  document.querySelectorAll('.card').forEach((card) => {
    const shouldShow = priority === 'all' || card.dataset.priority === priority;
    card.classList.toggle('hidden', !shouldShow);
  });

  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === priority);
  });

  updateColumnCounters();
};

const animateDoneCards = () => {
  const doneCards = document.querySelectorAll('.column-done .card');
  doneCards.forEach((card) => {
    card.style.animation = 'none';
    requestAnimationFrame(() => {
      card.style.animation = '';
    });
  });
};

const closeModal = () => {
  modalOverlay.classList.add('hidden');
  modalOverlay.setAttribute('aria-hidden', 'true');
  newCardForm.reset();
};

const openModal = () => {
  modalOverlay.classList.remove('hidden');
  modalOverlay.setAttribute('aria-hidden', 'false');
  titleInput.focus();
};

const createCard = ({ title, description, priority, column }) => {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    return;
  }

  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = String(Date.now());
  card.dataset.priority = priority;

  const badge = document.createElement('span');
  badge.className = `priority-badge priority-${priority}`;
  badge.textContent = priority;

  const cardTitle = document.createElement('h3');
  cardTitle.className = 'card-title';
  cardTitle.textContent = trimmedTitle;

  const cardDesc = document.createElement('p');
  cardDesc.className = 'card-desc';
  cardDesc.textContent = description.trim();

  card.append(badge, cardTitle, cardDesc);

  const targetColumn = document.querySelector(`.column[data-column="${column}"] .cards-container`);
  if (!targetColumn) {
    return;
  }

  targetColumn.appendChild(card);
  makeCardDraggable(card);
  filterCards(activePriorityFilter);

  if (column === 'done') {
    animateDoneCards();
  }

  closeModal();
};

const initDragAndDrop = () => {
  document.querySelectorAll('.card').forEach(makeCardDraggable);

  columns.forEach((column) => {
    const cardsContainer = column.querySelector('.cards-container');

    cardsContainer?.addEventListener('dragover', (event) => {
      event.preventDefault();
      column.classList.add('drag-over');
    });

    cardsContainer?.addEventListener('dragleave', (event) => {
      if (!column.contains(event.relatedTarget)) {
        column.classList.remove('drag-over');
      }
    });

    cardsContainer?.addEventListener('drop', (event) => {
      event.preventDefault();
      column.classList.remove('drag-over');

      if (!draggedCard) {
        return;
      }

      cardsContainer.appendChild(draggedCard);
      filterCards(activePriorityFilter);

      if (column.dataset.column === 'done') {
        animateDoneCards();
      }
    });
  });
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterCards(button.dataset.filter || 'all');
  });
});

openModalBtn.addEventListener('click', openModal);
cancelModalBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
    closeModal();
  }
});

newCardForm.addEventListener('submit', (event) => {
  event.preventDefault();

  createCard({
    title: document.getElementById('card-title').value,
    description: document.getElementById('card-description').value,
    priority: document.getElementById('card-priority').value,
    column: document.getElementById('card-column').value
  });
});

initDragAndDrop();
filterCards('all');
