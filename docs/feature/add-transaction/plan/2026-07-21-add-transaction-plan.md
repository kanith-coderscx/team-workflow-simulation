# Plan: add-transaction (issue #1)

- **branch:** `feature/1-add-transaction`
- **วันที่:** 2026-07-21
- **ผู้เขียน:** Dev
- **spec:** `docs/feature/add-transaction/spec/2026-07-20-add-transaction-spec.md`

## แนวทาง (Approach)

Static SPA — vanilla HTML/CSS/JS + `localStorage` เท่านั้น ไม่มี build step, ไม่มี framework,
ไม่มี network/CDN. แทนที่ placeholder ใน `#add-section` ด้วยฟอร์มจริง + รายการที่บันทึกไว้
เก็บข้อมูลลง `localStorage` คีย์ `tws.transactions` เป็น JSON array ตาม data-model เป๊ะ
(`id, type, amount, category, date, note`; `type` = `"income"`/`"expense"`).

ทำเฉพาะ #1 — ไม่แตะ placeholder ของ #2 (history) และ #3 (summary).

## ไฟล์ที่แก้ (Files touched)

- `app/index.html` — แทน placeholder ใน `#add-section` ด้วย `<form id="add-form">` (amount, type radios,
  category select, date, note, ปุ่ม «บันทึกรายการ», ช่อง error/success) + `<ul id="added-list">`
- `app/app.js` — storage layer (`load/save/addTransaction`), validation, render list, wiring
- `app/styles.css` — เพิ่ม style ของฟอร์ม (radio group, success, รายการ tx income/expense)

## On-screen copy (ตรงกับ spec เป๊ะ — เก็บเป็นค่าคงที่ใน JS/HTML)

- ปุ่มบันทึก: `บันทึกรายการ`
- จำนวนเงินผิด: `กรุณากรอกจำนวนเงินให้มากกว่า 0`
- ไม่เลือกหมวดหมู่: `กรุณาเลือกหมวดหมู่`
- บันทึกสำเร็จ: `บันทึกรายการเรียบร้อยแล้ว`

## แต่ละ AC ทำอย่างไร (How each AC is met)

1. **ฟอร์มครบทุกช่อง + ปุ่ม «บันทึกรายการ»** → HTML ประกาศ amount/type/category/date/note + ปุ่ม text ตรง spec
2. **บันทึกสำเร็จ → ข้อความ + รายการโผล่ทันที** → หลัง validate ผ่าน push เข้า array, เขียน localStorage,
   set success text, `renderList()` วาดใหม่ทันที (ไม่ reload)
3. **amount ว่าง/0/ติดลบ → ไม่บันทึก + ข้อความ** → guard `!(amount > 0)` ครอบ NaN(ว่าง), 0, ติดลบ → return ก่อน save
4. **ไม่เลือกหมวดหมู่ → ไม่บันทึก + ข้อความ** → category select ค่าเริ่ม `""` (placeholder); ถ้า `""` → return ก่อน save
   (ตรวจ amount ก่อน category ให้ตรง test step 5)
5. **รายจ่ายแยกจากรายรับชัดเจน** → ทุกรายการมี label ข้อความ (รายรับ/รายจ่าย) + สี (เขียว/แดง) + เครื่องหมาย +/-
6. **F5 แล้วยังอยู่** → เขียนลง `localStorage` จริง; ตอน boot อ่านกลับมา `renderList()`
7. **note ว่างไม่ทำให้บันทึกล้ม** → ไม่มี validation บน note; เก็บเป็น string (`""` ถ้าว่าง)

## รายละเอียดที่ตั้งใจออกแบบ (Design decisions)

- `date` default = วันนี้ (คำนวณจาก local timezone ไม่ใช่ UTC เพื่อกันวันเพี้ยน)
- `id` = timestamp (base36) + random suffix กันชนกันเมื่อบันทึกรัว ๆ ในมิลลิวินาทีเดียว
- render ด้วย `createElement` + `textContent` (ไม่ใช้ innerHTML กับ note/category) กัน XSS จาก free text
- category ขึ้นกับ type (expense: อาหาร/เดินทาง/…; income: เงินเดือน/โบนัส/…) — เปลี่ยน type แล้ว repopulate
- ฟอร์มใช้ `novalidate` เพื่อให้ validation + ข้อความเป็นของเราเอง (ไม่ใช่ browser tooltip)
- a11y: label ผูก for/id, error `role="alert"`, success `role="status"`, `aria-invalid` ตอน error

## Self-review / QA ที่จะทำ (fail-closed)

- **Static ที่ทำได้:** ตรวจถ้อยคำบนจอตรง spec เป๊ะ (เทียบ string), ตรวจ HTML มีครบทุก field + id,
  ไล่ logic validation ทีละเคส (ว่าง/0/ติดลบ/ถูก, ไม่เลือกหมวด), ตรวจ shape ที่เขียนลง localStorage ตรง data-model
- **ทำไม่ได้ (ไม่มี browser ใน env นี้):** การ render จริง, ข้อความ/รายการโผล่บนจอ, F5 persistence,
  สีแยก income/expense บนจอ → รายงาน **UNVERIFIED พร้อมเหตุผล** ให้ BA/SA ตรวจในขั้น ⑤ บน browser
