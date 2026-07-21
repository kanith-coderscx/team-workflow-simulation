# Plan: รายการย้อนหลัง + ลบรายการ (history-list) — issue #2

- **branch:** `feature/2-history-list`
- **วันที่:** 2026-07-21
- **ผู้เขียน:** Dev
- **spec:** `docs/feature/history-list/spec/2026-07-20-history-list-spec.md`

## เป้าหมาย

เติมเนื้อหาใน `#history-section` (ตอนนี้เป็น placeholder) ให้แสดงรายการทั้งหมดจาก
`localStorage` คีย์ `tws.transactions` เรียงใหม่→เก่า พร้อมลบทีละรายการโดย
ยืนยันแบบ inline ใน DOM (ห้ามใช้ `window.confirm/alert` หรือ dialog ของเบราว์เซอร์)

## ขอบเขต / กติกา

- แก้เฉพาะไฟล์ใน `app/` (`index.html`, `app.js`, `styles.css`) + ไฟล์ plan นี้
- **ห้ามแก้** `#add-section` (issue #1) และ `#summary-section` (issue #3)
- ใช้คีย์เดิม `tws.transactions` และ schema เดิม `{id,type,amount,category,date,note}`
- ข้อความบนจอต้องตรงเป๊ะ: empty=«ยังไม่มีรายการ», ปุ่มลบ=«ลบ», ยืนยัน=«ยืนยันการลบรายการนี้?»

## แนวทาง implement

### 1) HTML (`index.html`) — เฉพาะภายใน `#history-section`
- แทน `<p class="placeholder">…</p>` ด้วย `<ul id="history-list" aria-live="polite"></ul>`
- ไม่แตะ header/section tag เดิม

### 2) JS (`app.js`) — เพิ่ม IIFE ใหม่ต่อท้าย (แยกจาก IIFE ของ issue #1)
เหตุผลที่แยก IIFE: หลีกเลี่ยงการแก้โค้ด issue #1 ที่ merge แล้ว; helper เล็ก ๆ
(`loadTransactions/saveTransactions/formatAmount/TYPE_LABELS/STORAGE_KEY`) copy มา
ให้ตรงกับ convention เดิม + เพิ่ม `deleteTransaction(id)`
- `sortNewestFirst(list)` — เรียงหลักตาม `date` (string ISO เทียบ lexicographic = ตามเวลา)
  ใหม่→เก่า; วันเดียวกัน tie-break ด้วย `id` (timestamp-based) จากมาก→น้อย = เพิ่มทีหลังอยู่บน
- `render()` — อ่าน storage, sort, สร้างแถวด้วย `createElement` (ตามสไตล์ #1 ไม่ใช้ innerHTML string):
  แต่ละแถวแสดง ประเภท(รายรับ/รายจ่าย), หมวดหมู่, จำนวนเงิน, วันที่, note(ถ้ามี), ปุ่ม «ลบ»
  reuse คลาส `.tx-item/.tx-type/.tx-cat/.tx-amount/.tx-date/.tx-note/.tx-empty` ที่มีอยู่แล้ว
  - length===0 → แสดง `<li class="tx-empty">ยังไม่มีรายการ</li>`
- **ยืนยันลบแบบ inline (ไม่ใช้ native dialog):** ใช้ state `pendingDeleteId`
  - กด «ลบ» → `pendingDeleteId=id` แล้ว re-render → แถวนั้นแสดงแถบยืนยัน
    «ยืนยันการลบรายการนี้?» + ปุ่ม «ยืนยัน»/«ยกเลิก»
  - «ยกเลิก» → `pendingDeleteId=null` + re-render (ไม่ลบ)
  - «ยืนยัน» → `deleteTransaction(id)` → `pendingDeleteId=null` → re-render
    (แถวหาย, ที่เหลือยังเรียงถูก, ถ้าหมด → empty state)
- boot: render บน `DOMContentLoaded`
- **live refresh แบบไม่รุกล้ำ:** ผูก listener `submit` บนฟอร์ม add เพิ่ม (เป็นโค้ดของ #2 เอง
  ไม่แก้โค้ด #1) เรียก render ผ่าน `setTimeout(…,0)` ให้รันหลัง save ของ #1 เสมอ (order-independent)
  ครอบด้วย try/catch เพื่อไม่ให้ error ของ history กระทบ flow การเพิ่มรายการ
  → ทำให้หน้าเดียว (สาม section ซ้อนกัน) เห็นรายการใหม่ทันทีโดยไม่ต้อง F5

### 3) CSS (`styles.css`) — เพิ่มบล็อก history feature
- `#history-list` layout เลียนแบบ `#added-list`
- `.tx-delete` (ปุ่มเล็ก, ใช้ .danger เดิมได้), `.tx-confirm` แถบยืนยัน inline (width 100%, flex),
  `.tx-confirm-yes/.tx-confirm-no`

## Self-review + QA (fail-closed)
- ทวนทีละ AC (ดู self_qa ใน report)
- ยืนยันไม่มีการเรียก `confirm(`/`alert(`/`prompt(` ใด ๆ (grep)
- ตรวจ syntax `node --check app.js`
- ไม่มี browser ในสภาพแวดล้อมนี้ → ข้อที่ต้องคลิกจริงบนจอ = รายงาน **UNVERIFIED พร้อมเหตุผล** ไม่ถือว่าผ่าน
