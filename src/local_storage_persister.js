/* globals localStorage */
import Immutable from 'immutable';

const localStorageAvailable = () => {
  try {
    localStorage.setItem('test', 'test');
    return localStorage.getItem('test') === 'test';
  } catch(e) {
    return false;
  }
};

const fields = [
  {
    category: 'org',
    name: 'filePath',
    type: 'nullable'
  },
  {
    category: 'org',
    name: 'fontSize',
    type: 'nullable'
  },
  {
    category: 'org',
    name: 'bulletStyle',
    type: 'nullable'
  },
  {
    category: 'org',
    name: 'headerSpacing',
    type: 'nullable'
  },
  {
    category: 'dropbox',
    name: 'liveSync',
    type: 'boolean'
  },
  {
    category: 'dropbox',
    name: 'dropboxAccessToken',
    type: 'nullable'
  }
];

// Read initial state from localStorage.
export const readInitialState = () => {
  if (!localStorageAvailable()) {
    return undefined;
  }

  let initialState = {
    org: Immutable.fromJS({}),
    dropbox: Immutable.fromJS({})
  };

  fields.forEach(field => {
    let value = localStorage.getItem(field.name);
    if (field.type === 'nullable') {
      if (value === 'null') {
        value = null;
      }
    } else if (field.type === 'boolean') {
      value = value === 'true';
    }
    initialState[field.category] = initialState[field.category].set(field.name, value);
  });

  return initialState;
};

// Persist some fields to localStorage;
export const subscribeToChanges = storeInstance => {
  return () => {
    if (!localStorageAvailable()) {
      return;
    }

    const state = storeInstance.getState();

    fields.filter(f => f.category === 'org').map(f => f.name).forEach(field => {
      localStorage.setItem(field, state.org.get(field));
    });
    fields.filter(f => f.category === 'dropbox').map(f => f.name).forEach(field => {
      localStorage.setItem(field, state.dropbox.get(field));
    });
  };
};
