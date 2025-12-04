// 테스트에서 .env.test 로드
require('dotenv').config({ path: '.env.test' });

require('../utils/prismaClient');
// PrismaClient mock 등록

console.log("🔥 Jest Setup Loaded");
