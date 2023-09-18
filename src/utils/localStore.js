class Storage {
  store(key, data){
    localStorage.setItem(key, JSON.stringify(data));
  }

  getJson(key) {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  }

  get(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  remove(key) {
    localStorage.removeItem(key);
  }

  clearAll() {
    localStorage.clear();
  }
}

export default new Storage();
