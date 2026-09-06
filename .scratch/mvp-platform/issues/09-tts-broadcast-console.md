# 09: Staff Desk - One-Click Korean TTS Audio Broadcast Console

**What to build:** Build the in-store Audio Announcement Broadcast console in the Staff Desk (`/admin`). Implement a robust Web Speech API (`SpeechSynthesis`) wrapper configured for Korean language (`ko-KR`). Provide 6 one-click preset buttons:
1. ☕ `[음료 제작 완료]` ("주문하신 음료와 음식이 준비되었습니다. 카운터 픽업대로 와주시기 바랍니다. 감사합니다.")
2. 🪪 `[밤 10시 신분증 검사]` ("안내 말씀 드립니다. 청소년 보호법에 따라 밤 10시 이후 미성년자의 매장 이용이 제한됩니다. 직원에게 신분증 확인을 부탁드립니다.")
3. 🌙 `[마감 30분 전]` ("고객 여러분 안녕하십니까. 저희 카툰플러스 마감 30분 전입니다. 이용 중이신 좌석 정리 및 퇴장 준비를 부탁드립니다.")
4. ⏰ `[마감 10분 전]` ("고객 여러분 안녕하십니까. 영업 마감 10분 전입니다. 소지품을 확인해 주시고 보신 도서는 도서 반납대로 반납해 주시기 바랍니다.")
5. 🚫 `[외부음식 제한]` ("안내 말씀 드립니다. 쾌적한 매장 환경 유지를 위해 외부 음식물 반입 및 취식을 엄격히 금지하고 있습니다. 협조 부탁드립니다.")
6. 🤫 `[정숙/소음 주의]` ("안내 말씀 드립니다. 카툰플러스는 모두가 함께 쉬어가는 공간입니다. 타 이용자를 배려하여 큰 소리 대화나 전자기기 소음을 자제해 주시기 바랍니다.")
Also provide custom text input for instant announcements, stop broadcast button, and animated audio wave / status indicator (대기 / 송출중 / 완료).

**Blocked by:** 08: Staff Auth Context & Login Flow

**Status:** ready-for-agent

- [ ] Web Speech API wrapper handling browser audio playback in Korean
- [ ] 6 preset buttons with quick trigger and visual active feedback
- [ ] Custom text input with instant broadcast and character counter
- [ ] Real-time audio playing indicator with Stop Broadcast action
