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
