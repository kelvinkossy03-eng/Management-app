import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LayoutDashboard, Package, ShoppingCart, Users, ReceiptText, Plus, Search, Download, Menu, X, Wallet, TrendingUp, ArrowUpRight } from 'lucide-react';
import './styles.css';

const money = n => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(Number(n) || 0);
const initialProducts = [
  { id: 1, name: 'Jollof Rice', category: 'Food', price: 3500, stock: 28 },
  { id: 2, name: 'Grilled Chicken', category: 'Food', price: 4500, stock: 14 },
  { id: 3, name: 'Soft Drink', category: 'Drinks', price: 700, stock: 9 },
  { id: 4, name: 'Bottled Water', category: 'Drinks', price: 400, stock: 42 }
];
function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }

function App() {
  const [page, setPage] = useState('Overview');
  const [products, setProducts] = useState(() => read('bos_products', initialProducts));
  const [sales, setSales] = useState(() => read('bos_sales', [
    { id: 1048, item: 'Jollof Rice × 2', customer: 'Walk-in customer', method: 'Cash', amount: 7000, date: 'Today' },
    { id: 1047, item: 'Grilled Chicken × 1', customer: 'Ada Okafor', method: 'Transfer', amount: 4500, date: 'Today' }
  ]));
  const [expenses, setExpenses] = useState(() => read('bos_expenses', [{ id: 1, name: 'Food supplies', category: 'Inventory', amount: 42000, date: 'Today' }]));
  const [customers, setCustomers] = useState(() => read('bos_customers', [{ id: 1, name: 'Ada Okafor', phone: '0803 ••• ••21', visits: 8 }]));
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState('');
  const [form, setForm] = useState({});
  const [mobile, setMobile] = useState(false);
  const [notice, setNotice] = useState('');
  const revenue = sales.reduce((sum, s) => sum + Number(s.amount || 0), 0);
  const expenseTotal = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const filteredProducts = useMemo(() => products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())), [products, search]);
  const nav = [
    ['Overview', LayoutDashboard], ['Sales', ShoppingCart], ['Inventory', Package],
    ['Customers', Users], ['Expenses', ReceiptText]
  ];
  function save(key, value, setter) { setter(value); localStorage.setItem(key, JSON.stringify(value)); }
  function submit(e) {
    e.preventDefault();
    if (showForm === 'Product') {
      const next = [...products, { id: Date.now(), name: form.name || 'New product', category: form.category || 'General', price: Number(form.price) || 0, stock: Number(form.stock) || 0 }];
      save('bos_products', next, setProducts);
    } else if (showForm === 'Sale') {
      const amount = Number(form.amount) || 0;
      const next = [{ id: Date.now(), item: form.item || 'New sale', customer: form.customer || 'Walk-in customer', method: form.method || 'Cash', amount, date: new Date().toLocaleDateString() }, ...sales];
      save('bos_sales', next, setSales);
    } else if (showForm === 'Expense') {
      const next = [{ id: Date.now(), name: form.name || 'Expense', category: form.category || 'General', amount: Number(form.amount) || 0, date: new Date().toLocaleDateString() }, ...expenses];
      save('bos_expenses', next, setExpenses);
    } else if (showForm === 'Customer') {
      const next = [...customers, { id: Date.now(), name: form.name || 'Customer', phone: form.phone || '—', visits: 0 }];
      save('bos_customers', next, setCustomers);
    }
    setForm({}); setShowForm(''); setNotice('Saved successfully'); setTimeout(() => setNotice(''), 2500);
  }
  function exportSales() {
    const rows = [['Sale ID','Item','Customer','Payment method','Amount','Date'], ...sales.map(s => [s.id,s.item,s.customer,s.method,s.amount,s.date])];
    const csv = rows.map(row => row.map(v => '"' + String(v ?? '').replaceAll('"','""') + '"').join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'businessos-sales.csv'; a.click(); URL.revokeObjectURL(a.href);
  }
  const heading = { Overview: 'Business overview', Sales: 'Sales', Inventory: 'Inventory', Customers: 'Customers', Expenses: 'Expenses' }[page];
  return <div className="app-shell">
    {mobile && <div className="mobile-overlay" onClick={() => setMobile(false)} />}
    <aside className={'sidebar ' + (mobile ? 'sidebar-open' : '')}>
      <div className="brand"><div className="brand-mark">B</div><div><b>Business<span>OS</span></b><small>NIGERIA</small></div><button className="icon-btn close-nav" onClick={() => setMobile(false)}><X size={18}/></button></div>
      <button className="workspace-switch"><div className="workspace-avatar">VK</div><div className="workspace-copy"><b>Village Kitchen &amp; Bar</b><small>Business workspace</small></div></button>
      <div className="nav-scroll"><div className="nav-section"><div className="nav-label">WORKSPACE</div>{nav.map(([label, Icon]) => <button key={label} className={'nav-item ' + (page === label ? 'active' : '')} onClick={() => {setPage(label); setMobile(false);}}><Icon size={17}/><span>{label}</span></button>)}</div></div>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon">✦</div><div><b>Your business, organised</b><p>Track sales, stock, customers and spending in one place.</p></div></div><button className="profile-row"><div className="profile-avatar">KK</div><div className="profile-copy"><b>Business Owner</b><small>Local demo workspace</small></div></button></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="top-left"><button className="icon-btn menu-btn" onClick={() => setMobile(true)}><Menu size={20}/></button><div className="breadcrumb">Workspace <span>/</span> <b>{page}</b></div></div><div className="top-actions"><label className="searchbox"><Search size={15}/><input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}/></label><button className="secondary-btn" onClick={exportSales}><Download size={15}/> Export sales</button></div></header>
      <section className="content">
        <div className="page-heading"><div><div className="eyebrow"><span className="live-dot"/> BUSINESS WORKSPACE</div><h1>{heading}</h1><p>Know what is happening in your business, every day.</p></div><div className="heading-actions"><select className="period-select" defaultValue="This week"><option>This week</option><option>This month</option><option>This year</option></select><button className="primary-btn" onClick={() => {setShowForm(page === 'Inventory' ? 'Product' : page === 'Sales' || page === 'Overview' ? 'Sale' : page === 'Expenses' ? 'Expense' : 'Customer'); setForm({});}}><Plus size={15}/> {page === 'Inventory' ? 'Add product' : page === 'Expenses' ? 'Add expense' : page === 'Customers' ? 'Add customer' : 'Record sale'}</button></div></div>
        <div className="welcome-strip"><div className="welcome-icon"><TrendingUp size={19}/></div><div><b>Welcome to BusinessOS Nigeria</b><p>Your business information is saved in this browser on this device. This is a local demo, not a connected bank or payment service.</p></div></div>
        {page === 'Overview' && <>
          <div className="metrics-grid">
            <Metric title="Total sales recorded" value={money(revenue)} hint="From demo sales" tone="blue" icon={<Wallet size={17}/>}/>
            <Metric title="Expenses recorded" value={money(expenseTotal)} hint="Tracked spending" tone="orange" icon={<ReceiptText size={17}/>}/>
            <Metric title="Estimated balance" value={money(revenue-expenseTotal)} hint="Sales minus expenses" tone="green" icon={<ArrowUpRight size={17}/>}/>
            <Metric title="Products in stock" value={products.length} hint={products.reduce((n,p)=>n+Number(p.stock||0),0)+' units total'} tone="purple" icon={<Package size={17}/>}/>
          </div>
          <div className="overview-grid"><div className="panel table-panel"><div className="panel-head"><div><h3>Recent sales</h3><p>Latest transactions recorded in this workspace</p></div><button className="secondary-btn" onClick={() => setPage('Sales')}>View all</button></div><SalesTable sales={sales.slice(0,5)}/></div><div className="panel"><div className="panel-head"><div><h3>Quick actions</h3><p>Keep your business records up to date</p></div></div><div className="quick-actions">{[['Record a sale','Sale'],['Add a product','Product'],['Record an expense','Expense'],['Add a customer','Customer']].map(([label,formName])=><button key={formName} onClick={()=>{setShowForm(formName);setForm({});}}><span className="quick-icon blue"><Plus size={16}/></span><span>{label}</span><ArrowUpRight size={15}/></button>)}</div></div></div>
        </>}
        {page === 'Sales' && <div className="panel table-panel"><div className="panel-head"><div><h3>All sales</h3><p>Export your records as a CSV file anytime</p></div><button className="primary-btn" onClick={()=>setShowForm('Sale')}><Plus size={14}/> Record sale</button></div><SalesTable sales={sales}/></div>}
        {page === 'Inventory' && <div className="panel table-panel"><div className="panel-head"><div><h3>Products &amp; stock</h3><p>Manage your products and available quantities</p></div><button className="primary-btn" onClick={()=>setShowForm('Product')}><Plus size={14}/> Add product</button></div><div className="data-table"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th></tr></thead><tbody>{filteredProducts.map(p=><tr key={p.id}><td><b>{p.name}</b></td><td>{p.category}</td><td>{money(p.price)}</td><td><span className="status-pill">{p.stock} units</span></td></tr>)}</tbody></table></div></div>}
        {page === 'Customers' && <div className="panel table-panel"><div className="panel-head"><div><h3>Customers</h3><p>Keep a simple record of your customers</p></div><button className="primary-btn" onClick={()=>setShowForm('Customer')}><Plus size={14}/> Add customer</button></div><div className="data-table"><table><thead><tr><th>Name</th><th>Phone</th><th>Visits</th></tr></thead><tbody>{customers.map(c=><tr key={c.id}><td><b>{c.name}</b></td><td>{c.phone}</td><td>{c.visits}</td></tr>)}</tbody></table></div></div>}
        {page === 'Expenses' && <div className="panel table-panel"><div className="panel-head"><div><h3>Expenses</h3><p>Record business spending</p></div><button className="primary-btn" onClick={()=>setShowForm('Expense')}><Plus size={14}/> Add expense</button></div><div className="data-table"><table><thead><tr><th>Description</th><th>Category</th><th>Amount</th><th>Date</th></tr></thead><tbody>{expenses.map(e=><tr key={e.id}><td><b>{e.name}</b></td><td>{e.category}</td><td>{money(e.amount)}</td><td>{e.date}</td></tr>)}</tbody></table></div></div>}
        <footer className="footer"><span>BusinessOS Nigeria · MVP</span><span>Demo data stays in this browser unless you clear site data.</span></footer>
      </section>
    </main>
    {showForm && <div className="modal-backdrop" onClick={e=>{if(e.target===e.currentTarget)setShowForm('');}}><form className="modal" onSubmit={submit}><div className="modal-head"><div><div className="eyebrow">BUSINESS RECORD</div><h2>{showForm === 'Product' ? 'Add product' : showForm === 'Sale' ? 'Record a sale' : showForm === 'Expense' ? 'Record an expense' : 'Add customer'}</h2></div><button type="button" className="icon-btn" onClick={()=>setShowForm('')}><X size={18}/></button></div>
      {showForm === 'Product' && <><Field label="Product name" name="name" form={form} setForm={setForm} required/><Field label="Category" name="category" form={form} setForm={setForm}/><Field label="Selling price (₦)" name="price" type="number" form={form} setForm={setForm} required/><Field label="Stock quantity" name="stock" type="number" form={form} setForm={setForm} required/></>}
      {showForm === 'Sale' && <><Field label="Item or description" name="item" form={form} setForm={setForm} required/><Field label="Customer" name="customer" form={form} setForm={setForm}/><Field label="Amount (₦)" name="amount" type="number" form={form} setForm={setForm} required/><label className="field"><span>Payment method</span><select value={form.method||'Cash'} onChange={e=>setForm({...form,method:e.target.value})}><option>Cash</option><option>Transfer</option><option>POS</option><option>Other</option></select></label></>}
      {showForm === 'Expense' && <><Field label="Expense description" name="name" form={form} setForm={setForm} required/><Field label="Category" name="category" form={form} setForm={setForm}/><Field label="Amount (₦)" name="amount" type="number" form={form} setForm={setForm} required/></>}
      {showForm === 'Customer' && <><Field label="Customer name" name="name" form={form} setForm={setForm} required/><Field label="Phone number" name="phone" form={form} setForm={setForm}/></>}
      <div className="modal-actions"><button type="button" className="secondary-btn" onClick={()=>setShowForm('')}>Cancel</button><button className="primary-btn" type="submit">Save record</button></div></form></div>}
    {notice && <div className="toast">✓ {notice}</div>}
  </div>;
}
function Metric({title,value,hint,tone,icon}) { return <div className="metric-card"><div className="metric-top"><span>{title}</span><span className={'metric-icon '+tone}>{icon}</span></div><div className="metric-value">{value}</div><div className="metric-bottom"><span className="change up">↗</span>{hint}</div></div>; }
function SalesTable({sales}) { return <div className="data-table"><table><thead><tr><th>Sale</th><th>Customer</th><th>Method</th><th>Amount</th></tr></thead><tbody>{sales.length ? sales.map(s=><tr key={s.id}><td><b>{s.item}</b><small>#{s.id} · {s.date}</small></td><td>{s.customer}</td><td><span className="status-pill">{s.method}</span></td><td><b>{money(s.amount)}</b></td></tr>) : <tr><td colSpan="4">No sales recorded yet.</td></tr>}</tbody></table></div>; }
function Field({label,name,type='text',form,setForm,required=false}) { return <label className="field"><span>{label}</span><input type={type} value={form[name] ?? ''} required={required} onChange={e=>setForm({...form,[name]:e.target.value})}/></label>; }

createRoot(document.getElementById('root')).render(<App/>);
