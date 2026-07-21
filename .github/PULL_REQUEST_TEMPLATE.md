<!-- กติกาทีม: ห้าม merge ก่อน BA/SA approve | request review = สัญญาณ "พร้อม test" -->

## Issue

Refs #___
<!-- ใช้ "Refs" เท่านั้น (ไม่ใช้ Fixes/Closes) — การปิด issue เป็นหน้าที่ BA/SA หลัง verify บน develop -->

## What changed

<!-- สรุป 1-3 บรรทัด ว่าเปลี่ยนอะไร -->

## Deployed to 🔴 บังคับ — ถ้าช่องนี้ว่าง = ยังไม่พร้อม test ห้าม request review

- URL: <!-- เช่น https://test.example.com -->
- Branch/Commit: <!-- เช่น feature/123-login-page @ abc1234 -->

## ข้อมูลเพิ่มเติมสำหรับการ test (เฉพาะที่ AC ใน issue ไม่ครอบคลุม)

<!-- ไม่ต้องคัดลอก AC มาจาก issue — เขียนเฉพาะ test account, test data, setup พิเศษ, จุดที่ต้องระวัง
     ถ้าไม่มีอะไรเพิ่ม ให้เขียนว่า "ตาม AC ใน issue" -->

## Dev checklist (ก่อนกด request review)

- [ ] Self-review โค้ดตัวเองแล้ว
- [ ] Deploy ขึ้น test server แล้ว และกรอกช่อง "Deployed to" ครบ
- [ ] Branch แตกจาก `develop` ล่าสุด / rebase แล้ว ไม่มี conflict

---

## ผลการ test — ⚠️ ส่วนนี้ BA/SA เป็นผู้กรอกเท่านั้น (dev ห้ามติ๊ก)

<!-- ติ๊กตามข้อ Acceptance Criteria ใน issue ทีละข้อ พร้อมแนบ screenshot/ผลจริงเป็นคอมเมนต์บน PR
     ข้อที่ไม่ผ่าน: อย่าติ๊ก ให้กด "Request changes" แล้วระบุข้อที่ fail + actual result -->

- [ ] AC ข้อ 1 — ผลจริง:
- [ ] AC ข้อ 2 — ผลจริง:
- [ ] AC ข้อ 3 — ผลจริง:

**บันทึกการ test (บังคับก่อน approve):**

- Environment ที่ใช้ test:
- Commit ที่ test:
- วันที่ test:
