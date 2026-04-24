// ===== FOJI GAS — DATABASE (localStorage CRUD) =====

const DB = {
  // ---- KEYS ----
  KEYS: {
    stock: 'fg_stock',
    sales: 'fg_sales',
    parts: 'fg_parts',
    expenses: 'fg_expenses',
    settings: 'fg_settings',
  },

  // ---- HELPERS ----
  _get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
  },
  _set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },
  _id() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  },
  _today() {
    return new Date().toISOString().split('T')[0];
  },

  // ============================
  // STOCK
  // ============================
  Stock: {
    getAll() { return DB._get(DB.KEYS.stock); },

    getOrInit() {
      let s = DB._get(DB.KEYS.stock);
      if (!s.length) {
        // Default stock record
        s = [{
          id: DB._id(),
          cyl_12kg: 0,
          cyl_45kg: 0,
          gas_kg: 0,
          updatedAt: DB._today()
        }];
        DB._set(DB.KEYS.stock, s);
      }
      return s[0];
    },

    update(data) {
      const s = DB._get(DB.KEYS.stock);
      if (s.length) {
        Object.assign(s[0], data, { updatedAt: DB._today() });
        DB._set(DB.KEYS.stock, s);
        return s[0];
      } else {
        const rec = { id: DB._id(), ...data, updatedAt: DB._today() };
        DB._set(DB.KEYS.stock, [rec]);
        return rec;
      }
    },

    getLogs() {
      try { return JSON.parse(localStorage.getItem('fg_stock_logs')) || []; }
      catch { return []; }
    },

    addLog(entry) {
      const logs = DB.Stock.getLogs();
      logs.unshift({ id: DB._id(), date: DB._today(), ...entry });
      localStorage.setItem('fg_stock_logs', JSON.stringify(logs.slice(0, 200)));
    }
  },

  // ============================
  // LPG SALES
  // ============================
  Sales: {
    getAll() { return DB._get(DB.KEYS.sales); },

    add(data) {
      const all = DB._get(DB.KEYS.sales);
      const rec = {
        id: DB._id(),
        date: DB._today(),
        createdAt: new Date().toISOString(),
        ...data
      };
      all.unshift(rec);
      DB._set(DB.KEYS.sales, all);
      return rec;
    },

    update(id, data) {
      const all = DB._get(DB.KEYS.sales);
      const idx = all.findIndex(r => r.id === id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
        DB._set(DB.KEYS.sales, all);
        return all[idx];
      }
      return null;
    },

    delete(id) {
      const all = DB._get(DB.KEYS.sales).filter(r => r.id !== id);
      DB._set(DB.KEYS.sales, all);
    },

    getByDate(date) {
      return DB._get(DB.KEYS.sales).filter(r => r.date === date);
    },

    getByMonth(year, month) {
      return DB._get(DB.KEYS.sales).filter(r => {
        const d = new Date(r.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      });
    },

    getByYear(year) {
      return DB._get(DB.KEYS.sales).filter(r => {
        return new Date(r.date).getFullYear() === year;
      });
    }
  },

  // ============================
  // PARTS SALES
  // ============================
  Parts: {
    getAll() { return DB._get(DB.KEYS.parts); },

    add(data) {
      const all = DB._get(DB.KEYS.parts);
      const rec = {
        id: DB._id(),
        date: DB._today(),
        createdAt: new Date().toISOString(),
        ...data
      };
      all.unshift(rec);
      DB._set(DB.KEYS.parts, all);
      return rec;
    },

    update(id, data) {
      const all = DB._get(DB.KEYS.parts);
      const idx = all.findIndex(r => r.id === id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
        DB._set(DB.KEYS.parts, all);
        return all[idx];
      }
      return null;
    },

    delete(id) {
      const all = DB._get(DB.KEYS.parts).filter(r => r.id !== id);
      DB._set(DB.KEYS.parts, all);
    },

    getByDate(date) {
      return DB._get(DB.KEYS.parts).filter(r => r.date === date);
    },

    getByMonth(year, month) {
      return DB._get(DB.KEYS.parts).filter(r => {
        const d = new Date(r.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      });
    },

    getByYear(year) {
      return DB._get(DB.KEYS.parts).filter(r => {
        return new Date(r.date).getFullYear() === year;
      });
    }
  },

  // ============================
  // EXPENSES
  // ============================
  Expenses: {
    getAll() { return DB._get(DB.KEYS.expenses); },

    add(data) {
      const all = DB._get(DB.KEYS.expenses);
      const rec = {
        id: DB._id(),
        date: DB._today(),
        createdAt: new Date().toISOString(),
        ...data
      };
      all.unshift(rec);
      DB._set(DB.KEYS.expenses, all);
      return rec;
    },

    update(id, data) {
      const all = DB._get(DB.KEYS.expenses);
      const idx = all.findIndex(r => r.id === id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...data, updatedAt: new Date().toISOString() };
        DB._set(DB.KEYS.expenses, all);
        return all[idx];
      }
      return null;
    },

    delete(id) {
      const all = DB._get(DB.KEYS.expenses).filter(r => r.id !== id);
      DB._set(DB.KEYS.expenses, all);
    },

    getByDate(date) {
      return DB._get(DB.KEYS.expenses).filter(r => r.date === date);
    },

    getByMonth(year, month) {
      return DB._get(DB.KEYS.expenses).filter(r => {
        const d = new Date(r.date);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      });
    }
  },

  // ============================
  // UTILITIES
  // ============================
  sum(arr, field) {
    return arr.reduce((acc, r) => acc + (parseFloat(r[field]) || 0), 0);
  },

  fmt(n) {
    return Number(n).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  },

  today() { return new Date().toISOString().split('T')[0]; },

  nowYM() {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  }
};
