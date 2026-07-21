#!/usr/bin/env bash
# สร้าง label มาตรฐานของทีมบน GitHub repo (idempotent — รันซ้ำได้ ใช้ --force อัปเดตทับ)
#
# Usage:   ./scripts/setup-labels.sh <owner/repo>
# ตัวอย่าง: ./scripts/setup-labels.sh my-org/my-app
#
# ต้องมี GitHub CLI (gh) และ login แล้ว: gh auth login
#
# หลักการ (ดู docs/workflow-research/02-persona-review.md):
# - มีเฉพาะ type:* และ priority:* — จงใจ "ไม่มี" status:* labels
#   เพราะ status เป็นหน้าที่ของ Projects v2 board + built-in automation เท่านั้น
#   (status label ที่คนต้องสลับเองจะ stale และทำให้เลิกเชื่อทั้งระบบ)
# - หนึ่งสีต่อหนึ่ง prefix family: type:* = โทนน้ำเงิน, priority:* = โทนแดง→เหลืองตามความด่วน

set -euo pipefail

REPO="${1:?Usage: $0 <owner/repo>}"

echo "Creating labels on ${REPO} ..."

# ---- type:* (โทนน้ำเงิน) --------------------------------------------------
gh label create "type:feature" --repo "$REPO" --force \
  --color "1D76DB" \
  --description "งานพัฒนาใหม่จาก requirement/spec — เปิดผ่านฟอร์ม Feature เท่านั้น"

gh label create "type:bug" --repo "$REPO" --force \
  --color "5CA8FF" \
  --description "ข้อบกพร่องของระบบ — เปิดผ่านฟอร์ม Bug Report ต้องมีขั้นตอนทำซ้ำ"

gh label create "type:chore" --repo "$REPO" --force \
  --color "A3C4F3" \
  --description "งาน maintenance/config/refactor ที่ไม่ใช่ feature และไม่ใช่ bug"

# ---- priority:* (โทนแดง→เหลือง ตามความด่วน) -------------------------------
gh label create "priority:p1" --repo "$REPO" --force \
  --color "B60205" \
  --description "ด่วนที่สุด — production พัง / บล็อกงานอื่น หยิบก่อนทุกงาน"

gh label create "priority:p2" --repo "$REPO" --force \
  --color "D93F0B" \
  --description "สำคัญ — ทำให้เสร็จในรอบงานนี้"

gh label create "priority:p3" --repo "$REPO" --force \
  --color "FBCA04" \
  --description "ทำเมื่อมีคิวว่าง — ไม่กระทบแผนหลัก"

echo ""
echo "Done. ตรวจผลได้ที่ https://github.com/${REPO}/labels"
echo ""
echo "แนะนำ: ลบ default labels ที่ทีมไม่ใช้ เพื่อกันคนหยิบผิด เช่น"
echo "  gh label delete \"enhancement\" --repo ${REPO} --yes"
echo "  gh label delete \"bug\" --repo ${REPO} --yes        # ใช้ type:bug แทน"
echo "  gh label delete \"documentation\" --repo ${REPO} --yes"
