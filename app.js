// ===== FOJI GAS — APP =====

const App = {
  currentPage: 'dashboard',

  init() {
    this.setDate();
    this.bindNav();
    this.bindModal();
    this.bindMenuToggle();
    this.navigate('dashboard');
  },

  setDate() {
    const opts = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-PK', opts);
  },

  bindNav() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const page = link.dataset.page;
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        this.navigate(page);
        // close sidebar on mobile
        document.getElementById('sidebar').classList.remove('open');
      });
    });
  },

  bindMenuToggle() {
    document.getElementById('menuToggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });
  },

  bindModal() {
    document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
    document.getElementById('modalOverlay').addEventListener('click', e => {
      if (e.target === document.getElementById('modalOverlay')) this.closeModal();
    });
  },

  navigate(page) {
    this.currentPage = page;
    const titles = {
      dashboard: 'Dashboard',
      stock: 'Cylinder Stock',
      sales: 'LPG Sales',
      parts: 'Parts Sales',
      expenses: 'Expenses',
      reports: 'Reports & Analytics',
      history: 'Transaction History'
    };
    document.getElementById('pageTitle').textContent = titles[page] || page;
    const renderers = {
      dashboard: () => this.renderDashboard(),
      stock: () => this.renderStock(),
      sales: () => this.renderSales(),
      parts: () => this.renderParts(),
      expenses: () => this.renderExpenses(),
      reports: () => this.renderReports(),
      history: () => this.renderHistory()
    };
    if (renderers[page]) renderers[page]();
  },

  openModal(title, html) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('modalOverlay').classList.add('open');
  },

  closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
    this.navigate(this.currentPage);
  },

  setContent(html) {
    document.getElementById('content').innerHTML = html;
  },

  // ========================
  // DASHBOARD
  // ========================
  renderDashboard() {
    const today = DB.today();
    const { year, month } = DB.nowYM();

    const todaySales = DB.Sales.getByDate(today);
    const todayParts = DB.Parts.getByDate(today);
    const monthSales = DB.Sales.getByMonth(year, month);
    const monthParts = DB.Parts.getByMonth(year, month);
    const yearSales = DB.Sales.getByYear(year);
    const yearParts = DB.Parts.getByYear(year);
    const monthExp = DB.Expenses.getByMonth(year, month);

    const todaySalesAmt = DB.sum(todaySales, 'amount');
    const todayPartsAmt = DB.sum(todayParts, 'amount');
    const todaySalesCost = DB.sum(todaySales, 'cost');
    const todayPartsCost = DB.sum(todayParts, 'cost');
    const todayLpgProfit = todaySalesAmt - todaySalesCost;
    const todayPartsProfit = todayPartsAmt - todayPartsCost;

    const monthSalesAmt = DB.sum(monthSales, 'amount');
    const monthPartsAmt = DB.sum(monthParts, 'amount');
    const monthExpAmt = DB.sum(monthExp, 'amount');
    const monthTurnover = monthSalesAmt + monthPartsAmt;

    const yearTurnover = DB.sum(yearSales, 'amount') + DB.sum(yearParts, 'amount');

    const stock = DB.Stock.getOrInit();
    const todayLpgSaleKg = DB.sum(todaySales, 'qty_kg');

    this.setContent(`
      <div class="stats-grid">
        <div class="stat-card" style="--accent:var(--flame)">
          <div class="stat-label">12kg Cylinders</div>
          <div class="stat-value">${stock.cyl_12kg}</div>
          <div class="stat-unit">units in stock</div>
          <div class="stat-icon">🛢️</div>
        </div>
        <div class="stat-card" style="--accent:var(--yellow)">
          <div class="stat-label">45kg Cylinders</div>
          <div class="stat-value">${stock.cyl_45kg}</div>
          <div class="stat-unit">units in stock</div>
          <div class="stat-icon">⛽</div>
        </div>
        <div class="stat-card" style="--accent:var(--green)">
          <div class="stat-label">Gas Stock (kg)</div>
          <div class="stat-value">${DB.fmt(stock.gas_kg)}</div>
          <div class="stat-unit">kilograms total</div>
          <div class="stat-icon">💨</div>
        </div>
        <div class="stat-card" style="--accent:var(--green)">
          <div class="stat-label">Today LPG Sale</div>
          <div class="stat-value">${DB.fmt(todayLpgSaleKg)}</div>
          <div class="stat-unit">kg sold today</div>
          <div class="stat-icon">📦</div>
        </div>
        <div class="stat-card" style="--accent:var(--flame)">
          <div class="stat-label">Today Earning (LPG)</div>
          <div class="stat-value">₨${DB.fmt(todaySalesAmt)}</div>
          <div class="stat-unit">revenue</div>
          <div class="stat-icon">💰</div>
        </div>
        <div class="stat-card" style="--accent:var(--yellow)">
          <div class="stat-label">Today Earning (Other)</div>
          <div class="stat-value">₨${DB.fmt(todayPartsAmt)}</div>
          <div class="stat-unit">parts & accessories</div>
          <div class="stat-icon">🔧</div>
        </div>
        <div class="stat-card" style="--accent:var(--green)">
          <div class="stat-label">Today LPG Profit</div>
          <div class="stat-value" style="color:${todayLpgProfit>=0?'var(--green)':'var(--red)'}">₨${DB.fmt(todayLpgProfit)}</div>
          <div class="stat-unit">after cost</div>
          <div class="stat-icon">📈</div>
        </div>
        <div class="stat-card" style="--accent:var(--green)">
          <div class="stat-label">Today Parts Profit</div>
          <div class="stat-value" style="color:${todayPartsProfit>=0?'var(--green)':'var(--red)'}">₨${DB.fmt(todayPartsProfit)}</div>
          <div class="stat-unit">after cost</div>
          <div class="stat-icon">🔩</div>
        </div>
        <div class="stat-card" style="--accent:var(--flame)">
          <div class="stat-label">Monthly Turnover</div>
          <div class="stat-value">₨${DB.fmt(monthTurnover)}</div>
          <div class="stat-unit">this month (LPG + Parts)</div>
          <div class="stat-icon">📅</div>
        </div>
        <div class="stat-card" style="--accent:var(--yellow)">
          <div class="stat-label">Monthly Expenses</div>
          <div class="stat-value">₨${DB.fmt(monthExpAmt)}</div>
          <div class="stat-unit">this month</div>
          <div class="stat-icon">🧾</div>
        </div>
        <div class="stat-card" style="--accent:var(--flame)">
          <div class="stat-label">Yearly Turnover</div>
          <div class="stat-value">₨${DB.fmt(yearTurnover)}</div>
          <div class="stat-unit">this year ${year}</div>
          <div class="stat-icon">🏆</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="panel">
          <div class="panel-title">Today Summary</div>
          <div class="profit-row"><span>LPG Revenue</span><span class="profit-amount">₨${DB.fmt(todaySalesAmt)}</span></div>
          <div class="profit-row"><span>LPG Cost</span><span style="color:var(--red)">₨${DB.fmt(todaySalesCost)}</span></div>
          <div class="profit-row"><span>LPG Profit</span><span style="color:${todayLpgProfit>=0?'var(--green)':'var(--red)'}">₨${DB.fmt(todayLpgProfit)}</span></div>
          <div class="profit-row"><span>Parts Revenue</span><span class="profit-amount">₨${DB.fmt(todayPartsAmt)}</span></div>
          <div class="profit-row"><span>Parts Cost</span><span style="color:var(--red)">₨${DB.fmt(todayPartsCost)}</span></div>
          <div class="profit-row"><span>Parts Profit</span><span style="color:${todayPartsProfit>=0?'var(--green)':'var(--red)'}">₨${DB.fmt(todayPartsProfit)}</span></div>
          <div class="profit-row" style="border-top:2px solid var(--flame);margin-top:6px;padding-top:12px">
            <span><strong>Total Today</strong></span>
            <span style="font-family:'Bebas Neue';font-size:20px;color:var(--flame)">₨${DB.fmt(todaySalesAmt + todayPartsAmt)}</span>
          </div>
        </div>
        <div class="panel">
          <div class="panel-title">Monthly LPG vs Parts</div>
          <div class="profit-row"><span>LPG Sales</span><span class="profit-amount">₨${DB.fmt(monthSalesAmt)}</span></div>
          <div class="profit-row"><span>Parts Sales</span><span class="profit-amount">₨${DB.fmt(monthPartsAmt)}</span></div>
          <div class="profit-row"><span>Expenses</span><span style="color:var(--red)">₨${DB.fmt(monthExpAmt)}</span></div>
          <div class="profit-row"><span>Net Turnover</span><span style="color:var(--flame)">₨${DB.fmt(monthTurnover)}</span></div>
          <div class="profit-row"><span>Net Profit</span><span style="color:${(monthTurnover-monthExpAmt)>=0?'var(--green)':'var(--red)'}">₨${DB.fmt(monthTurnover - monthExpAmt)}</span></div>
          <div class="profit-row" style="border-top:2px solid var(--flame);margin-top:6px;padding-top:12px">
            <span><strong>Yearly Total</strong></span>
            <span style="font-family:'Bebas Neue';font-size:20px;color:var(--flame)">₨${DB.fmt(yearTurnover)}</span>
          </div>
        </div>
      </div>

      <div style="margin-top:20px" class="section-header">
        <div class="section-title">Recent Transactions</div>
      </div>
      ${this.recentTransactions()}
    `);
  },

  recentTransactions() {
    const sales = DB.Sales.getAll().slice(0, 5);
    const parts = DB.Parts.getAll().slice(0, 5);
    const combined = [...sales.map(r => ({...r, _type:'LPG'})), ...parts.map(r => ({...r, _type:'Parts'}))]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8);

    if (!combined.length) return `<div class="empty-state"><div class="empty-icon">📭</div>No transactions yet. Start by adding a sale!</div>`;

    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Date</th><th>Type</th><th>Description</th><th>Amount</th><th>Profit</th></tr>
          </thead>
          <tbody>
            ${combined.map(r => `
              <tr>
                <td>${r.date}</td>
                <td><span class="tag ${r._type === 'LPG' ? 'tag-orange' : 'tag-green'}">${r._type}</span></td>
                <td>${r.description || r.item_name || '-'}</td>
                <td>₨${DB.fmt(r.amount)}</td>
                <td style="color:var(--green)">₨${DB.fmt((r.amount||0)-(r.cost||0))}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  },

  // ========================
  // STOCK
  // ========================
  renderStock() {
    const stock = DB.Stock.getOrInit();
    const logs = DB.Stock.getLogs().slice(0, 20);

    this.setContent(`
      <div class="section-header">
        <div class="section-title">Current Stock</div>
        <button class="btn btn-primary" onclick="App.openStockForm()">✏️ Update Stock</button>
      </div>

      <div class="stats-grid" style="margin-bottom:28px">
        <div class="stat-card" style="--accent:var(--flame)">
          <div class="stat-label">12 kg Cylinders</div>
          <div class="stat-value">${stock.cyl_12kg}</div>
          <div class="stat-unit">units</div>
          <div class="stat-icon">🛢️</div>
          <div class="stock-bar-wrap">
            <div class="stock-bar"><div class="stock-bar-fill" style="width:${Math.min(stock.cyl_12kg/100*100,100)}%"></div></div>
          </div>
        </div>
        <div class="stat-card" style="--accent:var(--yellow)">
          <div class="stat-label">45 kg Cylinders</div>
          <div class="stat-value">${stock.cyl_45kg}</div>
          <div class="stat-unit">units</div>
          <div class="stat-icon">⛽</div>
          <div class="stock-bar-wrap">
            <div class="stock-bar"><div class="stock-bar-fill" style="width:${Math.min(stock.cyl_45kg/50*100,100)}%;background:var(--yellow)"></div></div>
          </div>
        </div>
        <div class="stat-card" style="--accent:var(--green)">
          <div class="stat-label">Total Gas Stock</div>
          <div class="stat-value">${DB.fmt(stock.gas_kg)}</div>
          <div class="stat-unit">kilograms</div>
          <div class="stat-icon">💨</div>
        </div>
        <div class="stat-card" style="--accent:var(--silver-dim)">
          <div class="stat-label">Last Updated</div>
          <div class="stat-value" style="font-size:20px">${stock.updatedAt}</div>
          <div class="stat-unit">date</div>
          <div class="stat-icon">📅</div>
        </div>
      </div>

      <div class="section-header">
        <div class="section-title">Stock Update History</div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Date</th><th>12kg</th><th>45kg</th><th>Gas (kg)</th><th>Notes</th></tr>
          </thead>
          <tbody>
            ${logs.length ? logs.map(l => `
              <tr>
                <td>${l.date}</td>
                <td>${l.cyl_12kg ?? '-'}</td>
                <td>${l.cyl_45kg ?? '-'}</td>
                <td>${l.gas_kg ?? '-'}</td>
                <td>${l.notes || '-'}</td>
              </tr>
            `).join('') : `<tr><td colspan="5" class="empty-state">No history yet</td></tr>`}
          </tbody>
        </table>
      </div>
    `);
  },

  openStockForm() {
    const stock = DB.Stock.getOrInit();
    this.openModal('Update Stock', `
      <div class="form-grid">
        <div class="form-group">
          <label>12kg Cylinders</label>
          <input type="number" id="s_12kg" value="${stock.cyl_12kg}" min="0" placeholder="0">
        </div>
        <div class="form-group">
          <label>45kg Cylinders</label>
          <input type="number" id="s_45kg" value="${stock.cyl_45kg}" min="0" placeholder="0">
        </div>
        <div class="form-group">
          <label>Total Gas Stock (kg)</label>
          <input type="number" id="s_gas" value="${stock.gas_kg}" min="0" step="0.1" placeholder="0.0">
        </div>
        <div class="form-group">
          <label>Notes</label>
          <input type="text" id="s_notes" placeholder="Optional notes">
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-ghost" onclick="App.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="App.saveStock()">💾 Save Stock</button>
      </div>
    `);
  },

  saveStock() {
    const cyl_12kg = parseFloat(document.getElementById('s_12kg').value) || 0;
    const cyl_45kg = parseFloat(document.getElementById('s_45kg').value) || 0;
    const gas_kg = parseFloat(document.getElementById('s_gas').value) || 0;
    const notes = document.getElementById('s_notes').value;

    DB.Stock.update({ cyl_12kg, cyl_45kg, gas_kg });
    DB.Stock.addLog({ cyl_12kg, cyl_45kg, gas_kg, notes });
    this.closeModal();
    this.showAlert('Stock updated successfully!', 'success');
  },

  // ========================
  // LPG SALES
  // ========================
  renderSales() {
    const today = DB.today();
    const all = DB.Sales.getAll();
    const todaySales = DB.Sales.getByDate(today);
    const { year, month } = DB.nowYM();
    const monthSales = DB.Sales.getByMonth(year, month);

    const todayAmt = DB.sum(todaySales, 'amount');
    const todayKg = DB.sum(todaySales, 'qty_kg');
    const monthAmt = DB.sum(monthSales, 'amount');

    this.setContent(`
      <div class="section-header">
        <div class="section-title">LPG Sales</div>
        <button class="btn btn-primary" onclick="App.openSaleForm()">➕ Add Sale</button>
      </div>

      <div class="stats-grid" style="margin-bottom:24px">
        <div class="stat-card" style="--accent:var(--flame)">
          <div class="stat-label">Today Sales (KG)</div>
          <div class="stat-value">${DB.fmt(todayKg)}</div>
          <div class="stat-unit">kg sold</div>
        </div>
        <div class="stat-card" style="--accent:var(--green)">
          <div class="stat-label">Today Revenue</div>
          <div class="stat-value">₨${DB.fmt(todayAmt)}</div>
          <div class="stat-unit">today earnings</div>
        </div>
        <div class="stat-card" style="--accent:var(--yellow)">
          <div class="stat-label">Monthly Revenue</div>
          <div class="stat-value">₨${DB.fmt(monthAmt)}</div>
          <div class="stat-unit">this month</div>
        </div>
        <div class="stat-card" style="--accent:var(--flame)">
          <div class="stat-label">Total Records</div>
          <div class="stat-value">${all.length}</div>
          <div class="stat-unit">transactions</div>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Date</th><th>Description</th><th>Type</th><th>Qty (kg)</th><th>Cost (₨)</th><th>Amount (₨)</th><th>Profit</th><th>Actions</th></tr>
          </thead>
          <tbody>
            ${all.length ? all.slice(0, 50).map(r => `
              <tr>
                <td>${r.date}</td>
                <td>${r.description || '-'}</td>
                <td><span class="tag tag-orange">${r.type || 'LPG'}</span></td>
                <td>${DB.fmt(r.qty_kg || 0)}</td>
                <td>₨${DB.fmt(r.cost || 0)}</td>
                <td>₨${DB.fmt(r.amount || 0)}</td>
                <td style="color:var(--green)">₨${DB.fmt((r.amount||0)-(r.cost||0))}</td>
                <td>
                  <button class="btn btn-ghost btn-sm" onclick="App.openSaleForm('${r.id}')">✏️</button>
                  <button class="btn btn-danger btn-sm" onclick="App.deleteSale('${r.id}')">🗑️</button>
                </td>
              </tr>
            `).join('') : `<tr><td colspan="8" class="empty-state">No sales recorded. Add your first sale!</td></tr>`}
          </tbody>
        </table>
      </div>
    `);
  },

  openSaleForm(id = null) {
    let rec = {};
    if (id) {
      rec = DB.Sales.getAll().find(r => r.id === id) || {};
    }
    this.openModal(id ? 'Edit LPG Sale' : 'Add LPG Sale', `
      <div class="form-grid">
        <div class="form-group">
          <label>Date</label>
          <input type="date" id="sale_date" value="${rec.date || DB.today()}">
        </div>
        <div class="form-group">
          <label>Type</label>
          <select id="sale_type">
            <option value="LPG" ${rec.type==='LPG'?'selected':''}>LPG Gas</option>
            <option value="Cylinder" ${rec.type==='Cylinder'?'selected':''}>Cylinder Sale</option>
            <option value="Refill" ${rec.type==='Refill'?'selected':''}>Refill</option>
            <option value="Other" ${rec.type==='Other'?'selected':''}>Other</option>
          </select>
        </div>
        <div class="form-group">
          <label>Description</label>
          <input type="text" id="sale_desc" value="${rec.description || ''}" placeholder="Customer / Note">
        </div>
        <div class="form-group">
          <label>Quantity (kg)</label>
          <input type="number" id="sale_kg" value="${rec.qty_kg || ''}" min="0" step="0.1" placeholder="0.0">
        </div>
        <div class="form-group">
          <label>Cost Price (₨)</label>
          <input type="number" id="sale_cost" value="${rec.cost || ''}" min="0" placeholder="0">
        </div>
        <div class="form-group">
          <label>Sale Amount (₨)</label>
          <input type="number" id="sale_amount" value="${rec.amount || ''}" min="0" placeholder="0">
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-ghost" onclick="App.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="App.saveSale('${id || ''}')">💾 Save</button>
      </div>
    `);
  },

  saveSale(id) {
    const data = {
      date: document.getElementById('sale_date').value,
      type: document.getElementById('sale_type').value,
      description: document.getElementById('sale_desc').value,
      qty_kg: parseFloat(document.getElementById('sale_kg').value) || 0,
      cost: parseFloat(document.getElementById('sale_cost').value) || 0,
      amount: parseFloat(document.getElementById('sale_amount').value) || 0,
    };
    if (!data.amount) { alert('Please enter a sale amount'); return; }

    if (id) DB.Sales.update(id, data);
    else DB.Sales.add(data);
    this.closeModal();
    this.showAlert('Sale saved!', 'success');
  },

  deleteSale(id) {
    if (confirm('Delete this sale record?')) {
      DB.Sales.delete(id);
      this.navigate('sales');
      this.showAlert('Sale deleted.', 'error');
    }
  },

  // ========================
  // PARTS
  // ========================
  renderParts() {
    const today = DB.today();
    const all = DB.Parts.getAll();
    const todayParts = DB.Parts.getByDate(today);
    const { year, month } = DB.nowYM();
    const monthParts = DB.Parts.getByMonth(year, month);

    const todayAmt = DB.sum(todayParts, 'amount');
    const monthAmt = DB.sum(monthParts, 'amount');

    this.setContent(`
      <div class="section-header">
        <div class="section-title">Parts & Accessories Sales</div>
        <button class="btn btn-primary" onclick="App.openPartForm()">➕ Add Sale</button>
      </div>

      <div class="stats-grid" style="margin-bottom:24px">
        <div class="stat-card" style="--accent:var(--green)">
          <div class="stat-label">Today Parts Revenue</div>
          <div class="stat-value">₨${DB.fmt(todayAmt)}</div>
          <div class="stat-unit">today</div>
        </div>
        <div class="stat-card" style="--accent:var(--yellow)">
          <div class="stat-label">Monthly Revenue</div>
          <div class="stat-value">₨${DB.fmt(monthAmt)}</div>
          <div class="stat-unit">this month</div>
        </div>
        <div class="stat-card" style="--accent:var(--flame)">
          <div class="stat-label">Total Records</div>
          <div class="stat-value">${all.length}</div>
          <div class="stat-unit">transactions</div>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Date</th><th>Item</th><th>Category</th><th>Qty</th><th>Cost (₨)</th><th>Amount (₨)</th><th>Profit</th><th>Actions</th></tr>
          </thead>
          <tbody>
            ${all.length ? all.slice(0, 50).map(r => `
              <tr>
                <td>${r.date}</td>
                <td>${r.item_name || '-'}</td>
                <td><span class="tag tag-green">${r.category || 'Parts'}</span></td>
                <td>${r.qty || 1}</td>
                <td>₨${DB.fmt(r.cost || 0)}</td>
                <td>₨${DB.fmt(r.amount || 0)}</td>
                <td style="color:var(--green)">₨${DB.fmt((r.amount||0)-(r.cost||0))}</td>
                <td>
                  <button class="btn btn-ghost btn-sm" onclick="App.openPartForm('${r.id}')">✏️</button>
                  <button class="btn btn-danger btn-sm" onclick="App.deletePart('${r.id}')">🗑️</button>
                </td>
              </tr>
            `).join('') : `<tr><td colspan="8" class="empty-state">No parts sales yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    `);
  },

  openPartForm(id = null) {
    let rec = {};
    if (id) rec = DB.Parts.getAll().find(r => r.id === id) || {};
    this.openModal(id ? 'Edit Parts Sale' : 'Add Parts Sale', `
      <div class="form-grid">
        <div class="form-group">
          <label>Date</label>
          <input type="date" id="p_date" value="${rec.date || DB.today()}">
        </div>
        <div class="form-group">
          <label>Item Name</label>
          <input type="text" id="p_item" value="${rec.item_name || ''}" placeholder="e.g. Regulator, Pipe...">
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="p_cat">
            <option value="Parts" ${rec.category==='Parts'?'selected':''}>Parts</option>
            <option value="Regulator" ${rec.category==='Regulator'?'selected':''}>Regulator</option>
            <option value="Pipe" ${rec.category==='Pipe'?'selected':''}>Pipe</option>
            <option value="Accessories" ${rec.category==='Accessories'?'selected':''}>Accessories</option>
            <option value="Service" ${rec.category==='Service'?'selected':''}>Service</option>
            <option value="Other" ${rec.category==='Other'?'selected':''}>Other</option>
          </select>
        </div>
        <div class="form-group">
          <label>Quantity</label>
          <input type="number" id="p_qty" value="${rec.qty || 1}" min="1" placeholder="1">
        </div>
        <div class="form-group">
          <label>Cost Price (₨)</label>
          <input type="number" id="p_cost" value="${rec.cost || ''}" min="0" placeholder="0">
        </div>
        <div class="form-group">
          <label>Sale Amount (₨)</label>
          <input type="number" id="p_amount" value="${rec.amount || ''}" min="0" placeholder="0">
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-ghost" onclick="App.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="App.savePart('${id || ''}')">💾 Save</button>
      </div>
    `);
  },

  savePart(id) {
    const data = {
      date: document.getElementById('p_date').value,
      item_name: document.getElementById('p_item').value,
      category: document.getElementById('p_cat').value,
      qty: parseInt(document.getElementById('p_qty').value) || 1,
      cost: parseFloat(document.getElementById('p_cost').value) || 0,
      amount: parseFloat(document.getElementById('p_amount').value) || 0,
    };
    if (!data.item_name) { alert('Please enter item name'); return; }
    if (!data.amount) { alert('Please enter amount'); return; }

    if (id) DB.Parts.update(id, data);
    else DB.Parts.add(data);
    this.closeModal();
    this.showAlert('Parts sale saved!', 'success');
  },

  deletePart(id) {
    if (confirm('Delete this record?')) {
      DB.Parts.delete(id);
      this.navigate('parts');
    }
  },

  // ========================
  // EXPENSES
  // ========================
  renderExpenses() {
    const today = DB.today();
    const all = DB.Expenses.getAll();
    const { year, month } = DB.nowYM();
    const monthExp = DB.Expenses.getByMonth(year, month);

    const todayAmt = DB.sum(DB.Expenses.getByDate(today), 'amount');
    const monthAmt = DB.sum(monthExp, 'amount');

    this.setContent(`
      <div class="section-header">
        <div class="section-title">Expenses</div>
        <button class="btn btn-primary" onclick="App.openExpenseForm()">➕ Add Expense</button>
      </div>

      <div class="stats-grid" style="margin-bottom:24px">
        <div class="stat-card" style="--accent:var(--red)">
          <div class="stat-label">Today Expenses</div>
          <div class="stat-value">₨${DB.fmt(todayAmt)}</div>
          <div class="stat-unit">today</div>
        </div>
        <div class="stat-card" style="--accent:var(--red)">
          <div class="stat-label">Monthly Expenses</div>
          <div class="stat-value">₨${DB.fmt(monthAmt)}</div>
          <div class="stat-unit">this month</div>
        </div>
        <div class="stat-card" style="--accent:var(--yellow)">
          <div class="stat-label">Total Records</div>
          <div class="stat-value">${all.length}</div>
          <div class="stat-unit">entries</div>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Date</th><th>Category</th><th>Description</th><th>Amount (₨)</th><th>Actions</th></tr>
          </thead>
          <tbody>
            ${all.length ? all.slice(0, 50).map(r => `
              <tr>
                <td>${r.date}</td>
                <td><span class="tag tag-red">${r.category || 'General'}</span></td>
                <td>${r.description || '-'}</td>
                <td style="color:var(--red)">₨${DB.fmt(r.amount || 0)}</td>
                <td>
                  <button class="btn btn-ghost btn-sm" onclick="App.openExpenseForm('${r.id}')">✏️</button>
                  <button class="btn btn-danger btn-sm" onclick="App.deleteExpense('${r.id}')">🗑️</button>
                </td>
              </tr>
            `).join('') : `<tr><td colspan="5" class="empty-state">No expenses recorded.</td></tr>`}
          </tbody>
        </table>
      </div>
    `);
  },

  openExpenseForm(id = null) {
    let rec = {};
    if (id) rec = DB.Expenses.getAll().find(r => r.id === id) || {};
    this.openModal(id ? 'Edit Expense' : 'Add Expense', `
      <div class="form-grid">
        <div class="form-group">
          <label>Date</label>
          <input type="date" id="e_date" value="${rec.date || DB.today()}">
        </div>
        <div class="form-group">
          <label>Category</label>
          <select id="e_cat">
            <option value="Rent" ${rec.category==='Rent'?'selected':''}>Rent</option>
            <option value="Electricity" ${rec.category==='Electricity'?'selected':''}>Electricity</option>
            <option value="Salary" ${rec.category==='Salary'?'selected':''}>Salary</option>
            <option value="Transport" ${rec.category==='Transport'?'selected':''}>Transport</option>
            <option value="Purchase" ${rec.category==='Purchase'?'selected':''}>Stock Purchase</option>
            <option value="Maintenance" ${rec.category==='Maintenance'?'selected':''}>Maintenance</option>
            <option value="Other" ${rec.category==='Other'?'selected':''}>Other</option>
          </select>
        </div>
        <div class="form-group">
          <label>Description</label>
          <input type="text" id="e_desc" value="${rec.description || ''}" placeholder="Details...">
        </div>
        <div class="form-group">
          <label>Amount (₨)</label>
          <input type="number" id="e_amount" value="${rec.amount || ''}" min="0" placeholder="0">
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn-ghost" onclick="App.closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="App.saveExpense('${id || ''}')">💾 Save</button>
      </div>
    `);
  },

  saveExpense(id) {
    const data = {
      date: document.getElementById('e_date').value,
      category: document.getElementById('e_cat').value,
      description: document.getElementById('e_desc').value,
      amount: parseFloat(document.getElementById('e_amount').value) || 0,
    };
    if (!data.amount) { alert('Please enter an amount'); return; }

    if (id) DB.Expenses.update(id, data);
    else DB.Expenses.add(data);
    this.closeModal();
    this.showAlert('Expense saved!', 'success');
  },

  deleteExpense(id) {
    if (confirm('Delete this expense?')) {
      DB.Expenses.delete(id);
      this.navigate('expenses');
    }
  },

  // ========================
  // REPORTS
  // ========================
  renderReports() {
    const { year, month } = DB.nowYM();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    // Build monthly breakdown
    let monthlyRows = '';
    for (let m = 1; m <= 12; m++) {
      const s = DB.Sales.getByMonth(year, m);
      const p = DB.Parts.getByMonth(year, m);
      const e = DB.Expenses.getByMonth(year, m);
      const sAmt = DB.sum(s, 'amount');
      const pAmt = DB.sum(p, 'amount');
      const eAmt = DB.sum(e, 'amount');
      const total = sAmt + pAmt;
      const profit = total - eAmt - DB.sum(s,'cost') - DB.sum(p,'cost');
      if (total > 0 || m <= month) {
        monthlyRows += `
          <tr>
            <td>${months[m-1]} ${year}</td>
            <td>₨${DB.fmt(sAmt)}</td>
            <td>₨${DB.fmt(pAmt)}</td>
            <td>₨${DB.fmt(total)}</td>
            <td style="color:var(--red)">₨${DB.fmt(eAmt)}</td>
            <td style="color:${profit>=0?'var(--green)':'var(--red)'}">₨${DB.fmt(profit)}</td>
          </tr>`;
      }
    }

    const allSales = DB.Sales.getByYear(year);
    const allParts = DB.Parts.getByYear(year);
    const yearExp = [];
    for (let m=1;m<=12;m++) yearExp.push(...DB.Expenses.getByMonth(year,m));

    const yearLpg = DB.sum(allSales,'amount');
    const yearParts = DB.sum(allParts,'amount');
    const yearExpTotal = DB.sum(yearExp,'amount');
    const yearGrossProfit = (yearLpg + yearParts) - DB.sum(allSales,'cost') - DB.sum(allParts,'cost');
    const yearNetProfit = yearGrossProfit - yearExpTotal;

    this.setContent(`
      <div class="section-title" style="margin-bottom:20px">Year ${year} — Full Report</div>

      <div class="stats-grid" style="margin-bottom:28px">
        <div class="stat-card" style="--accent:var(--flame)">
          <div class="stat-label">Year LPG Revenue</div>
          <div class="stat-value">₨${DB.fmt(yearLpg)}</div>
        </div>
        <div class="stat-card" style="--accent:var(--green)">
          <div class="stat-label">Year Parts Revenue</div>
          <div class="stat-value">₨${DB.fmt(yearParts)}</div>
        </div>
        <div class="stat-card" style="--accent:var(--flame)">
          <div class="stat-label">Year Total Turnover</div>
          <div class="stat-value">₨${DB.fmt(yearLpg+yearParts)}</div>
        </div>
        <div class="stat-card" style="--accent:var(--red)">
          <div class="stat-label">Year Total Expenses</div>
          <div class="stat-value" style="color:var(--red)">₨${DB.fmt(yearExpTotal)}</div>
        </div>
        <div class="stat-card" style="--accent:var(--green)">
          <div class="stat-label">Year Gross Profit</div>
          <div class="stat-value" style="color:${yearGrossProfit>=0?'var(--green)':'var(--red)'}">₨${DB.fmt(yearGrossProfit)}</div>
        </div>
        <div class="stat-card" style="--accent:var(--green)">
          <div class="stat-label">Year Net Profit</div>
          <div class="stat-value" style="color:${yearNetProfit>=0?'var(--green)':'var(--red)'}">₨${DB.fmt(yearNetProfit)}</div>
        </div>
      </div>

      <div class="section-header"><div class="section-title">Monthly Breakdown — ${year}</div></div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Month</th><th>LPG Sales</th><th>Parts Sales</th><th>Total Turnover</th><th>Expenses</th><th>Net Profit</th></tr>
          </thead>
          <tbody>${monthlyRows || '<tr><td colspan="6" class="empty-state">No data yet</td></tr>'}</tbody>
        </table>
      </div>
    `);
  },

  // ========================
  // HISTORY
  // ========================
  renderHistory() {
    const sales = DB.Sales.getAll().map(r => ({...r, _type:'LPG', _color:'tag-orange'}));
    const parts = DB.Parts.getAll().map(r => ({...r, description: r.item_name, _type:'Parts', _color:'tag-green'}));
    const expenses = DB.Expenses.getAll().map(r => ({...r, _type:'Expense', _color:'tag-red', amount: -r.amount}));

    const all = [...sales, ...parts, ...expenses]
      .sort((a,b) => new Date(b.createdAt||b.date) - new Date(a.createdAt||a.date));

    this.setContent(`
      <div class="section-header">
        <div class="section-title">All Transactions</div>
        <span style="color:var(--silver-dim);font-size:13px">${all.length} records</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Date</th><th>Type</th><th>Description</th><th>Amount (₨)</th></tr>
          </thead>
          <tbody>
            ${all.length ? all.map(r => `
              <tr>
                <td>${r.date}</td>
                <td><span class="tag ${r._color}">${r._type}</span></td>
                <td>${r.description || '-'}</td>
                <td style="color:${r.amount >= 0 ? 'var(--green)' : 'var(--red)'}">
                  ${r.amount >= 0 ? '+' : ''}₨${DB.fmt(r.amount)}
                </td>
              </tr>
            `).join('') : `<tr><td colspan="4" class="empty-state">No records yet.</td></tr>`}
          </tbody>
        </table>
      </div>
    `);
  },

  showAlert(msg, type='success') {
    const existing = document.querySelector('.alert-toast');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = `alert alert-${type} alert-toast`;
    el.style.cssText = 'position:fixed;top:80px;right:20px;z-index:9999;min-width:220px;animation:slideIn 0.3s ease';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
