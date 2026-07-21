// Expense / income tracker — issue #1 (add-transaction).
// Vanilla JS + localStorage. No build step, no frameworks, no network/CDN.
//
// Shared data shape (see docs/data-model/README.md):
//   { id, type, amount, category, date, note }
//   type = "income" | "expense"; amount > 0; date = ISO YYYY-MM-DD; note optional.
// Persisted as a JSON array under localStorage key "tws.transactions".
// This file only implements the "add" section; #2 (history) and #3 (summary)
// keep their placeholders and will read the same key later.

(function () {
  'use strict';

  var STORAGE_KEY = 'tws.transactions';

  // On-screen copy — must match the spec exactly. Keep as constants to avoid typos.
  var MSG = {
    amountInvalid: 'กรุณากรอกจำนวนเงินให้มากกว่า 0',
    categoryMissing: 'กรุณาเลือกหมวดหมู่',
    saveSuccess: 'บันทึกรายการเรียบร้อยแล้ว'
  };

  var TYPE_LABELS = { income: 'รายรับ', expense: 'รายจ่าย' };

  var CATEGORIES = {
    expense: ['อาหาร', 'เดินทาง', 'ช้อปปิ้ง', 'ค่าน้ำค่าไฟ', 'สุขภาพ', 'อื่นๆ'],
    income: ['เงินเดือน', 'โบนัส', 'รายได้เสริม', 'ของขวัญ', 'อื่นๆ']
  };

  // ---- storage layer ---------------------------------------------------

  function loadTransactions() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      // Corrupt/unreadable storage should not crash the form.
      console.error('[app] cannot read transactions:', err);
      return [];
    }
  }

  function saveTransactions(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function addTransaction(tx) {
    var list = loadTransactions();
    list.push(tx); // keep append order in storage; display reverses a copy
    saveTransactions(list);
  }

  // ---- helpers ---------------------------------------------------------

  // Local calendar day (not UTC) so the default date matches the user's today.
  function todayISO() {
    var d = new Date();
    var local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  // Timestamp-based id; random suffix guards against same-millisecond collisions.
  function generateId() {
    return 'tx_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  function formatAmount(n) {
    return Number(n).toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // ---- boot ------------------------------------------------------------

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('add-form');
    if (!form) {
      console.warn('[app] add-transaction form not found — nothing to wire up');
      return;
    }

    var amountInput = document.getElementById('amount');
    var categorySelect = document.getElementById('category');
    var dateInput = document.getElementById('date');
    var noteInput = document.getElementById('note');
    var amountError = document.getElementById('amount-error');
    var categoryError = document.getElementById('category-error');
    var successMsg = document.getElementById('form-success');
    var addedList = document.getElementById('added-list');

    function getSelectedType() {
      var checked = form.querySelector('input[name="type"]:checked');
      return checked ? checked.value : 'expense';
    }

    function populateCategories(type) {
      var cats = CATEGORIES[type] || [];
      categorySelect.innerHTML = '';
      var placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = '— เลือกหมวดหมู่ —';
      categorySelect.appendChild(placeholder);
      cats.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        categorySelect.appendChild(opt);
      });
    }

    function clearMessages() {
      amountError.textContent = '';
      categoryError.textContent = '';
      successMsg.textContent = '';
      amountInput.removeAttribute('aria-invalid');
      categorySelect.removeAttribute('aria-invalid');
    }

    function renderList() {
      var list = loadTransactions();
      addedList.innerHTML = '';

      if (list.length === 0) {
        var empty = document.createElement('li');
        empty.className = 'tx-empty';
        empty.textContent = 'ยังไม่มีรายการ';
        addedList.appendChild(empty);
        return;
      }

      // Newest first, without mutating stored order.
      list.slice().reverse().forEach(function (tx) {
        var isIncome = tx.type === 'income';

        var li = document.createElement('li');
        li.className = 'tx-item ' + (isIncome ? 'tx-income' : 'tx-expense');

        var typeSpan = document.createElement('span');
        typeSpan.className = 'tx-type';
        typeSpan.textContent = TYPE_LABELS[tx.type] || tx.type;

        var catSpan = document.createElement('span');
        catSpan.className = 'tx-cat';
        catSpan.textContent = tx.category;

        var amtSpan = document.createElement('span');
        amtSpan.className = 'tx-amount';
        amtSpan.textContent = (isIncome ? '+' : '-') + formatAmount(tx.amount) + ' ฿';

        var dateSpan = document.createElement('span');
        dateSpan.className = 'tx-date';
        dateSpan.textContent = tx.date;

        li.appendChild(typeSpan);
        li.appendChild(catSpan);
        li.appendChild(amtSpan);
        li.appendChild(dateSpan);

        if (tx.note) {
          var noteSpan = document.createElement('span');
          noteSpan.className = 'tx-note';
          noteSpan.textContent = tx.note;
          li.appendChild(noteSpan);
        }

        addedList.appendChild(li);
      });
    }

    function resetForNextEntry() {
      amountInput.value = '';
      noteInput.value = '';
      populateCategories(getSelectedType()); // resets category back to placeholder
      dateInput.value = todayISO();
      amountInput.focus();
    }

    function handleSubmit(e) {
      e.preventDefault();
      clearMessages();

      // 1) amount: reject empty (NaN), 0, and negative in one guard.
      var amount = parseFloat(amountInput.value);
      if (!(amount > 0)) {
        amountError.textContent = MSG.amountInvalid;
        amountInput.setAttribute('aria-invalid', 'true');
        amountInput.focus();
        return;
      }

      // 2) category: placeholder value is "" — checked after amount (matches test step 5).
      var category = categorySelect.value;
      if (!category) {
        categoryError.textContent = MSG.categoryMissing;
        categorySelect.setAttribute('aria-invalid', 'true');
        categorySelect.focus();
        return;
      }

      var tx = {
        id: generateId(),
        type: getSelectedType(),
        amount: amount,
        category: category,
        date: dateInput.value || todayISO(),
        note: noteInput.value.trim() // optional; "" is fine
      };

      addTransaction(tx);
      successMsg.textContent = MSG.saveSuccess;
      renderList();          // new item shows immediately, no reload
      resetForNextEntry();
    }

    // --- init ---
    dateInput.value = todayISO();
    populateCategories(getSelectedType());

    // Switching type swaps the category options for that type.
    Array.prototype.forEach.call(
      form.querySelectorAll('input[name="type"]'),
      function (radio) {
        radio.addEventListener('change', function () {
          populateCategories(getSelectedType());
        });
      }
    );

    // Clear a shown error as soon as the user starts fixing the field.
    amountInput.addEventListener('input', function () {
      if (amountError.textContent) {
        amountError.textContent = '';
        amountInput.removeAttribute('aria-invalid');
      }
    });
    categorySelect.addEventListener('change', function () {
      if (categoryError.textContent) {
        categoryError.textContent = '';
        categorySelect.removeAttribute('aria-invalid');
      }
    });

    form.addEventListener('submit', handleSubmit);

    renderList(); // show anything already saved (survives refresh)

    console.log('[app] add-transaction ready');
  });
})();

// =======================================================================
// history-list feature (issue #2).
// Shows ALL transactions from the same localStorage key, newest -> oldest,
// with per-row delete. Confirmation is INLINE in the DOM (an expanding
// confirm bar on the row) — native window.confirm/alert/prompt are banned
// here because they block automated testing and are poor UX.
//
// Kept in its own IIFE so it does not touch issue #1's merged code. The few
// tiny storage helpers are duplicated to match #1's conventions exactly.
// =======================================================================
(function () {
  'use strict';

  var STORAGE_KEY = 'tws.transactions';

  // On-screen copy — must match the spec exactly. Keep as constants to avoid typos.
  var MSG = {
    empty: 'ยังไม่มีรายการ',
    deleteBtn: 'ลบ',
    confirmDelete: 'ยืนยันการลบรายการนี้?',
    confirmYes: 'ยืนยัน',
    confirmNo: 'ยกเลิก'
  };

  var TYPE_LABELS = { income: 'รายรับ', expense: 'รายจ่าย' };

  // ---- storage layer (same shape/behaviour as issue #1) ----------------

  function loadTransactions() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('[app] cannot read transactions:', err);
      return [];
    }
  }

  function saveTransactions(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  // Remove one transaction by id and persist. Returns the surviving list.
  function deleteTransaction(id) {
    var next = loadTransactions().filter(function (tx) { return tx.id !== id; });
    saveTransactions(next);
    return next;
  }

  function formatAmount(n) {
    return Number(n).toLocaleString('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Newest -> oldest. Primary key: date (ISO YYYY-MM-DD compares chronologically
  // as a string). Tie-break on same date: id descending — ids are timestamp-based
  // (tx_<base36 time>_<rand>) so the later-added row sorts on top. Does not mutate
  // the stored order.
  function sortNewestFirst(list) {
    return list.slice().sort(function (a, b) {
      var da = a.date || '';
      var db = b.date || '';
      if (da < db) return 1;
      if (da > db) return -1;
      var ia = a.id || '';
      var ib = b.id || '';
      if (ia < ib) return 1;
      if (ia > ib) return -1;
      return 0;
    });
  }

  // ---- boot ------------------------------------------------------------

  document.addEventListener('DOMContentLoaded', function () {
    var listEl = document.getElementById('history-list');
    if (!listEl) {
      console.warn('[app] history-list container not found — nothing to wire up');
      return;
    }

    // Which row (if any) is currently showing its inline delete confirmation.
    var pendingDeleteId = null;

    function makeButton(text, className, onClick) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = className;
      btn.textContent = text;
      btn.addEventListener('click', onClick);
      return btn;
    }

    // Inline confirm bar shown in place of a row's actions. No native dialog.
    function buildConfirmBar(id) {
      var bar = document.createElement('div');
      bar.className = 'tx-confirm';
      bar.setAttribute('role', 'alertdialog');
      bar.setAttribute('aria-label', MSG.confirmDelete);

      var text = document.createElement('span');
      text.className = 'tx-confirm-text';
      text.textContent = MSG.confirmDelete;

      var yes = makeButton(MSG.confirmYes, 'tx-confirm-yes danger', function () {
        deleteTransaction(id);          // remove from localStorage
        pendingDeleteId = null;
        render();                       // remove from screen immediately, re-sort
      });

      var no = makeButton(MSG.confirmNo, 'tx-confirm-no', function () {
        pendingDeleteId = null;         // cancel: nothing removed
        render();
      });

      bar.appendChild(text);
      bar.appendChild(yes);
      bar.appendChild(no);
      return bar;
    }

    function buildRow(tx) {
      var isIncome = tx.type === 'income';

      var li = document.createElement('li');
      li.className = 'tx-item ' + (isIncome ? 'tx-income' : 'tx-expense');

      var typeSpan = document.createElement('span');
      typeSpan.className = 'tx-type';
      typeSpan.textContent = TYPE_LABELS[tx.type] || tx.type;

      var catSpan = document.createElement('span');
      catSpan.className = 'tx-cat';
      catSpan.textContent = tx.category;

      var amtSpan = document.createElement('span');
      amtSpan.className = 'tx-amount';
      amtSpan.textContent = (isIncome ? '+' : '-') + formatAmount(tx.amount) + ' ฿';

      var dateSpan = document.createElement('span');
      dateSpan.className = 'tx-date';
      dateSpan.textContent = tx.date;

      li.appendChild(typeSpan);
      li.appendChild(catSpan);
      li.appendChild(amtSpan);
      li.appendChild(dateSpan);

      if (tx.note) {
        var noteSpan = document.createElement('span');
        noteSpan.className = 'tx-note';
        noteSpan.textContent = tx.note;
        li.appendChild(noteSpan);
      }

      if (pendingDeleteId === tx.id) {
        li.classList.add('tx-confirming');
        li.appendChild(buildConfirmBar(tx.id));
      } else {
        var delBtn = makeButton(MSG.deleteBtn, 'tx-delete danger', function () {
          pendingDeleteId = tx.id;      // ask before removing anything
          render();
        });
        li.appendChild(delBtn);
      }

      return li;
    }

    function render() {
      var list = sortNewestFirst(loadTransactions());
      listEl.innerHTML = '';

      if (list.length === 0) {
        pendingDeleteId = null;
        var empty = document.createElement('li');
        empty.className = 'tx-empty';
        empty.textContent = MSG.empty;
        listEl.appendChild(empty);
        return;
      }

      // If the pending row no longer exists (e.g. deleted elsewhere), drop the flag.
      if (pendingDeleteId && !list.some(function (tx) { return tx.id === pendingDeleteId; })) {
        pendingDeleteId = null;
      }

      list.forEach(function (tx) {
        listEl.appendChild(buildRow(tx));
      });
    }

    // Keep this list in sync on a single page: when issue #1's add form saves a
    // new item, refresh history too. This is an additive listener owned by #2 —
    // it does not modify #add-section's code. setTimeout(...,0) guarantees it runs
    // AFTER #1's synchronous save regardless of handler registration order, and the
    // try/catch keeps any history error from affecting the add flow.
    var addForm = document.getElementById('add-form');
    if (addForm) {
      addForm.addEventListener('submit', function () {
        setTimeout(function () {
          try { render(); } catch (err) { console.error('[app] history refresh failed:', err); }
        }, 0);
      });
    }

    render(); // show whatever is already saved (survives refresh)

    console.log('[app] history-list ready');
  });
})();
